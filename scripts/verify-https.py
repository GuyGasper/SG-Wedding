#!/usr/bin/env python3
"""Verify a wedding load balancer using real-domain TLS before DNS cutover."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import gzip
import http.client
import ipaddress
import json
from pathlib import Path
import re
import socket
import ssl
import statistics
import time

class Connection(http.client.HTTPSConnection):
    def __init__(self, host, address):
        super().__init__(host, timeout=20, context=ssl.create_default_context())
        self.address = address
    def connect(self):
        self.sock = socket.create_connection((self.address, 443), timeout=self.timeout)
        self.sock = self._context.wrap_socket(self.sock, server_hostname=self.host)

def fetch(connection, path, expected=200):
    started = time.monotonic()
    connection.request('GET', path, headers={'Accept-Encoding': 'gzip', 'User-Agent': 'SG-Wedding-verification/1.0'})
    response = connection.getresponse()
    wire = response.read()
    assert response.status == expected, f'{path}: HTTP {response.status}, expected {expected}'
    body = gzip.decompress(wire) if response.getheader('Content-Encoding') == 'gzip' else wire
    return body, dict(response.getheaders()), len(wire), time.monotonic() - started

def percentile(values, fraction):
    return sorted(values)[min(len(values)-1, int((len(values)-1)*fraction))]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('address', type=ipaddress.ip_address)
    parser.add_argument('--users', nargs='+', type=int, default=[10, 20])
    parser.add_argument('--duration', type=int, default=30)
    parser.add_argument('--output', type=Path, default=Path('.local/https-verification.json'))
    args = parser.parse_args()
    if any(n < 1 or n > 20 for n in args.users) or not 1 <= args.duration <= 300:
        parser.error('Use 1–20 concurrent users and 1–300 seconds')
    result = {'address': str(args.address), 'tls_validation': True, 'domains': [], 'loads': []}
    for host in ['sg2027wedding.com', 'www.sg2027wedding.com']:
        with Connection(host, str(args.address)) as connection:
            html, _, _, _ = fetch(connection, '/')
            assert b'Sarah Eisenman &amp; Guy Gasper' in html
            route, _, _, _ = fetch(connection, '/home')
            assert html == route, 'SPA fallback differs from homepage'
            body, _, _, _ = fetch(connection, '/api/status')
            assert json.loads(body)['service'] == 'SG Wedding API' and json.loads(body)['status'] == 'UP'
            fetch(connection, '/api/missing', 404)
            fetch(connection, '/healthz')
            scripts = re.findall(rb'src="(/assets/[^" ]+\.js)"', html)
            styles = re.findall(rb'href="(/assets/[^" ]+\.css)"', html)
            assert scripts and styles
            paths = [p.decode() for p in styles + scripts] + ['/images/landscape.webp', '/fonts/serif.ttf', '/fonts/script.ttf']
            for path in paths:
                asset, headers, _, _ = fetch(connection, path)
                assert asset and 'text/html' not in headers.get('Content-Type', '')
            fetch(connection, '/assets/missing.js', 404)
        result['domains'].append({'host':host,'https':'passed','api':'passed','spa':'passed','assets':'passed'})
        print('HTTPS, certificate, API routing, SPA fallback, and assets passed:', host, flush=True)
    for users in args.users:
        deadline = time.monotonic() + args.duration
        def visitor(_):
            pages, requests, sizes, errors = [], [], [], []
            with Connection('sg2027wedding.com', str(args.address)) as connection:
                while time.monotonic() < deadline:
                    start = time.monotonic()
                    try:
                        for path in ['/'] + paths + ['/api/status']:
                            _, _, size, elapsed = fetch(connection, path)
                            requests.append(elapsed); sizes.append(size)
                        pages.append(time.monotonic()-start)
                    except Exception as error:
                        errors.append(str(error)); connection.close()
                    time.sleep(1)
            return pages, requests, sizes, errors
        start = time.monotonic()
        with ThreadPoolExecutor(max_workers=users) as pool:
            samples = list(pool.map(visitor, range(users)))
        pages = [x for sample in samples for x in sample[0]]
        requests = [x for sample in samples for x in sample[1]]
        sizes = [x for sample in samples for x in sample[2]]
        errors = [x for sample in samples for x in sample[3]]
        elapsed = time.monotonic()-start
        assert pages and requests, 'No successful requests'
        load = {'users':users,'duration_seconds':round(elapsed,2),'page_views':len(pages),'requests':len(requests),'errors':errors,'request_p95_ms':round(percentile(requests,.95)*1000,1),'page_p95_ms':round(percentile(pages,.95)*1000,1),'download_mbps':round(sum(sizes)*8/elapsed/1e6,2)}
        result['loads'].append(load)
        print(json.dumps(load), flush=True)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,indent=2)+'\n')
    assert all(not load['errors'] and load['page_p95_ms'] < 10000 for load in result['loads']), 'Performance verification failed; retain existing DNS'
    print('Pre-DNS verification passed. DNS and the existing placeholder were not modified.')

if __name__ == '__main__':
    main()

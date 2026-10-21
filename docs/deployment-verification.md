# Initial wedding deployment verification

Verified October 21, 2026. DNS has not been changed.

- New HTTPS load balancer: `129.158.40.64`; active, healthy backends, 10–100 Mbps.
- Both `sg2027wedding.com` and `www.sg2027wedding.com`: certificate validation, SPA route `/home`, static assets, `/api/status`, and API/static 404 checks passed using real-domain SNI directed to the new IP.
- Deployment namespace: `sg-wedding`; one Ready replica of each app on the wedding worker.
- `ocir-pull` and `sg-wedding-tls` were bootstrapped in that namespace.
- Existing DNS A records remain `143.47.101.84` for both hostnames. Existing placeholder infrastructure is retained. Cleanup remains a separate later change.

| Concurrent users | Duration | Requests | Errors | Full-page p95 | Request p95 | Download throughput |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | 31.19 s | 1715 | 0 | 292.9 ms | 68.0 ms | 42.64 Mbps |
| 20 | 31.21 s | 3346 | 0 | 414.9 ms | 84.8 ms | 83.14 Mbps |

The test repeatedly downloads HTML, JavaScript, CSS, both fonts, the image, and `/api/status` for each simulated visit, with one second between visits. Measurements are from this development machine and are an initial capacity check, not a global latency guarantee. Raw results and the prior DNS snapshot are retained under ignored `.local/`.

## Published release

Source commit: `6e02bc81af7a04d19ce2a5f85e850627afb7d5de`. Both images are Linux ARM64.

- api: `iad.ocir.io/idyvg6phrr9i/sg-wedding/api@sha256:20a1d6f75ae1d23db1448d3bd0fd17fab3e7f549cdcb747e771442d77ffabfee`
- frontend: `iad.ocir.io/idyvg6phrr9i/sg-wedding/frontend@sha256:eb244876e7cb523be1717b6f9788697d645ecd1401481fa3fa8fc5ad922f54bb`

## Publishing and renewal

The application GitHub `production` environment has `OCIR_REGISTRY` and `OCIR_NAMESPACE` variables plus `OCIR_USERNAME` and `OCIR_AUTH_TOKEN` secrets, configured with user authorization. The publishing workflow becomes active on main when the application PR merges; PR runs only verify.

The current certificate expires **February 15, 2027** and must be renewed before then. Preserve certificate-validation DNS records during cutover.

Application PR: https://github.com/GuyGasper/SG-Wedding/pull/1

Companion Nginx configuration PR: https://github.com/GuyGasper/OCI-Infrastructure/pull/1

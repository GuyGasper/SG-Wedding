# Sarah & Guy — October 2, 2027

Wedding homepage for Sarah Eisenman and Guy Gasper, with a small Java verification API. React uses a sage/ivory invitation design inspired by the supplied Minted reference. Navigation contains only Home. The hero uses the supplied engagement photo; see `frontend/ASSETS.md`.

## Local development

Requires Java 21, Maven 3.9+, and Node 24.

```sh
mvn -f backend/pom.xml verify
java -jar backend/target/app.jar
# In another terminal:
cd frontend
npm ci
npm run dev -- --port 5174
```

Vite forwards relative `/api` requests to the API on port 8080. The verification endpoint is `/api/status`. Internal probes are `/health/live` and `/health/ready`; readiness follows application availability. The homepage does not display technical API status.

## Containers and checks

```sh
docker compose -f compose.yaml -f compose.ci.yaml build
COMPOSE_FILE=compose.yaml:compose.ci.yaml bash scripts/test-containers.sh
cd frontend
npx playwright install --with-deps chromium
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8088 npm run test:e2e
```

Both images target Linux ARM64. Java runs as 10001:10001 and Nginx as 101:101, with read-only filesystems and writable `/tmp`. Local frontend: http://localhost:8088. The API is internal except for a loopback-only port in `compose.ci.yaml`.

## GitHub CI/CD

The workflow verifies Java, builds React, runs restricted ARM64 containers, checks desktop/mobile layout and `/api` routing, and exports the tested images. Its separate `production` job publishes those same images without rebuilding, tagging with the full commit SHA and recording immutable OCIR digests in a release artifact. A following deployment job promotes those digests to the existing wedding workloads and verifies HTTPS.

Configure this repository's GitHub `production` environment:

| Setting | Type |
| --- | --- |
| `OCIR_REGISTRY` (`iad.ocir.io`) | Variable |
| `OCIR_NAMESPACE` (tenancy namespace) | Variable |
| `OCIR_USERNAME` (full registry username) | Secret |
| `OCIR_AUTH_TOKEN` | Secret |
| `OCI_REGION` (`us-ashburn-1`) | Variable |
| `OKE_CLUSTER_ID` (existing shared cluster) | Variable |
| `OKE_ENDPOINT_NSG_ID` (optional; existing shared API endpoint NSG) | Variable |
| `OCI_TENANCY_OCID` | Secret |
| `OCI_USER_OCID` | Secret |
| `OCI_FINGERPRINT` | Secret |
| `OCI_PRIVATE_KEY` (OCI API signing key) | Secret |

Destinations: `<registry>/<namespace>/sg-wedding/api` and `sg-wedding/frontend`. Main pushes build, verify, publish, and deploy automatically. To deploy manually, open **Actions → CI / CD → Run workflow**, select `main`, and enable both **Publish** and **Deploy**. Enable only **Publish** for a publishing check without deployment. With Publish disabled, the deployment job is skipped even if Deploy is selected. Pull requests verify without publishing or deploying.

The deploy job follows the Personal OS pattern: check that the release is still the current main commit; configure short-lived local credential files on the runner; discover the API endpoint NSG from the selected cluster (or validate `OKE_ENDPOINT_NSG_ID`); allow only that runner's public IPv4 `/32` on TCP 6443; connect with an explicit kubeconfig/context; validate the release artifact and both Kubernetes image patches before changing anything; roll out the API before the frontend; then verify both HTTPS hostnames, the photo/fonts/build assets, SPA routing, and `/api/status`. CI uses a short smoke load; the full 10/20-user performance check remains available through `scripts/smoke-test.sh`.

The deployment job reuses the existing load balancer, TLS secret, pull secret, resources, and namespace. It updates only the named API/frontend container images. It saves the previous images and HTTPS report as an artifact and restores the previous images when a rollout or HTTPS check fails, without overwriting external changes. It always attempts removal of its own temporary API rule and local credential files. Any abandoned narrow rules belonging to this repository are pruned on the next deployment after their one-hour lease expires. A failed cleanup step needs attention; runner crashes cannot guarantee immediate cleanup.

The OCI identity needs cluster access, Kubernetes RBAC for the wedding deployments/service, and permissions to inspect/manage the selected API NSG's security rules. These are separate from OCIR publishing credentials. Deployment secrets are scoped to this repository's `production` environment. GitHub cannot copy another repository's encrypted secret values; configure the authorized identity from its original credential source.

Neither CI/CD nor publishing changes DNS or applies Terraform. The live apex and `www` records now point to `129.158.40.64`; the retained placeholder remains available for rollback.

## Kubernetes deployment

Infrastructure and base manifests remain in `../OCI-Infrastructure`; follow its `docs/sg-wedding.md`. Select the shared cluster kubeconfig and context explicitly. Supply `DOCKER_CONFIG_JSON`, `TLS_CERT_FILE`, `TLS_KEY_FILE`, and `.local/release.json` with `api_image` and `frontend_image` digest references. Optionally supply `TERRAFORM_OUTPUT_JSON` with verified wedding ingress subnet/NSG outputs.

```sh
export KUBECONFIG=/path/to/kubeconfig
export KUBE_CONTEXT="$(kubectl config current-context)"
export DOCKER_CONFIG_JSON=/secure/path/ocir-pull.json
export TLS_CERT_FILE=/secure/path/fullchain.pem
export TLS_KEY_FILE=/secure/path/private.key
bash scripts/deploy.sh
bash scripts/smoke-test.sh <wedding-load-balancer-ip>
```

The script validates the certificate for both hostnames and matches its private key, bootstraps namespace-local secrets, renders a local overlay, runs server-side dry-run, deploys the API before rolling the frontend, and waits for both rollouts. Nginx preserves `/api`, compresses text assets, and caches static assets.

The HTTPS verification script connects directly to the new IP using the real hostnames for SNI and certificate validation. It checks both domains, assets, SPA fallback, API success/404, and 30-second loads at 10 and 20 concurrent users. It saves `.local/https-verification.json` and fails on request errors or a full-page p95 above 10 seconds. It never disables TLS validation.

Do not change DNS until pre-cutover verification passes. Keep the existing placeholder and its infrastructure until the app works through normal DNS on both domains. Save previous DNS records for rollback. Cleanup is a separate change.

TLS certificates must be renewed before expiration; the currently available certificate expires February 15, 2027, before the wedding.

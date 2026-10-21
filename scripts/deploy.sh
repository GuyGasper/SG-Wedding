#!/usr/bin/env bash
set -euo pipefail
# Never enable shell tracing here: these commands process credentials.
: "${KUBECONFIG:?Select the SG Wedding kubeconfig explicitly}"
: "${KUBE_CONTEXT:?Select the intended OKE context explicitly}"
: "${DOCKER_CONFIG_JSON:?Path to a dedicated OCIR pull credentials JSON file}"
: "${TLS_CERT_FILE:?Path to the full PEM certificate chain}"
: "${TLS_KEY_FILE:?Path to the matching PEM private key}"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
infra="${INFRA_REPO:-$root/../OCI-Infrastructure}"
release="${RELEASE_FILE:-$root/.local/release.json}"
for tool in kubectl python3 openssl; do command -v "$tool" >/dev/null; done
for file in "$DOCKER_CONFIG_JSON" "$TLS_CERT_FILE" "$TLS_KEY_FILE" "$release" "$infra/scripts/render-sg-wedding.py"; do
  [[ -f "$file" ]] || { echo "Missing required file: $file" >&2; exit 1; }
done
k() { kubectl --context "$KUBE_CONTEXT" "$@"; }
k get nodes
openssl x509 -in "$TLS_CERT_FILE" -noout -checkhost sg2027wedding.com | grep -F "does match certificate"
openssl x509 -in "$TLS_CERT_FILE" -noout -checkhost www.sg2027wedding.com | grep -F "does match certificate"
openssl x509 -in "$TLS_CERT_FILE" -noout -checkend 86400
cert_key="$(openssl x509 -in "$TLS_CERT_FILE" -pubkey -noout | openssl pkey -pubin -outform DER | openssl dgst -sha256)"
private_key="$(openssl pkey -in "$TLS_KEY_FILE" -pubout -outform DER | openssl dgst -sha256)"
[[ "$cert_key" == "$private_key" ]] || { echo "TLS certificate and key do not match" >&2; exit 1; }
mapfile -t images < <(python3 - "$release" "$DOCKER_CONFIG_JSON" <<'PY'
import json, sys
release = json.load(open(sys.argv[1]))
auths = json.load(open(sys.argv[2])).get("auths", {})
for component in ["api", "frontend"]:
    image = release[f"{component}_image"]
    registry = image.split("/")[0]
    if not auths.get(registry, {}).get("auth"):
        raise SystemExit(f"Pull config must contain inline auth for {registry}; credential helper configs do not work in Kubernetes.")
    print(image)
PY
)
[[ "${#images[@]}" == 2 ]] || { echo "Invalid release or pull credentials config" >&2; exit 1; }
render_args=(--api-image "${images[0]}" --frontend-image "${images[1]}")
if [[ -n "${TERRAFORM_OUTPUT_JSON:-}" ]]; then
  render_args+=(--terraform-output "$TERRAFORM_OUTPUT_JSON")
fi
python3 "$infra/scripts/render-sg-wedding.py" "${render_args[@]}"
overlay="$infra/.local/sg-wedding"
k kustomize "$overlay" > "$root/.local/rendered-manifests.yaml"
if grep -Eq 'REPLACE_WITH_|replace-me|:latest' "$root/.local/rendered-manifests.yaml"; then
  echo "Unresolved manifest values" >&2; exit 1
fi

k apply -f "$infra/kubernetes/sg-wedding/namespace.yaml"
k -n sg-wedding create secret generic ocir-pull --type=kubernetes.io/dockerconfigjson \
  --from-file=".dockerconfigjson=$DOCKER_CONFIG_JSON" --dry-run=client -o yaml | k apply -f -
k -n sg-wedding create secret tls sg-wedding-tls \
  --cert="$TLS_CERT_FILE" --key="$TLS_KEY_FILE" --dry-run=client -o yaml | k apply -f -
k apply --dry-run=server -k "$overlay"
# This Service provisions the public OCI load balancer defined by the infrastructure repo.
# Apply the API and supporting resources before rolling the frontend.
k apply --dry-run=client -k "$overlay" -o json | python3 -c 'import json,sys; d=json.load(sys.stdin); d["items"]=[x for x in d["items"] if not (x["kind"]=="Deployment" and x["metadata"]["name"]=="sg-wedding-frontend")]; json.dump(d,sys.stdout)' | k apply -f -
k -n sg-wedding rollout status deployment/sg-wedding-api --timeout=300s
k apply -k "$overlay"
k -n sg-wedding rollout status deployment/sg-wedding-frontend --timeout=300s
k -n sg-wedding get service sg-wedding-web
echo "Verify HTTPS before updating DNS: bash scripts/smoke-test.sh <load-balancer-ip>"

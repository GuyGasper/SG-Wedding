#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
python3 scripts/verify-https.py "${1:?Provide the wedding load balancer IP}" "${@:2}"

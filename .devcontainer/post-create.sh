#!/usr/bin/env bash
set -euo pipefail

bun install
bunx playwright install --with-deps chromium

# Railway CLI (https://docs.railway.com/cli)
if ! command -v railway >/dev/null 2>&1; then
  bash <(curl -fsSL https://railway.com/install.sh) -y
fi

railway --version

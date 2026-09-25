#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"

echo "Checking wrangler auth with token..."
npx wrangler whoami

echo "Deploying worker assets to Cloudflare..."
npx wrangler deploy

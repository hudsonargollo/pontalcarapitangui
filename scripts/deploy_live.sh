#!/usr/bin/env bash
set -e
cd /root/ClubeMkt/mimenu

TOKEN="REDACTED"
export CLOUDFLARE_API_TOKEN="$TOKEN"

echo "Checking wrangler auth with token..."
npx wrangler whoami

echo "Deploying worker assets to Cloudflare..."
npx wrangler deploy

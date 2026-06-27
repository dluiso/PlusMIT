#!/usr/bin/env bash
set -euo pipefail

site_url="${1:-${NEXT_PUBLIC_SITE_URL:-https://plusmit.com}}"
site_url="${site_url%/}"

echo "Checking Docker services..."
docker compose ps
app_status="$(docker compose ps --format json app | grep -o '"Health":"[^"]*"' | head -n 1 | cut -d '"' -f 4 || true)"
if [ "${app_status}" = "unhealthy" ]; then
  echo "App container is unhealthy. Recent health/log output:"
  docker inspect --format='{{json .State.Health}}' "$(docker compose ps -q app)" || true
  docker compose logs app --tail=80 || true
  exit 1
fi

echo
echo "Checking local app health..."
curl -fsSI "http://localhost:${APP_PORT:-3000}/api/public-settings" >/dev/null
echo "Local app health OK."

echo
echo "Checking public headers..."
curl -fsSI -H "Accept-Encoding: br,gzip" "${site_url}/" | grep -iE "content-encoding|cache-control|cf-cache-status|strict-transport|content-security-policy|cross-origin|x-content-type-options|referrer-policy|permissions-policy" || true

echo
echo "Checking security.txt..."
curl -fsSI "${site_url}/.well-known/security.txt" | grep -iE "http/|cache-control|content-type" || true

echo
echo "Checking cached Next static asset..."
asset_path="$(curl -fsSL "${site_url}/" | grep -o '/_next/static/[^"]*\.css' | head -n 1 || true)"
if [ -n "${asset_path}" ]; then
  curl -fsSI -H "Accept-Encoding: br,gzip" "${site_url}${asset_path}" | grep -iE "content-encoding|cache-control|cf-cache-status|age" || true
else
  echo "No CSS asset path found in homepage HTML."
fi

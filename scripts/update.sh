#!/usr/bin/env bash
set -euo pipefail

./scripts/check-env.sh
docker compose pull postgres
docker compose build
docker compose up -d postgres
docker compose run --rm cli npm run migrate
docker compose up -d app
echo "Update completed."

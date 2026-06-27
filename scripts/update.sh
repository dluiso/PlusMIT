#!/usr/bin/env bash
set -euo pipefail

./scripts/check-env.sh
docker compose pull postgres
docker compose build app
docker compose up -d
docker compose exec app npm run migrate
echo "Update completed."

#!/usr/bin/env bash
set -euo pipefail

./scripts/check-env.sh
mkdir -p backups
timestamp=$(date +"%Y%m%d-%H%M%S")
file="backups/plusmit-${timestamp}.dump"

docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$file"
echo "Database backup written to $file"

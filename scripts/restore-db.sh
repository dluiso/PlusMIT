#!/usr/bin/env bash
set -euo pipefail

./scripts/check-env.sh

backup_file=${1:-}
if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
  echo "Usage: scripts/restore-db.sh backups/file.dump"
  exit 1
fi

read -r -p "This will restore $backup_file into $POSTGRES_DB. Type RESTORE to continue: " confirm
[ "$confirm" = "RESTORE" ] || exit 1

cat "$backup_file" | docker compose exec -T postgres pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists
echo "Restore completed."

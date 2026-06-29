#!/usr/bin/env bash
set -euo pipefail

required=(
  DATABASE_URL
  POSTGRES_DB
  POSTGRES_USER
  POSTGRES_PASSWORD
  PAYLOAD_SECRET
  SESSION_SECRET
  ENCRYPTION_SECRET
  CSRF_SECRET
  NEXT_PUBLIC_SITE_URL
)

if [ ! -f .env ]; then
  echo ".env is missing. Run scripts/install.sh first."
  exit 1
fi

set -a
source .env
set +a

missing=0
for name in "${required[@]}"; do
  if [ -z "${!name:-}" ]; then
    echo "Missing required environment variable: $name"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "Environment check passed."

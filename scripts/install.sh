#!/usr/bin/env bash
set -euo pipefail

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "$1 is required."
    exit 1
  fi
}

secret() {
  openssl rand -base64 48 | tr -d '\n'
}

need docker
need openssl
docker compose version >/dev/null

if [ -f .env ]; then
  read -r -p ".env already exists. Overwrite it? Type YES to continue: " overwrite
  [ "$overwrite" = "YES" ] || exit 1
fi

read -r -p "Production domain, including https://: " site_url
read -r -p "Database name [plusmit]: " db_name
db_name=${db_name:-plusmit}
read -r -p "Database user [plusmit]: " db_user
db_user=${db_user:-plusmit}
read -r -s -p "Database password: " db_pass
echo
read -r -p "GA4 Measurement ID (optional): " ga_id
read -r -p "Google Tag Manager ID (optional): " gtm_id
read -r -p "Cloudflare Turnstile Site Key (optional): " turnstile_site
read -r -s -p "Cloudflare Turnstile Secret Key (optional): " turnstile_secret
echo
read -r -p "SMTP host (optional): " smtp_host
read -r -p "SMTP port [587]: " smtp_port
smtp_port=${smtp_port:-587}
read -r -p "SMTP user (optional): " smtp_user
read -r -s -p "SMTP password (optional): " smtp_password
echo
read -r -p "SMTP from address (optional): " smtp_from

cat > .env <<EOF
DATABASE_URL=postgres://${db_user}:${db_pass}@postgres:5432/${db_name}
POSTGRES_DB=${db_name}
POSTGRES_USER=${db_user}
POSTGRES_PASSWORD=${db_pass}
PAYLOAD_SECRET=$(secret)
SESSION_SECRET=$(secret)
ENCRYPTION_SECRET=$(secret)
CSRF_SECRET=$(secret)
NEXT_PUBLIC_SITE_URL=${site_url}
NEXT_PUBLIC_GA_MEASUREMENT_ID=${ga_id}
NEXT_PUBLIC_GTM_ID=${gtm_id}
NEXT_PUBLIC_TURNSTILE_SITE_KEY=${turnstile_site}
TURNSTILE_SECRET_KEY=${turnstile_secret}
SMTP_HOST=${smtp_host}
SMTP_PORT=${smtp_port}
SMTP_USER=${smtp_user}
SMTP_PASSWORD=${smtp_password}
SMTP_FROM=${smtp_from}
EOF

chmod 600 .env

docker compose up -d --build
docker compose exec app npm run migrate
docker compose exec app npm run seed

echo "Setup URL: ${site_url}/setup"
echo "Admin URL after setup: ${site_url}/admin"

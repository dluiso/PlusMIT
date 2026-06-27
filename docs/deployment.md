# Debian 12 Production Deployment

Target domain: `plusmit.com`

Target server: fresh Debian 12 VM behind Cloudflare Tunnel or another TLS reverse proxy.

## 1. Prepare DNS

Point `plusmit.com` to the server or route it through Cloudflare Tunnel. The app listens locally on port `3000`.

## 2. Install Server Packages

```bash
sudo apt update
sudo apt install -y ca-certificates curl git gnupg openssl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
```

Log out and back in, or run:

```bash
newgrp docker
```

Verify Docker Compose:

```bash
docker compose version
```

## 3. Clone and Install

```bash
git clone https://github.com/dluiso/PlusMIT.git
cd PlusMIT
chmod +x scripts/*.sh
./scripts/install.sh
```

Use these production values when prompted:

- Production domain: `https://plusmit.com`
- Database name: `plusmit`
- Database user: `plusmit`
- Database password: leave blank to generate, or provide a strong alphanumeric password.
- GA4, GTM, Turnstile, and SMTP: leave blank until the real provider values are ready.

The installer creates `.env`, builds the app image, starts PostgreSQL, runs migrations, seeds starter content, and starts the web app.

By default the app binds Docker port `3000` to `127.0.0.1` only:

```env
APP_BIND_ADDRESS=127.0.0.1
APP_PORT=3000
```

Keep that default when Cloudflare Tunnel, Nginx, Caddy, or another local reverse proxy fronts the app. Only use `APP_BIND_ADDRESS=0.0.0.0` for temporary direct testing, and restrict it with a firewall.

## 4. Cloudflare Tunnel Example

Install `cloudflared` using Cloudflare's Debian instructions, then run:

```bash
cloudflared tunnel login
cloudflared tunnel create plusmit
cloudflared tunnel route dns plusmit plusmit.com
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Use this config shape:

```yaml
tunnel: plusmit
credentials-file: /root/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: plusmit.com
    service: http://localhost:3000
  - hostname: www.plusmit.com
    service: http://localhost:3000
  - service: http_status:404
```

Then install and start the tunnel service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared --no-pager
```

Protect `/admin*` and `/setup*` with Cloudflare Access before creating real content. If you later choose a fixed custom admin route, protect that path as well.

## 5. First Run

Open:

```text
https://plusmit.com/setup
```

Create the first admin user. After setup is complete, use:

```text
https://plusmit.com/admin
```

`PAYLOAD_ADMIN_ROUTE` defaults to `/admin`. Changing it is a code/deploy change, not a CMS setting. The Payload admin route and the Next App Router payload admin folder must be changed together.

## 6. Smoke Checks

```bash
docker compose ps
curl -I http://localhost:3000
curl -I http://localhost:3000/admin
curl -I https://plusmit.com
```

Static assets and uploaded media are intended to be cached by the browser/CDN. After changing logo, favicon, or media-heavy content, purge Cloudflare cache if the old asset remains visible.

## 7. Updates

For updates:

```bash
git pull
./scripts/update.sh
```

After an update, run:

```bash
./scripts/post-deploy-check.sh https://plusmit.com
```

If an update fails after `git pull`, return to the previous known good commit:

```bash
git log --oneline -5
git checkout <previous-good-commit>
./scripts/update.sh
```

Then investigate the failed commit before moving forward again.

## 8. Backups

Create a database backup:

```bash
./scripts/backup-db.sh
```

Restore a database backup:

```bash
./scripts/restore-db.sh backups/<backup-file>.sql.gz
```

Do not commit `.env`. Do not bake secrets into Docker images.

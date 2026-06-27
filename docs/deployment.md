# Deployment

Target: Debian or Ubuntu VM behind Cloudflare Tunnel.

1. Install Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
```

2. Clone the repository.
3. Run:

```bash
chmod +x scripts/*.sh
./scripts/install.sh
```

4. Complete `/setup`.
5. Protect `/admin` and `/setup` with Cloudflare Access.

For updates:

```bash
git pull
./scripts/update.sh
```

Do not commit `.env`. Do not bake secrets into Docker images.

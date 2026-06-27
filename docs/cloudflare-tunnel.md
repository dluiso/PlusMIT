# Cloudflare Tunnel

1. Install `cloudflared` on the Debian or Ubuntu VM.
2. Authenticate:

```bash
cloudflared tunnel login
```

3. Create a named tunnel:

```bash
cloudflared tunnel create plusmit
```

4. Route the hostname:

```bash
cloudflared tunnel route dns plusmit plusmit.com
```

5. Configure ingress to the local app:

```yaml
tunnel: plusmit
credentials-file: /root/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: plusmit.com
    service: http://localhost:3000
  - service: http_status:404
```

6. Install the service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Use Cloudflare Zero Trust Access policies to protect `/admin` and `/setup`. Troubleshoot with `systemctl status cloudflared`, tunnel logs, DNS records, and `docker compose ps`.

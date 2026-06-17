

# Deploying the MRM app to the Contabo server (`http://91.230.110.121/mrm`)

This app ships as **4 Docker containers** wired on their own private network and
exposed through a **single host port**. It is served under the `/mrm` path and
is fully isolated from the other application already running on the server.

> **Repository layout:** this folder ("Full Project") is the deployable root —
> it must be the root of the Git repo you deploy from, so that
> `docker-compose.yml`, `frontend/` and `backend/` sit at the repo root.

```
Internet ──▶ http://91.230.110.121/mrm
                      │
        ┌─────────────▼─────────────┐
        │  Server's main nginx :80  │   (you add one `location /mrm/` block)
        └─────────────┬─────────────┘
                      │ proxy_pass http://127.0.0.1:8090
        ┌─────────────▼───────────────────────────────────────┐
        │  frontend (nginx, container :80) — published as      │
        │  127.0.0.1:8090. Serves the Angular SPA at /mrm/ and │
        │  proxies the app's sub-paths over the mrm-net network:│
        │     /mrm/agent/        ──▶ reception_agent : 8350     │
        │     /mrm/mrm-backend/  ──▶ deep_agent      : 9090     │
        │     /mrm/ws            ──▶ mcp_server       : 8354 (WS)│
        │     /mrm/governance-api/ ─▶ (disabled, see below)     │
        └──────────────────────────────────────────────────────┘
```

**Isolation guarantees** (so the other app is never affected):
- Compose project name is `mrm` with its own bridge network `mrm-net`.
- Only the frontend publishes a host port, bound to `127.0.0.1` (not public).
- The 3 backends have **no host ports** — they talk over `mrm-net` only, so they
  cannot collide with any port the other app uses.

---

## 1. One-time server setup

On the Contabo box (the deploy user must be able to run `docker`):

```bash
# Pick the deploy directory (must match the DEPLOY_PATH variable below).
sudo mkdir -p /opt/mrm && sudo chown "$USER" /opt/mrm
git clone <THIS_REPO_URL> /opt/mrm     # repo root must contain docker-compose.yml
cd /opt/mrm
git checkout main
```

Requirements on the server: Docker Engine + the Compose plugin
(`docker compose version`). The other app already runs on Docker, so this is
usually already present.

## 2. GitHub repository Secrets / Variables

`Settings → Secrets and variables → Actions`:

**Secrets**
| Name | Value |
|---|---|
| `SERVER_HOST` | `91.230.110.121` |
| `SERVER_USER` | your SSH user |
| `SERVER_SSH_KEY` | private SSH key (PEM) for that user |
| `OPENAI_API_KEY` | OpenAI key (used by all 3 backends) |
| `TAVILY_API_KEY` | Tavily key (deep_agent web search) |

**Variables** (optional — sensible defaults shown)
| Name | Default | Meaning |
|---|---|---|
| `SERVER_PORT` | `22` | SSH port |
| `DEPLOY_PATH` | `/opt/mrm` | checkout dir on the server |
| `MRM_HOST_PORT` | `8090` | host port the frontend binds to (must match the nginx block) |

## 3. Add the `/mrm` route to the server's main nginx

Edit the server-level nginx site that serves `91.230.110.121` on port 80.

**a)** Once, in the `http { ... }` context (e.g. top of `nginx.conf`) — only add
if you don't already have a `connection_upgrade` map:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

**b)** Inside the `server { listen 80; ... }` block, add:

```nginx
# MRM app — proxied to its frontend container (keep the /mrm prefix intact).
location = /mrm { return 301 /mrm/; }
location /mrm/ {
    proxy_pass http://127.0.0.1:8090;          # no trailing slash: preserves /mrm/...
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # WebSocket support for /mrm/ws
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout  3600s;
    proxy_send_timeout  3600s;
    client_max_body_size 32m;
}
```

Then: `sudo nginx -t && sudo systemctl reload nginx`.

> If your "main nginx" is actually the **other app's** frontend container that
> holds port 80, add the same two blocks to that container's nginx config
> instead. Nothing else about the other app needs to change.

## 4. Deploy

- **Automatic:** push to `main` (the workflow triggers on changes under
  `frontend/`, `backend/`, or `docker-compose.yml`).
- **Manual:** Actions → *Deploy MRM app (Contabo)* → *Run workflow*.

The workflow SSHes in, `git reset --hard origin/main`, writes `.env` from the
secrets, and runs `docker compose -p mrm up -d --build`.

## 5. Verify

```bash
# On the server:
docker compose -p mrm ps                 # all 4 services Up / healthy
curl -s http://127.0.0.1:8090/health     # -> ok
curl -s http://127.0.0.1:8090/mrm/ | head # -> Angular index.html

# From anywhere:
#   open http://91.230.110.121/mrm
```

In the browser DevTools, requests should go to `…/mrm/agent/…`,
`…/mrm/mrm-backend/…` and the WebSocket to `ws://91.230.110.121/mrm/ws`.

---

## The governance API (`/mrm/governance-api/`) is disabled by default

The frontend's multi-document upload calls a governance backend on port `8353`.
No service in **this** project serves it — it belongs to the separate app
already on your server. It is therefore stubbed (`501`) until you wire it up.

To enable, edit `frontend/nginx.conf`, replace the
`location ^~ /mrm/governance-api/ { return 501; }` block with:

```nginx
location ^~ /mrm/governance-api/ {
    resolver 127.0.0.11 valid=30s;                 # Docker DNS
    set $gov "http://GOVERNANCE_HOST:8353";        # <-- existing backend
    rewrite ^/mrm/governance-api/(.*)$ /$1 break;  # strip the prefix
    proxy_pass $gov;
    proxy_set_header Host $host;
    client_max_body_size 64m;
}
```

`GOVERNANCE_HOST` options:
- the existing backend's **container name** — then add its Docker network to the
  `frontend` service in `docker-compose.yml` (an external network);
- or `host.docker.internal` if that backend publishes `8353` on the host (add
  `extra_hosts: ["host.docker.internal:host-gateway"]` to the `frontend` service).

Rebuild the frontend (`docker compose -p mrm up -d --build frontend`).

---

## Notes

- **Secrets** are never committed. `.env` is git-ignored and rewritten on each
  deploy from GitHub Secrets.
- **Single worker / in-memory sessions:** the backends keep state in-process —
  run one replica each (the compose does).
- **Generated files** (deep_agent reports, uploaded docs) live inside the
  container and are reset on redeploy. Add a named volume on `/app/docs` and
  `/app/deep_agent` if you need persistence.
- **Logs:** `docker compose -p mrm logs -f <service>`. A `502` at `/mrm/...`
  means the target backend isn't up yet — check that service's logs.

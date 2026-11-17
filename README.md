# Ayin Studio

Static marketing site for Ayin Studio — custom software for professional teams.

## Stack

- Plain HTML / CSS / JS (Tailwind via CDN)
- Served by **nginx** in Docker
- Ready for **Render** (Docker web service) or any container host

## Project layout

```text
.
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
├── Dockerfile
├── docker-entrypoint.sh   # binds nginx to $PORT (Render)
├── nginx.conf
├── docker-compose.yml
├── render.yaml
└── .dockerignore
```

## Run locally (Docker)

```bash
docker compose up --build
# open http://localhost:8080
```

Or without Compose:

```bash
docker build -t ayin-studio .
docker run --rm -p 8080:80 ayin-studio
```

## Deploy on Render

### Option A — Blueprint (`render.yaml`)

1. Push this folder to a Git repo.
2. In [Render](https://dashboard.render.com): **New → Blueprint** → select the repo.
3. Apply the blueprint. Service name: `ayin-studio`.

### Option B — Manual Docker service

1. **New → Web Service** → connect the repo.
2. Runtime: **Docker**.
3. Dockerfile path: `./Dockerfile` (repo root = this folder).
4. Health check path: `/healthz`.
5. Plan: Free is fine for a static site.

Render injects `PORT`; the entrypoint rewrites nginx to listen on that port.

### Option C — Static Site (no Docker)

1. **New → Static Site**.
2. Build command: leave empty (or `echo "static"`).
3. Publish directory: `.` (or the folder that contains `index.html`).

## Health check

`GET /healthz` → `200 ok`

## Notes

- Contact form is client-side only (confirmation message); wire a form backend or Formspree/Netlify Forms if you need real submissions.
- External fonts load from Google Fonts; no build step required.

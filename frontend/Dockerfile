# syntax=docker/dockerfile:1
# ---- Frontend: build Angular 19 (MainApp) and serve it under /mrm via nginx ----

# Stage 1: build the production bundle.
# `ng build` defaults to the production configuration (see angular.json), which
# sets baseHref=/mrm/ and swaps in environment.prod.ts (same-origin /mrm paths).
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --legacy-peer-deps: the lockfile was resolved with relaxed peer deps (e.g.
# ngx-socket-io's peer range lags Angular 19), so strict `npm ci` would ERESOLVE.
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: serve with nginx.
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf
# Serve the SPA from /mrm so request paths match the /mrm/ base href.
COPY --from=build /app/dist/main-app/browser /usr/share/nginx/html/mrm
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health >/dev/null 2>&1 || exit 1

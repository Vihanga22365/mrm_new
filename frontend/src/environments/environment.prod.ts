/**
 * Production environment for the containerised /mrm deployment.
 *
 * Unlike environment.ts (local dev, talks to http://localhost:<port>), this
 * build is served behind the frontend container's nginx at the `/mrm/` base
 * href. Every backend call is therefore a *same-origin* path under `/mrm/`,
 * and nginx fans each prefix out to the right internal service:
 *
 *   /mrm/agent/...        -> reception_agent  (sessions API)
 *   /mrm/mrm-backend/...  -> deep_agent       (MRM agent API)
 *   /mrm/governance-api/  -> external governance backend (see DEPLOYMENT.md)
 *   /mrm/ws               -> mcp_server        (native WebSocket)
 *
 * No host or port is hardcoded, so the same image works on any domain/IP.
 */

/** Build the ws(s):// origin from the page URL so http->ws / https->wss. */
function wsOrigin(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}`;
}

export const environment = {
  production: true,

  // Same-origin path prefixes (proxied by the frontend nginx).
  get agenticApplicationUrl(): string {
    return '/mrm/agent';
  },
  get backendApiUrl(): string {
    // ApiConfigService appends `/governance`, giving /mrm/governance-api/api/governance.
    return '/mrm/governance-api/api';
  },
  get backendBaseUrl(): string {
    return '/mrm/governance-api';
  },
  get mcpServerWsUrl(): string {
    // ChatHistoryWebSocketService appends `/ws`, giving <wsOrigin>/mrm/ws.
    return `${wsOrigin()}/mrm`;
  },
  get mrmBackendUrl(): string {
    return '/mrm/mrm-backend';
  },

  // Application Configuration
  appName: 'agentic_application',
  defaultUserId: 'Chathusha Wijenayake',

  // External CDN URLs
  pdfjsWorkerUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
};

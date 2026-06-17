# syntax=docker/dockerfile:1
# ---- mcp_server: MCP streamable-http (:8351) + WebSocket stream (:8354) ----
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

COPY . .

ENV PATH="/app/.venv/bin:$PATH"

RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app
USER appuser

# 8351 = MCP transport (used internally by reception_agent),
# 8354 = WebSocket (reached by the browser through the frontend nginx).
EXPOSE 8351 8354
# main.py launches the WebSocket server (thread) then the MCP server.
CMD ["python", "main.py"]

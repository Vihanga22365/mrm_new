# syntax=docker/dockerfile:1
# ---- reception_agent: FastAPI "Agentic Backend" (uvicorn :8350) ----
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# System libs for the unstructured[pdf] dependency (file typing + PDF text).
RUN apt-get update && apt-get install -y --no-install-recommends \
        libmagic1 poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

COPY . .

ENV PATH="/app/.venv/bin:$PATH"

RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8350
# main.py reads PORT (default 8350) and connects to MCP_SERVER_HOST/PORT on startup.
CMD ["python", "main.py"]

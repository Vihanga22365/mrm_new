# syntax=docker/dockerfile:1
# ---- deep_agent: FastAPI "MRM Agent Backend" (uvicorn :9090) ----
# NOTE: build context is ./backend (not ./backend/deep_agent) so we can also
# copy the shared ../docs directory that deep_agent reads at runtime
# (docs/document_stucture.md) and writes uploaded documents into.
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app/deep_agent

# 1) Locked dependencies first (cached layer; only changes with the lockfile).
COPY deep_agent/pyproject.toml deep_agent/uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# 2) Application code + shared docs dir. deep_agent resolves ../docs relative
#    to this directory, i.e. /app/docs.
COPY deep_agent/ ./
COPY docs/ /app/docs/

# Put the venv on PATH so `python` is the project interpreter.
ENV PATH="/app/deep_agent/.venv/bin:$PATH"

RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 9090
# main.py starts uvicorn on 0.0.0.0:9090 (timeout_keep_alive=300).
CMD ["python", "main.py"]

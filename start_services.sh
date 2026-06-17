#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Deep Agent, MCP Server, Reception Agent, and Frontend..."

PIDS=()

activate_venv_if_present() {
  if [[ -f ".venv/bin/activate" ]]; then
    # Linux/macOS venv path
    # shellcheck disable=SC1091
    source ".venv/bin/activate"
  elif [[ -f ".venv/Scripts/activate" ]]; then
    # Git Bash/WSL-compatible path for Windows-created venvs
    # shellcheck disable=SC1091
    source ".venv/Scripts/activate"
  else
    echo "Warning: virtual environment activation script not found in $(pwd)/.venv"
  fi
}

start_service() {
  local name="$1"
  local path="$2"
  local command="$3"

  (
    cd "$path"
    eval "$command"
  ) &

  local pid="$!"
  PIDS+=("$pid")
  echo "Started: $name (PID $pid)"
}

cleanup() {
  echo
  echo "Stopping all started services..."
  for pid in "${PIDS[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait || true
  echo "All services stopped."
}

trap cleanup INT TERM

start_service "Deep Agent" "$ROOT/backend/deep_agent" "activate_venv_if_present; uv run python main.py"
start_service "MCP Server" "$ROOT/backend/mcp_server" "activate_venv_if_present; uv run python main.py"
start_service "Reception Agent" "$ROOT/backend/reception_agent" "activate_venv_if_present; uv run python main.py"
start_service "Frontend" "$ROOT/frontend" "ng serve"

echo "All start commands launched."
echo "Press Ctrl+C to stop all services."

wait

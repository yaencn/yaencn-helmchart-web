#!/usr/bin/env bash
set -euo pipefail

# One-line: start backend and frontend for local development

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT_DIR/logs"

echo "Starting backend..."
cd "$ROOT_DIR/backend"
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt

# start uvicorn in background and save PID
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > "$ROOT_DIR/logs/backend.log" 2>&1 &
echo $! > "$ROOT_DIR/logs/backend.pid"

echo "Starting frontend..."
cd "$ROOT_DIR/frontend"
npm install

# start vite in background and save PID
nohup npm run dev -- --host 0.0.0.0 > "$ROOT_DIR/logs/frontend.log" 2>&1 &
echo $! > "$ROOT_DIR/logs/frontend.pid"

echo "Started backend (http://localhost:8000) and frontend (http://localhost:5173)."
echo "Logs: $ROOT_DIR/logs/"

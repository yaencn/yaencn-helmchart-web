#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Stopping local services (if running)..."

for pidfile in "$ROOT_DIR"/logs/*.pid; do
  [ -e "$pidfile" ] || continue
  pid=$(cat "$pidfile")
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" || true
    echo "Killed pid $pid"
  fi
  rm -f "$pidfile"
done

echo "Stopped services. Check logs in $ROOT_DIR/logs for details."

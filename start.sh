#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/backend"
if [ ! -d .venv ]; then
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
fi
echo "API: http://127.0.0.1:8000"
echo "Frontend: mở index.html hoặc: python3 -m http.server 8765 (thư mục gốc)"
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload

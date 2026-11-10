#!/usr/bin/env bash
set -e

echo "=== GATEWISE AI 1.0 — Development Environment Launcher ==="
echo "1. Checking environment files..."
if [ ! -f .env ]; then
  echo "No .env found. Copying .env.example to .env..."
  cp .env.example .env
fi

echo "2. Validating Python dependencies..."
python3 -c "import fastapi, sqlalchemy, cv2, alembic; print('Python dependencies validated successfully.')"

echo "3. Starting backend server..."
echo "To launch individual services:"
echo "  Backend: pnpm dev:backend (Port 8000)"
echo "  Web:     pnpm dev:web     (Port 3000)"
echo "  Mobile:  pnpm dev:mobile  (Metro Bundler)"

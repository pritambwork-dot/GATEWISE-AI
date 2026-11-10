#!/usr/bin/env bash
set -e

echo "=== Running Database Migrations via Alembic ==="
cd backend
alembic upgrade head
echo "Database schema migrated to latest revision."

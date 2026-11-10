#!/usr/bin/env bash
set -e

echo "=== Running GATEWISE AI Automated Test Suite ==="
export PYTHONPATH=.
pytest backend/tests/test_gatewise.py -v
echo "All test assertions passed successfully."

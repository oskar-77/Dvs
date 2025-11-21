#!/bin/bash

echo "Starting Python Backend..."
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
cd $(dirname "$0")
python python_backend/app.py

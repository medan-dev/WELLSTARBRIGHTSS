#!/usr/bin/env bash
# Wellstar Bright Finance POS Launcher for macOS and Linux
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    echo "Installing required dependencies..."
    npm install
fi

echo "Starting Wellstar Bright Finance & POS Desktop..."
npm start


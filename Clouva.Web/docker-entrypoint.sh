#!/bin/sh
set -e

# Bind-mount overwrites image files; the node_modules volume may be empty on first run.
if [ ! -f node_modules/vite/bin/vite.js ]; then
	echo "Installing dependencies..."
	pnpm install --frozen-lockfile
fi

exec "$@"

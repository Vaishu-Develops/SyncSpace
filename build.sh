#!/bin/bash

set -e

if ! command -v pnpm >/dev/null 2>&1; then
	if command -v corepack >/dev/null 2>&1; then
		corepack enable
		corepack prepare pnpm@9 --activate
	else
		npm install -g pnpm
	fi
fi

echo "Installing server dependencies..."
cd server
pnpm install --frozen-lockfile --no-strict-peer-dependencies
cd ..

echo "Installing client dependencies..."
cd client
pnpm install --frozen-lockfile --no-strict-peer-dependencies

echo "Building client application..."
pnpm run build
cd ..

echo "Build completed successfully!"
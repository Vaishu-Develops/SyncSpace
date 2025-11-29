#!/bin/bash

# Install dependencies for both client and server
echo "Installing server dependencies..."
cd server && npm install

echo "Installing client dependencies..."
cd ../client && npm install

echo "Building client application..."
npm run build

echo "Build completed successfully!"
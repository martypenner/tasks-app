#!/bin/bash

set -euo pipefail

npm install && (test -f .env || cp .env.example .env) && npm run setup

POCKETBASE_VERSION=0.7.10

test -d src-tauri/binaries ||
  curl -L https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip -o pocketbase.zip &&
  unzip pocketbase.zip &&
  rm LICENSE.md pocketbase.zip &&
  mkdir -p src-tauri/binaries &&
  mv pocketbase src-tauri/binaries/pocketbase-x86_64-unknown-linux-gnu

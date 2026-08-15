#!/bin/sh
set -eu

echo "[entrypoint] running prestart prepare…"
node dist/prepare-environment.js

export PREPARE_DONE=1
echo "[entrypoint] starting API…"
exec node dist/main.js

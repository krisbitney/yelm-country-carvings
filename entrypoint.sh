#!/usr/bin/env bash
set -e

# If host‐mount (/app/img) is empty, seed it from /img-default
if [ -d /img-default ] && [ -z "$(ls -A /app/img)" ]; then
  echo "Seeding /app/img from /img-default…"
  cp -r /img-default/* /app/img/
fi

# exec the original CMD
exec "$@"
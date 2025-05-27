#!/usr/bin/env bash
set -e

# Seed only missing sub‐directories under /app/img from /img-default
if [ -d /img-default ]; then
  mkdir -p /app/img

  for src in /img-default/*; do
    [ -d "$src" ] || continue
    dir=$(basename "$src")
    dest="/app/img/$dir"

    mkdir -p "$dest"
    if [ -z "$(ls -A "$dest")" ]; then
      echo "Seeding $dest from $src…"
      cp -r "$src"/* "$dest"/
    fi
  done
fi

# exec the original CMD
exec "$@"
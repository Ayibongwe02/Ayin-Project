#!/bin/sh
set -eu

# Render (and many hosts) inject PORT. Bind nginx to that port if set.
PORT="${PORT:-80}"

if [ "$PORT" != "80" ]; then
  sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/conf.d/default.conf
fi

exec "$@"

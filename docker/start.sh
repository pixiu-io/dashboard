#!/bin/sh
set -o errexit
set -o xtrace

if [[ ! -d "/etc/pixiu" ]]; then
    mkdir -p /etc/pixiu
fi

if [[ -e "/usr/share/nginx/html/pixiu/config.json" ]]; then
    rm -rf /usr/share/nginx/html/pixiu/config.json
fi
if [[ -e "/etc/pixiu/config.json" ]]; then
    cp /etc/pixiu/config.json /usr/share/nginx/html/pixiu/config.json
fi

echo "Starting pixiu dashboard service"
nginx -g 'daemon on;'

echo "Starting pixiu backend service"
/app

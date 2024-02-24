#!/bin/sh
set -o errexit
set -o xtrace

if [[ ! -d "/etc/pixiu" ]]; then
    mkdir -p /etc/pixiu
fi
cp /configs/config.yaml /etc/pixiu/config.yaml

if [[ -d "/usr/share/nginx/html/pixiu/config.json" ]]; then
    rm -rf /usr/share/nginx/html/pixiu/config.json
fi
if [[ -d "/configs/config.json" ]]; then
    cp /configs/config.json /usr/share/nginx/html/pixiu/config.json
fi

echo "Starting pixiu dashboard service"
nginx -g 'daemon on;'

echo "Starting pixiu backend service"
/app

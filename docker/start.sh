#!/bin/sh
set -o errexit
set -o xtrace

if [[ ! -d "/etc/pixiu" ]]; then
    mkdir -p /etc/pixiu
fi
cp /home/config/config.yaml /etc/pixiu/config.yaml

if [[ -d "/usr/share/nginx/html/pixiu/config.json" ]]; then
    rm -rf /usr/share/nginx/html/pixiu/config.json
fi
if [[ -d "/home/config/config.json" ]]; then
    cp /home/config/config.json /usr/share/nginx/html/pixiu/config.json
fi

echo "Starting pixiu dashboard service"
nginx -g 'daemon on;'

echo "Starting pixiu backend service"
/app

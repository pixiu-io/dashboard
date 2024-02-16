set -o errexit
set -o xtrace

echo "Starting pixiu dashboard service"
nginx -g  'daemon on;'

echo "Starting pixiu backend service"
/app

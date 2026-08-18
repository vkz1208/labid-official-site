#!/usr/bin/env bash
set -euo pipefail

release_sha="${1:?release sha is required}"
archive_path="${2:?source archive path is required}"
release_dir="/var/www/labid-www/releases/${release_sha}"
shared_dir="/var/www/labid-www/shared"
env_file="${shared_dir}/.env"
node_dir="/opt/node-v24.15.0/bin"
pm2_bin="/usr/local/bin/pm2"

test -f "${env_file}"
mkdir -p "${release_dir}"
tar -xzf "${archive_path}" -C "${release_dir}"
ln -sfn "${env_file}" "${release_dir}/.env"
chown -R deploy:deploy "${release_dir}"

sudo -u deploy bash -c "export PATH='${node_dir}':\$PATH; cd '${release_dir}'; npm install --include=dev --no-audit --no-fund --registry=https://registry.npmmirror.com; npm run build"
runtime_dir="${release_dir}/.next/standalone"
mkdir -p "${runtime_dir}/.next/static"
cp -a "${release_dir}/.next/static/." "${runtime_dir}/.next/static/"
cp -a "${release_dir}/public/." "${runtime_dir}/public/"
sudo -u deploy bash -c "export PATH='${node_dir}':\$PATH; cd '${runtime_dir}'; npm install --omit=dev --no-audit --no-fund --registry=https://registry.npmmirror.com"

if sudo -u deploy "${pm2_bin}" describe labid-www >/dev/null 2>&1; then
  sudo -u deploy "${pm2_bin}" delete labid-www
fi
sudo -u deploy bash -c "set -a; source '${env_file}'; set +a; export NODE_ENV=production PORT=3002 HOSTNAME=127.0.0.1; cd '${runtime_dir}'; '${pm2_bin}' start '${node_dir}/node' --name labid-www --update-env -- server.js"
sudo -u deploy "${pm2_bin}" save

for _ in {1..30}; do
  if curl --fail --silent --show-error http://127.0.0.1:3002/api/site >/dev/null; then
    ln -sfn "${release_dir}" /var/www/labid-www/current
    exit 0
  fi
  sleep 1
done

sudo -u deploy "${pm2_bin}" logs labid-www --lines 80 --nostream
exit 1

#!/usr/bin/env bash
set -euo pipefail

release_sha="${1:?release sha is required}"
archive_path="${2:?runtime archive path is required}"
runtime_dir="/var/www/labid-www/runtime/${release_sha}"
shared_dir="/var/www/labid-www/shared"
env_file="${shared_dir}/.env"
node_bin="/opt/node-v24.15.0/bin/node"
npm_bin="/opt/node-v24.15.0/bin/npm"
pm2_bin="/usr/local/bin/pm2"

test -x "${node_bin}"
test -f "${env_file}"
mkdir -p "${runtime_dir}" "${shared_dir}/data" "${shared_dir}/uploads"
tar -xzf "${archive_path}" -C "${runtime_dir}"
cd "${runtime_dir}"
"${npm_bin}" install --omit=dev --no-audit --no-fund

sed -i 's|^DATABASE_PATH=.*|DATABASE_PATH=/var/www/labid-www/shared/data/labid.db|' "${env_file}"
sed -i 's|^UPLOAD_DIR=.*|UPLOAD_DIR=/var/www/labid-www/shared/uploads|' "${env_file}"
chown -R deploy:deploy /var/www/labid-www
chmod 600 "${env_file}"

if sudo -u deploy "${pm2_bin}" describe labid-www >/dev/null 2>&1; then
  sudo -u deploy "${pm2_bin}" delete labid-www
fi

sudo -u deploy bash -c "set -a; source '${env_file}'; set +a; export NODE_ENV=production PORT=3002 HOSTNAME=127.0.0.1; cd '${runtime_dir}'; '${pm2_bin}' start '${node_bin}' --name labid-www --update-env -- server.js"
sudo -u deploy "${pm2_bin}" save

for _ in {1..30}; do
  if curl --fail --silent --show-error http://127.0.0.1:3002/ >/dev/null; then
    ln -sfn "${runtime_dir}" /var/www/labid-www/current-runtime
    exit 0
  fi
  sleep 1
done

sudo -u deploy "${pm2_bin}" logs labid-www --lines 80 --nostream
exit 1

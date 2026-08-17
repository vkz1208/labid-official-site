#!/usr/bin/env bash
set -euo pipefail

release_sha="${1:?release sha is required}"
archive_path="${2:?archive path is required}"
release_dir="/var/www/labid-www/releases/${release_sha}"
shared_dir="/var/www/labid-www/shared"

mkdir -p "${release_dir}" "${shared_dir}"
tar -xzf "${archive_path}" -C "${release_dir}"

if [[ ! -f "${shared_dir}/.env" ]]; then
  umask 077
  admin_password="$(openssl rand -hex 12)"
  session_secret="$(openssl rand -hex 32)"
  {
    echo "NEXT_PUBLIC_SITE_URL=https://www.labid.cn"
    echo "HOST_PORT=3002"
    echo "DATABASE_PATH=/app/data/labid.db"
    echo "ADMIN_EMAIL=276238375@qq.com"
    echo "ADMIN_PASSWORD=${admin_password}"
    echo "ADMIN_SESSION_SECRET=${session_secret}"
    echo "LEAD_NOTIFICATION_EMAIL=276238375@qq.com"
    echo "SMTP_HOST="
    echo "SMTP_PORT=465"
    echo "SMTP_SECURE=true"
    echo "SMTP_USER="
    echo "SMTP_PASSWORD="
    echo "SMTP_FROM="
    echo "UPLOAD_DIR=/app/public/uploads"
    echo "UPLOAD_PUBLIC_BASE_URL=/api/media"
  } > "${shared_dir}/.env"
  {
    echo "ADMIN_EMAIL=276238375@qq.com"
    echo "ADMIN_PASSWORD=${admin_password}"
  } > /root/labid-www-admin-credentials
  chmod 600 /root/labid-www-admin-credentials
fi

ln -sfn "${shared_dir}/.env" "${release_dir}/.env"
chown -R root:root /var/www/labid-www
cd "${release_dir}"
docker compose -p labid-www up -d --build
ln -sfn "${release_dir}" /var/www/labid-www/current

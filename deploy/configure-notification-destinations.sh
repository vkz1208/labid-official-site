#!/usr/bin/env bash
set -euo pipefail

env_file="/var/www/labid-www/shared/.env"
source_env="/var/www/labid/.env.production"

set_value() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" "${env_file}"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "${env_file}"
  else
    printf '%s=%s\n' "${key}" "${value}" >> "${env_file}"
  fi
}

set_value LEAD_NOTIFICATION_EMAIL "cmbvicky@163.com"
set_value LEAD_NOTIFICATION_SMS "18566718921"

if [[ -f "${source_env}" ]]; then
  # Reuse the server's existing Alibaba Cloud account, but require a dedicated
  # approved notification sign and template before any SMS can be sent.
  set -a
  source "${source_env}"
  set +a
  set_value ALIYUN_SMS_ACCESS_KEY_ID "${ALIYUN_SMS_ACCESS_KEY_ID:-}"
  set_value ALIYUN_SMS_ACCESS_KEY_SECRET "${ALIYUN_SMS_ACCESS_KEY_SECRET:-}"
  set_value ALIYUN_SMS_REGION_ID "${ALIYUN_SMS_REGION_ID:-cn-hangzhou}"
fi

set_value ALIYUN_SMS_NOTIFICATION_SIGN_NAME "${ALIYUN_SMS_NOTIFICATION_SIGN_NAME:-}"
set_value ALIYUN_SMS_NOTIFICATION_TEMPLATE_CODE "${ALIYUN_SMS_NOTIFICATION_TEMPLATE_CODE:-}"
chown deploy:deploy "${env_file}"
chmod 600 "${env_file}"

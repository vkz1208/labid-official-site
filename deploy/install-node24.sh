#!/usr/bin/env bash
set -euo pipefail

node_version="v24.15.0"
install_dir="/opt/node-${node_version}"
archive="node-${node_version}-linux-x64.tar.xz"
base_url="https://nodejs.org/dist/${node_version}"

if [[ -x "${install_dir}/bin/node" ]]; then
  "${install_dir}/bin/node" --version
  exit 0
fi

work_dir="$(mktemp -d)"
trap 'rm -rf "${work_dir}"' EXIT
curl --fail --location --silent --show-error "${base_url}/${archive}" -o "${work_dir}/${archive}"
curl --fail --location --silent --show-error "${base_url}/SHASUMS256.txt" -o "${work_dir}/SHASUMS256.txt"
cd "${work_dir}"
grep " ${archive}$" SHASUMS256.txt | sha256sum --check --status
mkdir -p "${install_dir}"
tar -xJf "${archive}" --strip-components=1 -C "${install_dir}"
"${install_dir}/bin/node" --version

#!/usr/bin/env bash

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-backups}"
STAMP="$(date +%Y%m%d-%H%M)"

mkdir -p "$BACKUP_DIR"

if [[ -z "${DIRECT_URL:-}" ]]; then
  echo "DIRECT_URL ortam degiskeni tanimli degil."
  exit 1
fi

pg_dump "$DIRECT_URL" | gzip > "$BACKUP_DIR/db-$STAMP.sql.gz"
echo "Yedek olusturuldu: $BACKUP_DIR/db-$STAMP.sql.gz"

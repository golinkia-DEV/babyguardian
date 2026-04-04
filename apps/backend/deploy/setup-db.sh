#!/usr/bin/env bash
# =============================================================================
# Crea la base de datos PostgreSQL para BabyGuardian (ejecutar una sola vez)
# Uso: bash setup-db.sh
# =============================================================================
set -euo pipefail

DB_NAME="babyguardian_prod"
DB_USER="babyguardian"
# Genera password aleatorio si no se pasa como argumento
DB_PASS="${1:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)}"

echo "==> Creando usuario y base de datos PostgreSQL..."

sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  ELSE
    ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;

SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}' \gexec
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
\c ${DB_NAME}
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
GRANT ALL ON SCHEMA public TO ${DB_USER};
SQL

echo ""
echo "============================================================"
echo " Base de datos lista."
echo " DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
echo ""
echo " Copia esta linea a /opt/babyguardian/backend/.env"
echo "============================================================"

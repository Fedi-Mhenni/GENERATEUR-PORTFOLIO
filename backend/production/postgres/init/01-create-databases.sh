#!/bin/sh
set -eu

create_database() {
  database="$1"
  username="$2"
  password="$3"

  psql --username "$POSTGRES_USER" --dbname postgres \
    --set=database="$database" \
    --set=username="$username" \
    --set=password="$password" <<'EOSQL'
CREATE USER :"username" WITH PASSWORD :'password';
CREATE DATABASE :"database" OWNER :"username";
REVOKE ALL PRIVILEGES ON DATABASE :"database" FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE :"database" TO :"username";
EOSQL
}

create_database "$STRAPI_A_DATABASE" "$STRAPI_A_USER" "$STRAPI_A_PASSWORD"
create_database "$STRAPI_B_DATABASE" "$STRAPI_B_USER" "$STRAPI_B_PASSWORD"
create_database "$STRAPI_C_DATABASE" "$STRAPI_C_USER" "$STRAPI_C_PASSWORD"

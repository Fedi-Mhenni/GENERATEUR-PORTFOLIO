#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKEND_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)"
readonly COMPOSE_FILE="$BACKEND_DIR/compose.prod.yml"

readonly STATE_DIR="$BACKEND_DIR/production/.deploy-state"
readonly LAST_SUCCESSFUL_TAG_FILE="$STATE_DIR/last-successful-tag"
readonly LOCK_FILE="$STATE_DIR/deploy.lock"

readonly IMAGE_REPOSITORY="ghcr.io/fedi-mhenni/generateur-portfolio"
readonly SERVICES=(strapi_a strapi_b strapi_c)
readonly HEALTH_ATTEMPTS=30
readonly HEALTH_WAIT_SECONDS=5

log() {
  printf '[%s] %s\n' "$(date --iso-8601=seconds)" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

validate_tag() {
  [[ "$1" =~ ^[0-9a-f]{40}$ ]] ||
    fail "Image tag must be a full 40-character Git SHA."
}

wait_for_health() {
  local service="$1"
  local container_id
  local health
  local attempt

  container_id="$(docker compose -f "$COMPOSE_FILE" ps -q "$service")"
  [[ -n "$container_id" ]] || fail "No container found for $service."

  for ((attempt = 1; attempt <= HEALTH_ATTEMPTS; attempt++)); do
    health="$(docker inspect \
      --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' \
      "$container_id")"

    case "$health" in
      healthy)
        log "$service is healthy."
        return 0
        ;;
      unhealthy)
        fail "$service is unhealthy."
        ;;
      missing)
        fail "$service has no healthcheck."
        ;;
      *)
        log "$service is $health ($attempt/$HEALTH_ATTEMPTS)."
        sleep "$HEALTH_WAIT_SECONDS"
        ;;
    esac
  done

  fail "$service did not become healthy in time."
}

deploy_one() {
  local service="$1"
  local tag="$2"
  local image="$IMAGE_REPOSITORY:$tag"

  log "Deploying $service with $image"

  STRAPI_IMAGE="$image" \
    docker compose -f "$COMPOSE_FILE" up -d --no-deps --force-recreate "$service"

  wait_for_health "$service"
}

deploy_all() {
  local tag="$1"
  local service

  for service in "${SERVICES[@]}"; do
    deploy_one "$service" "$tag"
  done
}

read_last_successful_tag() {
  [[ -f "$LAST_SUCCESSFUL_TAG_FILE" ]] || return 0
  tr -d '[:space:]' < "$LAST_SUCCESSFUL_TAG_FILE"
}

write_last_successful_tag() {
  printf '%s\n' "$1" > "$LAST_SUCCESSFUL_TAG_FILE"
}

rollback() {
  local tag="$1"

  log "Rolling back all Strapi services to $tag"
  docker pull "$IMAGE_REPOSITORY:$tag"
  deploy_all "$tag"
  write_last_successful_tag "$tag"
  log "Rollback completed."
}

on_deploy_failure() {
  local exit_code="$1"

  trap - ERR

  if [[ -n "${PREVIOUS_TAG:-}" ]]; then
    log "Deployment failed. Rolling back to $PREVIOUS_TAG."

    if ! rollback "$PREVIOUS_TAG"; then
      log "CRITICAL: rollback also failed. Inspect VPS logs immediately."
    fi
  else
    log "No previous validated image exists; rollback is impossible on this first deployment."
  fi

  exit "$exit_code"
}

main() {
  local action="${1:-}"
  local tag="${2:-}"

  [[ -f "$COMPOSE_FILE" ]] || fail "Compose file not found: $COMPOSE_FILE"
  command -v docker >/dev/null || fail "Docker is unavailable."
  command -v flock >/dev/null || fail "flock is unavailable."

  umask 077
  mkdir -p "$STATE_DIR"

  exec 9>"$LOCK_FILE"
  flock -n 9 || fail "Another deployment is already running."

  docker compose -f "$COMPOSE_FILE" config --quiet

  case "$action" in
    deploy)
      validate_tag "$tag"

      PREVIOUS_TAG="$(read_last_successful_tag)"
      if [[ -n "$PREVIOUS_TAG" ]]; then
        validate_tag "$PREVIOUS_TAG"
      fi

      trap 'on_deploy_failure $?' ERR

      log "Pulling $IMAGE_REPOSITORY:$tag"
      docker pull "$IMAGE_REPOSITORY:$tag"

      deploy_all "$tag"
      write_last_successful_tag "$tag"

      log "Deployment completed successfully with $tag"
      ;;
    rollback)
      PREVIOUS_TAG="$(read_last_successful_tag)"
      [[ -n "$PREVIOUS_TAG" ]] || fail "No previous validated image exists."
      validate_tag "$PREVIOUS_TAG"
      rollback "$PREVIOUS_TAG"
      ;;
    *)
      fail "Usage: $0 deploy <full-git-sha> | rollback"
      ;;
  esac
}

main "$@"
#!/bin/bash
# EC2 "User data" boot script — pasted into the instance launch wizard's
# Advanced details > User data field. Runs once, as root, on first boot only
# (Ubuntu 22.04/24.04 AMI). Installs Docker and brings the app up
# automatically, so the instance is serving traffic with no manual SSH step.
#
# Edit REPO_URL below before launching. GITHUB_TOKEN is only needed if the
# repo is private (a fine-grained PAT with read-only Contents access).
set -euo pipefail

REPO_URL="https://github.com/damnordinarycodes/canieatchickentoday.git"
APP_DIR="/opt/chicken-day"

curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu

git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# Edit Caddyfile here before boot if you already know your domain, e.g.:
# sed -i 's/your-domain.com/chickenday.example.com/' Caddyfile

docker compose up -d --build

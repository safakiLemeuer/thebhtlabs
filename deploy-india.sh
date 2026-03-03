#!/bin/bash
# =============================================================================
# deploy-india.sh — Deploy india.thebhtlabs.com on Hostinger VPS
# Run as root (or sudo) on your VPS:
#   bash deploy-india.sh
# =============================================================================

set -e  # Exit immediately on any error

# ── CONFIG ────────────────────────────────────────────────────────────────
DOMAIN="india.thebhtlabs.com"
WWW_ROOT="/var/www/thebhtlabs"
INDIA_ROOT="$WWW_ROOT/public/india"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
NGINX_LINK="/etc/nginx/sites-enabled/$DOMAIN"
MAIN_APP_NAME="thebhtlabs"   # existing PM2 process name

# ── COLOURS ───────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
info() { echo -e "${YELLOW}→ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "============================================================"
echo "  TheBHTLabs — India Subdomain Deployment"
echo "  Target: $DOMAIN"
echo "============================================================"
echo ""

# ── STEP 1: Pull latest code ──────────────────────────────────────────────
info "Pulling latest code from GitHub..."
cd "$WWW_ROOT" || fail "Cannot cd to $WWW_ROOT — is the main site deployed?"
git pull origin main
ok "Code pulled"

# ── STEP 2: Verify the India HTML file exists ─────────────────────────────
info "Verifying public/india/index.html..."
if [ ! -f "$INDIA_ROOT/index.html" ]; then
  fail "public/india/index.html not found after git pull. Something went wrong."
fi
FILE_SIZE=$(wc -c < "$INDIA_ROOT/index.html")
ok "File present — ${FILE_SIZE} bytes"

# ── STEP 3: Set correct file permissions ─────────────────────────────────
info "Setting file permissions..."
chmod 755 "$INDIA_ROOT"
chmod 644 "$INDIA_ROOT/index.html"
chown -R www-data:www-data "$INDIA_ROOT" 2>/dev/null || true
ok "Permissions set"

# ── STEP 4: Install / verify nginx ───────────────────────────────────────
info "Checking nginx..."
if ! command -v nginx &>/dev/null; then
  info "nginx not found — installing..."
  apt-get update -qq && apt-get install -y nginx
fi
ok "nginx available"

# ── STEP 5: Write nginx vhost ─────────────────────────────────────────────
info "Writing nginx config for $DOMAIN..."
cat > "$NGINX_CONF" << NGINXEOF
# india.thebhtlabs.com — static HTML (standalone, no Next.js proxy)
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $INDIA_ROOT;
    index index.html;

    # Serve the standalone India page
    location / {
        try_files \$uri \$uri/ /index.html =404;
    }

    # Security headers (mirrors main site)
    add_header X-Content-Type-Options    "nosniff"           always;
    add_header X-Frame-Options           "SAMEORIGIN"        always;
    add_header X-XSS-Protection          "1; mode=block"     always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()" always;

    # Cache static assets
    location ~* \.(ico|png|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Let certbot manage SSL redirect after cert is issued
}
NGINXEOF
ok "nginx config written to $NGINX_CONF"

# ── STEP 6: Enable site ───────────────────────────────────────────────────
info "Enabling nginx site..."
ln -sf "$NGINX_CONF" "$NGINX_LINK"
ok "Site enabled"

# ── STEP 7: Test nginx config ─────────────────────────────────────────────
info "Testing nginx configuration..."
nginx -t || fail "nginx config test failed — check $NGINX_CONF"
ok "nginx config valid"

# ── STEP 8: Reload nginx ──────────────────────────────────────────────────
info "Reloading nginx..."
systemctl reload nginx
ok "nginx reloaded"

# ── STEP 9: Install certbot if needed ────────────────────────────────────
info "Checking certbot..."
if ! command -v certbot &>/dev/null; then
  info "certbot not found — installing..."
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
fi
ok "certbot available"

# ── STEP 10: Issue SSL certificate ───────────────────────────────────────
info "Requesting SSL certificate for $DOMAIN..."
echo ""
echo "  NOTE: Make sure your DNS A record for $DOMAIN"
echo "  points to this server's IP before continuing."
echo "  Press ENTER to continue, or Ctrl+C to abort and fix DNS first."
read -r

certbot --nginx -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --redirect \
  --email "info@bhtsolutions.com" \
  || fail "certbot failed — check DNS propagation and try again:\n  certbot --nginx -d $DOMAIN"
ok "SSL certificate issued and HTTPS redirect configured"

# ── STEP 11: Reload nginx with SSL ───────────────────────────────────────
info "Final nginx reload with SSL config..."
systemctl reload nginx
ok "nginx reloaded with SSL"

# ── STEP 12: Smoke test ───────────────────────────────────────────────────
info "Running smoke test..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  ok "Smoke test passed — https://$DOMAIN returned HTTP 200"
else
  echo -e "${YELLOW}⚠  Smoke test returned HTTP $HTTP_CODE — may need a moment for DNS to fully propagate${NC}"
fi

# ── DONE ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo -e "  ${GREEN}india.thebhtlabs.com deployment complete!${NC}"
echo "============================================================"
echo ""
echo "  Live URL   : https://$DOMAIN"
echo "  HTML file  : $INDIA_ROOT/index.html"
echo "  nginx conf : $NGINX_CONF"
echo "  SSL cert   : /etc/letsencrypt/live/$DOMAIN/"
echo ""
echo "  Main site (thebhtlabs.com) was NOT touched."
echo ""
echo "  Useful commands:"
echo "    nginx -t                    # test config"
echo "    systemctl reload nginx      # reload after edits"
echo "    certbot renew --dry-run     # test auto-renewal"
echo "    curl -I https://$DOMAIN     # check headers"
echo ""
echo "  To update the India page in future:"
echo "    cd $WWW_ROOT && git pull origin main"
echo "    systemctl reload nginx"
echo ""

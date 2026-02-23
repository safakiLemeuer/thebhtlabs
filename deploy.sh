#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# TheBHTLabs v3.0 — Full Deploy Script
# Run this on your Hostinger VPS as root
# ═══════════════════════════════════════════════════════════════
set -e

APP_DIR="/var/www/thebhtlabs"
REPO="https://github.com/safakiLemeur/thebhtlabs.git"
DOMAIN="thebhtlabs.com"

echo "═══════════════════════════════════════"
echo "  TheBHTLabs v3.0 Deploy"
echo "═══════════════════════════════════════"

# ─── Step 1: Prerequisites ───
echo ""
echo "[1/8] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "Installing Node.js..."; curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs; }
command -v pm2 >/dev/null 2>&1 || { echo "Installing PM2..."; npm install -g pm2; }
command -v git >/dev/null 2>&1 || { echo "Installing git..."; apt-get install -y git; }
command -v nginx >/dev/null 2>&1 || { echo "Installing nginx..."; apt-get install -y nginx; }

# Build tools for better-sqlite3
apt-get install -y build-essential python3 2>/dev/null || true

echo "   Node: $(node -v)"
echo "   NPM: $(npm -v)"
echo "   PM2: $(pm2 -v 2>/dev/null || echo 'installing...')"

# ─── Step 2: Clone or Pull ───
echo ""
echo "[2/8] Getting latest code..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/main
  echo "   Updated existing repo"
else
  # Backup existing if present
  [ -d "$APP_DIR" ] && mv "$APP_DIR" "${APP_DIR}.bak.$(date +%s)"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
  echo "   Cloned fresh repo"
fi

# ─── Step 3: Preserve data & env ───
echo ""
echo "[3/8] Preserving data..."
mkdir -p "$APP_DIR/data"

# Create .env.local if it doesn't exist
if [ ! -f "$APP_DIR/.env.local" ]; then
  cat > "$APP_DIR/.env.local" << 'ENVEOF'
# Admin dashboard password
ADMIN_PASSWORD=BhtLabs2026!

# Email notifications (Resend)
RESEND_API_KEY=
ALERT_EMAIL=info@bhtsolutions.com

# Chat (Anthropic)
ANTHROPIC_API_KEY=

# Port
PORT=3000
ENVEOF
  echo "   Created .env.local (EDIT THIS with your actual keys)"
else
  echo "   .env.local preserved"
fi

# ─── Step 4: Install dependencies ───
echo ""
echo "[4/8] Installing dependencies..."
cd "$APP_DIR"
npm ci --production=false 2>/dev/null || npm install
echo "   Dependencies installed"

# ─── Step 5: Build ───
echo ""
echo "[5/8] Building Next.js..."
npm run build
echo "   Build complete"

# ─── Step 6: PM2 Setup ───
echo ""
echo "[6/8] Configuring PM2..."
pm2 delete thebhtlabs 2>/dev/null || true
pm2 start server.js --name thebhtlabs --cwd "$APP_DIR" \
  --max-memory-restart 512M \
  --env production
pm2 save
pm2 startup 2>/dev/null || true
echo "   PM2 running"

# ─── Step 7: Nginx Config ───
echo ""
echo "[7/8] Configuring Nginx..."
cat > /etc/nginx/sites-available/thebhtlabs << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect to HTTPS (certbot will add SSL block)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    client_max_body_size 10M;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/thebhtlabs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null
nginx -t && systemctl reload nginx
echo "   Nginx configured"

# ─── Step 8: SSL (if not already) ───
echo ""
echo "[8/8] SSL check..."
if ! command -v certbot &>/dev/null; then
  apt-get install -y certbot python3-certbot-nginx
fi
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "   Run this to enable SSL:"
  echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
  echo "   SSL already configured"
fi

# ─── Done ───
echo ""
echo "═══════════════════════════════════════"
echo "  DEPLOY COMPLETE"
echo "═══════════════════════════════════════"
echo ""
echo "  Site:   https://$DOMAIN"
echo "  Blog:   https://$DOMAIN/blog"
echo "  Admin:  https://$DOMAIN/admin"
echo "  Status: $(pm2 status thebhtlabs --no-color 2>/dev/null | grep thebhtlabs | awk '{print $12}')"
echo ""
echo "  NEXT STEPS:"
echo "  1. Edit /var/www/thebhtlabs/.env.local with your API keys"
echo "  2. Run: pm2 restart thebhtlabs"
echo "  3. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

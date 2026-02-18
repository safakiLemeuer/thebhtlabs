# TheBHTLabs — Deployment Guide
## Complete Setup for Hostinger Hosting

---

## 📋 Architecture Overview

```
thebhtlabs/
├── app/
│   ├── layout.js          # SEO metadata, fonts, global layout
│   ├── page.js            # Server component — fetches RSS, passes to client
│   ├── api/
│   │   ├── contact/route.js    # POST → Nodemailer → info@bhtsolutions.com
│   │   ├── assessment/route.js # POST → Sends report + lead alert email
│   │   └── feed/route.js       # GET → Aggregated RSS feed (cached 15 min)
├── components/
│   └── Platform.js        # Main client-side React app (the full UI)
├── lib/
│   ├── feeds.js           # RSS aggregator with keyword filtering + cache
│   └── case-studies.js    # Real-world case studies with references
├── public/                # Static assets (favicon, images)
├── .env.example           # Environment variable template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
└── DEPLOY.md              # This file
```

---

## 🔧 What's Real-Time / Dynamic

| Feature | How It Works | Update Frequency |
|---------|-------------|-----------------|
| **AI News Feed** | Server-side RSS aggregation from 8+ sources | Every 15 min (ISR) |
| **Contact Forms** | API route → Nodemailer → info@bhtsolutions.com | Instant |
| **Assessment Reports** | API route → Email to user + lead alert to BHT | Instant |
| **AI Chatbot** | Client-side Anthropic API (Claude Sonnet) | Real-time |
| **Case Studies** | Static data in lib/case-studies.js | On deploy |
| **Prompt Vault** | Static data in component | On deploy |

### RSS Feed Sources (all real, all free):
1. **Federal News Network** — federalnewsnetwork.com/category/technology/feed/
2. **Nextgov/FCW** — nextgov.com/rss/all/
3. **TechCrunch AI** — techcrunch.com/category/artificial-intelligence/feed/
4. **Microsoft Copilot Blog** — microsoft.com/en-us/microsoft-copilot/blog/feed/
5. **Microsoft Official Blog** — blogs.microsoft.com/blog/feed/
6. **GovTech** — govtech.com/rss
7. **The Hacker News** — feeds.feedburner.com/TheHackersNews
8. **Schneier on Security** — schneier.com/feed/

Feeds are filtered by AI/compliance/federal keywords before display.

---

## 🚀 Deployment Steps

### Option A: Hostinger Node.js Hosting (Easiest)

**Requirements:** Hostinger Business or Cloud plan

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "TheBHTLabs initial deploy"
   git remote add origin https://github.com/YOUR-ORG/thebhtlabs.git
   git push -u origin main
   ```

2. **In Hostinger hPanel:**
   - Go to **Websites** → **Add Website** → **Node.js Apps**
   - Connect your GitHub repository
   - Framework will auto-detect as Next.js
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Set Environment Variables** in Hostinger:
   ```
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=info@bhtsolutions.com
   SMTP_PASS=<your-email-password>
   CONTACT_EMAIL=info@bhtsolutions.com
   NEXT_PUBLIC_ANTHROPIC_ENABLED=true
   ```

4. **Connect Domain:**
   - Point thebhtsolutions.ai DNS to Hostinger
   - SSL is auto-provisioned

---

### Option B: Hostinger VPS (More Control)

**Requirements:** Hostinger KVM1+ VPS

1. **SSH into VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install dependencies:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   npm install -g pm2
   ```

3. **Clone and build:**
   ```bash
   mkdir -p /var/www/thebhtlabs
   cd /var/www/thebhtlabs
   git clone https://github.com/YOUR-ORG/thebhtlabs.git .
   cp .env.example .env.local
   nano .env.local  # Fill in your values
   npm install
   npm run build
   ```

4. **Start with PM2:**
   ```bash
   pm2 start npm --name "thebhtlabs" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name thebhtsolutions.ai www.thebhtsolutions.ai;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL with Certbot:**
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d thebhtsolutions.ai -d www.thebhtsolutions.ai
   ```

---

## 📧 Email Automation Flow

```
User submits form → /api/contact (POST)
                   ├→ Nodemailer → SMTP (smtp.hostinger.com:465)
                   │  ├→ info@bhtsolutions.com (formatted HTML notification)
                   │  └→ User's email (auto-reply with links)
                   └→ Response: { success: true }

User completes assessment → /api/assessment (POST)
                          ├→ User gets personalized PDF-style report email
                          └→ info@bhtsolutions.com gets lead alert with score
```

### SMTP Setup for Hostinger Email:
1. In hPanel → **Emails** → Create info@bhtsolutions.com
2. Use these SMTP settings:
   - Host: `smtp.hostinger.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `info@bhtsolutions.com`
   - Password: Your email password

---

## 🔄 Adding New Content

### New RSS Feeds:
Edit `lib/feeds.js` → `RSS_SOURCES` array. Add URL, category, and color.

### New Case Studies:
Edit `lib/case-studies.js` → Add new object to `CASE_STUDIES` array.

### New Prompts:
Edit the `VAULT` array in `components/Platform.js`.

### New Packages/Pricing:
Edit the `PACKAGES` array in `components/Platform.js`.

---

## 📊 Monitoring

- **RSS Feeds:** Check `/api/feed` endpoint — returns `live: true/false`
- **Email Delivery:** Monitor via Hostinger email logs
- **Uptime:** PM2 auto-restarts on crash (`pm2 monit`)
- **Errors:** `pm2 logs thebhtlabs`

---

## 🔐 Security Notes

- SMTP credentials are server-side only (never exposed to client)
- Anthropic API key is used client-side for chatbot (rate-limited by Anthropic)
- Contact form has basic validation; add reCAPTCHA for production:
  ```bash
  npm install @google-cloud/recaptcha-enterprise
  ```
- Consider adding rate limiting to API routes for production

---

## 🏗️ Future Enhancements

1. **Database:** Add PostgreSQL for storing assessment results and leads
2. **CRM Integration:** Pipe leads to HubSpot/Salesforce via webhook
3. **Blog/CMS:** Add MDX-based blog for original content
4. **User Accounts:** Assessment history, saved prompts, learning progress
5. **Stripe Integration:** Online package purchasing
6. **Calendar Booking:** Embed Calendly/Cal.com for consultation scheduling

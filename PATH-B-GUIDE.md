# Path B: Deploy TheBHTLabs via Node.js on Hostinger

## Prerequisites
- GitHub account (free at github.com)
- Your Hostinger Business plan (you already have this)
- 30 minutes

---

## STEP 1: Create GitHub Repository (5 min)

1. Go to **https://github.com/new**
2. Repository name: `thebhtlabs`
3. Set to **Private** (your code, your business)
4. Click **Create repository**
5. You'll see a page with setup instructions — keep this tab open

---

## STEP 2: Upload Project Files to GitHub (10 min)

### Option A: Using GitHub Web Upload (easiest, no git needed)
1. On your new repo page, click **"uploading an existing file"** link
2. Drag and drop ALL files from the unzipped project folder
3. Make sure the folder structure is flat at the root:
   ```
   thebhtlabs/          ← repo root
   ├── app/
   │   ├── layout.js
   │   ├── page.js
   │   └── api/
   │       ├── contact/route.js
   │       ├── assessment/route.js
   │       └── feed/route.js
   ├── components/
   │   ├── Platform.js
   │   └── PlatformFull.js
   ├── lib/
   │   ├── feeds.js
   │   └── case-studies.js
   ├── package.json
   ├── next.config.js
   ├── jsconfig.json
   └── .env.example
   ```
4. Click **Commit changes**

### Option B: Using Git Command Line
```bash
# On your computer, navigate to the unzipped project folder
cd thebhtlabs

git init
git add .
git commit -m "TheBHTLabs initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thebhtlabs.git
git push -u origin main
```

---

## STEP 3: Create .env.local file in GitHub (2 min)

⚠️ **Do NOT commit .env.local to GitHub** — you'll set these as environment variables in Hostinger instead (Step 5). But here's what you'll need:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bhtsolutions.com
SMTP_PASS=your-hostinger-email-password
CONTACT_EMAIL=info@bhtsolutions.com
```

If you haven't created the email yet:
1. In Hostinger hPanel → **Emails** (left sidebar)
2. Create **info@bhtsolutions.com** mailbox
3. Set a password — you'll use this as SMTP_PASS

---

## STEP 4: Connect GitHub to Hostinger (5 min)

1. Go to **Hostinger hPanel** → https://hpanel.hostinger.com
2. Select **thebhtlabs.com** website
3. In left sidebar, click **Website** → Look for **"Node.js Apps"** or **"Web Apps"**
   - If you see "Node.js Apps" → click it
   - If not, look under **Advanced** → **Node.js Apps**
4. Click **"Create a new Node.js app"** or **"Add website"**
5. Choose **"Connect to GitHub"**
6. You'll be redirected to GitHub → Click **"Authorize Hostinger"**
7. Select your **thebhtlabs** repository
8. Branch: **main**

### Build Settings (Hostinger auto-detects, but verify):
- **Framework:** Next.js (should auto-detect)
- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Node.js version:** 20.x or 22.x

9. Click **Deploy**

Wait 2-3 minutes for the build to complete. You'll see build logs.

---

## STEP 5: Set Environment Variables (3 min)

After deployment, you need to add your SMTP credentials:

1. In your Node.js app dashboard on Hostinger
2. Look for **"Environment Variables"** or **"Settings"**
3. Add each variable:

| Key | Value |
|-----|-------|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `info@bhtsolutions.com` |
| `SMTP_PASS` | *(your email password)* |
| `CONTACT_EMAIL` | `info@bhtsolutions.com` |

4. Click **Save** → **Redeploy**

---

## STEP 6: Connect Your Domain (5 min)

Your Node.js app will initially deploy to a temporary subdomain. To connect thebhtlabs.com:

1. In Hostinger hPanel → **Domains** → **thebhtlabs.com**
2. Point it to your Node.js deployment
3. Or follow Hostinger's guide: "How to Connect a Preferred Domain Name Instead of a Temporary One"
4. SSL will auto-provision

---

## STEP 7: Verify Everything Works (2 min)

Visit **https://thebhtlabs.com** and check:

- [ ] Site loads with the full UI
- [ ] AI News section shows live RSS articles
- [ ] 35-Point Assessment works (click through all 7 domains)
- [ ] Contact form sends (check info@bhtsolutions.com inbox)
- [ ] AI Chatbot opens and responds
- [ ] Case studies expand with real reference links
- [ ] Prompt vault copy buttons work

---

## Troubleshooting

### Build fails?
- Check build logs in Hostinger dashboard
- Most common: missing dependency → run `npm install` locally first to verify

### Contact form doesn't send email?
- Verify SMTP_PASS is correct (your Hostinger email password)
- Check if info@bhtsolutions.com mailbox exists in Hostinger Emails

### RSS feeds empty?
- The feeds load server-side. If all feeds fail, the site shows fallback data
- Check `/api/feed` endpoint in browser → should return JSON

### Domain not connecting?
- Nameservers should be ns1.dns-parking.com / ns2.dns-parking.com (you already have this ✓)
- Allow 5-10 min for DNS propagation

---

## Future: Auto-Deploy on Every Push

Once connected via GitHub, every time you push to `main`, Hostinger automatically rebuilds and redeploys. So to update content:

1. Edit files on GitHub (or locally + git push)
2. Hostinger auto-detects and redeploys
3. Live in 2-3 minutes

No manual uploads ever again.

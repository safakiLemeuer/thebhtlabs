// lib/db.js — SQLite database with better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'thebhtlabs.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;
function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Fast concurrent reads
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      excerpt TEXT,
      tags TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      featured INTEGER DEFAULT 0,
      read_time TEXT DEFAULT '2 min',
      author TEXT DEFAULT 'Nitin Nagar',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS blog_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      body TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS case_studies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      client TEXT NOT NULL,
      industry TEXT,
      tags TEXT DEFAULT '[]',
      challenge TEXT,
      solution TEXT,
      results TEXT,
      metrics TEXT DEFAULT '[]',
      pdf_path TEXT,
      color TEXT DEFAULT '#0D9488',
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(featured);
    CREATE INDEX IF NOT EXISTS idx_cases_status ON case_studies(status);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON blog_comments(post_id);

    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      -- Intake
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      title TEXT,
      company TEXT NOT NULL,
      industry TEXT,
      industry_label TEXT,
      employees TEXT,
      revenue TEXT,
      pains TEXT DEFAULT '[]',
      -- Scores
      overall_score INTEGER,
      stage TEXT,
      domain_data TEXT DEFAULT '[]',
      domain_foundation INTEGER DEFAULT 0,
      domain_process INTEGER DEFAULT 0,
      domain_tech INTEGER DEFAULT 0,
      domain_people INTEGER DEFAULT 0,
      domain_strategy INTEGER DEFAULT 0,
      domain_governance INTEGER DEFAULT 0,
      domain_usecase INTEGER DEFAULT 0,
      -- Raw answers (JSON)
      raw_answers TEXT DEFAULT '{}',
      -- ARIA
      aria_score INTEGER DEFAULT 0,
      aria_tier TEXT DEFAULT '',
      aria_mult REAL DEFAULT 1.0,
      aria_pricing TEXT DEFAULT '{}',
      -- Quality signals
      phone TEXT DEFAULT '',
      time_spent INTEGER DEFAULT 0,
      suspicious INTEGER DEFAULT 0,
      -- Meta
      ip_address TEXT,
      user_agent TEXT,
      pdf_downloaded INTEGER DEFAULT 0,
      email_sent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_assess_email ON assessments(email);
    CREATE INDEX IF NOT EXISTS idx_assess_industry ON assessments(industry);
    CREATE INDEX IF NOT EXISTS idx_assess_score ON assessments(overall_score);
    CREATE INDEX IF NOT EXISTS idx_assess_date ON assessments(created_at);

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      company TEXT DEFAULT '',
      interest TEXT DEFAULT '',
      message TEXT DEFAULT '',
      source TEXT DEFAULT 'contact_form',
      status TEXT DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','closed','spam')),
      notes TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_date ON contacts(created_at);

    CREATE TABLE IF NOT EXISTS partner_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      company TEXT NOT NULL,
      website_url TEXT DEFAULT '',
      country TEXT DEFAULT '',
      city TEXT DEFAULT '',
      company_size TEXT DEFAULT '',
      years_in_business TEXT DEFAULT '',
      ms_partnership TEXT DEFAULT '',
      certifications TEXT DEFAULT '',
      industries_served TEXT DEFAULT '',
      current_services TEXT DEFAULT '',
      annual_revenue TEXT DEFAULT '',
      why_partner TEXT DEFAULT '',
      existing_clients TEXT DEFAULT '',
      delivery_team_size TEXT DEFAULT '',
      qualification_score INTEGER DEFAULT 0,
      qualification_tier TEXT DEFAULT 'Early Stage',
      status TEXT DEFAULT 'new' CHECK(status IN ('new','reviewing','interview','accepted','declined','withdrawn')),
      notes TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_partner_email ON partner_applications(email);
    CREATE INDEX IF NOT EXISTS idx_partner_tier ON partner_applications(qualification_tier);
    CREATE INDEX IF NOT EXISTS idx_partner_status ON partner_applications(status);

    CREATE TABLE IF NOT EXISTS health_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT DEFAULT '',
      name TEXT DEFAULT '',
      email TEXT DEFAULT '',
      company TEXT DEFAULT '',
      industry TEXT DEFAULT '',
      employees TEXT DEFAULT '',
      score INTEGER DEFAULT 0,
      provider TEXT DEFAULT '',
      spf_status TEXT DEFAULT '',
      dmarc_status TEXT DEFAULT '',
      dkim_status TEXT DEFAULT '',
      has_m365 INTEGER DEFAULT 0,
      locale TEXT DEFAULT 'us',
      action TEXT DEFAULT 'scan',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_hc_domain ON health_checks(domain);
    CREATE INDEX IF NOT EXISTS idx_hc_action ON health_checks(action);
    CREATE INDEX IF NOT EXISTS idx_hc_email ON health_checks(email);
  `);

  // Seed blog posts if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM blog_posts').get();
  if (count.c === 0) {
    seedBlogPosts();
    seedCaseStudies();
  }
}

function seedBlogPosts() {
  const insert = db.prepare(`
    INSERT INTO blog_posts (slug, title, body, excerpt, tags, status, featured, read_time, published_at)
    VALUES (@slug, @title, @body, @excerpt, @tags, 'published', @featured, @read_time, CURRENT_TIMESTAMP)
  `);

  const posts = [
    {
      slug: 'copilot-studio-mistakes',
      title: '3 Copilot Studio mistakes every defense contractor is making right now',
      body: `We audited six Copilot Studio deployments last month. Every single one had the same three problems: no data grounding strategy (the bot hallucinates because it's not connected to SharePoint), no governance wrapper (who approved this agent to talk to customers?), and no fallback logic (when the AI doesn't know, it makes things up instead of routing to a human).

The fix isn't complicated. Connect your agent to a curated SharePoint library, wrap it in a Purview DLP policy, and add a confidence threshold that escalates to a human below 70%. We built all three in a single sprint.

Stop deploying demo agents to production. Your CISO will thank you.`,
      excerpt: 'We audited six Copilot Studio deployments last month. Every single one had the same three problems.',
      tags: JSON.stringify(['Copilot Studio', 'AI Governance', 'Defense', 'SharePoint']),
      featured: 1, read_time: '2 min'
    },
    {
      slug: 'cmmc-90-days',
      title: 'We helped a defense contractor hit 110/110 NIST 800-171 practices in 90 days',
      body: `Everyone says CMMC takes 12-18 months. That's true if you're working with a consultancy that bills by the hour and has zero incentive to finish.

Here's what we actually did: Week 1-2 — full gap assessment against all 110 practices. Found 67 gaps. Week 3-4 — migrated from consumer M365 to GCC-High, deployed Intune MDM to 200+ devices, configured Purview DLP with CUI sensitivity labels. Week 5-8 — SSP documentation, POA&M for remaining gaps, PowerShell continuous monitoring scripts. Week 9-12 — remediation of final gaps, pre-audit dry run, C3PAO readiness review.

The secret? We didn't start with documentation. We started with infrastructure. Get the tenant right, get the devices managed, get the DLP policies enforced. Then document what you built. Most firms do it backwards — they document what they wish they had, then scramble to build it.

90 days. 110/110. The client kept their DoD contract.`,
      excerpt: 'Everyone says CMMC takes 12-18 months. We did it in 90 days.',
      tags: JSON.stringify(['CMMC', 'NIST 800-171', 'GCC-High', 'Defense', 'Compliance']),
      featured: 1, read_time: '3 min'
    },
    {
      slug: 'ai-governance-gap',
      title: 'The AI governance gap that will cost small contractors their clearance',
      body: `Here's a scenario playing out right now at hundreds of defense contractors: an employee uses ChatGPT to summarize a document that contains CUI. That document is now in OpenAI's training data. The contractor has just violated NIST 800-171 and doesn't even know it.

The fix is an AI acceptable use policy — and almost nobody has one. We built a generator for it (it's free on this site). But the policy alone isn't enough. You need Purview DLP rules that detect when CUI is being pasted into unauthorized AI tools. You need Conditional Access policies in Entra ID that block access to consumer AI services from managed devices. You need training that explains WHY, not just WHAT.

The federal AI landscape is changing fast. The organizations that get governance right now will have a massive advantage when the auditors come knocking.`,
      excerpt: 'An employee uses ChatGPT to summarize CUI. The contractor just violated NIST 800-171.',
      tags: JSON.stringify(['AI Governance', 'NIST 800-171', 'CUI', 'Entra ID', 'DLP']),
      featured: 1, read_time: '2 min'
    },
    {
      slug: 'powershell-savings',
      title: '3 lines of PowerShell that saved a client $145K/year',
      body: `A client had two full-time employees whose entire job was pulling data from three systems, reconciling it in Excel, and emailing a report to 12 managers every Monday morning. Eight hours each, every week. 832 hours per year.

We replaced it with a Power Automate flow that pulls from all three APIs, a PowerShell script that does the reconciliation (3 lines — Get-Data, Compare-Object, Export-Csv), and a scheduled Teams message that delivers the report at 7am Monday.

Total build time: 2 days. Annual savings: $145K in labor. Those two employees? They're now doing analysis instead of data entry. Better work, better outcomes, better morale.

This is what AI readiness actually looks like. Not chatbots. Not copilots. Just automating the dumb stuff so smart people can do smart work.`,
      excerpt: 'Replaced two FTEs doing manual data reconciliation with a PowerShell script. 2 days to build, $145K/year saved.',
      tags: JSON.stringify(['PowerShell', 'Automation', 'Power Automate', 'ROI']),
      featured: 0, read_time: '2 min'
    },
    {
      slug: 'gcc-high-reality',
      title: 'The uncomfortable truth about GCC-High migrations',
      body: `Nobody tells you this upfront: a GCC-High migration is not a "migration." It's a rebuild. Your consumer M365 tenant and your GCC-High tenant are completely separate environments. You can't move data between them natively. Every mailbox, every SharePoint site, every Teams channel — rebuilt from scratch.

We've done enough of these to know where the landmines are: third-party apps that don't work in GCC-High (most of them), Conditional Access policies that need complete reconfiguration, Power Platform connectors that aren't available in the government cloud.

Our approach: we build the GCC-High environment in parallel, test everything in a pilot group, then migrate in waves. Never big-bang. The organizations that try to do it all at once are the ones calling us to fix it three months later.

Budget 4-8 weeks minimum. Plan for app compatibility issues. And for the love of everything, test your DLP policies before you migrate CUI.`,
      excerpt: 'A GCC-High migration is not a migration — it\'s a rebuild.',
      tags: JSON.stringify(['Azure Gov', 'GCC-High', 'M365', 'Migration', 'CUI']),
      featured: 0, read_time: '3 min'
    },
  ];

  const tx = db.transaction(() => {
    for (const p of posts) insert.run(p);
  });
  tx();
}

function seedCaseStudies() {
  const insert = db.prepare(`
    INSERT INTO case_studies (title, subtitle, client, industry, tags, challenge, solution, results, metrics, color, sort_order, status)
    VALUES (@title, @subtitle, @client, @industry, @tags, @challenge, @solution, @results, @metrics, @color, @sort_order, 'published')
  `);

  const cases = [
    {
      title: 'CMMC Level 2 in 90 Days',
      subtitle: 'CMMC Level 2 Certification',
      client: 'Defense Contractor',
      industry: 'Defense · 200 employees',
      tags: JSON.stringify(['CMMC L2', 'GCC-High', 'Copilot Studio']),
      challenge: 'Zero NIST 800-171 documentation, consumer M365 with mixed CUI data. Needed certification in 90 days to maintain DoD contract.',
      solution: 'GCC-High tenant, Intune MDM (200+ devices), Purview DLP with CUI labels, Copilot Studio compliance agent, PowerShell continuous monitoring.',
      results: 'Achieved 110/110 NIST 800-171 practices. Passed C3PAO assessment on first attempt. Contract retained.',
      metrics: JSON.stringify([{label:'NIST Score',value:'110/110'},{label:'Timeline',value:'90 days'},{label:'Devices',value:'200+'}]),
      color: '#0D9488', sort_order: 1
    },
    {
      title: 'AI-Powered Document Processing',
      subtitle: 'Copilot Studio + Power Automate',
      client: 'Insurance Broker',
      industry: 'Insurance · 85 employees',
      tags: JSON.stringify(['Copilot Studio', 'Power Automate', 'AI']),
      challenge: 'Manual document review consuming 40+ hours/week. Policy documents, claims, and compliance reports processed by hand.',
      solution: 'Copilot Studio agent with SharePoint grounding, Power Automate flows for document classification and routing, custom AI model for data extraction.',
      results: '87% reduction in document processing time. 12x speed improvement for policy lookups. $190K annual value for team of 25.',
      metrics: JSON.stringify([{label:'Time Saved',value:'87%'},{label:'Speed',value:'12x'},{label:'Annual Value',value:'$190K'}]),
      color: '#3B82F6', sort_order: 2
    },
    {
      title: 'Azure Gov Cloud Migration',
      subtitle: 'Full Tenant Migration',
      client: 'Federal Subcontractor',
      industry: 'Federal IT · 150 employees',
      tags: JSON.stringify(['Azure Gov', 'GCC-High', 'Entra ID', 'Migration']),
      challenge: 'Consumer Azure and M365 tenant handling FCI data. Needed to migrate to Azure Government and GCC-High before contract renewal.',
      solution: 'Parallel GCC-High environment build, phased migration in 4 waves, Entra ID configuration, Conditional Access policies, DLP enforcement.',
      results: 'Zero-downtime migration completed in 6 weeks. All compliance requirements met. Contract renewed for 3 years.',
      metrics: JSON.stringify([{label:'Downtime',value:'Zero'},{label:'Timeline',value:'6 weeks'},{label:'Contract',value:'3 years'}]),
      color: '#7C3AED', sort_order: 3
    },
  ];

  const tx = db.transaction(() => {
    for (const c of cases) insert.run(c);
  });
  tx();
}

module.exports = { getDb };

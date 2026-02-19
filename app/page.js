// app/page.js — Server-rendered SEO layer + client interactive components
import TheBHTLabsPlatform from '@/components/Platform';

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://thebhtlabs.com/#org",
      "name": "BHT Solutions (Bluebery Hawaii Technology Solutions LLC)",
      "alternateName": "TheBHTLabs",
      "url": "https://thebhtlabs.com",
      "description": "SBA 8(a) certified IT consulting firm specializing in Azure Government Cloud, Microsoft 365 GCC/GCC-High, CMMC Level 2 compliance, and AI governance for federal agencies and defense contractors.",
      "foundingDate": "2006",
      "address": { "@type": "PostalAddress", "streetAddress": "20223 Granite Birch Ln", "addressLocality": "Cypress", "addressRegion": "TX", "postalCode": "77433", "addressCountry": "US" },
      "contactPoint": { "@type": "ContactPoint", "email": "info@bhtsolutions.com", "contactType": "sales", "availableLanguage": "English" },
      "sameAs": ["https://www.linkedin.com/company/bhtsolutions", "https://bhtsolutions.com"],
      "knowsAbout": ["Azure Government Cloud","Microsoft 365 GCC-High","CMMC Level 2","FedRAMP Advisory","Copilot Studio","AI Governance","NIST 800-171","Power Platform","Entra ID","DevSecOps"],
      "hasCredential": [
        {"@type":"EducationalOccupationalCredential","name":"SBA 8(a) Certified"},
        {"@type":"EducationalOccupationalCredential","name":"EDWOSB Certified"},
        {"@type":"EducationalOccupationalCredential","name":"WOSB Certified"},
        {"@type":"EducationalOccupationalCredential","name":"Microsoft Certified: Azure Solutions Architect"},
        {"@type":"EducationalOccupationalCredential","name":"CyberAB Registered Practitioner"}
      ]
    },
    {
      "@type": "WebSite", "@id": "https://thebhtlabs.com/#website", "url": "https://thebhtlabs.com",
      "name": "TheBHTLabs — AI Readiness & Automation Tools", "publisher": {"@id":"https://thebhtlabs.com/#org"}
    },
    {
      "@type": "Service", "name": "AI Readiness Assessment",
      "description": "35-point AI readiness evaluation across 7 domains with downloadable PDF report.",
      "provider": {"@id":"https://thebhtlabs.com/#org"}, "serviceType": "IT Consulting", "areaServed": "US"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type":"Question","name":"What is an AI Readiness Assessment?","acceptedAnswer":{"@type":"Answer","text":"Our 35-point assessment evaluates your organization across 7 domains: Data Foundation, Process Maturity, Technology Readiness, People & Culture, Strategy & ROI, Governance & Compliance, and Use Case Clarity. You receive a detailed PDF report with actionable recommendations."}},
        {"@type":"Question","name":"What certifications does BHT Solutions hold?","acceptedAnswer":{"@type":"Answer","text":"SBA 8(a), EDWOSB, WOSB. Microsoft Certified Azure Solutions Architect. CyberAB Registered Practitioner. SAFe 5 Agile. Wiz-certified cloud security. CAGE: 7DBB9, UEI: ZW6GMVL368J6. Active T4 Public Trust clearance, Secret eligible."}},
        {"@type":"Question","name":"What Azure and Microsoft services does BHT specialize in?","acceptedAnswer":{"@type":"Answer","text":"Azure Government Cloud, M365 GCC/GCC-High, CMMC Level 2 compliance, FedRAMP advisory, Copilot Studio agents, Power Platform automation, Entra ID, and DevSecOps."}}
      ]
    }
  ]
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Server-rendered SEO content — visible to crawlers, visually hidden from users */}
      <div id="seo-content" style={{position:'absolute',width:1,height:1,overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap'}} aria-hidden="false">
        <h1>TheBHTLabs — AI Readiness, Automation &amp; Upskilling by BHT Solutions</h1>
        <p>Stop talking about AI. Start shipping it. 20 years of Fortune 500 and federal IT experience turned into tools that make your organization AI-ready in weeks, not quarters.</p>

        <h2>Free AI Readiness Tools</h2>
        <h3>35-Point AI Readiness Assessment</h3>
        <p>Evaluate your organization across 7 critical domains: Data Foundation, Process Maturity, Technology Readiness, People &amp; Culture, Strategy &amp; ROI, Governance &amp; Compliance, and Use Case Clarity. Downloadable PDF report with actionable recommendations.</p>
        <h3>AI ROI Calculator</h3>
        <p>Calculate potential return on investment from AI automation. Input team size, average salary, and hours on repetitive tasks to see projected savings across 1-3 years.</p>
        <h3>AI Policy Generator</h3>
        <p>Generate a customized AI acceptable use policy. Select industry, compliance requirements, and AI use cases for a production-ready governance document.</p>
        <h3>Compliance Countdown</h3>
        <p>Track critical deadlines: CMMC Level 2, EU AI Act, NIST AI RMF updates, and state AI regulations.</p>
        <h3>AI Career Risk Assessment</h3>
        <p>Evaluate how AI automation may impact your role with personalized upskilling recommendations.</p>

        <h2>Services &amp; Capabilities</h2>
        <h3>Azure Government Cloud</h3>
        <p>Full lifecycle Azure Gov implementations including GCC-High tenant provisioning, Entra ID identity management, and continuous compliance monitoring.</p>
        <h3>Microsoft 365 GCC &amp; GCC-High</h3>
        <p>Enterprise M365 for federal agencies and defense contractors. Intune MDM, Purview DLP with CUI labels, Teams governance.</p>
        <h3>CMMC Level 2 Compliance</h3>
        <p>End-to-end CMMC Level 2 certification. NIST 800-171 gap analysis, SSP development, POA&amp;M management, audit prep. 110/110 NIST practices in 90 days.</p>
        <h3>Copilot Studio &amp; Power Platform</h3>
        <p>Production AI agents with Copilot Studio. Power Automate workflows for document processing, approval routing, data extraction.</p>
        <h3>AI Governance &amp; NIST AI RMF</h3>
        <p>Governance frameworks aligned with NIST AI Risk Management Framework. Acceptable use policies, model risk assessment, bias testing, explainability.</p>

        <h2>Certifications</h2>
        <ul>
          <li>SBA 8(a) Certified Small Business</li>
          <li>EDWOSB — Economically Disadvantaged Women-Owned Small Business</li>
          <li>WOSB — Women-Owned Small Business</li>
          <li>WOSB — Women-Owned Small Business</li>
          <li>Microsoft Certified: Azure Solutions Architect</li>
          <li>CyberAB Registered Practitioner (RP)</li>
          <li>Wiz Partner Technical Foundations & Cloud Delivery</li>
          <li>SAFe 5 Agile Practitioner</li>
          <li>ITIL v3 Foundation — IT Service Management</li>
          <li>T4 Active Security Clearance</li>
        </ul>

        <h2>Federal Identification</h2>
        <p>CAGE Code: 7DBB9 | UEI: ZW6GMVL368J6 | DUNS: 801352894 | FEIN: 26-0374906</p>
        <h2>NAICS Codes</h2>
        <p>541512 Computer Systems Design (Primary), 541511, 541513, 541519, 541611, 541330, 541614, 541618, 541690, 519190, 611420</p>

        <h2>Past Performance</h2>
        <p>Microsoft, bp, Eli Lilly, GE Power, iRobot, Kroger, NOV, Apache, NTT Data, Hitachi Consulting. DIR-CPO-5626 TX ITSAC Contract Holder.</p>

        <h2>Packages</h2>
        <p>Free Discovery Call | AI Sprint $2,500 | AI Launchpad $7,500/mo | AI Transformation Custom</p>

        <h2>The Builder — Nitin Nagar</h2>
        <p>Every tool on this site was built by someone who spent 20 years inside the systems it assesses. Nitin Nagar is the founder and principal architect of BHT Solutions (Bluebery Hawaii Technology Solutions LLC). With T4 security clearance and two decades of Fortune 500 and federal IT experience, he has built enterprise systems for Microsoft, bp, Eli Lilly, GE Power, iRobot, Kroger, NOV, Apache, NTT Data, and Hitachi Consulting.</p>
        <p>TheBHTLabs is the R&amp;D arm of BHT Solutions — every assessment, calculator, policy generator, and compliance tracker exists because we got tired of watching organizations spend six figures on consulting engagements that could have started with a free diagnostic.</p>

        <h2>Field Notes — Dispatches From Active Engagements</h2>
        <h3>3 Copilot Studio mistakes every defense contractor is making right now</h3>
        <p>We audited six Copilot Studio deployments last month. Every single one had the same three problems: no data grounding strategy, no governance wrapper, and no fallback logic.</p>
        <h3>We helped a defense contractor hit 110/110 NIST 800-171 practices in 90 days</h3>
        <p>Everyone says CMMC takes 12-18 months. We did it in 90 days by starting with infrastructure instead of documentation. GCC-High migration, Intune MDM to 200+ devices, Purview DLP with CUI labels.</p>
        <h3>The AI governance gap that will cost small contractors their clearance</h3>
        <p>An employee uses ChatGPT to summarize a document containing CUI. That document is now in OpenAI training data. The contractor just violated NIST 800-171. The fix: AI acceptable use policy, Purview DLP rules, and Conditional Access in Entra ID.</p>
        <h3>3 lines of PowerShell that saved a client $145K per year</h3>
        <p>Replaced two full-time employees doing manual data reconciliation with a Power Automate flow and a PowerShell script. Total build time: 2 days. Annual savings: $145K in labor.</p>
        <h3>The uncomfortable truth about GCC-High migrations</h3>
        <p>A GCC-High migration is not a migration — it is a rebuild. Consumer M365 and GCC-High are completely separate environments. Every mailbox, SharePoint site, and Teams channel rebuilt from scratch.</p>

        <h2>Contact</h2>
        <p>Bluebery Hawaii Technology Solutions LLC | 20223 Granite Birch Ln, Cypress, TX 77433 | info@bhtsolutions.com</p>
      </div>

      <TheBHTLabsPlatform />
    </>
  );
}

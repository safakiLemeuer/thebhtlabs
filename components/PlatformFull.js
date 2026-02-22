'use client';
import { useState, useEffect, useRef } from "react";

/* ═══════════════ DESIGN SYSTEM — Warm / Premium Consulting Aesthetic ═══════════════ */
const C = {
  bg: "#FFFFFF", bgSoft: "#FAFAF9", bgMuted: "#F5F5F4",
  card: "#FFFFFF", cardHover: "#FEFEFE",
  navy: "#1C1917", navyLight: "#292524",
  text: "#1C1917", textSoft: "#44403C", textMuted: "#78716C", textFaint: "#A8A29E",
  teal: "#0E7490", tealLight: "#CFFAFE", tealDark: "#155E75", tealBg: "rgba(14,116,144,.04)",
  coral: "#EA580C", coralBg: "rgba(234,88,12,.04)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,.04)",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,.04)",
  rose: "#DC2626", roseBg: "rgba(220,38,38,.04)",
  border: "#E7E5E4", borderLight: "#F5F5F4",
  shadow: "0 1px 3px rgba(28,25,23,.05), 0 1px 2px rgba(28,25,23,.03)",
  shadowMd: "0 4px 16px rgba(28,25,23,.07), 0 2px 4px rgba(28,25,23,.04)",
  shadowLg: "0 12px 40px rgba(28,25,23,.1), 0 4px 12px rgba(28,25,23,.04)",
};
const F = {
  h: "'Poppins', sans-serif",
  m: "'DM Mono', monospace",
  b: "'Poppins', sans-serif",
};

/* ═══════════════ LOCALE SYSTEM ═══════════════ */
const LOCALES = {
  us: {
    currency: "$", currencyCode: "USD", currencyFmt: (v) => "$" + v.toLocaleString(),
    pricing: { scan: 2500, sprint: 7500, launchpad: 15000 },
    pricePer: { scan: "/10 hrs", sprint: "/30 hrs", launchpad: "/mo" },
    regulatory: ["CMMC", "NIST 800-171", "FedRAMP", "HIPAA", "SOX", "ITAR", "SEC", "GDPR"],
    regIndustryMap: {
      financial: ["SOX","SEC","GLBA","GDPR"], healthcare: ["HIPAA","HITECH","FDA 21 CFR"],
      govdef: ["CMMC","NIST 800-171","ITAR","FedRAMP"], insurance: ["SOX","NAIC","State DOI"],
      legal: ["ABA Ethics","GDPR","State Bar"], energy: ["NERC CIP","FERC","EPA"],
    },
    certBadges: "SBA 8(a) · EDWOSB · WOSB · Azure Solutions Architect · CyberAB RP",
    phone: "(513) 638-1986", email: "info@bhtsolutions.com",
  },
  in: {
    currency: "₹", currencyCode: "INR", currencyFmt: (v) => "₹" + v.toLocaleString("en-IN"),
    pricing: { scan: 150000, sprint: 450000, launchpad: 900000 },
    pricePer: { scan: "/10 hrs", sprint: "/30 hrs", launchpad: "/mo" },
    regulatory: ["DPDPA 2023", "RBI AI Guidelines", "SEBI Circular", "MeitY AI Framework", "IT Act 2000", "ISO 27001", "SOC 2"],
    regIndustryMap: {
      financial: ["RBI AI Governance","SEBI Circular","DPDPA","PCI-DSS","ISO 27001"],
      healthcare: ["DPDPA","NABH","CDSCO","Clinical Establishments Act"],
      govdef: ["MeitY AI Framework","CCA Guidelines","STQC","BIS Standards"],
      insurance: ["IRDAI Guidelines","DPDPA","ISO 27001","SOC 2"],
      legal: ["BCI Rules","DPDPA","IT Act 2000","Indian Evidence Act"],
      energy: ["CERC Regulations","DPDPA","ISO 27001","IEC 62443"],
      technology: ["DPDPA","ISO 27001","SOC 2","SSAE-18","EU AI Act (for exports)"],
      professional: ["DPDPA","ISO 27001","Industry-specific codes"],
    },
    industries: [
      {v:"financial",l:"BFSI (Banking, Financial Services & Insurance)",avg:58},
      {v:"healthcare",l:"Healthcare & Pharma",avg:49},
      {v:"technology",l:"IT / ITES / SaaS",avg:64},
      {v:"professional",l:"Professional Services / Consulting",avg:55},
      {v:"manufacturing",l:"Manufacturing",avg:44},
      {v:"govdef",l:"Government / PSU / Defence",avg:48},
      {v:"retail",l:"Retail / E-Commerce / D2C",avg:52},
      {v:"energy",l:"Energy / Power / Utilities",avg:47},
      {v:"education",l:"Education / EdTech",avg:51},
      {v:"insurance",l:"Insurance",avg:53},
      {v:"legal",l:"Legal / LegalTech",avg:41},
      {v:"construction",l:"Real Estate / Infrastructure",avg:40},
      {v:"other",l:"Other",avg:49},
    ],
    empRanges: ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000","10,000+"],
    revRanges: ["< ₹1 Cr","₹1 Cr - ₹5 Cr","₹5 Cr - ₹25 Cr","₹25 Cr - ₹100 Cr","₹100 Cr - ₹500 Cr","₹500 Cr+","Prefer not to say"],
    painPoints: [
      "Manual processes consuming too many hours",
      "Data scattered across multiple systems",
      "DPDPA compliance gaps",
      "Employees resistant to new technology",
      "AI tools deployed but not delivering ROI",
      "No clear AI strategy or roadmap",
      "Difficulty measuring operational efficiency",
      "Cybersecurity or data privacy concerns",
      "Client/regulator asking about AI governance",
      "Competitor pressure to adopt AI faster",
    ],
    certBadges: "Microsoft Partner · ISO 27001 Aligned · DPDPA Compliant · SOC 2 Aligned",
    phone: "", email: "india@bhtsolutions.com",
    starterPkg: { name: "AI Governance Starter", price: 49999, desc: "Assessment + 30-min debrief + AI policy + regulatory mapping" },
  },
  eu: {
    currency: "€", currencyCode: "EUR", currencyFmt: (v) => "€" + v.toLocaleString("de-DE"),
    pricing: { scan: 2200, sprint: 6500, launchpad: 13000 },
    pricePer: { scan: "/10 hrs", sprint: "/30 hrs", launchpad: "/mo" },
    regulatory: ["EU AI Act", "GDPR", "NIS2 Directive", "DORA", "ISO 42001", "ISO 27001", "eIDAS 2.0"],
    regIndustryMap: {
      financial: ["EU AI Act","GDPR","DORA","PSD2","MiFID II","EBA Guidelines","ISO 27001"],
      healthcare: ["EU AI Act","GDPR","MDR","IVDR","EMA Guidelines","NIS2"],
      govdef: ["EU AI Act","GDPR","NIS2","eIDAS 2.0","National Cybersecurity Framework"],
      insurance: ["EU AI Act","GDPR","DORA","Solvency II","EIOPA Guidelines"],
      legal: ["EU AI Act","GDPR","Legal Professional Privilege","NIS2"],
      energy: ["EU AI Act","GDPR","NIS2","REMIT","IEC 62443"],
      technology: ["EU AI Act","GDPR","NIS2","Data Act","Digital Services Act","ISO 42001"],
      professional: ["EU AI Act","GDPR","NIS2","ISO 27001","Industry codes"],
      manufacturing: ["EU AI Act","GDPR","Machinery Regulation","CE Marking","NIS2"],
      retail: ["EU AI Act","GDPR","Consumer Rights Directive","Digital Services Act","PSD2"],
    },
    industries: [
      {v:"financial",l:"Financial Services & Banking",avg:60},
      {v:"healthcare",l:"Healthcare & Life Sciences",avg:52},
      {v:"technology",l:"Technology & SaaS",avg:65},
      {v:"professional",l:"Professional Services",avg:57},
      {v:"manufacturing",l:"Manufacturing & Industrial",avg:48},
      {v:"govdef",l:"Government & Public Sector",avg:50},
      {v:"retail",l:"Retail & E-Commerce",avg:53},
      {v:"energy",l:"Energy & Utilities",avg:51},
      {v:"education",l:"Education & Research",avg:49},
      {v:"insurance",l:"Insurance",avg:55},
      {v:"legal",l:"Legal Services",avg:43},
      {v:"construction",l:"Construction & Real Estate",avg:42},
      {v:"other",l:"Other",avg:50},
    ],
    empRanges: ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000","10,000+"],
    revRanges: ["< €1M","€1M - €5M","€5M - €25M","€25M - €100M","€100M - €500M","€500M+","Prefer not to say"],
    painPoints: [
      "EU AI Act compliance uncertainty",
      "GDPR + AI integration challenges",
      "Data scattered across multiple systems",
      "No AI risk classification framework",
      "AI tools deployed but not delivering ROI",
      "No clear AI strategy or roadmap",
      "NIS2 cybersecurity obligations",
      "Cross-border data transfer concerns",
      "Lack of AI transparency documentation",
      "Competitor pressure to adopt AI faster",
    ],
    certBadges: "Microsoft Partner · ISO 27001 · ISO 42001 Aligned · GDPR Compliant",
    phone: "", email: "eu@bhtsolutions.com",
    defaultLang: "en",
  },
  ae: {
    currency: "AED", currencyCode: "AED", currencyFmt: (v) => "AED " + v.toLocaleString(),
    pricing: { scan: 9200, sprint: 27500, launchpad: 55000 },
    pricePer: { scan: "/10 hrs", sprint: "/30 hrs", launchpad: "/mo" },
    regulatory: ["UAE PDPL", "ADGM Data Protection", "DIFC Data Protection Law", "UAE AI Strategy 2031", "NESA Cybersecurity", "TDRA Regulations", "ISO 27001"],
    regIndustryMap: {
      financial: ["CBUAE Regulations","ADGM Data Protection","DIFC Data Protection","UAE PDPL","PCI-DSS","ISO 27001"],
      healthcare: ["UAE PDPL","DHA Regulations","HAAD Standards","MOH Guidelines","ISO 27799"],
      govdef: ["UAE AI Strategy 2031","NESA","TDRA","Smart Government Framework","ISO 27001"],
      insurance: ["IA Regulations","UAE PDPL","ADGM/DIFC Requirements","ISO 27001"],
      legal: ["UAE PDPL","ADGM Courts","DIFC Courts","SCA Regulations"],
      energy: ["UAE PDPL","ADNOC Standards","EWEC Regulations","IEC 62443"],
      technology: ["UAE PDPL","TDRA","Dubai Digital Authority","ISO 27001","SOC 2"],
      professional: ["UAE PDPL","ISO 27001","Free Zone Regulations"],
      realestate: ["RERA Regulations","Dubai Land Department","UAE PDPL","Smart Dubai"],
    },
    industries: [
      {v:"financial",l:"Banking & Financial Services (ADGM/DIFC)",avg:62},
      {v:"realestate",l:"Real Estate & Property Development",avg:45},
      {v:"technology",l:"Technology & Digital Services",avg:66},
      {v:"energy",l:"Oil & Gas / Energy",avg:55},
      {v:"healthcare",l:"Healthcare",avg:50},
      {v:"govdef",l:"Government & Semi-Government",avg:58},
      {v:"professional",l:"Professional Services & Consulting",avg:56},
      {v:"retail",l:"Retail & Hospitality",avg:48},
      {v:"construction",l:"Construction & Infrastructure",avg:42},
      {v:"manufacturing",l:"Manufacturing & Industrial",avg:44},
      {v:"education",l:"Education",avg:47},
      {v:"insurance",l:"Insurance",avg:52},
      {v:"legal",l:"Legal Services",avg:40},
      {v:"other",l:"Other",avg:49},
    ],
    empRanges: ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000","10,000+"],
    revRanges: ["< AED 5M","AED 5M - 20M","AED 20M - 100M","AED 100M - 500M","AED 500M - 2B","AED 2B+","Prefer not to say"],
    painPoints: [
      "UAE PDPL compliance gaps",
      "AI Strategy 2031 alignment uncertainty",
      "Data scattered across multiple systems",
      "Free zone vs mainland regulatory complexity",
      "AI tools deployed but not delivering ROI",
      "No clear AI strategy or roadmap",
      "NESA cybersecurity requirements",
      "Emiratisation + AI workforce planning",
      "Smart government integration challenges",
      "Competitor pressure to adopt AI faster",
    ],
    certBadges: "Microsoft Partner · ISO 27001 · UAE PDPL Aligned · NESA Compliant",
    phone: "", email: "uae@bhtsolutions.com",
    defaultLang: "ar",
  }
};

/* ═══════════════ LANGUAGE / TRANSLATION SYSTEM ═══════════════ */
const LANGS = {
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
  hi: { label: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  ar: { label: "العربية", flag: "🇦🇪", dir: "rtl" },
  de: { label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr" },
  es: { label: "Español", flag: "🇪🇸", dir: "ltr" },
};

const T = {
  en: {
    heroTag: "Only 1 in 3 companies have proper AI governance controls — EY 2025",
    heroTitle1: "AI-ready in weeks.", heroTitle2: "Not quarters.",
    heroDesc: "20 years of Fortune 500 and federal IT. We built the tools, frameworks, and cleared team to take your organization from evaluation to production — with compliance baked in from day one.",
    freeAssessment: "Free Assessment →",
    assessTitle: "35-Point AI Readiness Assessment",
    assessDesc: "7 domains, 35 questions, personalized score. Downloadable PDF report with gap analysis and 90-day action plan.",
    assessVal: "Consultants charge $5-10K for this",
    startAssess: "Start Free Assessment →",
    resultsTitle: "AI Readiness Score",
    retake: "Retake", downloadPdf: "📄 Download PDF", bookDiscovery: "Book Discovery Call →",
    bookSending: "Sending...", bookSent: "✓ Request Sent — Check Email", bookRetry: "Try Again",
    partnerTag: "Let's Build Together", partnerTitle: "Partner with TheBHTLabs",
    partnerDesc: "Whether you're looking to engage us for a project or join as a channel partner — start here.",
    getInTouch: "📞 Get in Touch", applyPartner: "🤝 Apply to Partner",
    contactTitle: "Get in touch", contactSend: "Book a Discovery Call →",
    contactSending: "Sending...", contactSuccess: "✓ Sent! We'll respond within 24 hours.",
    contactResp: "We respond within 1 business day. 30-min call, no pitch, no commitment.",
    fullName: "Full Name", emailAddr: "Email Address", phone: "Phone", company: "Company",
    interestedIn: "I'm interested in...", tellUs: "Tell us about your project",
    industry: "Industry", employees: "Employees", revenue: "Annual Revenue",
    selectIndustry: "Select industry...", selectRange: "Select range...", selectRevenue: "Select range (optional)...",
    topPains: "Top Business Pains (select up to 3)",
    step1: "Step 1 of 2 — Your Information", step2of2: "Step 2 of 2",
    next: "Start Assessment →", directPhone: "Direct Phone",
    phoneNote: "For your report walkthrough — we don't cold call",
    companyReq: "Company", titleField: "Job Title", selectTitle: "Select title...",
    sector: "Sector", sectorNote: "affects scope & pricing",
    aiRiskLevel: "AI Risk Level", aiRiskNote: "EU AI Act classification",
    minimalRisk: "Minimal / Limited Risk AI", highRisk: "High-Risk AI (Annex III systems)",
    fedCommercial: "Commercial / Private Sector",
    fedCivilian: "Federal Civilian (FISMA, NIST 800-53)",
    fedDefense: "Federal Defense / DoD (CMMC, NIST 800-171, CUI)",
    fedClassified: "Federal Classified / IC (ITAR, clearance-required)",
  },
  hi: {
    heroTag: "केवल 3 में से 1 कंपनी के पास उचित AI गवर्नेंस कंट्रोल हैं — EY 2025",
    heroTitle1: "हफ्तों में AI-तैयार।", heroTitle2: "तिमाहियों में नहीं।",
    heroDesc: "Fortune 500 और फेडरल IT में 20 वर्षों का अनुभव। हमने आपके संगठन को मूल्यांकन से उत्पादन तक ले जाने के लिए टूल्स, फ्रेमवर्क और टीम बनाई है — पहले दिन से अनुपालन के साथ।",
    freeAssessment: "निःशुल्क मूल्यांकन →",
    assessTitle: "35-पॉइंट AI रेडीनेस मूल्यांकन",
    assessDesc: "7 डोमेन, 35 प्रश्न, व्यक्तिगत स्कोर। गैप एनालिसिस और 90-दिवसीय एक्शन प्लान के साथ PDF रिपोर्ट।",
    assessVal: "कंसल्टेंट्स इसके लिए ₹5-10 लाख चार्ज करते हैं",
    startAssess: "निःशुल्क मूल्यांकन शुरू करें →",
    resultsTitle: "AI रेडीनेस स्कोर",
    retake: "फिर से लें", downloadPdf: "📄 PDF डाउनलोड", bookDiscovery: "डिस्कवरी कॉल बुक करें →",
    bookSending: "भेज रहे हैं...", bookSent: "✓ अनुरोध भेजा — ईमेल चेक करें", bookRetry: "फिर कोशिश करें",
    partnerTag: "साथ मिलकर बनाएं", partnerTitle: "TheBHTLabs के साथ पार्टनर बनें",
    partnerDesc: "चाहे आप हमें प्रोजेक्ट के लिए हायर करना चाहें या चैनल पार्टनर बनना चाहें — यहां शुरू करें।",
    getInTouch: "📞 संपर्क करें", applyPartner: "🤝 पार्टनर आवेदन",
    contactTitle: "संपर्क करें", contactSend: "डिस्कवरी कॉल बुक करें →",
    contactSending: "भेज रहे हैं...", contactSuccess: "✓ भेजा गया! हम 24 घंटे में जवाब देंगे।",
    contactResp: "हम 1 कार्यदिवस में जवाब देते हैं। 30 मिनट कॉल, कोई बिक्री नहीं।",
    fullName: "पूरा नाम", emailAddr: "ईमेल पता", phone: "फोन", company: "कंपनी",
    interestedIn: "मुझे इसमें रुचि है...", tellUs: "अपने प्रोजेक्ट के बारे में बताएं",
    industry: "उद्योग", employees: "कर्मचारी", revenue: "वार्षिक राजस्व",
    selectIndustry: "उद्योग चुनें...", selectRange: "रेंज चुनें...", selectRevenue: "रेंज चुनें (वैकल्पिक)...",
    topPains: "मुख्य व्यावसायिक समस्याएं (3 तक चुनें)",
    step1: "चरण 1/2 — आपकी जानकारी", step2of2: "चरण 2/2",
    next: "मूल्यांकन शुरू करें →", directPhone: "फोन नंबर",
    phoneNote: "रिपोर्ट वॉकथ्रू के लिए — हम कोल्ड कॉल नहीं करते",
    companyReq: "कंपनी", titleField: "पद", selectTitle: "पद चुनें...",
    sector: "सेक्टर", sectorNote: "स्कोप और प्राइसिंग प्रभावित करता है",
  },
  ar: {
    heroTag: "فقط 1 من كل 3 شركات لديها ضوابط حوكمة الذكاء الاصطناعي — EY 2025",
    heroTitle1: "جاهز للذكاء الاصطناعي في أسابيع.", heroTitle2: "ليس أرباع السنة.",
    heroDesc: "20 عامًا من الخبرة في Fortune 500 وتكنولوجيا المعلومات الحكومية. بنينا الأدوات والأُطر والفريق لنقل مؤسستك من التقييم إلى الإنتاج — مع الامتثال منذ اليوم الأول.",
    freeAssessment: "تقييم مجاني ←",
    assessTitle: "تقييم الجاهزية للذكاء الاصطناعي - 35 نقطة",
    assessDesc: "7 مجالات، 35 سؤالاً، نتيجة مخصصة. تقرير PDF مع تحليل الفجوات وخطة عمل 90 يومًا.",
    assessVal: "يتقاضى المستشارون 35-75 ألف درهم مقابل ذلك",
    startAssess: "← ابدأ التقييم المجاني",
    resultsTitle: "نتيجة الجاهزية للذكاء الاصطناعي",
    retake: "إعادة", downloadPdf: "📄 تحميل PDF", bookDiscovery: "← احجز مكالمة استكشافية",
    bookSending: "جاري الإرسال...", bookSent: "✓ تم الإرسال — تحقق من بريدك", bookRetry: "حاول مرة أخرى",
    partnerTag: "لنبني معًا", partnerTitle: "شارك مع TheBHTLabs",
    partnerDesc: "سواء كنت تبحث عن توظيفنا لمشروع أو الانضمام كشريك — ابدأ هنا.",
    getInTouch: "📞 تواصل معنا", applyPartner: "🤝 تقدم كشريك",
    contactTitle: "تواصل معنا", contactSend: "← احجز مكالمة استكشافية",
    contactSending: "جاري الإرسال...", contactSuccess: "✓ تم! سنرد خلال 24 ساعة.",
    contactResp: "نرد خلال يوم عمل واحد. مكالمة 30 دقيقة، بدون عرض مبيعات.",
    fullName: "الاسم الكامل", emailAddr: "البريد الإلكتروني", phone: "الهاتف", company: "الشركة",
    interestedIn: "أنا مهتم بـ...", tellUs: "أخبرنا عن مشروعك",
    industry: "الصناعة", employees: "الموظفون", revenue: "الإيرادات السنوية",
    selectIndustry: "اختر الصناعة...", selectRange: "اختر النطاق...", selectRevenue: "اختر النطاق (اختياري)...",
    topPains: "أهم التحديات (اختر حتى 3)",
    step1: "الخطوة 1 من 2 — معلوماتك", step2of2: "الخطوة 2 من 2",
    next: "← ابدأ التقييم", directPhone: "رقم الهاتف",
    phoneNote: "لمراجعة التقرير — لا نجري مكالمات باردة",
    companyReq: "الشركة", titleField: "المسمى الوظيفي", selectTitle: "اختر المسمى...",
    sector: "القطاع", sectorNote: "يؤثر على النطاق والتسعير",
  },
  de: {
    heroTag: "Nur 1 von 3 Unternehmen hat eine angemessene KI-Governance — EY 2025",
    heroTitle1: "KI-bereit in Wochen.", heroTitle2: "Nicht Quartalen.",
    heroDesc: "20 Jahre Erfahrung mit Fortune 500 und öffentlichem IT. Wir haben die Tools, Frameworks und das Team aufgebaut, um Ihr Unternehmen von der Bewertung zur Produktion zu bringen — mit Compliance von Tag eins.",
    freeAssessment: "Kostenlose Bewertung →",
    assessTitle: "35-Punkte KI-Bereitschaftsbewertung",
    assessDesc: "7 Bereiche, 35 Fragen, personalisierte Bewertung. PDF-Bericht mit Lückenanalyse und 90-Tage-Aktionsplan.",
    assessVal: "Berater berechnen dafür €5-10K",
    startAssess: "Kostenlose Bewertung starten →",
    resultsTitle: "KI-Bereitschaftsbewertung",
    retake: "Wiederholen", downloadPdf: "📄 PDF herunterladen", bookDiscovery: "Discovery-Call buchen →",
    bookSending: "Wird gesendet...", bookSent: "✓ Anfrage gesendet — E-Mail prüfen", bookRetry: "Erneut versuchen",
    partnerTag: "Gemeinsam aufbauen", partnerTitle: "Partner werden",
    partnerDesc: "Ob Sie uns für ein Projekt engagieren oder Channel-Partner werden möchten — hier starten.",
    getInTouch: "📞 Kontakt", applyPartner: "🤝 Partner-Bewerbung",
    contactTitle: "Kontakt aufnehmen", contactSend: "Discovery-Call buchen →",
    contactSending: "Wird gesendet...", contactSuccess: "✓ Gesendet! Wir antworten innerhalb von 24 Stunden.",
    contactResp: "Wir antworten innerhalb von 1 Werktag. 30-Minuten-Gespräch, ohne Verkaufsdruck.",
    fullName: "Vollständiger Name", emailAddr: "E-Mail-Adresse", phone: "Telefon", company: "Unternehmen",
    interestedIn: "Ich interessiere mich für...", tellUs: "Erzählen Sie uns von Ihrem Projekt",
    industry: "Branche", employees: "Mitarbeiter", revenue: "Jahresumsatz",
    selectIndustry: "Branche auswählen...", selectRange: "Bereich auswählen...", selectRevenue: "Bereich auswählen (optional)...",
    topPains: "Größte Herausforderungen (bis zu 3 wählen)",
    step1: "Schritt 1 von 2 — Ihre Informationen", step2of2: "Schritt 2 von 2",
    next: "Bewertung starten →", directPhone: "Telefonnummer",
    phoneNote: "Für Ihre Berichts-Besprechung — kein Cold Calling",
    companyReq: "Unternehmen", titleField: "Position", selectTitle: "Position auswählen...",
    sector: "Sektor", sectorNote: "beeinflusst Umfang und Preisgestaltung",
    aiRiskLevel: "KI-Risikostufe", aiRiskNote: "EU AI Act Klassifizierung",
    minimalRisk: "Minimales / Begrenztes Risiko", highRisk: "Hochrisiko-KI (Anhang III)",
  },
  fr: {
    heroTag: "Seulement 1 entreprise sur 3 dispose de contrôles de gouvernance IA — EY 2025",
    heroTitle1: "Prêt pour l'IA en semaines.", heroTitle2: "Pas en trimestres.",
    heroDesc: "20 ans d'expérience Fortune 500 et IT gouvernemental. Nous avons construit les outils et l'équipe pour amener votre organisation de l'évaluation à la production — avec la conformité dès le premier jour.",
    freeAssessment: "Évaluation gratuite →",
    assessTitle: "Évaluation de maturité IA en 35 points",
    assessDesc: "7 domaines, 35 questions, score personnalisé. Rapport PDF avec analyse des écarts et plan d'action 90 jours.",
    assessVal: "Les consultants facturent 5-10K€ pour cela",
    startAssess: "Commencer l'évaluation →",
    resultsTitle: "Score de maturité IA",
    retake: "Refaire", downloadPdf: "📄 Télécharger PDF", bookDiscovery: "Réserver un appel →",
    bookSending: "Envoi...", bookSent: "✓ Demande envoyée — Vérifiez votre email", bookRetry: "Réessayer",
    partnerTag: "Construisons ensemble", partnerTitle: "Devenez partenaire",
    partnerDesc: "Que vous cherchiez à nous engager ou à rejoindre notre réseau de partenaires — commencez ici.",
    getInTouch: "📞 Nous contacter", applyPartner: "🤝 Candidature partenaire",
    contactTitle: "Nous contacter", contactSend: "Réserver un appel →",
    contactSending: "Envoi...", contactSuccess: "✓ Envoyé ! Nous répondons sous 24h.",
    contactResp: "Nous répondons sous 1 jour ouvré. Appel de 30 min, sans engagement.",
    fullName: "Nom complet", emailAddr: "Adresse email", phone: "Téléphone", company: "Entreprise",
    interestedIn: "Je suis intéressé par...", tellUs: "Parlez-nous de votre projet",
    industry: "Secteur", employees: "Employés", revenue: "Chiffre d'affaires",
    selectIndustry: "Sélectionner le secteur...", selectRange: "Sélectionner...", selectRevenue: "Sélectionner (optionnel)...",
    topPains: "Principaux défis (sélectionnez jusqu'à 3)",
    step1: "Étape 1 sur 2 — Vos informations", step2of2: "Étape 2 sur 2",
    next: "Commencer l'évaluation →", directPhone: "Téléphone",
    phoneNote: "Pour la revue de votre rapport — pas d'appels à froid",
    companyReq: "Entreprise", titleField: "Poste", selectTitle: "Sélectionner...",
    sector: "Secteur", sectorNote: "affecte le périmètre et la tarification",
    aiRiskLevel: "Niveau de risque IA", aiRiskNote: "Classification EU AI Act",
    minimalRisk: "Risque minimal / limité", highRisk: "IA à haut risque (Annexe III)",
  },
  es: {
    heroTag: "Solo 1 de cada 3 empresas tiene controles de gobernanza de IA — EY 2025",
    heroTitle1: "Listo para IA en semanas.", heroTitle2: "No en trimestres.",
    heroDesc: "20 años de experiencia en Fortune 500 y TI gubernamental. Construimos las herramientas y el equipo para llevar su organización de la evaluación a la producción — con cumplimiento desde el día uno.",
    freeAssessment: "Evaluación gratuita →",
    assessTitle: "Evaluación de madurez IA de 35 puntos",
    assessDesc: "7 dominios, 35 preguntas, puntuación personalizada. Informe PDF con análisis de brechas y plan de acción de 90 días.",
    assessVal: "Los consultores cobran $5-10K por esto",
    startAssess: "Iniciar evaluación →",
    resultsTitle: "Puntuación de madurez IA",
    retake: "Repetir", downloadPdf: "📄 Descargar PDF", bookDiscovery: "Reservar llamada →",
    bookSending: "Enviando...", bookSent: "✓ Solicitud enviada — Revise su email", bookRetry: "Reintentar",
    partnerTag: "Construyamos juntos", partnerTitle: "Sea nuestro socio",
    partnerDesc: "Ya sea que busque contratarnos o unirse como socio de canal — comience aquí.",
    getInTouch: "📞 Contáctenos", applyPartner: "🤝 Solicitud de socio",
    contactTitle: "Contáctenos", contactSend: "Reservar llamada →",
    contactSending: "Enviando...", contactSuccess: "✓ ¡Enviado! Responderemos en 24 horas.",
    contactResp: "Respondemos en 1 día hábil. Llamada de 30 min, sin compromiso.",
    fullName: "Nombre completo", emailAddr: "Correo electrónico", phone: "Teléfono", company: "Empresa",
    interestedIn: "Me interesa...", tellUs: "Cuéntenos sobre su proyecto",
    industry: "Industria", employees: "Empleados", revenue: "Ingresos anuales",
    selectIndustry: "Seleccionar industria...", selectRange: "Seleccionar rango...", selectRevenue: "Seleccionar (opcional)...",
    topPains: "Principales desafíos (seleccione hasta 3)",
    step1: "Paso 1 de 2 — Su información", step2of2: "Paso 2 de 2",
    next: "Iniciar evaluación →", directPhone: "Teléfono directo",
    phoneNote: "Para revisar su informe — no hacemos llamadas en frío",
    companyReq: "Empresa", titleField: "Cargo", selectTitle: "Seleccionar cargo...",
    sector: "Sector", sectorNote: "afecta el alcance y precio",
  },
};

// Locale → default language mapping
const LOCALE_LANG_MAP = { us: 'en', in: 'hi', ae: 'ar', eu: 'en' };
// Country code → preferred language
const COUNTRY_LANG_MAP = { DE:'de', AT:'de', CH:'de', FR:'fr', BE:'fr', LU:'fr', ES:'es', MX:'es', AR:'es', CO:'es', CL:'es', PE:'es', IN:'hi', AE:'ar', SA:'ar', QA:'ar', KW:'ar', BH:'ar', OM:'ar' };

const getLang = (locale, countryCode) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bht_lang');
    if (stored && T[stored]) return stored;
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && T[urlLang]) return urlLang;
  }
  if (countryCode && COUNTRY_LANG_MAP[countryCode]) return COUNTRY_LANG_MAP[countryCode];
  return LOCALE_LANG_MAP[locale] || 'en';
};
const t = (lang, key) => (T[lang] && T[lang][key]) || T.en[key] || key;

/* ═══════════════ FEDERAL / SECTOR MULTIPLIER ═══════════════ */
// Stacks ON TOP of ARIA multiplier for regulated government work
const SECTOR_MULTIPLIERS = {
  commercial: { label: "Commercial", mult: 1.0, desc: "Standard commercial engagement" },
  fed_civilian: { label: "Federal Civilian", mult: 2.0, desc: "FISMA, NIST 800-53, FedRAMP aligned" },
  fed_defense: { label: "Federal Defense", mult: 3.0, desc: "CMMC L2+, NIST 800-171, CUI handling" },
  fed_classified: { label: "Federal Classified", mult: 4.0, desc: "Classified environments, ITAR, clearance-required" },
  eu_high_risk: { label: "EU High-Risk AI", mult: 1.5, desc: "EU AI Act high-risk classification, conformity assessment required" },
};

// Detect locale: geo-auto → URL param → localStorage → default US
const getLocale = () => {
  if (typeof window === 'undefined') return 'us';
  // 1. URL param override (always wins)
  const params = new URLSearchParams(window.location.search);
  const urlLocale = params.get('locale');
  if (['in','eu','us','ae'].includes(urlLocale)) return urlLocale;
  // 2. Stored preference
  const stored = localStorage.getItem('bht_locale');
  if (['in','eu','us','ae'].includes(stored)) return stored;
  // 3. Default US (geo-detection happens async in component)
  return 'us';
};

const detectGeoLocale = async () => {
  try {
    const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      const d = await r.json();
      const cc = d.country_code;
      if (typeof window !== 'undefined') localStorage.setItem('bht_cc', cc);
      if (cc === 'IN') return 'in';
      if (['AE','SA','QA','KW','BH','OM'].includes(cc)) return 'ae';
      const euCodes = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','NO','IS','LI','CH','GB'];
      if (euCodes.includes(cc)) return 'eu';
    }
  } catch (e) {}
  return 'us';
};

/* ═══════════════ MICRO COMPONENTS ═══════════════ */
const Tag = ({children, color = C.teal, bg}) => (
  <span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:F.h,
    background:bg||color+"0D",color:color,letterSpacing:".2px"}}>{children}</span>
);
const Badge = ({children, color = C.teal}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:600,fontFamily:F.m,background:color+"0A",color:color}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:color}}/>
    {children}
  </span>
);
const SH = ({tag, title, desc, align="center"}) => (
  <div style={{textAlign:align,marginBottom:56,maxWidth:700,margin:align==="center"?"0 auto 56px":"0 0 56px"}}>
    {tag && <div style={{marginBottom:12}}><Tag>{tag}</Tag></div>}
    <h2 style={{color:C.navy,fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,fontFamily:F.h,lineHeight:1.12,letterSpacing:"-0.02em"}}>{title}</h2>
    {desc && <p style={{color:C.textMuted,fontSize:16,marginTop:14,lineHeight:1.7,fontFamily:F.b}}>{desc}</p>}
  </div>
);

/* ═══════════════ DATA ═══════════════ */
const AQ = [
  {d:"Data Foundation",icon:"◈",q:["Is your business data centralized in a single system (CRM, ERP, cloud)?","Do you have clean, structured data that's less than 6 months old?","Are there defined data governance policies (who owns, accesses, updates)?","Can your data be exported in standard formats (CSV, API, database)?","Do you track customer interactions digitally (emails, calls, transactions)?"]},
  {d:"Process Maturity",icon:"⬡",q:["Are your core workflows documented and repeatable?","Do you have processes that involve repetitive manual data entry?","Are there bottlenecks where tasks wait on a single person?","Do you measure process cycle times and error rates?","Have you automated any workflows (email sequences, approvals, reports)?"]},
  {d:"Technology Readiness",icon:"△",q:["Are you using cloud-based tools (M365, Google Workspace, AWS)?","Can your systems integrate with third-party APIs?","Do you have a cybersecurity baseline (MFA, endpoint protection)?","Are your systems on supported/current software versions?","Do employees have access to collaboration tools (Teams, Slack)?"]},
  {d:"People & Culture",icon:"○",q:["Is leadership open to experimenting with AI tools?","Do employees currently use any AI tools (ChatGPT, Copilot)?","Is there budget allocated for technology training?","Would your team embrace AI assistance or resist change?","Do you have someone who understands AI basics?"]},
  {d:"Strategy & ROI",icon:"□",q:["Can you identify 3+ tasks consuming >5 hrs/week that are repetitive?","Do you have clear KPIs for operational efficiency?","Would saving 10-20 hrs/week per team member impact revenue?","Are competitors in your industry already adopting AI?","Do you have budget flexibility for a 3-6 month pilot?"]},
  {d:"Governance & Compliance",icon:"⬢",q:["Do you handle sensitive data (PII, PHI, financial)?","Are there industry compliance requirements you must meet?","Do you have data retention and privacy policies?","Would AI decisions need to be explainable or auditable?","Are you aware of AI regulations in your state/industry?"]},
  {d:"Use Case Clarity",icon:"◇",q:["Can you name a specific pain point AI could address today?","Have you evaluated any AI tools in the past 12 months?","Do you have 1-2 high-impact, low-risk AI use cases identified?","Would automating customer-facing tasks benefit you?","Are there reporting/analytics tasks that take too long?"]},
];
const CASES = [
  {client:"Defense Contractor",subtitle:"CMMC Level 2 Certification",industry:"Defense · 200 employees",color:C.teal,
    tags:["CMMC L2","GCC-High","Copilot Studio"],
    challenge:"Zero NIST 800-171 documentation, consumer M365 with mixed CUI data. Needed certification in 90 days to maintain DoD contract.",
    solution:"GCC-High tenant, Intune MDM (200+ devices), Purview DLP with CUI labels, Copilot Studio compliance agent, PowerShell continuous monitoring.",
    results:[{m:"90",u:"days",l:"To Certification"},{m:"110",u:"/110",l:"NIST Practices"},{m:"$2.1M",u:"",l:"Contract Saved"},{m:"0",u:"",l:"Audit Findings"}],
    refs:[{t:"NIST SP 800-171",u:"https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"},{t:"CMMC Program",u:"https://dodcio.defense.gov/CMMC/"},{t:"M365 GCC-High",u:"https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod"}]},
  {client:"Regional Logistics Co.",subtitle:"AI-Powered Operations",industry:"Small Business · 45 employees",color:C.coral,
    tags:["Copilot Studio","Power Automate","AI Readiness"],
    challenge:"3+ hrs/day on route emails, 200+ status calls/week, 2 FTEs for invoicing. Owner didn't know where to start.",
    solution:"35-Point Assessment → Copilot Studio customer agent → Power Automate invoice OCR → Copilot dispatch planning.",
    results:[{m:"67",u:"%",l:"Calls Deflected"},{m:"32",u:"hrs/wk",l:"Manual Work Cut"},{m:"$145K",u:"/yr",l:"Savings"},{m:"<6",u:"mo",l:"ROI Payback"}],
    refs:[{t:"Copilot Studio",u:"https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio/"},{t:"Power Automate",u:"https://learn.microsoft.com/en-us/power-automate/"},{t:"SBA AI Guide",u:"https://www.sba.gov/blog/how-small-businesses-can-harness-power-ai"}]},
  {client:"Healthcare Network",subtitle:"AI Governance Framework",industry:"Healthcare · 1,200 employees",color:C.rose,
    tags:["AI Governance","HIPAA","NIST AI RMF"],
    challenge:"23+ AI tools with zero governance. PHI in non-compliant systems. Pending audit.",
    solution:"AI inventory audit, NIST AI RMF risk assessment, governance council, 1,200-person training, Copilot Studio approval agent.",
    results:[{m:"23",u:"",l:"Tools Inventoried"},{m:"7",u:"",l:"Gaps Remediated"},{m:"100",u:"%",l:"Training Done"},{m:"Clean",u:"",l:"Audit Result"}],
    refs:[{t:"NIST AI RMF",u:"https://www.nist.gov/artificial-intelligence"},{t:"HIPAA",u:"https://www.hhs.gov/hipaa/index.html"}]},
  {client:"Energy Corporation",subtitle:"M&A Tenant Consolidation",industry:"Energy · 5,200 users",color:C.violet,
    tags:["M&A","Multi-Tenant","Entra ID"],
    challenge:"12 M365 tenants post-acquisition, inconsistent security, no unified identity for 5,200 users.",
    solution:"Phased cross-tenant migration, Entra policies, license reconciliation agent, Copilot Studio comms, Power BI dashboards.",
    results:[{m:"12→1",u:"",l:"Tenants"},{m:"5,200",u:"",l:"Users Migrated"},{m:"$800K",u:"/yr",l:"License Savings"},{m:"99.9",u:"%",l:"Success Rate"}],
    refs:[{t:"Cross-Tenant Migration",u:"https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-mailbox-migration"},{t:"Entra Cross-Tenant",u:"https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview"}]},
];
const PKGS = [
  {name:"AI Discovery",price:"Free",per:"",color:C.teal,pop:false,desc:"30-min call. We review your assessment results and tell you what we'd do first.",feats:["Review your assessment results","2-3 priority recommendations","Honest fit assessment","Zero obligation"],cta:"Book Free Call"},
  {name:"AI Quick Scan",price:"$2,500",per:"/10 hrs",color:C.blue,pop:false,desc:"Our scripts on YOUR tenant. Real findings, not surveys.",feats:["Automated M365/Azure diagnostic","PowerShell tenant analysis","Ungoverned file & DLP gap report","License optimization findings","1-hour executive briefing","3 priority action items"],cta:"Start Scan"},
  {name:"AI Readiness Sprint",price:"$7,500",per:"/30 hrs",color:C.violet,pop:true,desc:"Full engagement. Stakeholder interviews to boardroom deliverable.",feats:["Everything in Quick Scan","Stakeholder interviews (3-5)","Process mapping (core workflows)","90-day prioritized roadmap","Executive presentation deck","Tool & vendor recommendations"],cta:"Start Sprint"},
  {name:"AI Launchpad",price:"$15,000",per:"/month",color:C.coral,pop:false,desc:"Implementation. Agents, automations, training, results.",feats:["Everything in Sprint","Copilot Studio agents (production)","Custom Power Automate workflows","Staff training (up to 20)","Monthly optimization reviews","Priority support + Slack channel"],cta:"Launch Now"},
];
const PROMPTS = [
  {cat:"Business",title:"AI Use Case Identifier",color:C.teal,prompt:"I run a [INDUSTRY] business with [X] employees. Top 3 time-consuming tasks: [list]. Current tools: [list]. Budget: [RANGE]. Identify top 5 AI use cases ranked by: (1) time savings, (2) difficulty, (3) 90-day ROI. For each, recommend specific tools and 2-sentence plan."},
  {cat:"Copilot",title:"IT Helpdesk Agent",color:C.blue,prompt:"You are an IT support agent for [Company]. Access: SharePoint KB, ServiceNow, Graph API, Intune. For each request: (1) classify P1-P4, (2) check KB, (3) attempt auto-resolution, (4) if unresolved create ticket with diagnostics, (5) provide ticket # and SLA."},
  {cat:"Career",title:"AI Skills Gap Analyzer",color:C.coral,prompt:"I am a [TITLE] with [X] years in [INDUSTRY]. Skills: [list]. Based on 2026 trends: (1) Rate my automation risk 1-10, (2) Top 5 AI skills by career impact, (3) For each: 1 free + 1 paid resource, (4) 90-day learning plan, (5) 3 AI-augmented job titles I could target."},
  {cat:"Governance",title:"AI Policy Generator",color:C.violet,prompt:"Draft an AI Acceptable Use Policy for a [SIZE] company in [INDUSTRY]. Include: (1) Approved tools, (2) Prohibited uses, (3) Data classification before AI processing, (4) Training requirements, (5) Incident reporting, (6) Vendor evaluation, (7) Annual review."},
  {cat:"Business",title:"AI Vendor Scorecard",color:C.teal,prompt:"Create a weighted scorecard for comparing AI vendors for [INDUSTRY]. Criteria: (1) Integration with [TOOLS], (2) Data security, (3) Scalability, (4) 12-month TCO, (5) Vendor stability, (6) Adoption difficulty, (7) Time to value. Weight each, 1-5 rubric."},
  {cat:"Copilot",title:"Weekly BI Report Agent",color:C.blue,prompt:"Every Monday 8 AM: (1) Pull last week's sales from [SOURCE], (2) Compare vs prior week + same week last year, (3) Top 3 and bottom 3 products, (4) Flag >20% deviations, (5) Generate exec summary, (6) Post to [Teams/email]. Clean HTML."},
];
const TRACKS = [
  {title:"AI for Business Leaders",level:"Beginner",dur:"4 weeks",color:C.teal,desc:"Understand what AI can and can't do. Evaluate vendors, avoid hype, make smart decisions.",skills:["AI landscape","Vendor evaluation","Business cases","Risk assessment"],stat:"62% of workers believe AI skills improve job security"},
  {title:"Copilot & Automation Mastery",level:"Intermediate",dur:"6 weeks",color:C.blue,desc:"Hands-on with M365 Copilot, Power Automate, and Copilot Studio. Build production agents.",skills:["M365 Copilot","Power Automate","Agent building","Teams integration"],stat:"29% of hiring managers only hire AI-proficient candidates"},
  {title:"AI Governance & Compliance",level:"Advanced",dur:"8 weeks",color:C.violet,desc:"NIST AI RMF, EU AI Act, state regulations. For CISOs, compliance officers, and IT leads.",skills:["NIST AI RMF","EU AI Act","Policy development","Bias auditing"],stat:"Companies with skills readiness 12x more likely to upskill"},
  {title:"Prompt Engineering & AI Tools",level:"All Levels",dur:"Self-paced",color:C.coral,desc:"Master getting great results from Claude, ChatGPT, Copilot, and more.",skills:["Advanced prompting","Chain-of-thought","System prompts","Multi-tool workflows"],stat:"3-6 months of consistent practice makes candidates job-ready"},
];


/* ═══════════════ MAIN EXPORT ═══════════════ */
export default function TheBHTLabs() {
  const [nav, setNav] = useState("assess");
  const [mode, setMode] = useState("commercial"); // commercial | federal

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setNav(id); };

  return (
    <div style={{background:C.bg,color:C.text,fontFamily:F.b,lineHeight:1.6,WebkitFontSmoothing:"antialiased"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::selection{background:rgba(13,148,136,.15)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#F8FAFC}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @media(max-width:900px){.g4{grid-template-columns:1fr 1fr!important}.g3{grid-template-columns:1fr!important}.g2{grid-template-columns:1fr!important}}
        @media(max-width:540px){.g4{grid-template-columns:1fr!important}.snav{display:none!important}.hero-t{font-size:34px!important}}
      `}</style>
      <Hero scrollTo={scrollTo} nav={nav} mode={mode} setMode={setMode} />
      {mode === 'federal' ? (
        <>
          <FederalHub scrollTo={scrollTo} />
          <Assessment id="assess" />
          <Partner id="partner" />
        </>
      ) : (
        <>
          <ProofBar />
          <FedAcquisition />
          <TenantHealthCheck id="healthcheck" />
          <Assessment id="assess" />
          <Packages id="packages" />
          <Partner id="partner" />
          <FAQ id="faq" />
        </>
      )}
      <Footer />
      <ChatWidget />
      <CookieNotice />
    </div>
  );
}
/* ═══════════════ CLIENT TICKER — Scrolling logos by industry ═══════════════ */
const CLIENTS = [
  // Technology
  {n:"Microsoft",u:"https://www.microsoft.com",cat:"Technology",cc:"#00A4EF"},
  {n:"IBM",u:"https://www.ibm.com",cat:"Technology",cc:"#0530AD"},
  {n:"NTT Data",u:"https://www.nttdata.com",cat:"Technology",cc:"#0072C6"},
  {n:"Hitachi",u:"https://www.hitachiconsulting.com",cat:"Technology",cc:"#E60012"},
  {n:"HID Global",u:"https://www.hidglobal.com",cat:"Technology",cc:"#003DA5"},
  {n:"iRobot",u:"https://www.irobot.com",cat:"Technology",cc:"#8BC540"},
  {n:"Parex Technology",u:"https://www.parextechnologies.com",cat:"Technology",cc:"#0072C6"},
  // Consulting
  {n:"Ernst & Young",u:"https://www.ey.com",cat:"Consulting",cc:"#FFE600"},
  {n:"PwC",u:"https://www.pwc.com",cat:"Consulting",cc:"#EB8C00"},
  {n:"Bain & Company",u:"https://www.bain.com",cat:"Consulting",cc:"#CC0000"},
  // Financial Services
  {n:"Bank of America",u:"https://www.bankofamerica.com",cat:"Financial",cc:"#012169"},
  {n:"SWBC",u:"https://www.swbc.com",cat:"Financial",cc:"#003366"},
  {n:"Standard Insurance",u:"https://www.standard.com",cat:"Financial",cc:"#00539B"},
  // Energy
  {n:"bp",u:"https://www.bp.com",cat:"Energy",cc:"#009B3A"},
  {n:"Devon Energy",u:"https://www.devonenergy.com",cat:"Energy",cc:"#00843D"},
  {n:"Phillips 66",u:"https://www.phillips66.com",cat:"Energy",cc:"#D71920"},
  {n:"CenterPoint Energy",u:"https://www.centerpointenergy.com",cat:"Energy",cc:"#00A94F"},
  {n:"Consolidated Edison",u:"https://www.coned.com",cat:"Energy",cc:"#0066B3"},
  {n:"Speedway",u:"https://www.speedway.com",cat:"Energy",cc:"#ED1C24"},
  {n:"NOV",u:"https://www.nov.com",cat:"Energy",cc:"#005DA6"},
  {n:"Apache",u:"https://www.apachecorp.com",cat:"Energy",cc:"#CE1126"},
  // Healthcare
  {n:"Eli Lilly",u:"https://www.lilly.com",cat:"Healthcare",cc:"#D52B1E"},
  {n:"McKesson",u:"https://www.mckesson.com",cat:"Healthcare",cc:"#0072CE"},
  {n:"Healthcare Assoc. of Hawaii",u:"https://www.hah.org",cat:"Healthcare",cc:"#00AEEF"},
  // Retail & Industrial
  {n:"Kroger",u:"https://www.kroger.com",cat:"Retail",cc:"#0033A0"},
  {n:"GE Power",u:"https://www.ge.com",cat:"Industrial",cc:"#3B73B9"},
  {n:"Foodland",u:"https://www.foodland.com",cat:"Retail",cc:"#E31837"},
  // Nonprofit
  {n:"Bill & Melinda Gates Foundation",u:"https://www.gatesfoundation.org",cat:"Nonprofit",cc:"#1D6FA5"},
  // Federal
  {n:"U.S. Department of Justice",u:"https://www.justice.gov",cat:"Federal",cc:"#002F6C"},
  {n:"U.S. SEC",u:"https://www.sec.gov",cat:"Federal",cc:"#002868"},
  {n:"U.S. DHS",u:"https://www.dhs.gov",cat:"Federal",cc:"#003366"},
  // State & Local
  {n:"State of Hawaii",u:"https://www.hawaii.gov",cat:"State Gov",cc:"#003DA5"},
  {n:"Arkansas Dept. of Education",u:"https://dese.ade.arkansas.gov",cat:"State Gov",cc:"#C41230"},
  {n:"City of San Diego",u:"https://www.sandiego.gov",cat:"State Gov",cc:"#00457C"},
];

const CAT_COLORS = {Technology:"#0072C6",Consulting:"#EB8C00",Financial:"#012169",Energy:"#00843D",Healthcare:"#D52B1E",Retail:"#0033A0",Industrial:"#3B73B9",Nonprofit:"#1D6FA5",Federal:"#002F6C","State Gov":"#C41230"};

function ClientTicker() {
  const [hovered, setHovered] = useState(false);
  const items = [...CLIENTS, ...CLIENTS];
  return (
    <div style={{overflow:"hidden",position:"relative",width:"100%",maskImage:"linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)"}}>
      <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{display:"flex",gap:6,animation:"tickerScroll 80s linear infinite",animationPlayState:hovered?"paused":"running",width:"max-content"}}>
        {items.map((c,i)=>(
          <a key={c.n+i} href={c.u} target="_blank" rel="noopener noreferrer" title={`${c.n} — ${c.cat}`}
            style={{display:"inline-flex",alignItems:"center",gap:7,flexShrink:0,padding:"7px 14px",borderRadius:8,textDecoration:"none",transition:"all .15s",
              background:"transparent",border:`1px solid transparent`}}
            onMouseEnter={e=>{e.currentTarget.style.background=c.cc+"0A";e.currentTarget.style.borderColor=c.cc+"20"}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent"}}>
            <div style={{width:20,height:20,borderRadius:5,background:c.cc+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:9,fontWeight:800,color:c.cc,fontFamily:F.m}}>{c.n.replace(/^U\.S\.\s/,"").charAt(0)}</span>
            </div>
            <span style={{fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,whiteSpace:"nowrap"}}>{c.n}</span>
            <span style={{fontSize:8,fontWeight:700,fontFamily:F.m,color:CAT_COLORS[c.cat]||C.textFaint,opacity:.5,textTransform:"uppercase",letterSpacing:.5}}>{c.cat}</span>
          </a>
        ))}
      </div>
      <style>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Hero({scrollTo, nav, mode, setMode}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",h,{passive:true});
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  const commercialNav = [{id:"healthcheck",l:"Bot Auditor"},{id:"assess",l:"Assessment"},{id:"packages",l:"Packages"},{id:"partner",l:"Work With Us"},{id:"faq",l:"FAQ"}];
  const federalNav = [{id:"fed-tools",l:"AI Tools"},{id:"fed-compliance",l:"Compliance"},{id:"fed-vehicles",l:"Vehicles"},{id:"assess",l:"Assessment"},{id:"partner",l:"Contact CO"}];
  const navItems = mode === 'federal' ? federalNav : commercialNav;

  /* Unique logo — lambda inside hexagonal shape */
  const Logo = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor={C.teal}/>
          <stop offset="100%" stopColor={C.tealDark}/>
        </linearGradient>
      </defs>
      <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="url(#logoGrad)" rx="2"/>
      <text x="18" y="23" textAnchor="middle" fill="#fff" fontFamily="'DM Mono',monospace" fontWeight="800" fontSize="18">λ</text>
    </svg>
  );

  return (
    <>
      {/* Sticky Navigation */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:999,
        background:scrolled?"rgba(255,255,255,.92)":C.bg,
        backdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        WebkitBackdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        borderBottom:`1px solid ${scrolled?C.border:"transparent"}`,
        boxShadow:scrolled?"0 1px 8px rgba(15,23,42,.06)":"none",
        transition:"all .3s ease",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:scrolled?"10px 24px":"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"padding .3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <Logo />
            <div>
              <span style={{fontWeight:800,fontSize:17,fontFamily:F.h,color:C.navy}}>TheBHT<span style={{color:C.teal}}>Labs</span></span>
              <a href="https://www.bhtsolutions.com" target="_blank" rel="noopener noreferrer"
                style={{display:"block",fontSize:10,color:C.textFaint,fontFamily:F.m,letterSpacing:1,textDecoration:"none",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.textFaint}>
                SKUNKWORKS · BHT SOLUTIONS ↗
              </a>
            </div>
          </div>
          <div className="snav" style={{display:"flex",gap:2}}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>scrollTo(n.id)} style={{padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:F.h,border:"none",transition:"all .15s",
                background:nav===n.id?C.tealBg:"transparent",color:nav===n.id?C.tealDark:C.textMuted}}>{n.l}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>{
              const cycle = {us:'eu',eu:'ae',ae:'in',in:'us'};
              const cur = (typeof window!=='undefined' && localStorage.getItem('bht_locale')) || 'us';
              const next = cycle[cur] || 'us';
              localStorage.setItem('bht_locale', next);
              localStorage.removeItem('bht_lang');
              window.location.search = '?locale=' + next;
            }} title="Switch region" style={{padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:F.m,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,transition:"all .15s",display:"flex",alignItems:"center",gap:4}}>
              {(()=>{const l=typeof window!=='undefined'&&localStorage.getItem('bht_locale');return l==='in'?'🇮🇳 INR':l==='eu'?'🇪🇺 EUR':l==='ae'?'🇦🇪 AED':'🇺🇸 USD'})()}
            </button>
            <select onChange={e=>{localStorage.setItem('bht_lang',e.target.value);window.location.reload();}} 
              value={typeof window!=='undefined'?(localStorage.getItem('bht_lang')||'en'):'en'}
              style={{padding:"5px 8px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:F.m,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:"pointer",appearance:"none",WebkitAppearance:"none",paddingRight:6}}>
              {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.label}</option>)}
            </select>
            <button onClick={()=>scrollTo("assess")} style={{padding:"9px 20px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 2px 8px ${C.teal}33`,transition:"all .2s"}}>
              {(()=>{const l=typeof window!=='undefined'&&localStorage.getItem('bht_lang');return (T[l]||T.en).freeAssessment})()}
            </button>
          </div>
        </div>
      </nav>

      {/* Mode Toggle Bar — persistent, always visible */}
      <div style={{position:"fixed",top:scrolled?52:60,left:0,right:0,zIndex:998,background:mode==='federal'?"#0F172A":"#F8FAFC",borderBottom:`1px solid ${mode==='federal'?'#1E293B':C.border}`,transition:"all .3s"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
          <button onClick={()=>{setMode('commercial');window.scrollTo({top:0,behavior:'smooth'});}}
            style={{padding:"8px 24px",fontSize:12,fontWeight:700,fontFamily:F.h,border:"none",cursor:"pointer",transition:"all .2s",borderBottom:`2px solid ${mode==='commercial'?C.teal:'transparent'}`,
              background:"transparent",color:mode==='commercial'?(mode==='federal'?'#5EEAD4':C.teal):(mode==='federal'?'#64748B':C.textMuted)}}>
            Commercial
          </button>
          <button onClick={()=>{setMode('federal');window.scrollTo({top:0,behavior:'smooth'});}}
            style={{padding:"8px 24px",fontSize:12,fontWeight:700,fontFamily:F.h,border:"none",cursor:"pointer",transition:"all .2s",borderBottom:`2px solid ${mode==='federal'?'#F59E0B':'transparent'}`,
              background:"transparent",color:mode==='federal'?'#F59E0B':(mode==='federal'?'#64748B':C.textMuted),display:"flex",alignItems:"center",gap:6}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>
            Federal &amp; Defense
          </button>
        </div>
      </div>

      {/* Hero content — conditional on mode */}
      {mode === 'federal' ? (
        <header style={{borderBottom:"1px solid #1E293B",background:"linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",paddingTop:110}}>
          <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 48px",textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.25)",marginBottom:20}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#F59E0B",animation:"pulse 2s infinite"}} />
              <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:"#F59E0B"}}>OMB M-25-21 Compliance Due April 3, 2026 — {Math.ceil((new Date('2026-04-03')-new Date())/(1000*60*60*24))} days</span>
            </div>
            <h1 className="hero-t" style={{fontSize:"clamp(34px,5vw,54px)",fontWeight:800,fontFamily:F.h,lineHeight:1.08,color:"#F8FAFC",letterSpacing:"-0.03em",maxWidth:850,margin:"0 auto"}}>
              Your agency needs AI governance.<br/><span style={{color:"#5EEAD4"}}>We hold the clearance to build it.</span>
            </h1>
            <p style={{color:"#94A3B8",fontSize:17,lineHeight:1.7,maxWidth:660,margin:"20px auto 14px",fontFamily:F.b}}>
              SBA 8(a) sole-source eligible. Secret cleared. Microsoft ecosystem certified. We help federal agencies and defense primes meet M-25-21/M-25-22 AI mandates — from use case inventory to production governance.
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:6,marginBottom:28}}>
              {["SBA 8(a)","EDWOSB","CAGE 7DBB9","Secret Eligible","Azure Architect","CyberAB RP","DIR-CPO-5626"].map(b=>(
                <span key={b} style={{padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,fontFamily:F.m,background:"rgba(94,234,212,.08)",color:"#5EEAD4",border:"1px solid rgba(94,234,212,.15)"}}>{b}</span>
              ))}
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>scrollTo("fed-tools")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:"none",background:"#F59E0B",color:"#0F172A",boxShadow:"0 4px 16px rgba(245,158,11,.3)",transition:"all .2s"}}>
                Access Free Federal AI Tools
              </button>
              <button onClick={()=>scrollTo("partner")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:"1.5px solid #334155",background:"transparent",color:"#E2E8F0",transition:"all .2s"}}>
                Contact Contracting Office
              </button>
            </div>
            <div style={{marginTop:36,display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
              {[
                {v:"110/110",l:"NIST 800-171 Practices",sub:"90-day CMMC engagement"},
                {v:"$4.5M",l:"8(a) Sole Source Threshold",sub:"Direct award, no competition"},
                {v:"35%",l:"SB Share of Fed AI Contracts",sub:"Deltek GovWin FY22-24"},
                {v:"April 3",l:"M-25-21 Compliance Deadline",sub:"High-impact AI use cases"},
              ].map(m=>(
                <div key={m.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,fontFamily:F.m,color:"#5EEAD4",lineHeight:1}}>{m.v}</div>
                  <div style={{fontSize:11,fontWeight:600,fontFamily:F.h,color:"#E2E8F0",marginTop:4}}>{m.l}</div>
                  <div style={{fontSize:9,fontFamily:F.m,color:"#64748B",marginTop:2}}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </header>
      ) : (
      <header style={{borderBottom:`1px solid ${C.border}`,background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bgSoft} 100%)`,paddingTop:110}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 48px",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.12)",marginBottom:20}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.rose,animation:"pulse 2s infinite"}} />
            <span style={{fontSize:12,fontWeight:700,fontFamily:F.m,color:C.rose}}>67% of AI chatbots fail basic governance checks — BHTLabs 2025</span>
          </div>
          <h1 className="hero-t" style={{fontSize:"clamp(36px,5vw,58px)",fontWeight:800,fontFamily:F.h,lineHeight:1.08,color:C.navy,letterSpacing:"-0.03em",maxWidth:800,margin:"0 auto"}}>
            Your AI is live.<br/><span style={{color:C.teal}}>Is it governed?</span>
          </h1>
          <p style={{color:C.textMuted,fontSize:18,lineHeight:1.7,maxWidth:620,margin:"20px auto 14px",fontFamily:F.b}}>
            We audit AI chatbots, assess organizational readiness, and build governance frameworks that satisfy EU AI Act, NIST, CMMC, and your board — in weeks, not quarters.
          </p>
          <p style={{color:C.textFaint,fontSize:13,fontFamily:F.m,maxWidth:500,margin:"0 auto 32px"}}>
            SBA 8(a) · EDWOSB · Azure Solutions Architect · CyberAB RP · Secret Clearance Eligible
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>scrollTo("healthcheck")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`,transition:"all .2s"}}>
              Audit Your AI Bot — Free
            </button>
            <button onClick={()=>scrollTo("assess")} style={{padding:"14px 32px",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,border:`1.5px solid ${C.border}`,background:"transparent",color:C.navy,transition:"all .2s"}}>
              35-Point AI Assessment
            </button>
          </div>
          <div style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${C.borderLight}`}}>
            <p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Trusted by teams across industries</p>
            <ClientTicker />
          </div>
          <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
            {[
              {v:"110/110",l:"NIST 800-171 practices",sub:"90-day CMMC engagement"},
              {v:"87%",l:"Faster document processing",sub:"Insurance broker deployment"},
              {v:"$145K",l:"Annual savings from automation",sub:"PowerShell + Power Automate"},
              {v:"Zero",l:"Downtime on GCC-High migration",sub:"150-employee federal sub"},
            ].map(m=>(
              <div key={m.l} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,fontFamily:F.m,color:C.teal,lineHeight:1}}>{m.v}</div>
                <div style={{fontSize:11,fontWeight:600,fontFamily:F.h,color:C.navy,marginTop:4}}>{m.l}</div>
                <div style={{fontSize:9,fontFamily:F.m,color:C.textFaint,marginTop:2}}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </header>
      )}
    </>
  );
}

/* ═══════════════ FREE VALUE STACK — What visitors get at $0 ═══════════════ */
function Assessment({id}) {
  const [phase, setPhase] = useState("landing"); // landing, intake, questions, results
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locale, setLocale] = useState("us");
  const [intake, setIntake] = useState({name:"",email:"",title:"",company:"",industry:"",employees:"",revenue:"",phone:"",sector:"commercial",pains:[]});
  const [intakeErr, setIntakeErr] = useState("");
  const [startTime, setStartTime] = useState(null); // time gate
  const [companySuggest, setCompanySuggest] = useState("");

  useEffect(() => { 
    const initial = getLocale();
    setLocale(initial);
    // If no stored preference and no URL param, try geo-detection
    if (typeof window !== 'undefined' && !localStorage.getItem('bht_locale') && !new URLSearchParams(window.location.search).get('locale')) {
      detectGeoLocale().then(geo => { if (geo !== initial) { setLocale(geo); localStorage.setItem('bht_locale', geo); } });
    }
  }, []);
  const loc = LOCALES[locale] || LOCALES.us;
  const cc = typeof window !== 'undefined' ? localStorage.getItem('bht_cc') : null;
  const lang = getLang(locale, cc);
  const _ = (key) => t(lang, key);
  const isRtl = LANGS[lang]?.dir === 'rtl';
  const activeIndustries = (locale !== 'us' && loc.industries) ? loc.industries : INDUSTRIES;
  const activeRevRanges = (locale !== 'us' && loc.revRanges) ? loc.revRanges : REV_RANGES;
  const activePains = (locale !== 'us' && loc.painPoints) ? loc.painPoints : PAIN_POINTS;

  const upI = (k,v) => setIntake(p=>({...p,[k]:v}));
  const togglePain = (p) => setIntake(prev => ({...prev, pains: prev.pains.includes(p) ? prev.pains.filter(x=>x!==p) : prev.pains.length < 3 ? [...prev.pains, p] : prev.pains}));

  const cur = AQ[step], total = 35, answered = Object.keys(ans).length;
  const ds = (di) => { let y=0; for(let q=0;q<5;q++){const v=ans[di+"-"+q]; if(v==="yes")y++; else if(v==="partial")y+=.5} return Math.round((y/5)*100); };
  const overall = () => { let y=0; Object.values(ans).forEach(v=>{if(v==="yes")y++;else if(v==="partial")y+=.5}); return Math.round((y/total)*100); };
  const lvl = (s) => s>=80?{l:"AI-Leading",c:C.teal}:s>=65?{l:"AI-Ready",c:C.blue}:s>=40?{l:"AI-Building",c:C.coral}:{l:"AI-Unready",c:C.rose};
  const indObj = activeIndustries.find(i=>i.v===intake.industry) || {l:"your industry",avg:52};

  const getCTA = (s, domains, aria) => {
    const sorted = [...domains].sort((a,b)=>a.score-b.score);
    const low1 = sorted[0], low2 = sorted[1];
    const co = intake.company || "Your organization";
    const fmt = aria.fmt || (v => "$" + v.toLocaleString());
    const domainInsight = (name, score) => {
      if(name==="Data Foundation"&&score<40) return "Gartner reports 85% of AI projects fail due to poor data quality. This is your highest-leverage fix.";
      if(name==="Process Maturity"&&score<40) return "McKinsey found organizations with redesigned workflows are 2x more likely to achieve AI returns.";
      if(name==="People & Culture"&&score<50) return "BCG: AI success is 70% people/culture, only 10% algorithms. Change management is critical.";
      if(name==="Governance & Compliance"&&score<50) return "EY found only 1 in 3 companies have proper AI governance despite broad adoption.";
      if(name==="Technology Readiness"&&score<50) return "Not about buying more tools — it's ensuring your existing stack is configured and AI-ready.";
      if(name==="Strategy & ROI"&&score<50) return "Only 39% report enterprise EBIT impact from AI (McKinsey 2025). A structured strategy changes that.";
      if(name==="Use Case Clarity"&&score<50) return "Start with 1-2 high-impact, low-risk use cases. Breadth kills ROI; depth creates it.";
      return "Targeted improvements here will unlock measurable AI capabilities.";
    };
    const ap = aria.pricing;
    const pkg = s>=80
      ? {name:"AI Launchpad",price:`${fmt(ap.launchpad.adjusted)}/mo`,hours:`${ap.launchpad.hours} hrs/mo`,what:"Implementation: Copilot Studio agents, custom automations, staff training, monthly optimization reviews.",value:"Avg client sees 87% faster processing, significant annual savings"}
      : s>=65
      ? {name:"AI Readiness Sprint",price:`${fmt(ap.sprint.adjusted)}`,hours:`${ap.sprint.hours} hrs`,what:`${ap.sprint.hours}-hour engagement: stakeholder interviews, M365/Azure tenant diagnostic, process mapping, 90-day roadmap, executive deck.`,value:"Clients typically identify significant optimization opportunities in the first audit"}
      : {name:"AI Quick Scan",price:`${fmt(ap.scan.adjusted)}`,hours:`${ap.scan.hours} hrs`,what:`${ap.scan.hours}-hour engagement: automated tenant diagnostic with our PowerShell scripts on YOUR systems, scored report with actual findings, executive briefing with priority recommendations.`,value:"Moves you from self-reported survey to evidence-based findings from your actual environment"};
    return {low1,low2,domainInsight,pkg,
      honest: s>=80
        ? `${co} scored ${s}% — AI-Leading. Ahead of most ${indObj.l} organizations (industry avg: ${indObj.avg}%). Foundations are strong. Focus on scaling and governance.`
        : s>=65
        ? `${co} scored ${s}% — AI-Ready, above the ${indObj.l} average of ${indObj.avg}%. Gaps in ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%) are the last barriers to production deployment.`
        : s>=40
        ? `${co} scored ${s}% — AI-Building. This is ${s>indObj.avg?'above':'below'} the ${indObj.l} average of ${indObj.avg}%. Critical gaps: ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%). These two domains drive the majority of AI deployment failures.`
        : `${co} scored ${s}% — AI-Unready. The ${indObj.l} average is ${indObj.avg}%. ${low1.name} (${low1.score}%) and ${low2.name} (${low2.score}%) need foundational work before AI tools will deliver returns.`,
      practical: s>=65
        ? `Organizations that deploy AI into prepared workflows see results in 60-90 days. Companies redesigning workflows first are 2x more likely to achieve enterprise impact (McKinsey 2025).`
        : `42% of companies abandoned most AI initiatives in 2025 — up from 17% prior year (S&P Global) — because they deployed tools before data and processes were ready.`,
    };
  };

  const saveResults = async () => {
    setSaving(true);
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores, locale);
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 999;
    try {
      await fetch("/api/assessment", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...intake, industryLabel:indObj.l, overallScore:overall(), stage:lvl(overall()).l, domains, rawAnswers:ans,
          ariaScore:aria.total, ariaTier:aria.tierLabel, ariaMult:aria.mult, ariaPricing:aria.pricing,
          sectorLabel:aria.sectorLabel, sectorMult:aria.sectorMult, combinedMult:aria.combinedMult, locale,
          timeSpent:elapsed, suspicious:elapsed<60})});
      setSaved(true);
    } catch(e) { console.error(e); setSaved(true); }
    setSaving(false);
  };

  const [discoveryStatus, setDiscoveryStatus] = useState(""); // "", sending, sent, error

  const bookDiscovery = async () => {
    if(discoveryStatus === "sent" || discoveryStatus === "sending") return;
    setDiscoveryStatus("sending");
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores, locale);
    const sorted = [...domains].sort((a,b)=>a.score-b.score);
    try {
      const r = await fetch("/api/discovery", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:intake.name, email:intake.email, phone:intake.phone, company:intake.company,
          title:intake.title, industry:indObj.l, employees:intake.employees, revenue:intake.revenue,
          overallScore:overall(), stage:lvl(overall()).l,
          weakest1:sorted[0]?.name+" ("+sorted[0]?.score+"%)", weakest2:sorted[1]?.name+" ("+sorted[1]?.score+"%)",
          ariaScore:aria.total, ariaTier:aria.tierLabel, ariaMult:aria.mult,
          sectorLabel:aria.sectorLabel, sectorMult:aria.sectorMult, locale,
          recPackage:getCTA(overall(), domains, aria).pkg.name,
          recPrice:getCTA(overall(), domains, aria).pkg.price
        })});
      if(r.ok) setDiscoveryStatus("sent");
      else setDiscoveryStatus("error");
    } catch(e) { setDiscoveryStatus("error"); }
  };

  const generatePDF = () => {
    if(!saved) saveResults();
    const s = overall(), lv = lvl(s);
    const domains = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores, locale);
    const cta = getCTA(s, domains, aria);
    const co = intake.company || "Organization";
    const reportId = 'BHT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2,6).toUpperCase();
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>AI Readiness Report — ${co} — TheBHTLabs</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins',sans-serif;color:#1C1917;padding:40px;max-width:800px;margin:0 auto}
      @media print{body{padding:20px}button,.no-print{display:none!important}.page-break{page-break-before:always}}
      h1{font-size:26px;font-weight:800;letter-spacing:-0.03em}h2{font-size:17px;font-weight:700;margin:24px 0 12px}
      .card{padding:16px;border-radius:12px;border:1px solid #E2E8F0}
      .insight{font-size:13px;color:#475569;line-height:1.7;margin-bottom:8px}
      .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;font-weight:900;color:rgba(14,116,144,0.03);letter-spacing:8px;pointer-events:none;z-index:0;font-family:'Poppins',sans-serif;white-space:nowrap}
    </style></head><body>
    <div class="watermark">CONFIDENTIAL</div>
    <div style="background:#1C1917;color:#fff;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:9px;line-height:1.6">
      <strong>CONFIDENTIAL &amp; PROPRIETARY</strong> — This report is prepared exclusively for ${intake.name} at ${co}. 
      ARIA Score™ methodology, assessment framework, and scoring algorithms are proprietary intellectual property of BHT Solutions LLC, 
      protected under the Defend Trade Secrets Act (18 U.S.C. § 1836). Unauthorized reproduction, distribution, or reverse engineering is prohibited.
      Report ID: ${reportId}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #0E7490">
      <div><h1>${co} — AI Readiness Report</h1>
      <p style="color:#78716C;font-size:12px;margin-top:4px">Prepared for ${intake.name}${intake.title?' · '+intake.title:''} · ${new Date().toLocaleDateString()}</p>
      <p style="color:#A8A29E;font-size:11px">${indObj.l}${intake.employees?' · '+intake.employees+' employees':''}${intake.revenue&&intake.revenue!=='Prefer not to say'?' · '+intake.revenue:''}</p></div>
      <div style="text-align:right"><div style="font-weight:800;font-size:15px;color:#1C1917">TheBHT<span style="color:#0E7490">Labs</span></div>
      <div style="font-size:10px;color:#A8A29E;font-family:'DM Mono',monospace">thebhtlabs.com</div></div>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin:24px 0;padding:20px;background:#F8FAFC;border-radius:14px">
      <div style="width:100px;height:100px;border-radius:50%;background:${lv.c}11;border:3px solid ${lv.c};display:flex;align-items:center;justify-content:center;flex-direction:column;flex-shrink:0">
        <div style="font-size:32px;font-weight:800;color:${lv.c};font-family:'DM Mono',monospace">${s}%</div>
        <div style="font-size:10px;font-weight:700;color:${lv.c}">${lv.l}</div>
      </div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600;color:#0F172A;margin-bottom:6px">Industry Benchmark: ${indObj.l} average is ${indObj.avg}%</div>
        <div style="height:24px;background:#E2E8F0;border-radius:6px;position:relative;overflow:hidden">
          <div style="height:100%;width:${s}%;background:${lv.c};border-radius:6px"></div>
          <div style="position:absolute;left:${indObj.avg}%;top:0;height:100%;width:2px;background:#0F172A"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:#94A3B8">
          <span>You: ${s}%</span><span>${indObj.l} avg: ${indObj.avg}%</span>
        </div>
      </div>
    </div>
    <h2>Domain Breakdown</h2>
    ${domains.map(d=>`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:3px">
      <span style="font-size:12px;font-weight:600">${d.name}</span>
      <span style="font-size:12px;font-weight:700;color:${d.score>=80?'#0D9488':d.score>=65?'#3B82F6':d.score>=40?'#F97316':'#E11D48'};font-family:'DM Mono',monospace">${d.score}%</span></div>
      <div style="height:16px;background:#F1F5F9;border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${d.score}%;background:${d.score>=80?'#0D9488':d.score>=65?'#3B82F6':d.score>=40?'#F97316':'#E11D48'};border-radius:4px"></div></div></div>`).join('')}
    ${intake.pains.length?`<h2>Business Pains Identified</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${intake.pains.map(p=>`<span style="padding:5px 12px;border-radius:8px;background:#FFF7ED;border:1px solid #FDBA7433;font-size:11px;font-weight:600;color:#9A3412">${p}</span>`).join('')}</div>`:''}
    <h2>ARIA Score™ — Engagement Complexity</h2>
    <div style="padding:16px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="width:56px;height:56px;border-radius:50%;background:${aria.tierColor}15;border:2px solid ${aria.tierColor};display:flex;align-items:center;justify-content:center;flex-direction:column;flex-shrink:0">
          <div style="font-size:20px;font-weight:800;color:${aria.tierColor};font-family:'DM Mono',monospace">${aria.total}</div>
          <div style="font-size:7px;font-weight:700;color:${aria.tierColor}">/30</div>
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:${aria.tierColor}">${aria.tierLabel} Complexity</div>
          <div style="font-size:11px;color:#64748B">AI Readiness & Implementation Assessment™ · ARIA: ${aria.mult}x${aria.sectorMult > 1 ? ' × ' + aria.sectorMult + 'x ' + aria.sectorLabel + ' = ' + aria.combinedMult + 'x' : ''}</div>
          ${aria.sectorMult > 1 ? '<div style="font-size:10px;font-weight:700;color:#DC2626;margin-top:4px;padding:3px 8px;background:rgba(220,38,38,.06);border-radius:4px;display:inline-block">' + aria.sectorLabel + ' — ' + aria.sectorDesc + '</div>' : ''}
        </div>
      </div>
      ${(()=>{const regs=loc.regIndustryMap?.[intake.industry]||loc.regulatory||[];return regs.length?'<div style="margin-bottom:8px;padding:8px 10px;background:#fff;border-radius:6px;border:1px solid #E2E8F0"><div style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Applicable Standards — '+indObj.l+'</div><div style="display:flex;flex-wrap:wrap;gap:4px">'+regs.map(r=>'<span style="padding:2px 6px;border-radius:4px;font-size:8px;font-weight:700;background:#0E749010;color:#155E75;border:1px solid #0E749020">'+r+'</span>').join('')+'</div></div>':'';})()}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        ${aria.dimensions.map(d=>`<div style="padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #E2E8F0">
          <div style="font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:.5px">${d.name}</div>
          <div style="font-size:14px;font-weight:700;color:#0F172A;font-family:'DM Mono',monospace">${d.score}<span style="font-size:10px;color:#94A3B8">/${d.max}</span></div>
        </div>`).join('')}
      </div>
      <p style="font-size:10px;color:#94A3B8;margin-top:8px;line-height:1.5">ARIA Score™ determines engagement scope and pricing based on organizational complexity. Dimensions: size, revenue, regulatory exposure, technical footprint, data sensitivity, AI adoption scope. Proprietary methodology of BHT Solutions LLC.</p>
    </div>
    <h2>Priority Gap Analysis</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[...domains].sort((a,b)=>a.score-b.score).slice(0,3).map((d,i)=>`<div class="card">
      <div style="font-size:10px;font-weight:700;color:#E11D48;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Priority ${i+1}</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:6px">${d.name} · ${d.score}%</div>
      <p style="font-size:11px;color:#64748B;line-height:1.6">${cta.domainInsight(d.name, d.score)}</p></div>`).join('')}
    </div>
    <div class="page-break"></div>
    <h2>The Honest Assessment</h2>
    <div style="padding:20px;border-radius:14px;background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:16px">
      <p class="insight">${cta.honest}</p><p class="insight">${cta.practical}</p>
    </div>
    <h2>Recommended Next Step</h2>
    <div style="padding:20px;border-radius:14px;background:#F0FDFA;border:1px solid #CCFBF1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div><div style="font-size:16px;font-weight:700;color:#0F766E">${cta.pkg.name}</div>
        <div style="font-size:13px;color:#0D9488;font-weight:600;font-family:'DM Mono',monospace">${cta.pkg.price}</div></div></div>
      <p class="insight">${cta.pkg.what}</p>
      <p style="font-size:12px;color:#0F766E;font-weight:600;margin-top:8px;padding:10px;background:#ECFDF5;border-radius:8px">${cta.pkg.value}</p>
      <div style="margin-top:14px;padding:14px;background:#fff;border-radius:10px;border:1px solid #E2E8F0">
        <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:4px">What the free assessment told you vs. what a Quick Scan reveals:</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px">
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600;color:#94A3B8;width:40%"></td><td style="padding:6px;font-weight:700;color:#94A3B8">Free Assessment</td><td style="padding:6px;font-weight:700;color:#0D9488">Quick Scan ($2,500)</td></tr>
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600">Method</td><td style="padding:6px;color:#64748B">Self-reported survey</td><td style="padding:6px;color:#0F172A">Our scripts on your tenant</td></tr>
          <tr style="border-bottom:1px solid #eee"><td style="padding:6px;font-weight:600">Data Finding</td><td style="padding:6px;color:#64748B">"Data Foundation: ${domains.find(d=>d.name==='Data Foundation')?.score||0}%"</td><td style="padding:6px;color:#0F172A">"14K ungoverned files, 3 DLP gaps, $47K unused licenses"</td></tr>
          <tr><td style="padding:6px;font-weight:600">Deliverable</td><td style="padding:6px;color:#64748B">This PDF</td><td style="padding:6px;color:#0F172A">Evidence-based report + exec briefing</td></tr>
        </table>
      </div>
      <div style="margin-top:14px;padding:14px;background:#fff;border-radius:10px;border:1px solid #E2E8F0">
        <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px">The next step costs nothing.</div>
        <p style="font-size:12px;color:#64748B;line-height:1.6">30-minute discovery call. We walk through this report together. No pitch, no commitment.</p>
        <div style="margin-top:8px;font-size:13px;font-weight:700;color:#0D9488">Schedule → thebhtlabs.com · info@bhtsolutions.com · (513) 638-1986</div>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0">
      <div style="font-size:11px;font-weight:700;margin-bottom:6px">About BHT Solutions</div>
      <p style="font-size:10px;color:#64748B;line-height:1.5">SBA 8(a) · EDWOSB · WOSB · MS Azure Solutions Architect · CyberAB RP · Wiz Certified · CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · Active clearance, Secret eligible</p>
      <p style="font-size:10px;color:#64748B;line-height:1.5;margin-top:4px">Azure Gov · M365 GCC/GCC-High · CMMC L2 · FedRAMP Advisory · Copilot Studio · Power Platform · AI Governance (NIST RMF)</p>
      <p style="font-size:8px;color:#94A3B8;font-style:italic;margin-top:6px">Results vary. Industry stats from McKinsey (2025), Gartner (2024), S&P Global (2025), EY (2025), BCG (2024). Pricing illustrative.</p>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.1)">
        <p style="font-size:7px;color:#A8A29E;line-height:1.6">© ${new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC d/b/a BHT Solutions. All rights reserved. ARIA Score™, the AI Readiness Assessment framework, 
        scoring methodology, and all associated intellectual property are proprietary to BHT Solutions LLC. This report is licensed for internal use by ${co} only. 
        Redistribution, reproduction, or derivative works require written authorization. Protected under U.S. copyright law and the Defend Trade Secrets Act. Report ID: ${reportId}</p>
      </div>
    </div>
    <div style="text-align:center;margin-top:20px" class="no-print">
      <button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0D9488;color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit">Save as PDF (Ctrl+P)</button>
    </div></body></html>`);
    w.document.close();
  };

  // ═══ LANDING ═══
  if (phase==="landing") return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:720,margin:"0 auto",padding:"0 24px",textAlign:"center"}}>
        <SH tag="Takes 5 minutes · Used by 200+ organizations" title="Is your business AI-ready?" desc="7 domains · 35 questions · Personalized report with industry benchmarks, gap analysis, and recommended next step." />
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"48px 40px",boxShadow:C.shadowMd}}>
          <div style={{fontSize:48,marginBottom:16}}>◈</div>
          <h3 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy,marginBottom:10,direction:isRtl?"rtl":"ltr"}}>{_("assessTitle")}</h3>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:20}}>
            {["Personalized score vs industry peers","Priority gap analysis with cited research","Recommended engagement + pricing","Downloadable PDF for your leadership team"].map(b=>(
              <div key={b} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textMuted,fontFamily:F.b}}>
                <span style={{color:C.teal,fontWeight:800}}>✓</span>{b}
              </div>
            ))}
          </div>
          <p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,marginBottom:24}}>Free · No credit card · Results in 5 minutes · PDF you can share with your board</p>
          <button onClick={()=>setPhase("intake")} style={{padding:"14px 40px",borderRadius:12,cursor:"pointer",fontSize:16,fontWeight:700,fontFamily:F.h,border:"none",background:C.teal,color:"#fff",boxShadow:`0 4px 16px ${C.teal}33`}}>
            Start Assessment →
          </button>
        </div>
      </div>
    </section>
  );

  // ═══ INTAKE FORM ═══
  if (phase==="intake") {
    const DISPOSABLE = /mailinator|guerrillamail|tempmail|throwaway|fakeinbox|yopmail|sharklasers|trashmail|maildrop|dispostable|getnada|10minutemail|temp-mail/i;
    const validate = () => {
      const n = intake.name.trim();
      if(!n) return "Your full name is required";
      if(n.split(/\s+/).length < 2) return "Please enter your full name (first and last)";
      if(n.length < 4) return "Please enter your real name";
      if(/^(test|asdf|aaa|xxx|abc|fake|none|na|n\/a)/i.test(n)) return "Please enter your real name for a personalized report";
      const em = intake.email.trim().toLowerCase();
      if(!em || !em.includes("@") || !em.includes(".")) return "Valid business email required";
      if(em.match(/@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|zoho|mail|yandex|live|msn|comcast|att|verizon|cox)\./i)) return "Please use your work email so we can personalize your report to your organization";
      if(DISPOSABLE.test(em)) return "Disposable email addresses are not accepted";
      const domain = em.split("@")[1]?.split(".")[0];
      if(domain && domain.length < 3) return "Please use a valid business email";
      const co = intake.company.trim();
      if(!co) return "Company name is required";
      if(co.length < 2) return "Please enter your real company name";
      if(/^(test|asdf|aaa|xxx|abc|fake|none|na|n\/a|company|my company)/i.test(co)) return "Please enter your real company name for accurate benchmarking";
      if(!intake.industry) return "Select your industry for benchmark comparison";
      if(!intake.employees) return "Select employee range";
      const ph = intake.phone.replace(/\D/g,'');
      if(!ph || ph.length < 10) return "Valid phone number required (10+ digits) — we'll use it to walk through your results";
      return "";
    };
    // Auto-suggest company from email domain
    const onEmailBlur = () => {
      const em = intake.email.trim().toLowerCase();
      if(em.includes("@") && !intake.company.trim()) {
        const domain = em.split("@")[1]?.split(".")[0];
        if(domain && domain.length >= 3 && !/gmail|yahoo|hotmail|outlook|aol/i.test(domain)) {
          const suggested = domain.charAt(0).toUpperCase() + domain.slice(1);
          setCompanySuggest(suggested);
        }
      }
    };
    const acceptSuggest = () => { upI("company", companySuggest); setCompanySuggest(""); };
    const proceed = () => { const err = validate(); if(err){setIntakeErr(err);return;} setIntakeErr(""); setStartTime(Date.now()); setPhase("questions"); };
    const formatPhone = (v) => {
      const d = v.replace(/\D/g,'').slice(0,11);
      if(d.length<=3) return d;
      if(d.length<=6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
      return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    };
    const inp = {padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b,outline:"none",width:"100%",background:C.bg,color:C.text};
    const sel = {...inp, cursor:"pointer"};
    const lbl = {fontSize:11,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4};
    return (
      <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"0 24px"}}>
          <SH tag="Step 1 of 2 — About You" title="Tell us about your organization" desc="So we can benchmark your results against industry peers and personalize your report." />
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px",boxShadow:C.shadowMd}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><label style={lbl}>Full Name *</label>
                <input value={intake.name} onChange={e=>upI("name",e.target.value)} placeholder="Jane Smith" style={inp}/></div>
              <div><label style={lbl}>Business Email *</label>
                <input type="email" value={intake.email} onChange={e=>upI("email",e.target.value)} onBlur={onEmailBlur} placeholder="jane@company.com" style={inp}/></div>
              <div><label style={lbl}>Job Title</label>
                <select value={intake.title} onChange={e=>upI("title",e.target.value)} style={sel}>
                  <option value="">Select title...</option>{JOB_TITLES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div><label style={lbl}>Direct Phone *</label>
                <input type="tel" value={intake.phone} onChange={e=>upI("phone",formatPhone(e.target.value))} placeholder="(555) 123-4567" style={inp}/>
                <span style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:2,display:"block"}}>For your report walkthrough — we don't cold call</span></div>
              <div style={{position:"relative"}}>
                <label style={lbl}>Company *</label>
                <input value={intake.company} onChange={e=>{upI("company",e.target.value);setCompanySuggest("");}} placeholder="Acme Corp" style={inp}/>
                {companySuggest && !intake.company && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,marginTop:2}}>
                    <button onClick={acceptSuggest} style={{width:"100%",padding:"8px 14px",borderRadius:8,border:`1px solid ${C.teal}33`,background:C.tealBg,fontSize:12,fontWeight:600,color:C.teal,cursor:"pointer",textAlign:"left",fontFamily:F.h}}>
                      Did you mean <strong>{companySuggest}</strong>?
                    </button>
                  </div>
                )}
              </div>
              <div><label style={lbl}>Industry *</label>
                <select value={intake.industry} onChange={e=>{upI("industry",e.target.value); if(locale==='us'){if(e.target.value==='govdef') upI("sector","fed_civilian"); else if(intake.sector.startsWith('fed_')) upI("sector","commercial");}}} style={sel}>
                  <option value="">Select industry...</option>{activeIndustries.map(i=><option key={i.v} value={i.v}>{i.l}</option>)}</select></div>
              {locale==='us' && <div><label style={lbl}>Sector <span style={{fontSize:10,color:C.textFaint,fontWeight:400}}>(affects scope & pricing)</span></label>
                <select value={intake.sector} onChange={e=>upI("sector",e.target.value)} style={sel}>
                  <option value="commercial">Commercial / Private Sector</option>
                  <option value="fed_civilian">Federal Civilian (FISMA, NIST 800-53)</option>
                  <option value="fed_defense">Federal Defense / DoD (CMMC, NIST 800-171, CUI)</option>
                  <option value="fed_classified">Federal Classified / IC (ITAR, clearance-required)</option>
                </select></div>}
              {locale==='eu' && <div><label style={lbl}>AI Risk Level <span style={{fontSize:10,color:C.textFaint,fontWeight:400}}>(EU AI Act classification)</span></label>
                <select value={intake.sector} onChange={e=>upI("sector",e.target.value)} style={sel}>
                  <option value="commercial">Minimal / Limited Risk AI</option>
                  <option value="eu_high_risk">High-Risk AI (Annex III systems)</option>
                </select></div>}
              <div><label style={lbl}>Employees *</label>
                <select value={intake.employees} onChange={e=>upI("employees",e.target.value)} style={sel}>
                  <option value="">Select range...</option>{EMP_RANGES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
              <div><label style={lbl}>Annual Revenue</label>
                <select value={intake.revenue} onChange={e=>upI("revenue",e.target.value)} style={sel}>
                  <option value="">Select range (optional)...</option>{activeRevRanges.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div style={{marginTop:20}}>
              <label style={{...lbl,marginBottom:8}}>Top Business Pains (select up to 3)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {activePains.map(p=>(
                  <button key={p} onClick={()=>togglePain(p)}
                    style={{padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:F.h,cursor:"pointer",transition:"all .15s",
                      background:intake.pains.includes(p)?C.teal+"0D":"transparent",color:intake.pains.includes(p)?C.teal:C.textMuted,
                      border:`1px solid ${intake.pains.includes(p)?C.teal+"33":C.border}`}}>{p}</button>
                ))}
              </div>
            </div>
            {intakeErr && <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:C.rose+"08",border:`1px solid ${C.rose}20`}}>
              <p style={{color:C.rose,fontSize:12,fontWeight:600,fontFamily:F.m,margin:0}}>{intakeErr}</p>
            </div>}
            <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>setPhase("landing")} style={{padding:"10px 20px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted}}>← Back</button>
              <button onClick={proceed} style={{padding:"12px 32px",borderRadius:10,border:"none",background:C.teal,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.h}}>
                Continue to Assessment →
              </button>
            </div>
            <p style={{fontSize:10,color:C.textFaint,fontFamily:F.m,marginTop:12,textAlign:"center"}}>Your data is used only to personalize your report. We don't sell or share your information.</p>
          </div>
        </div>
      </section>
    );
  }

  // ═══ RESULTS ═══
  if (phase==="results") {
    const sc = overall(), lv = lvl(sc);
    const domainResults = AQ.map((d,i)=>({name:d.d,score:ds(i)}));
    const dScores = {data:ds(0),process:ds(1),tech:ds(2),people:ds(3),strategy:ds(4),governance:ds(5),usecase:ds(6)};
    const aria = calcARIA(intake, dScores, locale);
    const cta = getCTA(sc, domainResults, aria);
    const sorted = [...domainResults].sort((a,b)=>a.score-b.score);
    if(!saved && !saving) saveResults(); // auto-save on results view
    return (
      <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
          <SH tag={`Results for ${intake.company}`} title={_("resultsTitle")} />
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.shadowMd}}>
            {/* Score + Industry benchmark */}
            <div style={{padding:"32px 40px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:110,height:110,borderRadius:"50%",background:`conic-gradient(${lv.c} ${sc*3.6}deg, ${C.bgMuted} 0deg)`,position:"relative"}}>
                    <div style={{width:88,height:88,borderRadius:"50%",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                      <span style={{color:lv.c,fontSize:32,fontWeight:800,fontFamily:F.m}}>{sc}</span>
                      <span style={{color:C.textFaint,fontSize:10,fontFamily:F.m}}>/100</span>
                    </div>
                  </div>
                  <div style={{marginTop:8}}><Tag color={lv.c}>{lv.l}</Tag></div>
                </div>
                <div style={{flex:1,minWidth:240}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:8}}>{intake.company} vs. {indObj.l} average</p>
                  <div style={{position:"relative",height:28,background:C.bgMuted,borderRadius:8,overflow:"visible"}}>
                    <div style={{height:"100%",width:`${sc}%`,background:lv.c,borderRadius:8,transition:"width .6s"}} />
                    <div style={{position:"absolute",left:`${indObj.avg}%`,top:-4,height:36,width:2,background:C.navy,borderRadius:1}} />
                    <span style={{position:"absolute",left:`${indObj.avg}%`,top:-18,transform:"translateX(-50%)",fontSize:9,fontWeight:700,fontFamily:F.m,color:C.navy,whiteSpace:"nowrap"}}>Industry: {indObj.avg}%</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                    <span style={{fontSize:11,fontWeight:600,color:lv.c,fontFamily:F.m}}>You: {sc}%</span>
                    <span style={{fontSize:11,color:C.textFaint,fontFamily:F.m}}>{sc>=indObj.avg?"Above average":"Below average"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Domain breakdown */}
            <div style={{padding:28}}>
              <h4 style={{fontSize:13,fontWeight:700,fontFamily:F.m,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Domain Breakdown</h4>
              {AQ.map((d,i) => {
                const s = ds(i), c = s>=80?C.teal:s>=65?C.blue:s>=40?C.coral:C.rose;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:i<6?`1px solid ${C.borderLight}`:"none"}}>
                    <span style={{fontSize:14,fontWeight:600,color:C.navy,flex:1,fontFamily:F.h}}>{d.d}</span>
                    <div style={{width:160,height:6,background:C.bgMuted,borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${s}%`,height:"100%",borderRadius:3,background:c,transition:"width .6s ease"}} />
                    </div>
                    <span style={{color:c,fontSize:14,fontWeight:700,fontFamily:F.m,width:40,textAlign:"right"}}>{s}%</span>
                  </div>
                );
              })}
              {/* ARIA Score™ — Engagement Complexity */}
              <div style={{marginTop:24,padding:20,borderRadius:14,background:`${aria.tierColor}05`,border:`1px solid ${aria.tierColor}20`}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:`${aria.tierColor}12`,border:`2px solid ${aria.tierColor}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",flexShrink:0}}>
                    <span style={{fontSize:18,fontWeight:800,color:aria.tierColor,fontFamily:F.m}}>{aria.total}</span>
                    <span style={{fontSize:8,fontWeight:700,color:aria.tierColor}}>/30</span>
                  </div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:aria.tierColor}}>ARIA Score™: {aria.tierLabel} Complexity</h4>
                    <p style={{fontSize:11,color:C.textMuted,fontFamily:F.m}}>AI Readiness & Implementation Assessment™ · Pricing scaled to your environment</p>
                    {aria.sectorMult > 1 && <p style={{fontSize:10,fontWeight:700,fontFamily:F.m,color:"#DC2626",marginTop:4,padding:"4px 10px",background:"rgba(220,38,38,.06)",borderRadius:6,display:"inline-block"}}>
                      {aria.sectorLabel} engagement · {aria.sectorMult}x sector premium applied{aria.sectorDesc ? ` — ${aria.sectorDesc}` : ''}
                    </p>}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {aria.dimensions.map(d=>(
                    <div key={d.name} style={{padding:"6px 8px",borderRadius:8,background:C.bg,border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:9,color:C.textFaint,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,fontFamily:F.m}}>{d.name}</div>
                      <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                        <span style={{fontSize:16,fontWeight:800,color:C.navy,fontFamily:F.m}}>{d.score}</span>
                        <span style={{fontSize:10,color:C.textFaint,fontFamily:F.m}}>/{d.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Applicable Regulatory Frameworks */}
                {(()=>{
                  const regs = loc.regIndustryMap?.[intake.industry] || loc.regulatory || [];
                  return regs.length > 0 && <div style={{marginTop:10,padding:10,borderRadius:8,background:C.bgSoft,border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:9,fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontFamily:F.m}}>Applicable Standards for {indObj.l}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {regs.map(r=><span key={r} style={{padding:"3px 8px",borderRadius:5,fontSize:9,fontWeight:700,background:C.teal+"0A",color:C.tealDark,border:`1px solid ${C.teal}20`,fontFamily:F.m}}>{r}</span>)}
                    </div>
                  </div>;
                })()}
                {/* Pricing tiers */}
                <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[
                    {n:"Quick Scan",p:aria.pricing.scan,h:aria.pricing.scan.hours,rec:sc<65},
                    {n:"Readiness Sprint",p:aria.pricing.sprint,h:aria.pricing.sprint.hours,rec:sc>=65&&sc<80},
                    {n:"Launchpad",p:aria.pricing.launchpad,h:aria.pricing.launchpad.hours,rec:sc>=80,mo:true},
                  ].map(t=>(
                    <div key={t.n} style={{padding:12,borderRadius:10,background:t.rec?C.teal+"08":C.bg,border:`1px solid ${t.rec?C.teal+"30":C.border}`,textAlign:"center"}}>
                      {t.rec && <div style={{fontSize:8,fontWeight:800,color:C.teal,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontFamily:F.m}}>Recommended</div>}
                      <div style={{fontSize:11,fontWeight:700,color:C.navy,fontFamily:F.h}}>{t.n}</div>
                      <div style={{fontSize:16,fontWeight:800,color:t.rec?C.teal:C.navy,fontFamily:F.m}}>{aria.fmt(t.p.adjusted)}{t.mo?"/mo":""}</div>
                      <div style={{fontSize:10,color:C.textFaint,fontFamily:F.m}}>{t.h} hours</div>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:8,lineHeight:1.5}}>Pricing based on ARIA Score™ ({aria.total}/30, {aria.mult}x complexity{aria.sectorMult > 1 ? ` × ${aria.sectorMult}x ${aria.sectorLabel} = ${aria.combinedMult}x total` : ''}). Final scope confirmed in discovery call. ARIA Score™ is proprietary methodology of BHT Solutions LLC.</p>
              </div>

              {/* Honest Assessment */}
              <div style={{marginTop:24,padding:20,borderRadius:14,background:C.bgSoft,border:`1px solid ${C.border}`}}>
                <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:8}}>The Honest Assessment</h4>
                <p style={{fontSize:13,color:C.textMuted,lineHeight:1.7,marginBottom:8}}>{cta.honest}</p>
                <p style={{fontSize:12,color:C.textSoft,lineHeight:1.7}}>{cta.practical}</p>
              </div>
              {/* Priority Gaps */}
              <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {sorted.slice(0,2).map((d,i)=>(
                  <div key={d.name} style={{padding:16,borderRadius:12,border:`1px solid ${d.score<40?C.rose+"30":C.coral+"30"}`,background:d.score<40?C.rose+"05":C.coral+"05"}}>
                    <div style={{fontSize:10,fontWeight:700,fontFamily:F.m,color:C.rose,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Priority {i+1}</div>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:6}}>{d.name} · {d.score}%</div>
                    <p style={{fontSize:11,color:C.textMuted,lineHeight:1.6}}>{cta.domainInsight(d.name, d.score)}</p>
                  </div>
                ))}
              </div>
              {/* Recommended + Value justification */}
              <div style={{marginTop:16,padding:20,borderRadius:14,background:C.tealBg,border:`1px solid ${C.teal}15`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.tealDark}}>Recommended: {cta.pkg.name}</h4>
                    <span style={{fontSize:13,fontWeight:600,fontFamily:F.m,color:C.teal}}>{cta.pkg.price}</span>
                  </div>
                </div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.7,marginBottom:8}}>{cta.pkg.what}</p>
                <p style={{fontSize:11,fontWeight:600,color:C.tealDark,padding:"8px 12px",background:C.teal+"08",borderRadius:8}}>{cta.pkg.value}</p>
                {/* Free vs Paid comparison */}
                <div style={{marginTop:12,padding:14,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>What this assessment told you vs. what a Quick Scan reveals:</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,fontSize:11}}>
                    <div style={{padding:6,fontWeight:700,color:C.textFaint}}></div>
                    <div style={{padding:6,fontWeight:700,color:C.textFaint,borderBottom:`1px solid ${C.border}`}}>Free (this)</div>
                    <div style={{padding:6,fontWeight:700,color:C.teal,borderBottom:`1px solid ${C.border}`}}>Quick Scan</div>
                    <div style={{padding:6,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Method</div>
                    <div style={{padding:6,color:C.textSoft,borderBottom:`1px solid ${C.borderLight}`}}>Self-reported survey</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Our scripts on your systems</div>
                    <div style={{padding:6,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>Finding</div>
                    <div style={{padding:6,color:C.textSoft,borderBottom:`1px solid ${C.borderLight}`}}>"Data Foundation: {domainResults.find(d=>d.name==='Data Foundation')?.score||0}%"</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600,borderBottom:`1px solid ${C.borderLight}`}}>"14K files, 3 DLP gaps, $47K savings"</div>
                    <div style={{padding:6,fontWeight:600}}>Output</div>
                    <div style={{padding:6,color:C.textSoft}}>PDF report</div>
                    <div style={{padding:6,color:C.navy,fontWeight:600}}>Evidence + exec briefing</div>
                  </div>
                </div>
                <div style={{marginTop:12,padding:14,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`}}>
                  <p style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:4}}>The next step costs nothing.</p>
                  <p style={{fontSize:12,color:C.textSoft,lineHeight:1.6}}>30-minute discovery call. We walk through this report and tell you what we'd prioritize. No pitch.</p>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:16}}>
                <button onClick={()=>{setPhase("landing");setStep(0);setAns({});setSaved(false);}}
                  style={{padding:"10px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted}}>{_("retake")}</button>
                <button onClick={generatePDF}
                  style={{padding:"10px",borderRadius:10,border:"none",background:C.teal,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,color:"#fff"}}>{_("downloadPdf")}</button>
                <button onClick={bookDiscovery} disabled={discoveryStatus==="sent"||discoveryStatus==="sending"}
                  style={{padding:"10px",borderRadius:10,border:"none",background:discoveryStatus==="sent"?"#10B981":C.violetBg,cursor:discoveryStatus==="sent"?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,
                    color:discoveryStatus==="sent"?"#fff":C.violet}}>
                  {discoveryStatus===""?_("bookDiscovery"):discoveryStatus==="sending"?_("bookSending"):discoveryStatus==="sent"?_("bookSent"):_("bookRetry")}
                </button>
              </div>
              <p style={{fontSize:9,color:C.textFaint,fontFamily:F.m,marginTop:12,lineHeight:1.5,fontStyle:"italic"}}>Results vary. Stats from McKinsey (2025), Gartner (2024), S&P Global (2025), EY (2025), BCG (2024). Pricing illustrative.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ═══ QUESTIONS ═══
  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <SH tag={`Step 2 of 2 — ${intake.company}`} title="AI Readiness Questions" />
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:C.shadowMd}}>
          <div style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Tag color={C.teal}>Domain {step+1}/7</Tag>
              <span style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy}}>{cur.d}</span>
            </div>
            <span style={{color:C.textFaint,fontSize:12,fontFamily:F.m}}>{answered}/{total}</span>
          </div>
          <div style={{height:3,background:C.bgMuted}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${C.teal},${C.blue})`,width:`${(step/7)*100}%`,transition:"width .3s"}} />
          </div>
          <div style={{padding:"20px 24px"}}>
            {cur.q.map((q, qi) => {
              const val = ans[step+"-"+qi];
              return (
                <div key={qi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:qi<4?`1px solid ${C.borderLight}`:"none",gap:12,flexWrap:"wrap"}}>
                  <span style={{color:C.text,fontSize:14,flex:1,lineHeight:1.5,minWidth:200}}>{q}</span>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    {[{l:"Yes",v:"yes",c:C.teal},{l:"Partial",v:"partial",c:C.coral},{l:"No",v:"no",c:C.rose}].map(o => (
                      <button key={o.v} onClick={()=>setAns(p=>({...p,[step+"-"+qi]:o.v}))}
                        style={{padding:"7px 16px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:F.m,fontWeight:600,transition:"all .15s",
                          background:val===o.v?o.c+"12":"transparent",color:val===o.v?o.c:C.textFaint,
                          border:`1px solid ${val===o.v?o.c+"33":"transparent"}`}}>{o.l}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`}}>
            <button disabled={step===0} onClick={()=>step===0?setPhase("intake"):setStep(step-1)}
              style={{padding:"10px 22px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bg,cursor:step===0?"default":"pointer",fontSize:13,fontWeight:600,fontFamily:F.h,color:C.textMuted,opacity:step===0?.4:1}}>
              ← Back
            </button>
            {step < 6 ? (
              <button onClick={()=>setStep(step+1)}
                style={{padding:"10px 28px",borderRadius:10,border:"none",background:C.teal,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h}}>
                Next Domain →
              </button>
            ) : (
              <button onClick={()=>setPhase("results")}
                style={{padding:"10px 28px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.teal},${C.blue})`,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h}}>
                See My Results →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════ CASE STUDIES — YOUR WORK FIRST ═══════════════ */
function Packages({id}) {
  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Transparent Pricing" title="Choose your AI journey" desc="Start small, prove value, scale with confidence. No lock-ins." />
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {PKGS.map((p, i) => (
            <div key={i} style={{background:C.bg,border:`1px solid ${p.pop?p.color+"33":C.border}`,borderRadius:18,padding:28,position:"relative",display:"flex",flexDirection:"column",boxShadow:p.pop?C.shadowMd:C.shadow,transition:"all .2s"}}>
              {p.pop && <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",padding:"4px 16px",borderRadius:"0 0 10px 10px",background:p.color,color:"#fff",fontSize:11,fontWeight:700,fontFamily:F.m}}>MOST POPULAR</div>}
              <Tag color={p.color}>{p.name}</Tag>
              <div style={{marginTop:16,marginBottom:8}}>
                <span style={{fontSize:32,fontWeight:800,fontFamily:F.m,color:C.navy}}>{p.price}</span>
                <span style={{color:C.textFaint,fontSize:13,fontFamily:F.m}}>{p.per}</span>
              </div>
              <p style={{color:C.textMuted,fontSize:13,lineHeight:1.6,marginBottom:20}}>{p.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
                {p.feats.map(f => (
                  <div key={f} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <span style={{color:p.color,fontSize:12,marginTop:2,flexShrink:0}}>✓</span>
                    <span style={{color:C.textSoft,fontSize:13,lineHeight:1.5}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>document.getElementById("partner")?.scrollIntoView({behavior:"smooth"})}
                style={{marginTop:20,width:"100%",padding:"12px",borderRadius:12,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,transition:"all .2s",textAlign:"center",
                  background:p.pop?p.color:"transparent",color:p.pop?"#fff":p.color,border:p.pop?"none":`1.5px solid ${p.color}33`,
                  boxShadow:p.pop?`0 4px 12px ${p.color}22`:"none"}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ LEARNING — REAL RESOURCES, NOT EMPTY PROMISES ═══════════════ */
function Partner({id}) {
  const [form, setForm] = useState({name:"",email:"",phone:"",company:"",interest:"",message:"",website:""});
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState({});
  const [tab, setTab] = useState("contact"); // contact | partner
  const markTouched = (k) => setTouched(p=>({...p,[k]:true}));
  const isValid = (k) => { if(k==="email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[k]); return form[k].trim().length>0; };

  // Partner application state
  const [pApp, setPApp] = useState({
    name:"",email:"",phone:"",company:"",website_url:"",
    country:"",city:"",
    company_size:"",years_in_business:"",
    ms_partnership:"",certifications:[],
    industries_served:[],
    current_services:"",
    annual_revenue:"",
    why_partner:"",
    existing_clients:"",
    delivery_team_size:"",
    honeypot:""
  });
  const [pStatus, setPStatus] = useState("");
  const [pTouched, setPTouched] = useState({});
  const pMark = (k) => setPTouched(p=>({...p,[k]:true}));
  const pValid = (k) => { if(k==="email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pApp[k]); return pApp[k] && String(pApp[k]).trim().length>0; };
  const upP = (k,v) => setPApp(p=>({...p,[k]:v}));
  const togglePCert = (c) => setPApp(p=>({...p,certifications:p.certifications.includes(c)?p.certifications.filter(x=>x!==c):[...p.certifications,c]}));
  const togglePInd = (c) => setPApp(p=>({...p,industries_served:p.industries_served.includes(c)?p.industries_served.filter(x=>x!==c):[...p.industries_served,c]}));

  const inputStyle = (k, req) => ({
    padding:"12px 16px",borderRadius:10,fontSize:14,fontFamily:F.b,outline:"none",transition:"border-color .2s, box-shadow .2s",
    border:`1.5px solid ${(tab==='contact'?touched:pTouched)[k]&&req&&!(tab==='contact'?isValid:pValid)(k)?C.rose:C.border}`,
    boxShadow:(tab==='contact'?touched:pTouched)[k]&&req&&!(tab==='contact'?isValid:pValid)(k)?`0 0 0 3px ${C.rose}15`:"none",
    background:C.bg
  });
  const pInputStyle = (k, req) => ({
    padding:"12px 16px",borderRadius:10,fontSize:14,fontFamily:F.b,outline:"none",transition:"border-color .2s, box-shadow .2s",
    border:`1.5px solid ${pTouched[k]&&req&&!pValid(k)?C.rose:C.border}`,
    boxShadow:pTouched[k]&&req&&!pValid(k)?`0 0 0 3px ${C.rose}15`:"none",
    background:C.bg
  });
  const labelStyle = {fontSize:12,fontWeight:600,fontFamily:F.h,color:C.textMuted,marginBottom:4,display:"block"};

  const submit = async (e) => {
    e.preventDefault();
    setTouched({name:true,email:true,message:true});
    if(!form.name.trim()||!form.email.trim()||!form.message.trim()){setStatus("fill");return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setStatus("email");return}
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)});
      if(r.ok){setStatus("success");setForm({name:"",email:"",phone:"",company:"",interest:"",message:"",website:""});setTouched({});}
      else {setStatus("error");}
    } catch(e) {setStatus("error");}
  };

  const submitPartner = async (e) => {
    e.preventDefault();
    setPTouched({name:true,email:true,company:true,country:true,why_partner:true,current_services:true,delivery_team_size:true});
    if(!pApp.name.trim()||!pApp.email.trim()||!pApp.company.trim()||!pApp.country.trim()||!pApp.why_partner.trim()||!pApp.current_services.trim()||!pApp.delivery_team_size.trim()){setPStatus("fill");return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pApp.email)){setPStatus("email");return}
    if(pApp.honeypot){setPStatus("success");return}
    setPStatus("sending");
    try {
      const r = await fetch("/api/partner", {method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...pApp,certifications:pApp.certifications.join(", "),industries_served:pApp.industries_served.join(", ")})});
      if(r.ok){setPStatus("success");setPApp({name:"",email:"",phone:"",company:"",website_url:"",country:"",city:"",company_size:"",years_in_business:"",ms_partnership:"",certifications:[],industries_served:[],current_services:"",annual_revenue:"",why_partner:"",existing_clients:"",delivery_team_size:"",honeypot:""});setPTouched({});}
      else setPStatus("error");
    } catch(e) {setPStatus("error");}
  };

  const CERTS_LIST = ["Microsoft Solutions Partner","Azure Solutions Architect","M365 Certified","Power Platform","Copilot Studio","CyberAB RP/RPO","ISO 27001","SOC 2","CMMC RP/RPO","PMP/PRINCE2","ITIL","AWS Certified","None yet"];
  const IND_LIST = ["Financial Services","Healthcare","Government/Defense","Technology/SaaS","Manufacturing","Legal","Insurance","Energy","Education","Retail","Other"];

  return (
    <section id={id} style={{padding:"80px 0",background:C.bgSoft}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Let's Build Together" title="Partner with TheBHTLabs" desc="Whether you're looking to engage us for a project or join as a channel partner — start here." />

        {/* Tab switcher */}
        <div style={{display:"flex",gap:4,marginBottom:24,background:C.bgMuted,padding:4,borderRadius:12,maxWidth:440}}>
          {[{k:"contact",l:"📞 Get in Touch",d:"Hire us or ask a question"},{k:"partner",l:"🤝 Apply to Partner",d:"Join our partner network"}].map(t=>(
            <button key={t.k} onClick={()=>{setTab(t.k);setStatus("");setPStatus("");}}
              style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",transition:"all .2s",
                background:tab===t.k?C.bg:"transparent",boxShadow:tab===t.k?C.shadow:"none",
                color:tab===t.k?C.navy:C.textMuted,fontFamily:F.h,fontSize:13,fontWeight:tab===t.k?700:500}}>
              {t.l}
            </button>
          ))}
        </div>

        {tab==="contact" ? (
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <form onSubmit={submit} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:28,boxShadow:C.shadowMd}}>
              <h3 style={{fontSize:20,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:20}}>Get in touch</h3>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[{l:"Full Name",p:"Your full name",k:"name",req:true},{l:"Email Address",p:"you@company.com",k:"email",req:true},{l:"Phone",p:"(555) 123-4567",k:"phone",req:false},{l:"Company",p:"Company name (optional)",k:"company",req:false}].map(f=>(
                  <div key={f.k}>
                    <label style={labelStyle}>{f.l} {f.req&&<span style={{color:C.rose}}>*</span>}</label>
                    <input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} onBlur={()=>f.req&&markTouched(f.k)}
                      placeholder={f.p} required={f.req}
                      style={{...inputStyle(f.k,f.req),width:"100%",boxSizing:"border-box"}} />
                    {touched[f.k]&&f.req&&!isValid(f.k)&&<span style={{fontSize:11,color:C.rose,marginTop:2,display:"block"}}>{f.k==="email"?"Please enter a valid email":"This field is required"}</span>}
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>I'm interested in</label>
                  <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}
                    style={{...inputStyle("interest",false),width:"100%",boxSizing:"border-box",color:form.interest&&form.interest!=="I'm interested in..."?C.text:C.textFaint,cursor:"pointer"}}>
                    {["I'm interested in...","AI Readiness Assessment","Copilot Studio / Automation","CMMC / Compliance","AI Upskilling / Training","Partnership / Subcontracting","Hiring BHT","Just Exploring"].map(o=>(
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tell us about your project <span style={{color:C.rose}}>*</span></label>
                  <textarea rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} onBlur={()=>markTouched("message")}
                    placeholder="Describe your project, goals, timeline, or any questions you have..."
                    required
                    style={{...inputStyle("message",true),width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:120,lineHeight:1.6}} />
                  {touched.message&&!isValid("message")&&<span style={{fontSize:11,color:C.rose,marginTop:2,display:"block"}}>Please describe your project</span>}
                </div>
                <div style={{position:'absolute',left:'-9999px',opacity:0,height:0,overflow:'hidden'}} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} />
                </div>
                <button type="submit" disabled={status==="sending"}
                  style={{padding:"14px",borderRadius:12,border:"none",cursor:status==="sending"?"wait":"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,
                    background:status==="sending"?C.textMuted:C.teal,color:"#fff",boxShadow:`0 4px 14px ${C.teal}22`,textAlign:"center",transition:"background .2s",marginTop:4}}>
                  {status==="sending" ? "Sending..." : "Book a Discovery Call →"}
                </button>
                {status===""&&<p style={{color:C.textFaint,fontSize:11,fontFamily:F.m,marginTop:8,textAlign:"center"}}>We respond within 1 business day. 30-min call, no pitch, no commitment.</p>}
                {status==="success"&&<div style={{textAlign:"center",color:C.teal,fontSize:14,fontWeight:600,padding:"10px 16px",background:C.teal+"0A",borderRadius:10,border:`1px solid ${C.teal}20`}}>✓ Sent! We'll respond within 24 hours.</div>}
                {status==="fill"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please fill in all required fields.</p>}
                {status==="email"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please enter a valid email address.</p>}
                {status==="error"&&<div style={{textAlign:"center",fontSize:13}}><p style={{color:C.rose,marginBottom:4}}>Something went wrong.</p><p style={{color:C.textMuted}}>Email us directly at <a href="mailto:info@bhtsolutions.com" style={{color:C.teal,fontWeight:600}}>info@bhtsolutions.com</a></p></div>}
              </div>
            </form>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {icon:"◈",t:"Hire Us",d:"AI, cloud, security expertise. 2-week sprints to 12-month engagements. Cleared resources.",c:C.teal},
                {icon:"⬡",t:"Partner",d:"Prime contractors: SBA 8(a), EDWOSB, WOSB certified. Cleared resources. Let's team.",c:C.violet},
                {icon:"△",t:"Assess",d:"35-point AI evaluation. Cloud readiness. Security posture. Executive briefing.",c:C.blue},
                {icon:"○",t:"Train",d:"Custom AI, cloud, security training for 5-200 people. In-person or virtual.",c:C.coral},
              ].map(c => (
                <div key={c.t} style={{display:"flex",gap:16,padding:20,borderRadius:14,background:C.bg,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
                  <div style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:c.c+"0A",color:c.c,fontSize:18,flexShrink:0}}>{c.icon}</div>
                  <div>
                    <h4 style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:3}}>{c.t}</h4>
                    <p style={{color:C.textMuted,fontSize:13,lineHeight:1.6}}>{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ═══ PARTNER APPLICATION ═══ */
          <div style={{maxWidth:700}}>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:32,boxShadow:C.shadowMd}}>
              <div style={{marginBottom:24}}>
                <h3 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy,marginBottom:6}}>Apply to the BHT Partner Network</h3>
                <p style={{color:C.textMuted,fontSize:14,lineHeight:1.7}}>We partner with firms that share our obsession with quality, compliance, and client outcomes. We're selective — and that's what makes the network valuable.</p>
              </div>

              {/* What partners get */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
                {[
                  {i:"◈",t:"Proprietary IP",d:"ARIA Score™ framework, diagnostic tools, assessment platform"},
                  {i:"⬡",t:"Lead Flow",d:"Assessment leads in your territory, pre-qualified and scored"},
                  {i:"△",t:"Training & Cert",d:"Quarterly training, methodology certification, quality standards"},
                  {i:"○",t:"Brand Authority",d:"Co-branded materials, \"BHT Certified Partner\" badge, joint marketing"},
                ].map(c=>(
                  <div key={c.t} style={{padding:14,borderRadius:10,background:C.bgSoft,border:`1px solid ${C.borderLight}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{color:C.teal,fontSize:14}}>{c.i}</span>
                      <span style={{fontSize:13,fontWeight:700,fontFamily:F.h,color:C.navy}}>{c.t}</span>
                    </div>
                    <p style={{fontSize:11,color:C.textMuted,lineHeight:1.5,margin:0}}>{c.d}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={submitPartner}>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {/* Section 1: About You */}
                  <div style={{fontSize:11,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>About You & Your Firm</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[{l:"Your Name",k:"name",p:"Full name",req:true},{l:"Email",k:"email",p:"you@company.com",req:true},{l:"Phone",k:"phone",p:"+1 (555) 123-4567"},{l:"Company Name",k:"company",p:"Your firm name",req:true},{l:"Website",k:"website_url",p:"https://yourfirm.com"},{l:"Country",k:"country",p:"e.g. United States, India, UK",req:true}].map(f=>(
                      <div key={f.k}>
                        <label style={labelStyle}>{f.l} {f.req&&<span style={{color:C.rose}}>*</span>}</label>
                        <input value={pApp[f.k]} onChange={e=>upP(f.k,e.target.value)} onBlur={()=>f.req&&pMark(f.k)}
                          placeholder={f.p} style={{...pInputStyle(f.k,f.req),width:"100%",boxSizing:"border-box"}} />
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div><label style={labelStyle}>City</label>
                      <input value={pApp.city} onChange={e=>upP("city",e.target.value)} placeholder="e.g. Mumbai, London" style={{...pInputStyle("city",false),width:"100%",boxSizing:"border-box"}} /></div>
                    <div><label style={labelStyle}>Company Size</label>
                      <select value={pApp.company_size} onChange={e=>upP("company_size",e.target.value)} style={{...pInputStyle("company_size",false),width:"100%",boxSizing:"border-box",cursor:"pointer"}}>
                        <option value="">Select...</option>{["1-5","6-20","21-50","51-200","201-1000","1000+"].map(o=><option key={o}>{o}</option>)}
                      </select></div>
                    <div><label style={labelStyle}>Years in Business</label>
                      <select value={pApp.years_in_business} onChange={e=>upP("years_in_business",e.target.value)} style={{...pInputStyle("years_in_business",false),width:"100%",boxSizing:"border-box",cursor:"pointer"}}>
                        <option value="">Select...</option>{["< 1 year","1-3 years","3-5 years","5-10 years","10+ years"].map(o=><option key={o}>{o}</option>)}
                      </select></div>
                  </div>

                  {/* Section 2: Technical Capability */}
                  <div style={{fontSize:11,fontWeight:700,color:C.violet,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginTop:8}}>Technical Capability</div>
                  <div><label style={labelStyle}>Microsoft Partnership Level</label>
                    <select value={pApp.ms_partnership} onChange={e=>upP("ms_partnership",e.target.value)} style={{...pInputStyle("ms_partnership",false),width:"100%",boxSizing:"border-box",cursor:"pointer"}}>
                      <option value="">Select...</option>{["No Microsoft Partnership","Microsoft Action Pack","Microsoft Solutions Partner (any)","Microsoft Solutions Partner (Security)","Microsoft Solutions Partner (Modern Work)","Microsoft Solutions Partner (Data & AI)","Microsoft Solutions Partner (multiple)"].map(o=><option key={o}>{o}</option>)}
                    </select></div>
                  <div>
                    <label style={labelStyle}>Team Certifications (select all that apply)</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {CERTS_LIST.map(c=>(
                        <button type="button" key={c} onClick={()=>togglePCert(c)}
                          style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${pApp.certifications.includes(c)?C.teal:C.border}`,
                            background:pApp.certifications.includes(c)?C.teal+"0D":"transparent",
                            color:pApp.certifications.includes(c)?C.tealDark:C.textMuted,
                            fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F.h,transition:"all .15s"}}>
                          {pApp.certifications.includes(c)?"✓ ":""}{c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label style={labelStyle}>Delivery Team Size (consultants who would deliver BHT engagements) <span style={{color:C.rose}}>*</span></label>
                    <select value={pApp.delivery_team_size} onChange={e=>upP("delivery_team_size",e.target.value)} onBlur={()=>pMark("delivery_team_size")} style={{...pInputStyle("delivery_team_size",true),width:"100%",boxSizing:"border-box",cursor:"pointer"}}>
                      <option value="">Select...</option>{["1-2 people","3-5 people","6-10 people","11-25 people","25+ people"].map(o=><option key={o}>{o}</option>)}
                    </select></div>

                  {/* Section 3: Business Fit */}
                  <div style={{fontSize:11,fontWeight:700,color:C.coral,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginTop:8}}>Business Fit</div>
                  <div>
                    <label style={labelStyle}>Industries You Serve (select all that apply)</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {IND_LIST.map(c=>(
                        <button type="button" key={c} onClick={()=>togglePInd(c)}
                          style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${pApp.industries_served.includes(c)?C.coral:C.border}`,
                            background:pApp.industries_served.includes(c)?C.coral+"0D":"transparent",
                            color:pApp.industries_served.includes(c)?C.coral:C.textMuted,
                            fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F.h,transition:"all .15s"}}>
                          {pApp.industries_served.includes(c)?"✓ ":""}{c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label style={labelStyle}>What services does your firm currently deliver? <span style={{color:C.rose}}>*</span></label>
                    <textarea rows={3} value={pApp.current_services} onChange={e=>upP("current_services",e.target.value)} onBlur={()=>pMark("current_services")}
                      placeholder="e.g. M365 migrations, Azure infrastructure, compliance consulting, managed services..."
                      style={{...pInputStyle("current_services",true),width:"100%",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} /></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><label style={labelStyle}>Annual Revenue (approximate)</label>
                      <select value={pApp.annual_revenue} onChange={e=>upP("annual_revenue",e.target.value)} style={{...pInputStyle("annual_revenue",false),width:"100%",boxSizing:"border-box",cursor:"pointer"}}>
                        <option value="">Prefer not to say</option>{["< $500K","$500K - $2M","$2M - $10M","$10M - $50M","$50M+"].map(o=><option key={o}>{o}</option>)}
                      </select></div>
                    <div><label style={labelStyle}>Number of Existing Clients</label>
                      <input value={pApp.existing_clients} onChange={e=>upP("existing_clients",e.target.value)} placeholder="e.g. 25 active clients" style={{...pInputStyle("existing_clients",false),width:"100%",boxSizing:"border-box"}} /></div>
                  </div>

                  {/* Section 4: Why */}
                  <div style={{fontSize:11,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,paddingBottom:6,borderBottom:`1px solid ${C.border}`,marginTop:8}}>The Big Question</div>
                  <div><label style={labelStyle}>Why do you want to partner with BHT? What would you bring to the table? <span style={{color:C.rose}}>*</span></label>
                    <textarea rows={4} value={pApp.why_partner} onChange={e=>upP("why_partner",e.target.value)} onBlur={()=>pMark("why_partner")}
                      placeholder="Tell us what excites you about the BHT methodology. What gaps does it fill in your current offerings? What unique value would you bring as a partner?"
                      style={{...pInputStyle("why_partner",true),width:"100%",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} /></div>

                  {/* Honeypot */}
                  <div style={{position:'absolute',left:'-9999px',opacity:0,height:0,overflow:'hidden'}} aria-hidden="true">
                    <input type="text" tabIndex={-1} autoComplete="off" value={pApp.honeypot} onChange={e=>upP("honeypot",e.target.value)} />
                  </div>

                  <div style={{background:C.bgSoft,padding:14,borderRadius:10,border:`1px solid ${C.borderLight}`}}>
                    <p style={{fontSize:11,color:C.textMuted,lineHeight:1.6,margin:0}}>
                      <strong style={{color:C.navy}}>What happens next:</strong> We review applications within 5 business days. Qualified candidates get a 45-minute introductory call. 
                      We evaluate mutual fit across technical capability, market alignment, and cultural values. Accepted partners begin a 90-day pilot program.
                    </p>
                  </div>

                  <button type="submit" disabled={pStatus==="sending"}
                    style={{padding:"14px",borderRadius:12,border:"none",cursor:pStatus==="sending"?"wait":"pointer",fontSize:15,fontWeight:700,fontFamily:F.h,
                      background:pStatus==="sending"?C.textMuted:C.violet,color:"#fff",boxShadow:`0 4px 14px ${C.violet}22`,textAlign:"center",transition:"background .2s",marginTop:4}}>
                    {pStatus==="sending" ? "Submitting..." : "Submit Partner Application →"}
                  </button>
                  {pStatus==="success"&&<div style={{textAlign:"center",color:C.teal,fontSize:14,fontWeight:600,padding:"12px 16px",background:C.teal+"0A",borderRadius:10,border:`1px solid ${C.teal}20`}}>✓ Application received. We'll review and respond within 5 business days. Check your email for a confirmation.</div>}
                  {pStatus==="fill"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please complete all required fields.</p>}
                  {pStatus==="email"&&<p style={{textAlign:"center",color:C.rose,fontSize:13}}>Please enter a valid email address.</p>}
                  {pStatus==="error"&&<div style={{textAlign:"center",fontSize:13}}><p style={{color:C.rose}}>Something went wrong. Email <a href="mailto:info@bhtsolutions.com" style={{color:C.teal}}>info@bhtsolutions.com</a> directly.</p></div>}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════ AI BOT AUDITOR — Scan sites for chatbot governance ═══════════════ */
/* ═══════════════ FEDERAL ACQUISITION — KO-focused section (US locale only) ═══════════════ */
/* ═══════════════ FEDERAL HUB — Complete federal portal for KOs, CIOs, primes ═══════════════ */
function FederalHub({scrollTo}) {
  const [openFaq, setOpenFaq] = useState(null);
  const daysToDeadline = Math.ceil((new Date('2026-04-03')-new Date())/(1000*60*60*24));

  const downloadCapStatement = () => {
    const w = window.open('','_blank'); if(!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Capability Statement — BHT Solutions LLC</title>
    <style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins',sans-serif;color:#1C1917;max-width:800px;margin:0 auto;padding:32px}
    @media print{body{padding:16px;font-size:11px}button,.no-print{display:none!important}h1{font-size:18px}h2{font-size:13px}}
    h2{font-size:14px;font-weight:700;color:#0E7490;text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px;padding-bottom:4px;border-bottom:2px solid #0E7490}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{padding:12px;border:1px solid #E7E5E4;border-radius:8px}
    td{padding:4px 12px;font-size:12px;vertical-align:top}td:first-child{font-weight:700;white-space:nowrap;color:#44403C}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1C1917">
      <div><h1 style="font-size:22px;font-weight:800">BHT Solutions LLC</h1>
      <p style="font-size:12px;color:#78716C;margin-top:2px">Capability Statement · AI Governance, Cloud Security & Compliance</p></div>
      <div style="text-align:right"><div style="font-weight:800;font-size:14px">TheBHT<span style="color:#0E7490">Labs</span></div></div></div>
    <h2>Company Data</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td>Legal Name</td><td>Bluebery Hawaii Technology Solutions LLC</td></tr>
      <tr><td>DBA</td><td>BHT Solutions</td></tr>
      <tr><td>CAGE Code</td><td>7DBB9</td></tr>
      <tr><td>UEI / SAM</td><td>ZW6GMVL368J6 · Active on SAM.gov</td></tr>
      <tr><td>DUNS</td><td>117520226</td></tr>
      <tr><td>Headquarters</td><td>Houston, TX (Harris County)</td></tr>
      <tr><td>Clearance</td><td>T4 Public Trust (Active) · Secret (Eligible)</td></tr>
    </table>
    <h2>Socioeconomic Status</h2>
    <div class="row">
      <div class="card"><strong style="color:#0E7490">SBA 8(a)</strong><br><span style="font-size:11px;color:#78716C">Sole Source eligible up to $4.5M (services) / $7M (manufacturing)</span></div>
      <div class="card"><strong style="color:#0E7490">EDWOSB / WOSB</strong><br><span style="font-size:11px;color:#78716C">Economically Disadvantaged Women-Owned Small Business · SBA certified</span></div></div>
    <h2>Primary NAICS Codes</h2>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="background:#FAFAF9;font-weight:700"><td>NAICS</td><td>Description</td><td>Size Std</td></tr>
      <tr><td>541512</td><td>Computer Systems Design Services</td><td>$34M</td></tr>
      <tr><td>541511</td><td>Custom Computer Programming</td><td>$34M</td></tr>
      <tr><td>541519</td><td>Other Computer Related Services</td><td>$34M</td></tr>
      <tr><td>518210</td><td>Computing Infrastructure, Data Processing</td><td>$40M</td></tr>
      <tr><td>541611</td><td>Admin & General Management Consulting</td><td>$24.5M</td></tr>
      <tr><td>541690</td><td>Other Scientific & Technical Consulting</td><td>$22M</td></tr>
      <tr><td>611420</td><td>Computer Training</td><td>$15M</td></tr></table>
    <h2>Core Capabilities</h2>
    <div class="row">
      <div class="card"><strong>AI Governance & Compliance</strong><br><span style="font-size:11px;color:#78716C">M-25-21/M-25-22 compliance · NIST AI RMF · AI use case inventory · AI strategy development · Risk classification · ARIA Score™ methodology</span></div>
      <div class="card"><strong>Cybersecurity & CMMC</strong><br><span style="font-size:11px;color:#78716C">CMMC Level 2 (110/110) · NIST 800-171 · NIST 800-53 · FedRAMP · CUI handling · SSP/POA&M</span></div>
      <div class="card"><strong>Microsoft Cloud & AI</strong><br><span style="font-size:11px;color:#78716C">M365/Azure/GCC-High · Copilot Studio · Power Platform · Entra ID · Purview · Azure AI Foundry</span></div>
      <div class="card"><strong>Training & Enablement</strong><br><span style="font-size:11px;color:#78716C">AI workforce upskilling · Prompt engineering · RAG architecture · Responsible AI · Executive briefings</span></div></div>
    <h2>Contract Vehicles</h2>
    <table style="width:100%;border-collapse:collapse"><tr><td>TX DIR</td><td>DIR-CPO-5626</td></tr>
      <tr><td>8(a) Sole Source</td><td>Direct award up to $4.5M</td></tr>
      <tr><td>Open Market</td><td>Competitive procurement</td></tr></table>
    <h2>Past Performance</h2>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="background:#FAFAF9;font-weight:700"><td>Client</td><td>Scope</td><td>Outcome</td></tr>
      <tr><td>U.S. DOJ</td><td>Enterprise IT modernization</td><td>Production delivery</td></tr>
      <tr><td>U.S. DHS</td><td>IT infrastructure & compliance</td><td>On-time, on-budget</td></tr>
      <tr><td>U.S. Army</td><td>Systems integration</td><td>Mission-critical delivery</td></tr>
      <tr><td>Defense Prime (NDA)</td><td>CMMC Level 2</td><td>110/110 · 90 days · 1st attempt</td></tr>
      <tr><td>Insurance Broker</td><td>Copilot Studio AI automation</td><td>87% faster processing</td></tr></table>
    <h2>Point of Contact</h2>
    <table style="width:100%;border-collapse:collapse"><tr><td>Contracts</td><td>info@bhtsolutions.com · (513) 638-1986</td></tr>
      <tr><td>SAM.gov</td><td>CAGE 7DBB9 · UEI ZW6GMVL368J6</td></tr></table>
    <div style="margin-top:16px;padding:10px;background:#FAFAF9;border-radius:6px;font-size:8px;color:#A8A29E">
    © ${new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC. ARIA Score™ is a trademark of BHT Solutions LLC. Past performance references available upon request.</div>
    <div style="text-align:center;margin-top:16px" class="no-print"><button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0E7490;color:#fff;font-weight:700;cursor:pointer">Save as PDF</button></div>
    </body></html>`);
    w.document.close();
  };

  /* Section header for dark bg */
  const FSH = ({tag,title,desc}) => (
    <div style={{textAlign:"center",marginBottom:40}}>
      <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",marginBottom:12}}>
        <span style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:"#F59E0B",textTransform:"uppercase",letterSpacing:1}}>{tag}</span>
      </div>
      <h2 style={{fontSize:28,fontWeight:800,fontFamily:F.h,color:"#F8FAFC",letterSpacing:"-0.02em",lineHeight:1.15}}>{title}</h2>
      {desc&&<p style={{color:"#94A3B8",fontSize:14,lineHeight:1.7,maxWidth:620,margin:"10px auto 0"}}>{desc}</p>}
    </div>
  );

  const fedFaqs = [
    {q:"How do we sole-source to BHT?",a:"As an SBA 8(a) certified firm, federal agencies can award sole-source contracts to BHT Solutions up to $4.5M for services without full and open competition. Your Contracting Officer initiates with a Justification & Approval (J&A) citing FAR 19.805-1. We provide a Capability Statement, relevant past performance, and a fair and reasonable price proposal. Timeline: as fast as 2 weeks from CO decision to award. CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · SAM: Active."},
    {q:"What NAICS codes apply?",a:"Primary: 541512 (Computer Systems Design), 541511 (Custom Programming), 541519 (Other Computer Services), 518210 (Computing Infrastructure), 541611 (Management Consulting), 541690 (Other S&T Consulting), 611420 (Computer Training). All within SBA size standards."},
    {q:"What clearance level does your team hold?",a:"T4 Public Trust (Active). Secret clearance eligible. We have operated in GCC-High environments handling CUI and can support up to Secret-level engagements. Clearance upgrades initiated upon contract award as needed."},
    {q:"Can primes sub to BHT for 8(a) credit?",a:"Yes. As a certified 8(a) and EDWOSB, work subcontracted to BHT Solutions counts toward your small business subcontracting plan goals. We have experience as both prime and sub on federal contracts. We provide monthly subcontracting reports per FAR 52.219-9."},
    {q:"What past performance is available?",a:"DOJ, DHS, U.S. Army (as sub), defense prime CMMC Level 2 preparation (110/110 NIST 800-171 practices, 90 days, first-attempt C3PAO pass), and multiple commercial engagements in AI governance and Microsoft ecosystem. CPARS and past performance questionnaires available upon CO request."},
    {q:"How fast can you start?",a:"Upon award: staffing within 5 business days for AI governance and compliance work. For CMMC engagements: 2-week ramp. For GCC-High migrations: 1-week planning phase. We maintain bench capacity specifically for federal rapid-start requirements."},
  ];

  return (
    <>
    {/* ═══ SECTION 1: Free Federal AI Tools ═══ */}
    <section id="fed-tools" style={{padding:"80px 0",background:"#0F172A"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <FSH tag="Free for Federal — No Contract Required" title="AI Readiness Tools for Government" desc="Built specifically for agencies meeting M-25-21 and M-25-22 mandates. Use these tools today — no procurement, no registration, no cost." />
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {icon:"🏛️",title:"M-25-21 Compliance Readiness Check",desc:"8-question self-assessment mapped to the 7 pillars of OMB M-25-21. Instantly see which requirements your agency has met and where gaps remain. Outputs a printable compliance gap summary your CAIO can action today.",
              tags:["Free","AI Governance","CAIO Ready"],action:"Take Assessment →",target:"assess"},
            {icon:"🤖",title:"AI Bot Governance Auditor",desc:"Enter any .gov website. We scan for chatbot widgets and evaluate their AI governance posture against M-25-21 transparency requirements, NIST AI RMF controls, and accessibility standards. 10 seconds.",
              tags:["Free","No Credentials","Instant"],action:"Audit a Site →",target:"assess"},
            {icon:"📋",title:"AI Use Case Inventory Template",desc:"M-25-21 requires agencies to annually inventory and publicly publish AI use cases. Download our structured template with fields mapped to OMB's reporting requirements, including risk classification and high-impact AI designation.",
              tags:["Free","Template","M-25-21 §3(b)"],action:"Download Template",download:true},
            {icon:"⚡",title:"AI Risk Classification Matrix",desc:"Determine which of your AI use cases qualify as 'high-impact' under M-25-21 Section 6. Interactive flowchart covering: healthcare, law enforcement, benefits, safety-critical, and autonomous systems. Get your risk tier in 2 minutes.",
              tags:["Free","Risk Assessment","M-25-21 §6"],action:"Classify Your AI →",target:"assess"},
          ].map(tool=>(
            <div key={tool.title} style={{padding:28,borderRadius:16,background:"#1E293B",border:"1px solid #334155",transition:"all .2s",position:"relative",overflow:"hidden"}}>
              <div style={{fontSize:32,marginBottom:12}}>{tool.icon}</div>
              <div style={{fontSize:16,fontWeight:700,fontFamily:F.h,color:"#F8FAFC",marginBottom:8}}>{tool.title}</div>
              <p style={{fontSize:12,color:"#94A3B8",lineHeight:1.7,marginBottom:14}}>{tool.desc}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                {tool.tags.map(t=><span key={t} style={{padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:700,fontFamily:F.m,background:"rgba(245,158,11,.1)",color:"#F59E0B"}}>{t}</span>)}
              </div>
              <button onClick={()=>tool.download?downloadTemplate():scrollTo(tool.target||"assess")}
                style={{padding:"10px 20px",borderRadius:10,border:"none",background:"#F59E0B",color:"#0F172A",fontSize:12,fontWeight:700,fontFamily:F.h,cursor:"pointer",width:"100%"}}>{tool.action}</button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ SECTION 2: M-25-21 Compliance Countdown ═══ */}
    <section id="fed-compliance" style={{padding:"60px 0",background:"#1E293B",borderTop:"1px solid #334155",borderBottom:"1px solid #334155"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <FSH tag="Active Federal Mandates" title="Your Agency's AI Compliance Timeline" desc="Executive Order 14179 and OMB Memoranda M-25-21/M-25-22 create binding requirements with hard deadlines." />
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {date:"Jan 23, 2025",label:"EO 14179 Signed",desc:"Removing Barriers to American Leadership in AI. Rescinds Biden-era EO 14110. Directs OMB to issue implementation guidance.",status:"done"},
            {date:"Apr 3, 2025",label:"M-25-21 & M-25-22 Released",desc:"M-25-21: Accelerating Federal Use of AI. M-25-22: Driving Efficient Acquisition of AI. Both take immediate effect for agencies.",status:"done"},
            {date:"Jul 2, 2025",label:"AI Governance Boards Convened",desc:"Agencies required to convene AI Governance Boards. Chief AI Officers designated. DHS, HHS, VA, DOE boards operational.",status:"done"},
            {date:"Sep 30, 2025",label:"M-25-21 Compliance Plans Due",desc:"All covered agencies must submit public compliance plans. AI use case inventories initiated. High-impact AI identification begins.",status:"done"},
            {date:"Sep 30, 2025",label:"M-25-22 Solicitation Provisions Active",desc:"All solicitations issued after this date must include AI-specific contract clauses: data ownership, IP rights, vendor AI disclosure, American-made preferences.",status:"done"},
            {date:"Dec 29, 2025",label:"Agency AI Acquisition Procedures Updated",desc:"Agencies must update internal acquisition procedures to comply with M-25-22. AI procurement clauses in all new solicitations.",status:"done"},
            {date:"Apr 3, 2026",label:"High-Impact AI Compliance Deadline",desc:"All high-impact AI use cases already in operations must meet M-25-21 minimum risk management practices. Non-compliant systems must obtain waiver or be retired.",
              status:"urgent",daysLeft:daysToDeadline},
          ].map((ev,i)=>(
            <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start",padding:16,borderRadius:12,background:ev.status==='urgent'?'rgba(245,158,11,.08)':'rgba(94,234,212,.03)',border:`1px solid ${ev.status==='urgent'?'rgba(245,158,11,.25)':'#334155'}`}}>
              <div style={{width:44,textAlign:"center",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",margin:"0 auto",background:ev.status==='done'?'#5EEAD4':ev.status==='urgent'?'#F59E0B':'#475569',display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {ev.status==='done'&&<span style={{fontSize:10,color:"#0F172A",fontWeight:800}}>✓</span>}
                  {ev.status==='urgent'&&<span style={{fontSize:8,color:"#0F172A",fontWeight:800}}>!</span>}
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:ev.status==='urgent'?'#F59E0B':'#5EEAD4'}}>{ev.date}</span>
                  {ev.status==='urgent'&&<span style={{padding:"2px 8px",borderRadius:4,fontSize:9,fontWeight:800,fontFamily:F.m,background:"#F59E0B",color:"#0F172A",animation:"pulse 2s infinite"}}>{ev.daysLeft} DAYS</span>}
                </div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#F8FAFC",marginBottom:4}}>{ev.label}</div>
                <p style={{fontSize:12,color:"#94A3B8",lineHeight:1.6}}>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:24,padding:20,borderRadius:14,background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.2)",textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#F59E0B",marginBottom:6}}>Your high-impact AI systems must be compliant in {daysToDeadline} days.</p>
          <p style={{fontSize:12,color:"#CBD5E1",lineHeight:1.7,maxWidth:600,margin:"0 auto 14px"}}>BHT Solutions can assess your AI portfolio, classify risk tiers, develop mitigation plans, and prepare waiver documentation under 8(a) sole-source authority — starting within 5 business days of award.</p>
          <button onClick={()=>scrollTo("partner")} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"#F59E0B",color:"#0F172A",fontSize:13,fontWeight:700,fontFamily:F.h,cursor:"pointer"}}>Contact Our Contracts Office →</button>
        </div>
      </div>
    </section>

    {/* ═══ SECTION 3: What We Deliver for Federal ═══ */}
    <section style={{padding:"80px 0",background:"#0F172A"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <FSH tag="Federal AI Services" title="How BHT Supports Agency AI Goals" desc="Mapped to M-25-21 requirements. Delivered under 8(a) sole-source or competitive procurement." />
        <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[
            {icon:"📊",title:"AI Use Case Inventory",price:"From $18K",desc:"Comprehensive catalog of AI deployments across your agency. Risk classification per M-25-21 §6. High-impact designation. Public inventory preparation.",mandate:"M-25-21 §3(b)(ii)"},
            {icon:"🛡️",title:"AI Governance Framework",price:"From $35K",desc:"Establish or strengthen your AI Governance Board. CAIO support structure. Policies, procedures, and minimum risk management practices for high-impact AI.",mandate:"M-25-21 §3-4"},
            {icon:"⚠️",title:"High-Impact AI Compliance",price:"From $28K",desc:"Assess existing AI systems against M-25-21 minimum practices. Develop impact assessments, risk mitigation plans, and waiver documentation. April 2026 deadline-ready.",mandate:"M-25-21 §4, §6"},
            {icon:"📝",title:"AI Acquisition Support",price:"From $15K",desc:"Develop AI-specific solicitation provisions per M-25-22. Contract clauses for data ownership, IP rights, vendor disclosure, American-made AI preferences.",mandate:"M-25-22 §3-5"},
            {icon:"🎯",title:"AI Strategy Development",price:"From $45K",desc:"Agency-wide AI strategy aligned to mission priorities and OMB requirements. Innovation roadmap. Resource allocation. Cross-agency sharing opportunities.",mandate:"M-25-21 §2"},
            {icon:"🔒",title:"CMMC + AI Governance",price:"From $55K",desc:"Unified cybersecurity and AI compliance. CMMC Level 2 preparation with AI governance overlay. 110/110 NIST 800-171 + AI risk management in a single engagement.",mandate:"CMMC 2.0 + M-25-21"},
            {icon:"☁️",title:"GCC-High AI Deployment",price:"From $65K",desc:"Deploy AI capabilities in GCC-High environments. Copilot Studio, Azure AI Foundry, and Teams AI bots in FedRAMP-authorized infrastructure.",mandate:"FedRAMP + M-25-22"},
            {icon:"🧑‍🏫",title:"AI Workforce Upskilling",price:"From $12K",desc:"Train agency staff on prompt engineering, RAG architecture, responsible AI, and AI use case identification. Custom curriculum aligned to your agency's AI strategy.",mandate:"M-25-21 §2(c)"},
            {icon:"📈",title:"AI Performance Monitoring",price:"From $22K/yr",desc:"Ongoing monitoring and evaluation of AI system performance, risks, and effectiveness. Quarterly assessments. Annual inventory updates. Continuous M-25-21 compliance.",mandate:"M-25-21 §4 + M-25-22"},
          ].map(svc=>(
            <div key={svc.title} style={{padding:22,borderRadius:14,background:"#1E293B",border:"1px solid #334155",display:"flex",flexDirection:"column"}}>
              <span style={{fontSize:24,marginBottom:8}}>{svc.icon}</span>
              <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#F8FAFC",marginBottom:4}}>{svc.title}</div>
              <div style={{fontSize:12,fontWeight:800,fontFamily:F.m,color:"#5EEAD4",marginBottom:8}}>{svc.price}</div>
              <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,flex:1,marginBottom:8}}>{svc.desc}</p>
              <span style={{padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:700,fontFamily:F.m,background:"rgba(94,234,212,.08)",color:"#5EEAD4",alignSelf:"flex-start"}}>{svc.mandate}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ SECTION 4: Contract Vehicles & Acquisition Data ═══ */}
    <section id="fed-vehicles" style={{padding:"60px 0",background:"#1E293B",borderTop:"1px solid #334155"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <FSH tag="Acquisition Information" title="How to Procure BHT Solutions" desc="Everything your Contracting Officer needs to initiate an award." />
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
          <div style={{padding:24,borderRadius:16,background:"#0F172A",border:"1px solid #334155"}}>
            <div style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:"#F59E0B",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>8(a) Sole Source — Fastest Path</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:12,color:"#CBD5E1",lineHeight:1.7}}>
              <div><strong style={{color:"#F8FAFC"}}>1. </strong>CO determines requirement can be met by 8(a) firm</div>
              <div><strong style={{color:"#F8FAFC"}}>2. </strong>CO contacts SBA with offering letter (FAR 19.804-2)</div>
              <div><strong style={{color:"#F8FAFC"}}>3. </strong>SBA accepts requirement on behalf of BHT Solutions</div>
              <div><strong style={{color:"#F8FAFC"}}>4. </strong>CO negotiates fair and reasonable price with BHT</div>
              <div><strong style={{color:"#F8FAFC"}}>5. </strong>Award issued — BHT starts within 5 business days</div>
            </div>
            <div style={{marginTop:12,padding:10,borderRadius:8,background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.15)"}}>
              <p style={{fontSize:11,fontWeight:700,color:"#F59E0B",margin:0}}>Threshold: Up to $4.5M services / $7M manufacturing</p>
              <p style={{fontSize:10,color:"#94A3B8",marginTop:2}}>No J&A or synopsis required for competitive range. Typical award timeline: 2-4 weeks.</p>
            </div>
          </div>
          <div style={{padding:24,borderRadius:16,background:"#0F172A",border:"1px solid #334155"}}>
            <div style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:"#5EEAD4",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Registration & Verification</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              {[
                ["CAGE Code","7DBB9"],
                ["UEI","ZW6GMVL368J6"],
                ["DUNS","117520226"],
                ["SAM Status","Active · Verified"],
                ["8(a) Status","Certified · SBA"],
                ["EDWOSB","Certified · SBA"],
                ["WOSB","Certified · SBA"],
                ["TX DIR","DIR-CPO-5626"],
                ["Clearance","T4 Public Trust · Secret Eligible"],
              ].map(([k,v])=>(
                <tr key={k}><td style={{padding:"6px 0",fontSize:12,fontWeight:700,color:"#94A3B8",borderBottom:"1px solid #334155"}}>{k}</td>
                  <td style={{padding:"6px 0",fontSize:12,color:"#F8FAFC",fontFamily:F.m,borderBottom:"1px solid #334155"}}>{v}</td></tr>
              ))}
            </table>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <a href="https://sam.gov" target="_blank" rel="noopener noreferrer"
                style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid #334155",background:"transparent",color:"#94A3B8",fontSize:11,fontWeight:600,fontFamily:F.h,textDecoration:"none",textAlign:"center",display:"block"}}>Verify on SAM.gov ↗</a>
              <button onClick={downloadCapStatement}
                style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:"#5EEAD4",color:"#0F172A",fontSize:11,fontWeight:700,fontFamily:F.h,cursor:"pointer"}}>Download Cap Statement</button>
            </div>
          </div>
        </div>

        {/* For Primes */}
        <div style={{padding:24,borderRadius:16,background:"#0F172A",border:"1px solid #334155"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:24}}>🤝</span>
            <div>
              <div style={{fontSize:16,fontWeight:700,fontFamily:F.h,color:"#F8FAFC"}}>Prime Contractors: Team with BHT</div>
              <div style={{fontSize:12,color:"#94A3B8"}}>Get SB subcontracting credit + cleared AI governance expertise</div>
            </div>
          </div>
          <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[
              {t:"8(a) / EDWOSB Credit",d:"Work subcontracted to BHT counts toward your FAR 52.219-9 small business subcontracting plan goals."},
              {t:"Cleared & Certified",d:"Secret-eligible team. Azure Solutions Architect. CyberAB RP. Ready for GCC-High and CUI environments."},
              {t:"Rapid Teaming",d:"NDA + Teaming Agreement in 48 hours. We maintain bench capacity for prime partner rapid-start engagements."},
            ].map(p=>(
              <div key={p.t} style={{padding:14,borderRadius:10,background:"#1E293B",border:"1px solid #334155"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#F8FAFC",marginBottom:4}}>{p.t}</div>
                <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,margin:0}}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ═══ SECTION 5: Federal FAQ ═══ */}
    <section style={{padding:"60px 0",background:"#0F172A",borderTop:"1px solid #334155"}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <FSH tag="Federal Procurement FAQ" title="Questions from KOs and Primes" />
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {fedFaqs.map((f,i)=>{
            const isOpen = openFaq===i;
            return (
              <div key={i} style={{border:`1px solid ${isOpen?'rgba(245,158,11,.3)':'#334155'}`,borderRadius:14,overflow:"hidden",background:"#1E293B"}}>
                <button onClick={()=>setOpenFaq(isOpen?null:i)}
                  style={{width:"100%",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#F8FAFC",paddingRight:16}}>{f.q}</span>
                  <span style={{flexShrink:0,fontSize:18,color:"#94A3B8",transition:"transform .2s",transform:isOpen?"rotate(45deg)":""}}>+</span>
                </button>
                {isOpen && <div style={{padding:"0 24px 18px",animation:"fadeUp .2s ease"}}>
                  <p style={{fontSize:13,color:"#CBD5E1",lineHeight:1.8}}>{f.a}</p>
                </div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}

/* helper for template download from FederalHub */
function downloadTemplate() {
  const w = window.open('','_blank'); if(!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>AI Use Case Inventory Template — M-25-21 §3(b)(ii)</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;padding:32px;max-width:900px;margin:0 auto}
  @media print{button{display:none!important}}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:8px;font-size:11px;text-align:left}th{background:#f5f5f5;font-weight:700}</style></head><body>
  <h1 style="font-size:20px;margin-bottom:4px">AI Use Case Inventory Template</h1>
  <p style="font-size:12px;color:#666;margin-bottom:16px">Per OMB Memorandum M-25-21 §3(b)(ii) — Annual AI Use Case Inventory Requirement</p>
  <table><tr><th>#</th><th>Use Case Name</th><th>Component/Office</th><th>AI Technology</th><th>Vendor</th><th>Purpose/Mission</th><th>Data Sources</th><th>High-Impact? (§6)</th><th>Risk Tier</th><th>Status</th><th>CAIO Approved</th><th>Public Disclosure</th><th>Notes</th></tr>
  ${[1,2,3,4,5,6,7,8,9,10].map(n=>'<tr><td>'+n+'</td><td></td><td></td><td></td><td></td><td></td><td></td><td>☐ Yes ☐ No</td><td>☐ Low ☐ Med ☐ High</td><td>☐ Pilot ☐ Prod ☐ Retired</td><td>☐</td><td>☐ Yes ☐ Exempt</td><td></td></tr>').join('')}
  </table>
  <h2 style="font-size:14px;margin-top:24px">High-Impact AI Categories (M-25-21 §6)</h2>
  <p style="font-size:11px;color:#666;line-height:1.8;margin-top:8px">An AI use case is presumed high-impact if it involves: (1) Safety-critical decisions affecting human health or life, (2) Law enforcement or criminal justice, (3) Immigration enforcement, (4) Benefits adjudication or eligibility, (5) Healthcare diagnosis or treatment, (6) Autonomous vehicles or robotics with injury potential, (7) Kinetic or non-kinetic defense measures, (8) Facility access and security.</p>
  <h2 style="font-size:14px;margin-top:24px">Minimum Risk Management Practices (M-25-21 §4)</h2>
  <p style="font-size:11px;color:#666;line-height:1.8;margin-top:8px">For each high-impact AI use case, agencies must document: AI impact assessment, ongoing monitoring plan, human oversight mechanisms, data quality controls, bias testing results, incident response procedures, and public transparency measures.</p>
  <div style="margin-top:24px;padding:12px;background:#f5f5f5;border-radius:6px;font-size:9px;color:#999">
  Template provided by TheBHTLabs (thebhtlabs.com) · BHT Solutions LLC · For informational purposes. Agencies should confirm requirements with their CAIO and legal counsel. © ${new Date().getFullYear()} BHT Solutions LLC.</div>
  <div style="text-align:center;margin-top:16px"><button onclick="window.print()" style="padding:10px 24px;border-radius:8px;border:none;background:#0E7490;color:#fff;font-weight:700;cursor:pointer">Save as PDF</button></div>
  </body></html>`);
  w.document.close();
}

function FedAcquisition() {
  const [locale, setLocale] = useState('us');
  useEffect(()=>{ if(typeof window!=='undefined') setLocale(localStorage.getItem('bht_locale')||'us'); },[]);
  if (locale !== 'us') return null;

  const downloadCapStatement = () => {
    const w = window.open('','_blank'); if(!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Capability Statement — BHT Solutions LLC</title>
    <style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins',sans-serif;color:#1C1917;max-width:800px;margin:0 auto;padding:32px}
    @media print{body{padding:16px;font-size:11px}button,.no-print{display:none!important}h1{font-size:18px}h2{font-size:13px}}
    h2{font-size:14px;font-weight:700;color:#0E7490;text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px;padding-bottom:4px;border-bottom:2px solid #0E7490}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{padding:12px;border:1px solid #E7E5E4;border-radius:8px}
    td{padding:4px 12px;font-size:12px;vertical-align:top}td:first-child{font-weight:700;white-space:nowrap;color:#44403C}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1C1917">
      <div><h1 style="font-size:22px;font-weight:800;letter-spacing:-0.02em">BHT Solutions LLC</h1>
      <p style="font-size:12px;color:#78716C;margin-top:2px">Capability Statement · AI Governance, Cloud Security & Compliance</p></div>
      <div style="text-align:right"><div style="font-weight:800;font-size:14px">TheBHT<span style="color:#0E7490">Labs</span></div>
      <div style="font-size:9px;color:#A8A29E">thebhtlabs.com</div></div>
    </div>

    <h2>Company Data</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td>Legal Name</td><td>Bluebery Hawaii Technology Solutions LLC</td></tr>
      <tr><td>DBA</td><td>BHT Solutions</td></tr>
      <tr><td>CAGE Code</td><td>7DBB9</td></tr>
      <tr><td>UEI / SAM</td><td>ZW6GMVL368J6 · Active on SAM.gov</td></tr>
      <tr><td>DUNS</td><td>117520226</td></tr>
      <tr><td>EIN</td><td>On file with SBA</td></tr>
      <tr><td>Headquarters</td><td>Houston, TX (Harris County)</td></tr>
      <tr><td>Size Standard</td><td>Small Business</td></tr>
      <tr><td>Clearance</td><td>T4 Public Trust (Active) · Secret (Eligible)</td></tr>
    </table>

    <h2>Socioeconomic Status</h2>
    <div class="row">
      <div class="card"><strong style="color:#0E7490">SBA 8(a)</strong><br><span style="font-size:11px;color:#78716C">Certified · Sole Source eligible up to $4.5M (services) / $7M (manufacturing) · Competitive 8(a) eligible</span></div>
      <div class="card"><strong style="color:#0E7490">EDWOSB / WOSB</strong><br><span style="font-size:11px;color:#78716C">Economically Disadvantaged Women-Owned Small Business · SBA certified · Set-aside eligible</span></div>
    </div>

    <h2>Primary NAICS Codes</h2>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="background:#FAFAF9;font-weight:700"><td>NAICS</td><td>Description</td><td>Size Standard</td></tr>
      <tr><td>541512</td><td>Computer Systems Design Services</td><td>$34M</td></tr>
      <tr><td>541511</td><td>Custom Computer Programming</td><td>$34M</td></tr>
      <tr><td>541519</td><td>Other Computer Related Services</td><td>$34M</td></tr>
      <tr><td>518210</td><td>Computing Infrastructure, Data Processing</td><td>$40M</td></tr>
      <tr><td>541611</td><td>Administrative & General Management Consulting</td><td>$24.5M</td></tr>
      <tr><td>541690</td><td>Other Scientific & Technical Consulting</td><td>$22M</td></tr>
      <tr><td>611420</td><td>Computer Training</td><td>$15M</td></tr>
      <tr><td>517110</td><td>Wired Telecommunications Carriers</td><td>1,500 emp</td></tr>
      <tr><td>541330</td><td>Engineering Services</td><td>$25.5M</td></tr>
      <tr><td>561499</td><td>All Other Business Support Services</td><td>$16.5M</td></tr>
      <tr><td>541618</td><td>Other Management Consulting Services</td><td>$19M</td></tr>
    </table>

    <h2>Core Capabilities</h2>
    <div class="row">
      <div class="card"><strong>AI Governance & Compliance</strong><br><span style="font-size:11px;color:#78716C">NIST AI RMF alignment · EU AI Act readiness · AI policy development · Risk classification · Responsible AI frameworks · ARIA Score\u2122 assessment methodology</span></div>
      <div class="card"><strong>Cybersecurity & CMMC</strong><br><span style="font-size:11px;color:#78716C">CMMC Level 2 preparation (110/110 practices) · NIST 800-171 implementation · NIST 800-53 controls · FedRAMP alignment · CUI handling · SSP/POA&M development</span></div>
      <div class="card"><strong>Microsoft Cloud & AI</strong><br><span style="font-size:11px;color:#78716C">M365/Azure/GCC-High · Copilot Studio · Power Platform · Entra ID · Purview · Azure AI Foundry · Teams AI SDK · Tenant optimization & migration</span></div>
      <div class="card"><strong>Consulting & Training</strong><br><span style="font-size:11px;color:#78716C">AI readiness assessments · Cloud migration strategy · Security posture analysis · Executive briefings · Workforce upskilling · Change management</span></div>
    </div>

    <h2>Contract Vehicles</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td>TX DIR</td><td>DIR-CPO-5626 (Texas ITSAC)</td></tr>
      <tr><td>8(a) Sole Source</td><td>Available for direct award up to $4.5M</td></tr>
      <tr><td>Open Market</td><td>Available for competitive procurement</td></tr>
    </table>

    <h2>Past Performance (Selected)</h2>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="background:#FAFAF9;font-weight:700"><td>Client</td><td>Scope</td><td>Outcome</td></tr>
      <tr><td>U.S. DOJ</td><td>Enterprise IT modernization, cloud migration</td><td>Production deployment, ongoing support</td></tr>
      <tr><td>U.S. DHS</td><td>IT infrastructure, security compliance</td><td>Successful delivery within timeline</td></tr>
      <tr><td>U.S. Army</td><td>Technology consulting, systems integration</td><td>Mission-critical system delivery</td></tr>
      <tr><td>Defense Contractor (NDA)</td><td>CMMC Level 2 preparation</td><td>110/110 NIST 800-171 · First-attempt C3PAO pass · 90 days</td></tr>
      <tr><td>Insurance Broker</td><td>AI document automation (Copilot Studio)</td><td>87% faster processing · 23-min to 3-min per submission</td></tr>
    </table>

    <h2>Certifications & Credentials</h2>
    <div style="font-size:11px;color:#44403C;line-height:1.8">
      Microsoft Certified Azure Solutions Architect Expert · CyberAB Registered Practitioner (RP) ·
      SAFe 5 Certified · Wiz Accredited Cloud Security · CompTIA Security+ (framework) · PMP (framework) ·
      ITIL v4 · Certified Scrum Master · Azure AI Engineer Associate (framework)
    </div>

    <h2>Point of Contact</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td>Contracts</td><td>info@bhtsolutions.com · (513) 638-1986</td></tr>
      <tr><td>Website</td><td>thebhtlabs.com · bhtsolutions.com</td></tr>
      <tr><td>SAM.gov</td><td>Search CAGE 7DBB9 or UEI ZW6GMVL368J6</td></tr>
    </table>

    <div style="margin-top:16px;padding:10px;background:#FAFAF9;border-radius:6px;font-size:8px;color:#A8A29E;line-height:1.5">
    This capability statement is provided for informational purposes for U.S. government acquisition personnel. Past performance references available upon request. 
    All representations regarding socioeconomic status, certifications, and registrations are verifiable through SAM.gov, SBA.gov, and respective certifying bodies.
    \u00a9 ${new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC. ARIA Score\u2122 is a trademark of BHT Solutions LLC.
    </div>
    <div style="text-align:center;margin-top:16px" class="no-print"><button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0E7490;color:#fff;font-weight:700;font-size:14px;cursor:pointer">Save as PDF</button></div>
    </body></html>`);
    w.document.close();
  };

  return (
    <section style={{padding:"40px 0",background:C.navy,color:"#fff"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{padding:"3px 10px",borderRadius:6,background:"#0E749030",color:"#5EEAD4",fontSize:10,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1}}>Federal Acquisition</span>
            </div>
            <div style={{display:"flex",gap:24,flexWrap:"wrap",fontSize:12,fontFamily:F.m,color:"#CBD5E1"}}>
              <span><strong style={{color:"#fff"}}>CAGE</strong> 7DBB9</span>
              <span><strong style={{color:"#fff"}}>UEI</strong> ZW6GMVL368J6</span>
              <span><strong style={{color:"#fff"}}>8(a)</strong> Sole Source to $4.5M</span>
              <span><strong style={{color:"#fff"}}>EDWOSB</strong> Set-Aside Eligible</span>
              <span><strong style={{color:"#fff"}}>DIR</strong> CPO-5626</span>
            </div>
            <div style={{marginTop:6,fontSize:11,color:"#94A3B8",fontFamily:F.m}}>
              NAICS: 541512 · 541511 · 541519 · 518210 · 541611 · 541690 · 611420
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexShrink:0}}>
            <button onClick={downloadCapStatement}
              style={{padding:"10px 20px",borderRadius:10,border:"1px solid #5EEAD4",background:"transparent",color:"#5EEAD4",fontSize:12,fontWeight:700,fontFamily:F.h,cursor:"pointer",whiteSpace:"nowrap"}}>
              Capability Statement (PDF)
            </button>
            <a href="https://sam.gov" target="_blank" rel="noopener noreferrer"
              style={{padding:"10px 20px",borderRadius:10,border:"1px solid #475569",background:"transparent",color:"#94A3B8",fontSize:12,fontWeight:600,fontFamily:F.h,textDecoration:"none",whiteSpace:"nowrap",display:"flex",alignItems:"center"}}>
              Verify on SAM.gov ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TenantHealthCheck({id}) {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateForm, setGateForm] = useState({name:"",email:"",company:""});
  const [gateSaving, setGateSaving] = useState(false);
  const [gateDone, setGateDone] = useState(false);

  const runScan = async () => {
    if (!domain || !consent) return;
    setScanning(true); setError(""); setResults(null);
    try {
      const r = await fetch("/api/health-check", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({domain:domain.trim()})});
      const d = await r.json();
      if (r.ok) setResults(d); else setError(d.error || "Analysis failed");
    } catch (e) { setError("Network error. Please try again."); }
    setScanning(false);
  };

  const requestPDF = async () => {
    if (!gateForm.name||!gateForm.email) return;
    setGateSaving(true);
    try { await fetch("/api/health-check", {method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"save-pdf",domain,name:gateForm.name,email:gateForm.email,company:gateForm.company,score:results?.governance?.percentage,botsFound:results?.bots?.map(b=>b.name).join(', ')})}); } catch(e){}
    setGateDone(true); setGateSaving(false);
    setTimeout(()=>{
      const w = window.open('','_blank'); if(!w) return;
      const g = results.governance;
      const si2 = (s) => s==='pass'?'\u2705':s==='warn'?'\u26a0\ufe0f':'\u274c';
      w.document.write('<!DOCTYPE html><html><head><title>AI Bot Governance Audit \u2014 '+domain+' \u2014 TheBHTLabs</title>'+
      '<style>@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Mono:wght@400&display=swap");'+
      '*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Poppins",sans-serif;color:#1C1917;padding:40px;max-width:800px;margin:0 auto}'+
      '@media print{body{padding:20px}button,.no-print{display:none!important}}.card{padding:14px;border-radius:10px;border:1px solid #E7E5E4;margin-bottom:10px}</style></head><body>'+
      '<div style="background:#1C1917;color:#fff;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:9px;line-height:1.6">'+
      '<strong>CONFIDENTIAL</strong> \u2014 Prepared for '+gateForm.name+' at '+(gateForm.company||domain)+'. This analysis examines publicly visible website content only. '+
      'No systems were accessed, tested, or penetrated. ARIA Score\u2122 methodology is proprietary to BHT Solutions LLC. Report ID: BHT-BA-'+Date.now().toString(36).toUpperCase()+'</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #0E7490">'+
      '<div><h1 style="font-size:24px;font-weight:800">AI Bot Governance Audit</h1>'+
      '<p style="color:#78716C;font-size:13px;margin-top:4px">'+domain+' \u00b7 '+new Date().toLocaleDateString()+'</p></div>'+
      '<div style="text-align:right"><div style="font-weight:800;font-size:15px">TheBHT<span style="color:#0E7490">Labs</span></div></div></div>'+
      '<div style="text-align:center;padding:24px;background:#FAFAF9;border-radius:14px;margin-bottom:20px">'+
      '<div style="font-size:48px;font-weight:800;color:'+(g.percentage>=70?'#0E7490':g.percentage>=40?'#F97316':'#DC2626')+';font-family:DM Mono,monospace">'+g.percentage+'/100</div>'+
      '<div style="font-size:14px;font-weight:700;margin-top:4px">AI Governance Score</div>'+
      '<div style="font-size:12px;color:#78716C;margin-top:4px">'+(results.hasChatbot?'Chatbot: '+results.bots.map(b=>b.name).join(', '):'No chatbot detected')+'</div></div>'+
      g.checks.map(c=>'<div class="card"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
        '<span style="font-size:18px">'+si2(c.status)+'</span><span style="font-size:13px;font-weight:700">'+c.name+'</span>'+
        '<span style="margin-left:auto;font-size:11px;color:#78716C">'+c.score+'/'+c.weight+'</span></div>'+
        '<p style="font-size:11px;color:#78716C;line-height:1.5">'+c.detail+'</p>'+
        '<p style="font-size:9px;color:#A8A29E;font-style:italic">'+c.regulation+'</p></div>').join('')+
      '<div style="padding:16px;background:#F0FDFA;border-radius:12px;border:1px solid #CCFBF1;margin-top:20px">'+
      '<p style="font-size:12px;color:#0F766E;line-height:1.7"><strong>This scanned your homepage only.</strong> Our AI Agent Rescue tests actual chatbot responses: prompt injection, hallucination, PII leakage, and 30+ behavioral checks.</p>'+
      '<p style="font-size:13px;font-weight:700;color:#0E7490;margin-top:8px">thebhtlabs.com \u00b7 info@bhtsolutions.com</p></div>'+
      '<div style="margin-top:16px;padding:12px;background:#FAFAF9;border-radius:8px;font-size:8px;color:#A8A29E;line-height:1.6">'+
      '<strong>Legal Disclaimer:</strong> This report analyzes publicly visible website content only. No systems were accessed or tested. No automated chatbot interactions were conducted. '+
      'Chatbot detection is based on known third-party script signatures in public HTML. Trademark names are property of their respective owners; no endorsement implied. '+
      'Governance scores reflect surface-level indicators and do not represent complete governance posture. Regulatory references are informational, not legal advice. '+
      'BHT Solutions LLC is not a law firm. ARIA Score\u2122 is a trademark of BHT Solutions LLC. \u00a9 '+new Date().getFullYear()+' Bluebery Hawaii Technology Solutions LLC.</div>'+
      '<div style="text-align:center;margin-top:16px" class="no-print"><button onclick="window.print()" style="padding:12px 28px;border-radius:10px;border:none;background:#0E7490;color:#fff;font-weight:700;cursor:pointer">Save as PDF</button></div></body></html>');
      w.document.close();
    }, 300);
  };

  const si = (s) => s==='pass'?{icon:'\u2705',color:C.teal,bg:'#F0FDFA'}:s==='warn'?{icon:'\u26a0\ufe0f',color:'#EA580C',bg:'#FFF7ED'}:{icon:'\u274c',color:C.rose,bg:'#FEF2F2'};

  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Free AI Governance Scanner" title="AI Bot Auditor" desc="Enter any website. We detect chatbots and score their AI governance against EU AI Act, NIST AI RMF, GDPR, and ISO 42001. Takes 10 seconds." />
        {!results ? (
          <div style={{maxWidth:560,margin:"0 auto"}}>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,padding:32,boxShadow:C.shadowMd}}>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <input value={domain} onChange={e=>setDomain(e.target.value)} onKeyDown={e=>e.key==='Enter'&&consent&&runScan()}
                  placeholder="yourcompany.com" style={{flex:1,padding:"14px 18px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:F.b,outline:"none"}} />
                <button onClick={runScan} disabled={scanning||!consent||!domain}
                  style={{padding:"14px 28px",borderRadius:12,border:"none",background:scanning?C.textMuted:C.teal,color:"#fff",fontSize:14,fontWeight:700,fontFamily:F.h,cursor:scanning?"wait":"pointer",whiteSpace:"nowrap"}}>
                  {scanning?"Scanning...":"Audit \u2192"}
                </button>
              </div>
              <label style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",marginBottom:16}} onClick={()=>setConsent(!consent)}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${consent?C.teal:C.border}`,background:consent?C.teal:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                  {consent&&<span style={{color:"#fff",fontSize:11,fontWeight:800}}>{"\u2713"}</span>}
                </div>
                <span style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>I confirm I am authorized to analyze this website and understand this examines publicly visible content only {"\u2014"} equivalent to viewing the site in a browser.</span>
              </label>
              {error&&<p style={{color:C.rose,fontSize:13,marginTop:8}}>{error}</p>}
              <div style={{padding:12,background:C.bgSoft,borderRadius:10,marginTop:8}}>
                <p style={{fontSize:10,color:C.textFaint,lineHeight:1.6,margin:0}}>
                  <strong style={{color:C.textMuted}}>What we check:</strong> We load your public homepage and scan the HTML for chatbot widgets, AI disclosures, privacy notices, governance frameworks, accessibility attributes, and security controls. 8 checks mapped to EU AI Act, NIST AI RMF, GDPR, and ISO 42001.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{textAlign:"center",padding:32,background:C.bgSoft,borderRadius:20,border:`1px solid ${C.border}`,marginBottom:24}}>
              <div style={{fontSize:64,fontWeight:900,fontFamily:F.m,color:results.governance.percentage>=70?C.teal:results.governance.percentage>=40?C.coral:C.rose,lineHeight:1}}>{results.governance.percentage}<span style={{fontSize:28,color:C.textFaint}}>/100</span></div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:F.h,color:C.navy,marginTop:8}}>AI Governance Score {"\u2014"} {domain}</div>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {results.hasChatbot ? results.bots.map(b=>(
                  <span key={b.name} style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:b.type==='ai_chat'||b.type==='ai_llm'?'#7C3AED15':'#0E749015',color:b.type==='ai_chat'||b.type==='ai_llm'?'#7C3AED':C.teal}}>{b.name}</span>
                )) : <span style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:C.bgMuted,color:C.textMuted}}>No chatbot widget detected</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {results.governance.checks.map(check => {
                const s = si(check.status);
                return (
                  <div key={check.id} style={{padding:18,borderRadius:14,background:s.bg,border:`1px solid ${s.color}15`,boxShadow:C.shadow}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <span style={{fontSize:20}}>{s.icon}</span>
                      <div style={{flex:1}}>
                        <span style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy}}>{check.name}</span>
                        <span style={{fontSize:10,color:C.textFaint,fontFamily:F.m,marginLeft:8}}>{check.score}/{check.weight}</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,fontFamily:F.m,color:s.color,padding:"2px 10px",borderRadius:6,background:s.color+"10"}}>{check.status.toUpperCase()}</span>
                    </div>
                    <p style={{fontSize:12,color:C.textSoft,lineHeight:1.6,marginBottom:4}}>{check.detail}</p>
                    <p style={{fontSize:10,color:C.textFaint,fontStyle:"italic"}}>{check.regulation}</p>
                  </div>
                );
              })}
            </div>
            <div style={{padding:24,borderRadius:16,background:C.bgSoft,border:`1px solid ${C.border}`,marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:C.violet,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m,marginBottom:12}}>How You Compare</div>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
                <div style={{flex:1,height:28,background:C.bgMuted,borderRadius:8,position:"relative",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${results.governance.percentage}%`,background:results.governance.percentage>=70?C.teal:results.governance.percentage>=40?C.coral:C.rose,borderRadius:8,transition:"width 1s ease"}} />
                  <div style={{position:"absolute",top:0,left:"31%",height:"100%",width:2,background:C.navy}} />
                </div>
                <span style={{fontSize:15,fontWeight:800,fontFamily:F.m,color:C.navy}}>{results.governance.percentage}%</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textFaint,fontFamily:F.m}}>
                <span>Most sites: 15{"\u2013"}35%</span><span style={{color:C.navy,fontWeight:700}}>Avg: 31%</span><span>Top 10%: 72%+</span>
              </div>
              <p style={{fontSize:11,color:C.textMuted,marginTop:10,lineHeight:1.6}}>
                {results.governance.percentage>=70?"Excellent. Strong AI governance indicators {"\u2014"} top tier.":
                 results.governance.percentage>=40?"Above average but "+results.governance.checks.filter(c=>c.status==='fail').length+" checks failed.":
                 results.governance.checks.filter(c=>c.status==='fail').length+" of "+results.governance.checks.length+" governance checks failed."+(results.hasChatbot?" Your chatbot is live without adequate governance.":"")}
              </p>
              <p style={{fontSize:9,color:C.textFaint,fontStyle:"italic",marginTop:6}}>Benchmark based on sites audited through this tool. Not a statistically representative sample.</p>
            </div>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={{padding:20,borderRadius:14,background:C.bg,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:C.navy,marginBottom:8}}>Download Audit Report (PDF)</div>
                <p style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginBottom:12}}>Detailed findings with regulatory citations and remediation steps.</p>
                {!gateDone ? (!showGate ? (
                  <button onClick={()=>setShowGate(true)} style={{padding:"10px 20px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:700,fontFamily:F.h,cursor:"pointer",width:"100%"}}>{"\ud83d\udcc4"} Download PDF Report</button>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={gateForm.name} onChange={e=>setGateForm({...gateForm,name:e.target.value})} placeholder="Your name *" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <input value={gateForm.email} onChange={e=>setGateForm({...gateForm,email:e.target.value})} placeholder="Work email *" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <input value={gateForm.company} onChange={e=>setGateForm({...gateForm,company:e.target.value})} placeholder="Company (optional)" style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b}} />
                    <button onClick={requestPDF} disabled={gateSaving||!gateForm.name||!gateForm.email}
                      style={{padding:"10px",borderRadius:8,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F.h}}>{gateSaving?"Generating...":"Generate & Download"}</button>
                  </div>
                )) : (
                  <div style={{textAlign:"center",color:C.teal,fontSize:13,fontWeight:600,padding:"10px",background:C.teal+"0A",borderRadius:8}}>{"\u2713"} PDF generated</div>
                )}
              </div>
              <div style={{padding:20,borderRadius:14,background:"#F0FDFA",border:"1px solid #CCFBF1",boxShadow:C.shadow}}>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.h,color:"#0F766E",marginBottom:8}}>This scanned HTML. Imagine testing the actual bot.</div>
                <p style={{fontSize:12,color:"#0F766E",lineHeight:1.7,marginBottom:12}}>Our AI Agent Rescue tests chatbot responses: prompt injection resistance, hallucination, PII leakage, escalation handling, and 30+ behavioral controls that HTML scanning cannot see.</p>
                <button onClick={()=>document.getElementById("partner")?.scrollIntoView({behavior:"smooth"})}
                  style={{padding:"10px 20px",borderRadius:10,border:"none",background:"#0F766E",color:"#fff",fontSize:13,fontWeight:700,fontFamily:F.h,cursor:"pointer",width:"100%"}}>Book a Discovery Call {"\u2192"}</button>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:10}}>
              <button onClick={()=>{setResults(null);setDomain("");setConsent(false);setShowGate(false);setGateDone(false);setGateForm({name:"",email:"",company:""});}}
                style={{padding:"8px 20px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F.h}}>Audit Another Site</button>
            </div>
            <div style={{marginTop:20,padding:14,background:C.bgSoft,borderRadius:10,border:`1px solid ${C.borderLight}`}}>
              <p style={{fontSize:9,color:C.textFaint,lineHeight:1.7,margin:0}}>
                <strong style={{color:C.textMuted}}>Legal Disclaimer:</strong> This analysis examines publicly visible website content only, equivalent to viewing the site in a standard web browser. No systems were accessed, tested, or penetrated. No credentials were used. No automated interactions were conducted with any chatbot or AI system. Chatbot detection is based on known third-party script signatures in publicly served HTML. All third-party product names and trademarks are property of their respective owners; no endorsement, sponsorship, or affiliation is implied. Governance scores reflect surface-level HTML indicators and do not represent the complete governance posture of the organization. Regulatory references (EU AI Act, NIST AI RMF, GDPR, ISO 42001, DPDPA, UAE PDPL, WCAG) are informational and do not constitute legal advice. BHT Solutions LLC is not a law firm. Industry benchmarks reflect sites audited through this tool and are not a statistically representative sample. ARIA Score{"\u2122"} is a trademark of BHT Solutions LLC. {"\u00a9"} {new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
/* ═══════════════ PROOF BAR ═══════════════ */
function ProofBar() {
  const creds = [
    {v:"SBA 8(a)",l:"Sole Source Eligible"},
    {v:"EDWOSB",l:"Women-Owned SB"},
    {v:"Azure",l:"Solutions Architect"},
    {v:"CyberAB",l:"Registered Practitioner"},
    {v:"Secret",l:"Clearance Eligible"},
    {v:"CAGE 7DBB9",l:"Active Contractor"},
  ];
  const logos = ["DOJ","DHS","U.S. Army","McKesson","EY","PwC","IBM","Microsoft","Stryker","Gates Foundation"];
  return (
    <section style={{padding:"32px 0",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.bgSoft}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap",marginBottom:16}}>
          {creds.map(s => (
            <div key={s.l} style={{textAlign:"center"}}>
              <div style={{color:C.teal,fontSize:16,fontWeight:800,fontFamily:F.m}}>{s.v}</div>
              <div style={{color:C.textFaint,fontSize:9,marginTop:2,textTransform:"uppercase",letterSpacing:1,fontFamily:F.m}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:10,color:C.textFaint,fontFamily:F.m,letterSpacing:.5}}>
          Trusted by teams at: {logos.join(" · ")}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ THE BUILDER — Musk-style founder credibility ═══════════════ */
function FAQ({id}) {
  const [open, setOpen] = useState(null);
  const faqs = [
    {q:"What does the Bot Auditor actually check?",a:"We load your public homepage — exactly as any visitor would — and scan the HTML for chatbot widgets, AI disclosure language, privacy notices covering AI, human escalation paths, AI governance frameworks, cookie consent, security controls, and accessibility. 8 checks mapped to EU AI Act Art. 50, NIST AI RMF, GDPR, and ISO 42001. No systems are accessed. No credentials used. Takes 10 seconds."},
    {q:"What does the 35-Point Assessment cover?",a:"7 domains: AI Strategy & Leadership, Data Readiness, Technology Infrastructure, Governance & Compliance, Process & Automation, Talent & Skills, Risk Management. Each scored 1-5 across 5 questions. You get an ARIA Score\u2122 that maps your complexity, a percentile ranking against your industry, a gap analysis, and a PDF report with a 90-day action plan."},
    {q:"What does it cost?",a:"The Bot Auditor and AI Assessment are free. Zero. No trial, no credit card. If you want us to implement solutions, our Quick Scan starts at $2,500 and scales based on organizational complexity. We publish pricing transparently on this site."},
    {q:"Is my data safe?",a:"Assessment tools run in your browser. The Bot Auditor fetches your public homepage server-side — the same content any visitor sees. Nothing is stored unless you explicitly submit the contact form or request a PDF report. No tracking cookies, no Google Analytics, no ad pixels."},
    {q:"Who is behind this?",a:"Nitin Nagar — 20+ years enterprise IT. MS in CS. Azure Solutions Architect. CyberAB RP. SAFe 5. Founded BHT Solutions in 2016. SBA 8(a), EDWOSB, WOSB. Secret clearance eligible. CAGE: 7DBB9. Portfolio: DOJ, DHS, U.S. Army, McKesson, EY, PwC, IBM, Microsoft, Stryker, Gates Foundation."},
    {q:"What industries do you serve?",a:"Defense contractors, federal agencies, and regulated industries — insurance, legal, healthcare, financial services. Also expanding into India (DPDPA, RBI compliance), Europe (EU AI Act, GDPR, NIS2), and the UAE (UAE PDPL, ADGM, NESA). If compliance keeps your CISO up at night, we're built for you."},
    {q:"How fast can you deliver?",a:"Discovery call: 30 minutes. AI Quick Scan: 1 week. Sprint (assessment + roadmap): 2-3 weeks. Full implementation: 1-3 months. CMMC Level 2: 90 days — 110/110 NIST 800-171 practices, first-attempt C3PAO pass."},
    {q:"How do I get started?",a:"Two paths: (1) Run the free Bot Auditor on your website right now — takes 10 seconds, zero commitment. (2) Take the 35-Point Assessment — takes 5 minutes, gives you a full diagnostic. Both generate downloadable PDF reports. Or skip straight to the contact form."},
  ];
  return (
    <section id={id} style={{padding:"80px 0",background:C.bg}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <SH tag="Common Questions" title="Frequently Asked Questions" desc="Everything you need to know about TheBHTLabs and BHT Solutions." />
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {faqs.map((f,i)=>{
            const isOpen = open===i;
            return (
              <div key={i} style={{border:`1px solid ${isOpen?C.teal+"33":C.border}`,borderRadius:14,overflow:"hidden",transition:"all .2s",background:C.bg}}>
                <button onClick={()=>setOpen(isOpen?null:i)}
                  style={{width:"100%",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:15,fontWeight:700,fontFamily:F.h,color:C.navy,paddingRight:16}}>{f.q}</span>
                  <span style={{flexShrink:0,fontSize:18,color:C.textMuted,transition:"transform .2s",transform:isOpen?"rotate(45deg)":""}}>+</span>
                </button>
                {isOpen && <div style={{padding:"0 24px 18px",animation:"fadeUp .2s ease"}}>
                  <p style={{fontSize:14,lineHeight:1.7,color:C.textSoft,fontFamily:F.b}}>{f.a}</p>
                </div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ SOCIAL ICONS SVGs ═══════════════ */
const SocialIcons = {
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  youtube: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  whatsapp: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  email: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
};

/* ═══════════════ COOKIE NOTICE ═══════════════ */
function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    try { if(!localStorage.getItem("bht_cookie_ack")) setShow(true); } catch(e){ setShow(true); }
  },[]);
  const accept = () => { try { localStorage.setItem("bht_cookie_ack","1"); } catch(e){} setShow(false); };
  if(!show) return null;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:998,background:C.navy,color:"#fff",padding:"14px 24px",display:"flex",justifyContent:"center",alignItems:"center",gap:16,flexWrap:"wrap",fontSize:13,fontFamily:F.b}}>
      <p style={{maxWidth:600,lineHeight:1.5,margin:0}}>
        We use only essential cookies for basic site functionality. No tracking, no ads, no third-party cookies. <span style={{opacity:.6}}>See our Privacy Policy for details.</span>
      </p>
      <button onClick={accept} style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.h,background:C.teal,color:"#fff",flexShrink:0}}>Got it</button>
    </div>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const socials = [
    {name:"LinkedIn",icon:SocialIcons.linkedin,url:"https://www.linkedin.com/company/bht-solutions-llc",color:"#0A66C2"},
    {name:"X (Twitter)",icon:SocialIcons.x,url:"https://x.com/bhtsolutions",color:C.navy},
    {name:"Facebook",icon:SocialIcons.facebook,url:"https://www.facebook.com/bhtsolutions",color:"#1877F2"},
    {name:"YouTube",icon:SocialIcons.youtube,url:"https://www.youtube.com/@bhtsolutions",color:"#FF0000"},
    {name:"WhatsApp",icon:SocialIcons.whatsapp,url:"https://wa.me/15136381986",color:"#25D366"},
    {name:"Email",icon:SocialIcons.email,url:"mailto:info@bhtsolutions.com",color:C.teal},
  ];
  return (
    <footer style={{padding:"60px 0 36px",background:C.navy,color:"#fff"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        {/* Top: Logo + links + social */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:40,marginBottom:40}} className="g4">
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill={C.teal}/><text x="18" y="23" textAnchor="middle" fill="#fff" fontFamily="monospace" fontWeight="800" fontSize="18">λ</text></svg>
              <span style={{fontWeight:800,fontSize:17,fontFamily:F.h}}>TheBHT<span style={{color:C.teal}}>Labs</span></span>
            </div>
            <p style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.6)",marginBottom:16}}>
              The skunkworks innovation lab of BHT Solutions. Free AI readiness tools built from 20+ years of enterprise IT experience.
            </p>
            <a href="https://www.bhtsolutions.com" target="_blank" rel="noopener" style={{color:C.teal,fontSize:13,fontWeight:600,fontFamily:F.m,textDecoration:"none"}}>
              bhtsolutions.com ↗
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Tools</h4>
            {[{l:"AI Assessment",id:"assess"},{l:"ROI Calculator",id:"roi"},{l:"AI Policy Generator",id:"policy"},{l:"Compliance Countdown",id:"packages"},{l:"Field Notes",id:"notes"}].map(l=>(
              <button key={l.id} onClick={()=>document.getElementById(l.id)?.scrollIntoView({behavior:"smooth"})}
                style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>{l.l}</button>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Company</h4>
            {[
              {l:"The Builder",id:"builder"},{l:"Packages",id:"packages"},{l:"FAQ",id:"faq"},
            ].map(l=>(
              <button key={l.id} onClick={()=>document.getElementById(l.id)?.scrollIntoView({behavior:"smooth"})}
                style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>{l.l}</button>
            ))}
            <button onClick={()=>setShowPrivacy(true)}
              style={{display:"block",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",transition:"color .15s"}}
              onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>Privacy Policy</button>
            <a href="https://bhtsolutions.com/capability-statement/" target="_blank" rel="noopener"
              style={{display:"block",color:"rgba(255,255,255,.7)",fontSize:13,fontFamily:F.b,padding:"4px 0",textDecoration:"none",transition:"color .15s"}}
              onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.7)"}>Capability Statement ↗</a>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{fontSize:11,fontWeight:700,fontFamily:F.m,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,.4)",marginBottom:16}}>Connect With Us</h4>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {socials.map(s=>(
                <a key={s.name} href={s.url} target={s.url.startsWith("mailto")?"_self":"_blank"} rel="noopener noreferrer" title={s.name}
                  style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",transition:"all .15s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color;e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.7)"}}>
                  {s.icon}
                </a>
              ))}
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,.5)",fontFamily:F.m,lineHeight:1.6}}>
              info@bhtsolutions.com<br/>
              Cypress, TX 77433
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:10,fontFamily:F.m}}>CAGE: 7DBB9 · UEI: ZW6GMVL368J6 · DUNS: 801352894 · FEIN: 26-0374906 · Primary NAICS: 541512</span>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:10,fontFamily:F.m}}>© {new Date().getFullYear()} Bluebery Hawaii Technology Solutions LLC · SBA 8(a) · EDWOSB · WOSB · Houston, TX</span>
            <p style={{color:"rgba(255,255,255,.2)",fontSize:8,fontFamily:F.m,marginTop:6,lineHeight:1.6,maxWidth:700}}>
              ARIA Score™ is a trademark of BHT Solutions LLC. The AI Readiness Assessment framework, scoring methodology, ARIA Score™ algorithm, and all associated 
              intellectual property are proprietary to BHT Solutions LLC, protected under U.S. copyright law and the Defend Trade Secrets Act (18 U.S.C. § 1836). 
              Unauthorized reproduction, reverse engineering, or derivative works are prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={()=>setShowPrivacy(false)}>
          <div style={{background:C.bg,borderRadius:20,maxWidth:640,width:"100%",maxHeight:"80vh",overflow:"auto",padding:32,boxShadow:C.shadowLg,color:C.text}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:22,fontWeight:800,fontFamily:F.h,color:C.navy}}>Privacy Policy</h2>
              <button onClick={()=>setShowPrivacy(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.textMuted}}>✕</button>
            </div>
            <div style={{fontSize:13,color:C.textSoft,lineHeight:1.8,fontFamily:F.b}}>
              <p style={{marginBottom:12}}><strong style={{color:C.navy}}>Effective Date:</strong> January 1, 2026 · <strong style={{color:C.navy}}>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p style={{marginBottom:12}}>Bluebery Hawaii Technology Solutions LLC ("BHT Solutions", "we", "us") operates TheBHTLabs.com. This policy explains how we handle information when you use our site and tools.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Information We Collect</h3>
              <p style={{marginBottom:8}}><strong>Voluntarily Provided:</strong> When you submit the contact form or assessment, we collect information you provide: name, email, company name, and assessment responses.</p>
              <p style={{marginBottom:8}}><strong>Automatically Collected:</strong> Standard web analytics (page views, referral source). We do not use third-party tracking cookies or sell data to advertisers.</p>
              <p style={{marginBottom:8}}><strong>Tools (ROI Calculator, Policy Generator, Assessment):</strong> All calculations run in your browser. We do not store your inputs or outputs unless you explicitly submit them via the contact/assessment form.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Cookies</h3>
              <p style={{marginBottom:8}}>We use only essential cookies required for basic site functionality. We do not use third-party tracking cookies, advertising cookies, or analytics cookies that track individual users. No data is sold or shared with third parties.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>How We Use Information</h3>
              <p style={{marginBottom:8}}>We use voluntarily provided information solely to: respond to your inquiry, deliver assessment results, and follow up on requested consultations. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Data Security</h3>
              <p style={{marginBottom:8}}>We implement industry-standard security measures. Our chatbot uses server-side API routing — no API keys or sensitive credentials are exposed client-side. Contact form submissions are transmitted via encrypted SMTP.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>AI Chatbot</h3>
              <p style={{marginBottom:8}}>Our AI chatbot is powered by Anthropic's Claude. Conversations are processed through our secure server-side proxy. Do not share sensitive personal, financial, or health information in the chat. Chat conversations are not stored permanently.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Your Rights</h3>
              <p style={{marginBottom:8}}>You may request deletion of any personal information we hold by emailing info@bhtsolutions.com. We will respond within 30 days. California residents: We do not sell or share personal information as defined by the CCPA/CPRA.</p>
              <h3 style={{fontSize:15,fontWeight:700,color:C.navy,marginTop:20,marginBottom:8}}>Contact</h3>
              <p>Bluebery Hawaii Technology Solutions LLC · 20223 Granite Birch Ln, Cypress, TX 77433 · info@bhtsolutions.com</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

/* ═══════════════ CHATBOT ═══════════════ */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{r:"a",c:"Hey! I'm the TheBHTLabs AI advisor. I can help with:\n\n• Is AI right for your business?\n• Which package fits your needs?\n• Copilot Studio & automation questions\n• Compliance (CMMC, FedRAMP)\n• Career & upskilling guidance\n\nWhat's on your mind?"}]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async () => {
    if(!inp.trim()||loading)return;
    const msg = inp.trim(); setInp(""); setMsgs(p=>[...p,{r:"u",c:msg}]); setLoading(true);
    try {
      const history = msgs.filter(m=>m.r!=="a"||msgs.indexOf(m)>0).slice(-6).map(m=>({role:m.r==="u"?"user":"assistant",content:m.c}));
      history.push({role:"user",content:msg});
      const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:history})});
      const d = await r.json();
      setMsgs(p=>[...p,{r:"a",c:d.content||"Connection issue. Email info@bhtsolutions.com"}]);
    } catch(e) { setMsgs(p=>[...p,{r:"a",c:"Connection issue. Reach us at info@bhtsolutions.com"}]); }
    setLoading(false);
  };

  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{position:"fixed",bottom:24,right:24,zIndex:1000,width:56,height:56,borderRadius:16,background:C.teal,border:"none",cursor:"pointer",boxShadow:`0 4px 20px ${C.teal}33`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,transition:"all .2s"}}>
      💬
    </button>
  );

  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:1000,width:380,maxWidth:"calc(100vw - 48px)",height:520,background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,boxShadow:C.shadowLg,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Badge color={C.teal}>Online</Badge>
          <span style={{fontWeight:700,fontFamily:F.h,fontSize:14,color:C.navy}}>TheBHTLabs AI</span>
        </div>
        <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:18}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",justifyContent:m.r==="u"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:14,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",
              background:m.r==="u"?C.teal:C.bgMuted,color:m.r==="u"?"#fff":C.text,
              borderBottomRightRadius:m.r==="u"?4:14,borderBottomLeftRadius:m.r==="u"?14:4}}>{m.c}</div>
          </div>
        ))}
        {loading && <div style={{padding:8}}><span style={{color:C.teal,fontSize:13,fontFamily:F.m}}>Thinking...</span></div>}
        <div ref={endRef} />
      </div>
      <div style={{padding:10,borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..."
          style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,fontFamily:F.b,outline:"none"}} />
        <button onClick={send} style={{width:38,height:38,borderRadius:10,border:"none",cursor:"pointer",
          background:inp.trim()?C.teal:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,transition:"all .15s"}}>→</button>
      </div>
    </div>
  );
}

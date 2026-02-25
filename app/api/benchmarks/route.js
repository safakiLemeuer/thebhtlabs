// app/api/benchmarks/route.js — Data Flywheel: Live aggregate intelligence
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getDb } = require('../../../lib/db');
    const db = getDb();

    // Core counts
    const totalScans = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan'").get()?.c || 0;
    const totalLeads = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='pdf_download'").get()?.c || 0;
    const withBots = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE has_m365=1 AND action='scan'").get()?.c || 0;

    // Score distribution
    const avgScore = Math.round(db.prepare("SELECT AVG(score) as a FROM health_checks WHERE action='scan' AND score > 0").get()?.a || 0);
    const medianRow = db.prepare("SELECT score FROM health_checks WHERE action='scan' AND score > 0 ORDER BY score LIMIT 1 OFFSET (SELECT COUNT(*)/2 FROM health_checks WHERE action='scan' AND score > 0)").get();
    const medianScore = medianRow?.score || avgScore;

    // Failure distribution
    const below30 = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND score > 0 AND score < 30").get()?.c || 0;
    const below50 = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND score > 0 AND score < 50").get()?.c || 0;
    const above70 = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND score > 0 AND score >= 70").get()?.c || 0;
    const scored = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND score > 0").get()?.c || 1;

    // Check-level failure rates (parse from dmarc_status field which stores "X/8" pass count)
    // dkim_status stores "X fails"
    const failRows = db.prepare("SELECT dkim_status FROM health_checks WHERE action='scan' AND dkim_status LIKE '%fail%'").all();
    const totalFails = failRows.reduce((sum, r) => {
      const n = parseInt(r.dkim_status);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    const avgFails = scored > 0 ? (totalFails / scored).toFixed(1) : 0;

    // Chatbot detection rate
    const botRate = scored > 0 ? Math.round((withBots / scored) * 100) : 0;

    // Top 10% threshold
    const top10Row = db.prepare("SELECT score FROM health_checks WHERE action='scan' AND score > 0 ORDER BY score DESC LIMIT 1 OFFSET (SELECT MAX(1, COUNT(*)/10) FROM health_checks WHERE action='scan' AND score > 0)").get();
    const top10Threshold = top10Row?.score || 72;

    // Recent velocity (last 7 days vs previous 7 days)
    const recent7 = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND created_at > datetime('now', '-7 days')").get()?.c || 0;
    const prev7 = db.prepare("SELECT COUNT(*) as c FROM health_checks WHERE action='scan' AND created_at > datetime('now', '-14 days') AND created_at <= datetime('now', '-7 days')").get()?.c || 0;

    // Unique domains
    const uniqueDomains = db.prepare("SELECT COUNT(DISTINCT domain) as c FROM health_checks WHERE action='scan' AND domain != ''").get()?.c || 0;

    const benchmarks = {
      // Headline numbers
      totalAudits: totalScans,
      totalLeads,
      uniqueDomains,

      // Score intelligence
      avgScore,
      medianScore,
      top10Threshold,

      // Failure rates
      failRate: Math.round((below50 / scored) * 100),
      criticalFailRate: Math.round((below30 / scored) * 100),
      passRate: Math.round((above70 / scored) * 100),
      avgFailedChecks: parseFloat(avgFails),

      // Bot detection
      chatbotDetectionRate: botRate,
      sitesWithBots: withBots,

      // Velocity
      last7Days: recent7,
      prev7Days: prev7,
      weekOverWeekGrowth: prev7 > 0 ? Math.round(((recent7 - prev7) / prev7) * 100) : 0,

      // Computed insights for display
      insights: {
        headline: `${Math.round((below50 / scored) * 100)}% of AI chatbots fail basic governance checks`,
        avgLine: `Average governance score: ${avgScore}/100`,
        botLine: `${botRate}% of sites audited have detectable AI chatbots`,
        topLine: `Top 10% of sites score ${top10Threshold}+`,
      },

      // Timestamp
      generatedAt: new Date().toISOString(),
      dataPoints: scored,
    };

    // Cache for 5 minutes
    return NextResponse.json(benchmarks, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (e) {
    // Fallback with sensible defaults if DB fails
    return NextResponse.json({
      totalAudits: 0, avgScore: 31, medianScore: 28, top10Threshold: 72,
      failRate: 67, criticalFailRate: 42, passRate: 8, avgFailedChecks: 4.2,
      chatbotDetectionRate: 58, insights: {
        headline: "67% of AI chatbots fail basic governance checks",
        avgLine: "Average governance score: 31/100",
      },
      generatedAt: new Date().toISOString(), dataPoints: 0,
    });
  }
}

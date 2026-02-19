// app/api/cases/route.js — Case studies CRUD
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === '1';

    let cases;
    if (admin && requireAuth(request)) {
      cases = db.prepare('SELECT * FROM case_studies ORDER BY sort_order ASC, created_at DESC').all();
    } else {
      cases = db.prepare("SELECT * FROM case_studies WHERE status = 'published' ORDER BY sort_order ASC").all();
    }

    const parsed = cases.map(c => ({
      ...c,
      tags: JSON.parse(c.tags || '[]'),
      metrics: JSON.parse(c.metrics || '[]'),
    }));

    return NextResponse.json({ cases: parsed });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = getDb();
    const body = await request.json();
    const { title, subtitle, client, industry, tags, challenge, solution, results, metrics, color, sort_order, status, pdf_path } = body;

    if (!title || !client) {
      return NextResponse.json({ error: 'Title and client required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO case_studies (title, subtitle, client, industry, tags, challenge, solution, results, metrics, color, sort_order, status, pdf_path)
      VALUES (@title, @subtitle, @client, @industry, @tags, @challenge, @solution, @results, @metrics, @color, @sort_order, @status, @pdf_path)
    `).run({
      title, subtitle: subtitle || '', client, industry: industry || '',
      tags: JSON.stringify(tags || []),
      challenge: challenge || '', solution: solution || '', results: results || '',
      metrics: JSON.stringify(metrics || []),
      color: color || '#0D9488',
      sort_order: sort_order || 0,
      status: status || 'draft',
      pdf_path: pdf_path || null,
    });

    const cs = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ case_study: { ...cs, tags: JSON.parse(cs.tags), metrics: JSON.parse(cs.metrics) } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

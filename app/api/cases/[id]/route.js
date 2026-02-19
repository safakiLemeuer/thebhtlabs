// app/api/cases/[id]/route.js — Single case study CRUD
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const db = getDb();
    const { id } = await params;
    const cs = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(id);
    if (!cs) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ case_study: { ...cs, tags: JSON.parse(cs.tags || '[]'), metrics: JSON.parse(cs.metrics || '[]') } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!requireAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    const existing = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.prepare(`
      UPDATE case_studies SET
        title=@title, subtitle=@subtitle, client=@client, industry=@industry,
        tags=@tags, challenge=@challenge, solution=@solution, results=@results,
        metrics=@metrics, color=@color, sort_order=@sort_order, status=@status,
        pdf_path=@pdf_path, updated_at=CURRENT_TIMESTAMP
      WHERE id=@id
    `).run({
      id: parseInt(id),
      title: body.title || existing.title,
      subtitle: body.subtitle ?? existing.subtitle,
      client: body.client || existing.client,
      industry: body.industry ?? existing.industry,
      tags: JSON.stringify(body.tags || JSON.parse(existing.tags)),
      challenge: body.challenge ?? existing.challenge,
      solution: body.solution ?? existing.solution,
      results: body.results ?? existing.results,
      metrics: JSON.stringify(body.metrics || JSON.parse(existing.metrics)),
      color: body.color || existing.color,
      sort_order: body.sort_order ?? existing.sort_order,
      status: body.status || existing.status,
      pdf_path: body.pdf_path ?? existing.pdf_path,
    });

    const updated = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(id);
    return NextResponse.json({ case_study: { ...updated, tags: JSON.parse(updated.tags), metrics: JSON.parse(updated.metrics) } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!requireAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getDb();
    const { id } = await params;
    db.prepare('DELETE FROM case_studies WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

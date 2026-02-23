import { NextResponse } from 'next/server';

function verifyToken(authHeader) {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  const [t, sig] = token.split('.');
  if (!t || !sig) return false;
  const expected = require('crypto').createHmac('sha256', adminPass).update(t).digest('hex');
  return sig === expected;
}

export async function GET(request, { params }) {
  try {
    const { getDb } = require('@/lib/db');
    const db = getDb();
    const id = params.id;
    const post = isNaN(id)
      ? db.prepare(`SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'`).get(id)
      : db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(parseInt(id));
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    post.tags = JSON.parse(post.tags || '[]');
    post.featured = !!post.featured;
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!verifyToken(request.headers.get('authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { getDb } = require('@/lib/db');
    const db = getDb();
    const data = await request.json();
    const id = parseInt(params.id);
    const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const slug = data.title
      ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 80)
      : existing.slug;

    const wasPublished = existing.status === 'published';
    const nowPublished = (data.status || existing.status) === 'published';
    const publishedAt = (!wasPublished && nowPublished) ? new Date().toISOString() : existing.published_at;

    db.prepare(`UPDATE blog_posts SET slug=?, title=?, body=?, excerpt=?, tags=?, status=?, featured=?, read_time=?, author=?, published_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(
      slug,
      data.title || existing.title,
      data.body || existing.body,
      data.excerpt || existing.excerpt,
      JSON.stringify(data.tags || JSON.parse(existing.tags || '[]')),
      data.status || existing.status,
      data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured,
      data.read_time || existing.read_time,
      data.author || existing.author,
      publishedAt,
      id
    );

    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!verifyToken(request.headers.get('authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { getDb } = require('@/lib/db');
    const db = getDb();
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(parseInt(params.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

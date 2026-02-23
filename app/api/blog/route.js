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

export async function GET(request) {
  try {
    const { getDb } = require('@/lib/db');
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let where = admin ? '1=1' : "status = 'published'";
    const params = [];

    if (tag) {
      where += ` AND tags LIKE ?`;
      params.push(`%"${tag}"%`);
    }
    if (q) {
      where += ` AND (title LIKE ? OR body LIKE ? OR excerpt LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const total = db.prepare(`SELECT COUNT(*) as c FROM blog_posts WHERE ${where}`).get(...params).c;
    const posts = db.prepare(`SELECT * FROM blog_posts WHERE ${where} ORDER BY featured DESC, published_at DESC, created_at DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset)
      .map(p => ({ ...p, tags: JSON.parse(p.tags || '[]'), featured: !!p.featured }));

    // Get all unique tags for filtering
    const allTags = db.prepare(`SELECT tags FROM blog_posts WHERE status = 'published'`).all();
    const tagSet = new Set();
    allTags.forEach(p => JSON.parse(p.tags || '[]').forEach(t => tagSet.add(t)));

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit), tags: [...tagSet].sort() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!verifyToken(request.headers.get('authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { getDb } = require('@/lib/db');
    const db = getDb();
    const data = await request.json();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 80);
    const excerpt = data.excerpt || data.body.substring(0, 200).replace(/[#*`\n]/g, '') + '...';
    const readTime = Math.max(1, Math.round(data.body.split(/\s+/).length / 200)) + ' min';

    const r = db.prepare(`INSERT INTO blog_posts (slug, title, body, excerpt, tags, status, featured, read_time, author, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      slug, data.title, data.body, excerpt,
      JSON.stringify(data.tags || []), data.status || 'draft',
      data.featured ? 1 : 0, data.read_time || readTime,
      data.author || 'Nitin Nagar',
      data.status === 'published' ? new Date().toISOString() : null
    );

    return NextResponse.json({ id: r.lastInsertRowid, slug });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

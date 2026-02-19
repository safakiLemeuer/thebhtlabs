// app/api/blog/[id]/route.js — Single blog post CRUD
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const db = getDb();
    const { id } = await params;
    // Support lookup by id or slug
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ? OR slug = ?').get(id, id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const comments = db.prepare('SELECT id, name, body, created_at FROM blog_comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC').all(post.id);

    return NextResponse.json({
      post: { ...post, tags: JSON.parse(post.tags || '[]') },
      comments
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    const { title, body: content, excerpt, tags, status, featured, read_time } = body;

    const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Set published_at if transitioning to published
    let published_at = existing.published_at;
    if (status === 'published' && existing.status !== 'published') {
      published_at = new Date().toISOString();
    }

    db.prepare(`
      UPDATE blog_posts SET
        title = @title, body = @body, excerpt = @excerpt, tags = @tags,
        status = @status, featured = @featured, read_time = @read_time,
        published_at = @published_at, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({
      id: parseInt(id),
      title: title || existing.title,
      body: content || existing.body,
      excerpt: excerpt || existing.excerpt,
      tags: JSON.stringify(tags || JSON.parse(existing.tags)),
      status: status || existing.status,
      featured: featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      read_time: read_time || existing.read_time,
      published_at,
    });

    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    return NextResponse.json({ post: { ...post, tags: JSON.parse(post.tags) } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = getDb();
    const { id } = await params;
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

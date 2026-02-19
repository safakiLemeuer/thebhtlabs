// app/api/blog/comments/route.js — Comments CRUD
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const admin = searchParams.get('admin') === '1';

    if (admin && requireAuth(request)) {
      // Admin sees all comments
      const comments = db.prepare(`
        SELECT c.*, p.title as post_title FROM blog_comments c
        LEFT JOIN blog_posts p ON c.post_id = p.id
        ORDER BY c.created_at DESC LIMIT 100
      `).all();
      return NextResponse.json({ comments });
    }

    if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 });
    const comments = db.prepare('SELECT id, name, body, created_at FROM blog_comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC').all(postId);
    return NextResponse.json({ comments });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const { post_id, name, email, body, website } = await request.json();

    // Honeypot
    if (website) return NextResponse.json({ success: true });

    if (!post_id || !name || !body) {
      return NextResponse.json({ error: 'post_id, name, and body required' }, { status: 400 });
    }

    // Sanitize
    const clean = {
      post_id: parseInt(post_id),
      name: String(name).replace(/<[^>]*>/g, '').substring(0, 100),
      email: email ? String(email).replace(/<[^>]*>/g, '').substring(0, 200) : null,
      body: String(body).replace(/<[^>]*>/g, '').substring(0, 2000),
    };

    db.prepare('INSERT INTO blog_comments (post_id, name, email, body) VALUES (@post_id, @name, @email, @body)').run(clean);

    return NextResponse.json({ success: true, message: 'Comment submitted for review' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  // Approve/reject comments (admin only)
  if (!requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = getDb();
    const { id, approved } = await request.json();
    db.prepare('UPDATE blog_comments SET approved = ? WHERE id = ?').run(approved ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    db.prepare('DELETE FROM blog_comments WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

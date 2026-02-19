// app/api/blog/route.js — List & create blog posts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === '1';
    const tag = searchParams.get('tag');
    const search = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query, params = {};

    if (admin && requireAuth(request)) {
      // Admin sees all posts
      query = 'SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT @limit';
      params = { limit };
    } else {
      // Public sees only published
      query = 'SELECT * FROM blog_posts WHERE status = \'published\'';
      if (tag) {
        query += ' AND tags LIKE @tag';
        params.tag = `%${tag}%`;
      }
      if (search) {
        query += ' AND (title LIKE @search OR body LIKE @search OR tags LIKE @search)';
        params.search = `%${search}%`;
      }
      query += ' ORDER BY published_at DESC LIMIT @limit';
      params.limit = limit;
    }

    const posts = db.prepare(query).all(params);
    // Parse tags JSON
    const parsed = posts.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));

    // Get all tags for word cloud
    const allTags = db.prepare("SELECT tags FROM blog_posts WHERE status = 'published'").all();
    const tagCloud = {};
    allTags.forEach(row => {
      JSON.parse(row.tags || '[]').forEach(t => {
        tagCloud[t] = (tagCloud[t] || 0) + 1;
      });
    });

    return NextResponse.json({ posts: parsed, tagCloud });
  } catch (e) {
    console.error('Blog GET error:', e.message);
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
    const { title, body: content, excerpt, tags, status, featured, read_time } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and body required' }, { status: 400 });
    }

    // Generate slug
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Check uniqueness
    const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(slug);
    if (existing) slug += '-' + Date.now();

    const result = db.prepare(`
      INSERT INTO blog_posts (slug, title, body, excerpt, tags, status, featured, read_time, published_at)
      VALUES (@slug, @title, @body, @excerpt, @tags, @status, @featured, @read_time, @published_at)
    `).run({
      slug,
      title,
      body: content,
      excerpt: excerpt || content.substring(0, 200).replace(/\n/g, ' ').trim(),
      tags: JSON.stringify(tags || []),
      status: status || 'draft',
      featured: featured ? 1 : 0,
      read_time: read_time || '2 min',
      published_at: status === 'published' ? new Date().toISOString() : null,
    });

    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ post: { ...post, tags: JSON.parse(post.tags) } }, { status: 201 });
  } catch (e) {
    console.error('Blog POST error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

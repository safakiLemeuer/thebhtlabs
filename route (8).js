// app/api/admin/auth/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass) {
      return NextResponse.json({ error: 'Admin password not configured. Set ADMIN_PASSWORD in .env.local' }, { status: 500 });
    }

    if (!password || password !== adminPass) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a simple session token
    const token = crypto.randomBytes(32).toString('hex');
    // In production you'd store this server-side; for simplicity we use a signed token
    const sig = crypto.createHmac('sha256', adminPass).update(token).digest('hex');

    return NextResponse.json({ token: `${token}.${sig}` });
  } catch (e) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

// Verify token helper — exported for use in other routes
export function verifyToken(authHeader) {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  const [t, sig] = token.split('.');
  if (!t || !sig) return false;
  const expected = require('crypto').createHmac('sha256', adminPass).update(t).digest('hex');
  return sig === expected;
}

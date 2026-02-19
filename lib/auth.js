// lib/auth.js — Token verification helper
import crypto from 'crypto';

export function verifyToken(authHeader) {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || !authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [t, sig] = parts;
  const expected = crypto.createHmac('sha256', adminPass).update(t).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
}

export function requireAuth(request) {
  const auth = request.headers.get('authorization');
  if (!verifyToken(auth)) {
    return false;
  }
  return true;
}

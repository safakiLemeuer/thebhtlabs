// lib/auth.js — Shared admin auth verification
import crypto from 'crypto';

export function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const adminPass = process.env.ADMIN_PASSWORD;
  
  if (!adminPass || !token) return false;
  
  // Method 1: Raw password (curl)
  if (token === adminPass) return true;
  
  // Method 2: HMAC signed token (admin UI)
  const dotIdx = token.indexOf('.');
  if (dotIdx === -1) return false;
  const t = token.substring(0, dotIdx);
  const sig = token.substring(dotIdx + 1);
  if (!t || !sig) return false;
  
  try {
    const expected = crypto.createHmac('sha256', adminPass).update(t).digest('hex');
    return sig === expected;
  } catch (e) {
    return false;
  }
}

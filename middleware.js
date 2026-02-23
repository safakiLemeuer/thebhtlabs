// middleware.js — Security headers, bot blocking, rate limiting
import { NextResponse } from 'next/server';

// Simple in-memory rate limiter for API routes
const rateMap = new Map();
const RATE_WINDOW = 60000; // 1 minute
const RATE_LIMIT_API = 30;  // 30 requests per minute per IP for API
const RATE_LIMIT_FORM = 5;  // 5 form submissions per minute per IP

// Known malicious bot user agents
const BLOCKED_BOTS = [
  'zgrab', 'masscan', 'sqlmap', 'nikto', 'nmap', 'dirbuster',
  'gobuster', 'wpscan', 'jorgee', 'censys', 'shodan',
  'python-requests', 'go-http-client', 'curl/', 'wget/',
];

function getIP(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function checkRate(ip, limit) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count++;
  rateMap.set(ip, entry);

  // Clean old entries periodically
  if (rateMap.size > 10000) {
    for (const [k, v] of rateMap) {
      if (now - v.start > RATE_WINDOW * 5) rateMap.delete(k);
    }
  }

  return entry.count <= limit;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const ip = getIP(request);

  // Block malicious bots
  if (BLOCKED_BOTS.some(bot => ua.includes(bot))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const limit = (pathname === '/api/contact' || pathname === '/api/assessment')
      ? RATE_LIMIT_FORM
      : RATE_LIMIT_API;

    if (!checkRate(`${ip}:${pathname}`, limit)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Content Security Policy
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.anthropic.com https://api.rss2json.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '));

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

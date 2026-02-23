'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const C = { teal:'#0E7490', navy:'#1C1917', bg:'#FFFFFF', bgSoft:'#FAFAF9', border:'#E7E5E4', text:'#1C1917', textMuted:'#78716C', textFaint:'#A8A29E' };
const F = { h:"'Poppins',sans-serif", m:"'DM Mono',monospace" };

function renderBody(body) {
  if (!body) return '';
  return body
    .replace(/^### (.*$)/gm, '<h3 style="font-size:18px;font-weight:700;color:#1C1917;margin:28px 0 12px">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="font-size:22px;font-weight:700;color:#1C1917;margin:32px 0 14px">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="font-size:26px;font-weight:800;color:#1C1917;margin:36px 0 16px">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#F5F5F4;padding:2px 6px;border-radius:4px;font-size:13px;font-family:DM Mono,monospace">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin:0 0 16px;line-height:1.8;color:#44403C;font-size:16px">')
    .replace(/\n/g, '<br/>');
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/blog/${params.slug}`).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(d => { setPost(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.h, color:C.textMuted }}>Loading...</div>;
  if (!post) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:F.h, gap:16 }}>
      <h1 style={{ fontSize:24, fontWeight:800, color:C.navy }}>Post not found</h1>
      <Link href="/blog" style={{ color:C.teal, fontWeight:600, textDecoration:'none' }}>← Back to Insights</Link>
    </div>
  );

  const url = typeof window !== 'undefined' ? window.location.href : `https://thebhtlabs.com/blog/${post.slug}`;
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xShare = `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`;

  // Contextual CTA based on tags
  const isGov = post.tags.some(t => /federal|M-25|CMMC|govdef|defense|FedRAMP/i.test(t));
  const isBot = post.tags.some(t => /copilot|chatbot|bot|governance/i.test(t));
  const ctaText = isGov ? 'Explore Federal AI Tools' : isBot ? 'Audit Your AI Bot — Free' : 'Take the 35-Point Assessment';
  const ctaHref = isGov ? '/#fed-tools' : isBot ? '/#healthcheck' : '/#assess';

  const published = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : '';

  return (
    <div style={{ minHeight:'100vh', background:C.bgSoft, fontFamily:F.h }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <header style={{ background:C.bg, borderBottom:`1px solid ${C.border}`, padding:'16px 0' }}>
        <div style={{ maxWidth:720, margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ textDecoration:'none', fontSize:20, fontWeight:800, color:C.navy }}>TheBHT<span style={{color:C.teal}}>Labs</span></Link>
          <Link href="/blog" style={{ fontSize:13, fontWeight:600, color:C.textMuted, textDecoration:'none' }}>← All Posts</Link>
        </div>
      </header>

      <article style={{ maxWidth:720, margin:'0 auto', padding:'48px 24px' }}>
        {/* Tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
          {post.tags.map(t => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}
              style={{ fontSize:11, padding:'4px 10px', borderRadius:12, background:C.teal+'10', color:C.teal, fontWeight:600, textDecoration:'none' }}>{t}</Link>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize:32, fontWeight:800, color:C.navy, lineHeight:1.3, marginBottom:16 }}>{post.title}</h1>

        {/* Meta */}
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:32, color:C.textFaint, fontSize:13 }}>
          <span style={{ fontWeight:600, color:C.textMuted }}>{post.author}</span>
          {published && <><span>·</span><span>{published}</span></>}
          <span>·</span>
          <span style={{ fontFamily:F.m }}>{post.read_time}</span>
        </div>

        {/* Body */}
        <div style={{ fontSize:16, lineHeight:1.8, color:'#44403C' }}
          dangerouslySetInnerHTML={{ __html: `<p style="margin:0 0 16px;line-height:1.8;color:#44403C;font-size:16px">${renderBody(post.body)}</p>` }} />

        {/* Share bar */}
        <div style={{ borderTop:`1px solid ${C.border}`, marginTop:40, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:600, color:C.textMuted }}>Share this post</span>
          <div style={{ display:'flex', gap:8 }}>
            <a href={linkedIn} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none', color:C.navy, fontSize:13, fontWeight:600, background:C.bg, transition:'all .15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href={xShare} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none', color:C.navy, fontSize:13, fontWeight:600, background:C.bg, transition:'all .15s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Post on X
            </a>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop:32, padding:28, borderRadius:14, background:C.teal+'08', border:`1px solid ${C.teal}20`, textAlign:'center' }}>
          <p style={{ fontSize:15, fontWeight:600, color:C.navy, marginBottom:12 }}>Want to see where your organization stands?</p>
          <Link href={ctaHref}
            style={{ display:'inline-block', padding:'12px 28px', borderRadius:10, background:C.teal, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 14px ${C.teal}22` }}>
            {ctaText}
          </Link>
        </div>
      </article>

      <footer style={{ padding:'40px 0', textAlign:'center', color:C.textFaint, fontSize:12 }}>
        <Link href="/blog" style={{ color:C.teal, textDecoration:'none', fontWeight:600 }}>← Back to Insights</Link>
      </footer>
    </div>
  );
}

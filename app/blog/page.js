'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = { teal:'#0E7490', navy:'#1C1917', bg:'#FFFFFF', bgSoft:'#FAFAF9', border:'#E7E5E4', text:'#1C1917', textMuted:'#78716C', textFaint:'#A8A29E' };
const F = { h:"'Poppins',sans-serif", m:"'DM Mono',monospace" };

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTag) params.set('tag', activeTag);
    if (search) params.set('q', search);
    setLoading(true);
    fetch(`/api/blog?${params}`).then(r => r.json()).then(d => {
      setPosts(d.posts || []);
      setTags(d.tags || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeTag, search]);

  const shareUrl = (slug, title) => ({
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://thebhtlabs.com/blog/${slug}`)}`,
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(`https://thebhtlabs.com/blog/${slug}`)}`
  });

  return (
    <div style={{ minHeight:'100vh', background:C.bgSoft, fontFamily:F.h }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <header style={{ background:C.bg, borderBottom:`1px solid ${C.border}`, padding:'16px 0' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ textDecoration:'none', fontSize:20, fontWeight:800, color:C.navy }}>
            TheBHT<span style={{ color:C.teal }}>Labs</span>
          </Link>
          <span style={{ fontSize:13, fontWeight:600, color:C.textMuted, letterSpacing:1, textTransform:'uppercase' }}>Insights</span>
        </div>
      </header>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>
        {/* Title + search */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:32, fontWeight:800, color:C.navy, marginBottom:8 }}>Insights</h1>
          <p style={{ color:C.textMuted, fontSize:15, lineHeight:1.6, marginBottom:20 }}>
            AI governance, federal compliance, and Microsoft ecosystem — from the field.
          </p>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
            style={{ width:'100%', maxWidth:400, padding:'10px 16px', borderRadius:10, border:`1px solid ${C.border}`, fontSize:14, outline:'none', fontFamily:F.h, boxSizing:'border-box' }} />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:28 }}>
            <button onClick={() => setActiveTag('')}
              style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${!activeTag?C.teal:C.border}`, background:!activeTag?C.teal+'10':C.bg, color:!activeTag?C.teal:C.textMuted, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:F.h }}>
              All
            </button>
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(activeTag===t?'':t)}
                style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${activeTag===t?C.teal:C.border}`, background:activeTag===t?C.teal+'10':C.bg, color:activeTag===t?C.teal:C.textMuted, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:F.h }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Posts grid */}
        {loading ? <p style={{ color:C.textMuted }}>Loading...</p> : posts.length === 0 ? (
          <p style={{ color:C.textMuted, textAlign:'center', padding:60 }}>No posts found.</p>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
            {posts.map(p => {
              const urls = shareUrl(p.slug, p.title);
              return (
                <article key={p.id} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', transition:'box-shadow .2s', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ padding:24 }}>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                      {p.tags.map(t => (
                        <span key={t} onClick={() => setActiveTag(t)} style={{ fontSize:10, padding:'3px 8px', borderRadius:10, background:C.teal+'10', color:C.teal, fontWeight:600, cursor:'pointer' }}>{t}</span>
                      ))}
                    </div>
                    <Link href={`/blog/${p.slug}`} style={{ textDecoration:'none' }}>
                      <h2 style={{ fontSize:17, fontWeight:700, color:C.navy, lineHeight:1.4, marginBottom:8 }}>{p.title}</h2>
                    </Link>
                    <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.6, marginBottom:16 }}>{p.excerpt}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span style={{ fontSize:11, color:C.textFaint, fontFamily:F.m }}>{p.read_time}</span>
                        <span style={{ fontSize:11, color:C.textFaint }}>·</span>
                        <span style={{ fontSize:11, color:C.textFaint }}>{p.author}</span>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <a href={urls.linkedin} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn"
                          style={{ width:28, height:28, borderRadius:6, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', color:C.textMuted, fontSize:12, transition:'all .15s' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <a href={urls.x} target="_blank" rel="noopener noreferrer" title="Share on X"
                          style={{ width:28, height:28, borderRadius:6, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', color:C.textMuted, fontSize:12, transition:'all .15s' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Minimal footer */}
      <footer style={{ padding:'40px 0', textAlign:'center', color:C.textFaint, fontSize:12 }}>
        <Link href="/" style={{ color:C.teal, textDecoration:'none', fontWeight:600 }}>← Back to TheBHTLabs.com</Link>
      </footer>
    </div>
  );
}

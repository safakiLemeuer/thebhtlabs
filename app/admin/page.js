'use client';
import { useState, useEffect, useCallback } from 'react';

const C = { teal:'#0D9488', navy:'#0F172A', bg:'#FFFFFF', bgSoft:'#F8FAFC', border:'#E2E8F0', text:'#0F172A', textMuted:'#64748B', red:'#EF4444', green:'#10B981' };

export default function AdminPortal() {
  const [token, setToken] = useState(null);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    const t = typeof window !== 'undefined' && sessionStorage.getItem('bht_admin');
    if (t) setToken(t);
  }, []);

  const login = async () => {
    setErr('');
    const r = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
    const d = await r.json();
    if (r.ok) { setToken(d.token); sessionStorage.setItem('bht_admin', d.token); }
    else setErr(d.error || 'Login failed');
  };

  const logout = () => { setToken(null); sessionStorage.removeItem('bht_admin'); };
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  if (!token) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bgSoft, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: 400, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 8 }}>TheBHT<span style={{ color: C.teal }}>Labs</span> Admin</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>Enter admin password</p>
        {err && <p style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Password" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }} />
        <button onClick={login} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Login</button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'posts', label: 'Blog Posts', icon: '📝' },
    { id: 'cases', label: 'Case Studies', icon: '📋' },
    { id: 'comments', label: 'Comments', icon: '💬' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: C.navy, color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>TheBHT<span style={{ color: C.teal }}>Labs</span> CMS</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: tab === t.id ? 'rgba(255,255,255,.15)' : 'transparent', color: tab === t.id ? '#fff' : 'rgba(255,255,255,.6)' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>View Site ↗</a>
          <button onClick={logout} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,.2)', background: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {tab === 'posts' && <BlogManager headers={headers} />}
        {tab === 'cases' && <CaseManager headers={headers} />}
        {tab === 'comments' && <CommentManager headers={headers} />}
      </div>
    </div>
  );
}

/* ═══════════════ BLOG MANAGER ═══════════════ */
function BlogManager({ headers }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, 'new' or post object
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/blog?admin=1', { headers });
    const d = await r.json();
    setPosts(d.posts || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  if (editing) return <BlogEditor post={editing === 'new' ? null : editing} headers={headers} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>Blog Posts ({posts.length})</h2>
        <button onClick={() => setEditing('new')} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ New Post</button>
      </div>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map(p => (
            <div key={p.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.status === 'published' ? C.green : '#F59E0B' }} />
                  <span style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>{p.status}</span>
                  {p.featured ? <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>FEATURED</span> : null}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{p.title}</h3>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {p.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: C.teal + '15', color: C.teal, fontWeight: 600 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => setEditing(p)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={async () => { if (confirm('Delete this post?')) { await fetch(`/api/blog/${p.id}`, { method: 'DELETE', headers }); load(); } }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.red}33`, background: C.red + '08', color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ═══════════════ BLOG EDITOR — Markdown + Live Preview ═══════════════ */
function BlogEditor({ post, headers, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '', body: post?.body || '', excerpt: post?.excerpt || '',
    tags: post?.tags?.join(', ') || '', status: post?.status || 'draft',
    featured: post?.featured || false, read_time: post?.read_time || '2 min'
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: form.featured,
    };
    const url = post ? `/api/blog/${post.id}` : '/api/blog';
    const method = post ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    setSaving(false);
    onSave();
  };

  // Simple markdown to HTML preview
  const renderMd = (md) => {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gm, '<h3 style="font-size:16px;font-weight:700;margin:16px 0 8px">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size:18px;font-weight:700;margin:16px 0 8px">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size:22px;font-weight:800;margin:16px 0 8px">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#F1F5F9;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 12px;line-height:1.7">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{post ? 'Edit Post' : 'New Post'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving || !form.title || !form.body}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 16 }}>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title *"
          style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none', gridColumn: '1/3' }} />
        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma-separated)"
          style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt (auto-generated if empty)"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }} />
        <input value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} placeholder="Read time"
          style={{ width: 100, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
      </div>

      {/* Markdown editor + preview side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 'calc(100vh - 300px)', minHeight: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Markdown Editor</div>
          <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Write your post in Markdown..."
            style={{ flex: 1, padding: 16, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.7, resize: 'none', outline: 'none', background: '#FAFBFC' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Live Preview</div>
          <div style={{ flex: 1, padding: 16, borderRadius: 10, border: `1px solid ${C.border}`, overflowY: 'auto', background: C.bg, fontSize: 14, lineHeight: 1.7, color: C.text }}
            dangerouslySetInnerHTML={{ __html: `<p style="margin:0 0 12px;line-height:1.7">${renderMd(form.body)}</p>` }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CASE STUDY MANAGER ═══════════════ */
function CaseManager({ headers }) {
  const [cases, setCases] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/cases?admin=1', { headers });
    const d = await r.json();
    setCases(d.cases || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  if (editing) return <CaseEditor cs={editing === 'new' ? null : editing} headers={headers} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>Case Studies ({cases.length})</h2>
        <button onClick={() => setEditing('new')} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ New Case Study</button>
      </div>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cases.map(c => (
            <div key={c.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.status === 'published' ? C.green : '#F59E0B' }} />
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>{c.status.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>Order: {c.sort_order}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{c.title}</h3>
                <p style={{ fontSize: 12, color: C.textMuted }}>{c.client} · {c.industry}</p>
                {c.pdf_path && <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>📄 PDF attached</span>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditing(c)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={async () => { if (confirm('Delete?')) { await fetch(`/api/cases/${c.id}`, { method: 'DELETE', headers }); load(); } }}
                  style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.red}33`, background: C.red + '08', color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ═══════════════ CASE STUDY EDITOR ═══════════════ */
function CaseEditor({ cs, headers, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: cs?.title || '', subtitle: cs?.subtitle || '', client: cs?.client || '',
    industry: cs?.industry || '', tags: cs?.tags?.join(', ') || '',
    challenge: cs?.challenge || '', solution: cs?.solution || '', results: cs?.results || '',
    metrics: cs?.metrics || [], color: cs?.color || '#0D9488',
    sort_order: cs?.sort_order || 0, status: cs?.status || 'draft', pdf_path: cs?.pdf_path || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), sort_order: parseInt(form.sort_order) };
    const url = cs ? `/api/cases/${cs.id}` : '/api/cases';
    const method = cs ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(payload) });
    setSaving(false);
    onSave();
  };

  const uploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': headers.Authorization }, body: fd });
    const d = await r.json();
    if (d.path) setForm({ ...form, pdf_path: d.path });
    setUploading(false);
  };

  const addMetric = () => setForm({ ...form, metrics: [...form.metrics, { label: '', value: '' }] });
  const updateMetric = (i, k, v) => { const m = [...form.metrics]; m[i] = { ...m[i], [k]: v }; setForm({ ...form, metrics: m }); };
  const removeMetric = (i) => { const m = [...form.metrics]; m.splice(i, 1); setForm({ ...form, metrics: m }); };

  const I = ({ label, field, area }) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
      {area ? <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3}
        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', resize: 'vertical', marginTop: 4, boxSizing: 'border-box' }} />
        : <input value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4, boxSizing: 'border-box' }} />
      }
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{cs ? 'Edit Case Study' : 'New Case Study'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <I label="Title *" field="title" />
          <I label="Subtitle" field="subtitle" />
          <I label="Client *" field="client" />
          <I label="Industry" field="industry" />
          <I label="Tags (comma-separated)" field="tags" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Color</label>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: '100%', height: 36, border: 'none', marginTop: 4, cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: 'none', marginTop: 4 }}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <I label="Challenge" field="challenge" area />
          <I label="Solution" field="solution" area />
          <I label="Results" field="results" area />
        </div>
        {/* Metrics */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Key Metrics</label>
            <button onClick={addMetric} style={{ fontSize: 12, color: C.teal, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Metric</button>
          </div>
          {form.metrics.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }} />
              <input value={m.value} onChange={e => updateMetric(i, 'value', e.target.value)} placeholder="Value" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }} />
              <button onClick={() => removeMetric(i)} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>
          ))}
        </div>
        {/* PDF Upload */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>PDF Attachment</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <input type="file" accept=".pdf" onChange={uploadPdf} style={{ fontSize: 13 }} />
            {uploading && <span style={{ fontSize: 12, color: C.teal }}>Uploading...</span>}
            {form.pdf_path && <a href={form.pdf_path} target="_blank" rel="noopener" style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>📄 {form.pdf_path}</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ COMMENT MANAGER ═══════════════ */
function CommentManager({ headers }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/blog/comments?admin=1', { headers });
    const d = await r.json();
    setComments(d.comments || []);
    setLoading(false);
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id, approved) => {
    await fetch('/api/blog/comments', { method: 'PUT', headers, body: JSON.stringify({ id, approved }) });
    load();
  };

  const del = async (id) => {
    await fetch(`/api/blog/comments?id=${id}`, { method: 'DELETE', headers });
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Comments ({comments.length})</h2>
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> :
        comments.length === 0 ? <p style={{ color: C.textMuted }}>No comments yet</p> :
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {comments.map(c => (
              <div key={c.id} style={{ background: C.bg, border: `1px solid ${c.approved ? C.green + '33' : '#F59E0B33'}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{c.name}</span>
                    {c.email && <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>{c.email}</span>}
                    <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 8 }}>on "{c.post_title}"</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!c.approved && <button onClick={() => approve(c.id, true)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: C.green, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Approve</button>}
                    {c.approved && <button onClick={() => approve(c.id, false)} style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${C.border}`, background: C.bg, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Unapprove</button>}
                    <button onClick={() => del(c.id)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: C.red + '15', color: C.red, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.text, marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

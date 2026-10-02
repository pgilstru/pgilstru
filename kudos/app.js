/* Kudos (inject builder) — static, no build step. See README.md. */
(function () {
  'use strict';

  const STORAGE_KEY = 'kudos.draft.v1';
  const HOSTS_KEY = 'kudos.hosts.v1';
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const CLOSING = 'If there are any concerns, questions, or clarifications, please do not hesitate to reach out.';
  const OS_OPTIONS = ['Linux', 'Windows', 'Network device', 'Other'];
  const SAMPLE_HOSTS = [
    ['Ubuntu Ecom', 'Linux', '172.20.242.30'],
    ['Fedora Webmail', 'Linux', '172.20.242.40'],
    ['Splunk (Oracle 9)', 'Linux', '172.20.242.20'],
    ['Ubuntu Workstation', 'Linux', 'DHCP'],
    ['Server 2019 AD/DNS', 'Windows', '172.20.240.102'],
    ['Server 2019 Web', 'Windows', '172.20.240.101'],
    ['Server 2022 FTP', 'Windows', '172.20.240.104'],
    ['Windows 11 Workstation', 'Windows', '172.20.240.100'],
  ];
  const SNIPPETS = {
    partial: { heading: '', text: 'We were unable to finish {{unfinished_task}} at this time due to the prioritized defense of the ongoing cyber attacks. We will continue working on this and will inform you when the task is complete.' },
    pleaseNote: { heading: '', text: '**Please note that {{note}}.**' },
    ai: { heading: '', text: 'AI was used to assist in the creation of this {{ai_artifact}}. Specifically, free Google Gemini (gemini.google.com) was utilized, and the output was reviewed and tested by our team before it was deployed.' },
    sources: { heading: 'Sources:', level: 2, text: '- {{source_url}}' },
  };

  const TYPES = window.INJECT_TYPES || [];
  const findType = id => TYPES.find(t => t.id === id);
  const findVariant = (tid, vid) => { const t = findType(tid); return t && t.variants.find(v => v.id === vid); };

  // ---------- helpers ----------
  const uid = () => Math.random().toString(36).slice(2, 10);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clone = o => JSON.parse(JSON.stringify(o));
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'text') e.textContent = v;
      else if (k === 'value') e.value = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function fmtDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    return m ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : '';
  }
  const osClass = os => /linux/i.test(os) ? 'linux' : /windows/i.test(os) ? 'windows' : 'other';

  // ---------- state ----------
  function defaultState() {
    return {
      meta: {
        team: '07', injectNo: '', to: '', from: 'Team {{team}}', date: today(), subject: '', company: '',
        summaryLabel: 'Summary:', closing: CLOSING, signoff: 'With Regards,', signature: 'Team {{team}}',
      },
      hosts: [],
      typeId: '', variantId: '',
      vars: {},
      summary: '',
      sections: [],
      checklist: { text: '', done: {} },
    };
  }
  let state = defaultState();
  let pickedType = '';

  function hostsFor(filter, exclude) {
    return state.hosts.filter(hs => hs.name.trim()
      && (!filter || filter === 'all' || osClass(hs.os) === filter)
      && !(exclude && exclude[hs.id]));
  }
  function values() {
    const names = f => hostsFor(f).map(hs => hs.name).join(', ');
    const v = {
      team: state.meta.team, company: state.meta.company, to: state.meta.to,
      hosts_all: names('all'), hosts_linux: names('linux'), hosts_windows: names('windows'),
    };
    for (const [k, val] of Object.entries(state.vars)) if (val) v[k] = val;
    return v;
  }
  const hostVals = (vals, hs) => ({ ...vals, host: hs.name, host_os: hs.os, host_ip: hs.ip });
  const PH_RE = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;
  const PROMPT_RE = /\[\[[^\]]+\]\]/g; // template prompts still to be written
  const subst = (text, vals) => String(text || '').replace(PH_RE, (m, k) => vals[k] || `{{${k}}}`);

  // ---------- instantiate a draft ----------
  function hostRowsFor(def) {
    const vals = values();
    return hostsFor(def.filter || 'all').map(hs => def.cells.map(c => subst(c, hostVals(vals, hs))));
  }
  function makeSection(def) {
    const s = {
      uid: uid(), srcId: def.id || null, on: def.on !== false,
      heading: def.heading || '', level: def.level || 1, text: def.text || '',
      table: null, hostRows: null, perHost: null, evidence: [], captions: def.evidence || [],
    };
    if (def.table) {
      s.table = { columns: clone(def.table.columns), rows: clone(def.table.rows || []) };
      if (def.table.hostRows) {
        s.hostRows = clone(def.table.hostRows);
        const rows = hostRowsFor(def.table.hostRows);
        if (rows.length) s.table.rows = rows;
      }
      if (!s.table.rows.length) s.table.rows = [def.table.columns.map(() => '')];
    }
    if (def.perHost) {
      s.perHost = {
        filter: def.perHost.filter || 'all', label: def.perHost.label || '{{host}}:', text: def.perHost.text || '',
        table: def.perHost.table ? { columns: clone(def.perHost.table.columns), rows: clone(def.perHost.table.rows || []) } : null,
        captions: def.perHost.evidence || [], exclude: {}, tables: {}, evidence: {},
      };
    }
    return s;
  }
  function applyVariant(t, v) {
    state.typeId = t.id; state.variantId = v.id;
    const vars = {};
    for (const d of v.vars || []) vars[d.key] = state.vars[d.key] || d.default || '';
    state.vars = vars;
    state.meta.subject = v.subject || t.name;
    if (v.to && !state.meta.to) state.meta.to = v.to;
    state.summary = v.summary || '';
    state.sections = (v.sections || []).map(makeSection);
  }
  function hasWork() {
    return state.sections.some(s => s.evidence.length || (s.perHost && Object.values(s.perHost.evidence).some(a => a.length)))
      || state.sections.some(s => s.edited);
  }

  // ---------- mini markdown ----------
  // paragraphs, "- " bullets, "1. " numbered, ``` code, "### " sub-heading, **bold**, `code`
  function parseBlocks(text) {
    const blocks = [];
    let para = [], list = null, code = null;
    const flushPara = () => { if (para.length) blocks.push({ type: 'p', text: para.join(' ') }); para = []; };
    const flushList = () => { if (list) blocks.push(list); list = null; };
    for (const line of String(text || '').replace(/\r/g, '').split('\n')) {
      if (code) {
        if (line.trim().startsWith('```')) { blocks.push({ type: 'code', text: code.join('\n') }); code = null; }
        else code.push(line);
        continue;
      }
      if (line.trim().startsWith('```')) { flushPara(); flushList(); code = []; continue; }
      const hd = /^\s*#{2,4}\s+(.*)$/.exec(line);
      if (hd) { flushPara(); flushList(); blocks.push({ type: 'h3', text: hd[1] }); continue; }
      const ul = /^\s*[-*•]\s+(.*)$/.exec(line);
      const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
      if (ul || ol) {
        const kind = ul ? 'ul' : 'ol';
        flushPara();
        if (!list || list.type !== kind) { flushList(); list = { type: kind, items: [] }; }
        list.items.push((ul || ol)[1]);
        continue;
      }
      if (!line.trim()) { flushPara(); flushList(); continue; }
      if (list && /^\s{2,}\S/.test(line)) { list.items[list.items.length - 1] += ' ' + line.trim(); continue; }
      flushList();
      para.push(line.trim());
    }
    if (code) blocks.push({ type: 'code', text: code.join('\n') });
    flushPara(); flushList();
    return blocks;
  }
  function inlineTokens(text) {
    const out = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\{\{[a-z0-9_]+\}\}|\[\[[^\]]+\]\])/gi;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ t: text.slice(last, m.index) });
      const tok = m[0];
      if (tok.startsWith('**')) out.push({ t: tok.slice(2, -2), bold: true });
      else if (tok.startsWith('`')) out.push({ t: tok.slice(1, -1), code: true });
      else out.push({ t: tok, ph: true });
      last = re.lastIndex;
    }
    if (last < text.length) out.push({ t: text.slice(last) });
    return out;
  }
  const inlineHtml = text => inlineTokens(text).map(k =>
    k.bold ? `<b>${esc(k.t)}</b>` : k.code ? `<code>${esc(k.t)}</code>` : k.ph ? `<span class="ph">${esc(k.t)}</span>` : esc(k.t)).join('');

  // ---------- document model (shared by preview and export) ----------
  function docModel() {
    const vals = values();
    const out = [];
    let n = 0;
    const figs = list => list.forEach(ev => out.push({ t: 'fig', ev, n: ++n }));
    const md = (text, v) => { const s = subst(text, v); if (s.trim()) out.push({ t: 'md', blocks: parseBlocks(s) }); };
    const table = (tb, v) => {
      const rows = tb ? tb.rows.filter(r => r.some(c => String(c || '').trim())) : [];
      if (!rows.length) return;
      out.push({ t: 'table', columns: tb.columns.map(c => subst(c, v)), rows: rows.map(r => r.map(c => subst(c, v))) });
    };
    for (const s of state.sections) {
      if (!s.on) continue;
      if (s.heading.trim()) out.push({ t: 'h', level: s.level, text: subst(s.heading, vals) });
      md(s.text, vals);
      table(s.table, vals);
      figs(s.evidence);
      if (s.perHost) {
        for (const hs of hostsFor(s.perHost.filter, s.perHost.exclude)) {
          const hv = hostVals(vals, hs);
          out.push({ t: 'h', level: Math.min(3, s.level + 1), text: subst(s.perHost.label, hv) });
          md(s.perHost.text, hv);
          if (s.perHost.table) table({ columns: s.perHost.table.columns, rows: s.perHost.tables[hs.id] || s.perHost.table.rows }, hv);
          figs(s.perHost.evidence[hs.id] || []);
        }
      }
    }
    return out;
  }
  function allText() {
    const vals = values();
    const parts = [state.meta.to, state.meta.from, state.meta.subject, state.meta.signature, state.summary];
    for (const s of state.sections) {
      if (!s.on) continue;
      parts.push(s.heading, s.text, ...s.evidence.map(e => e.caption));
      if (s.table) parts.push(...s.table.columns, ...s.table.rows.flat());
      if (s.perHost) parts.push(s.perHost.text);
    }
    return parts.map(p => subst(p, vals)).join('\n');
  }

  // ---------- preview ----------
  function blocksHtml(blocks) {
    return blocks.map(b => {
      if (b.type === 'p') return `<p>${inlineHtml(b.text)}</p>`;
      if (b.type === 'h3') return `<h3>${inlineHtml(b.text)}</h3>`;
      if (b.type === 'ul' || b.type === 'ol') return `<${b.type}>${b.items.map(i => `<li>${inlineHtml(i)}</li>`).join('')}</${b.type}>`;
      return `<pre>${esc(b.text)}</pre>`;
    }).join('');
  }
  function renderPreview() {
    const vals = values();
    const m = state.meta;
    let html = `<div class="memo">INTEROFFICE MEMORANDUM</div><div class="hdr">
      <p>To: ${inlineHtml(subst(m.to, vals)) || '<span class="ph">to</span>'}</p>
      <p>From: ${inlineHtml(subst(m.from, vals))}</p>
      <p>Date: ${esc(fmtDate(m.date))}</p>
      <p>Subject: ${inlineHtml(subst(m.subject, vals)) || '<span class="ph">subject</span>'}</p></div>`;
    if (m.summaryLabel) html += `<h1>${esc(m.summaryLabel)}</h1>`;
    html += blocksHtml(parseBlocks(subst(state.summary, vals)));
    for (const b of docModel()) {
      if (b.t === 'h') html += `<h${b.level}>${inlineHtml(b.text)}</h${b.level}>`;
      else if (b.t === 'md') html += blocksHtml(b.blocks);
      else if (b.t === 'table') html += `<table><tr>${b.columns.map(c => `<th>${inlineHtml(c)}</th>`).join('')}</tr>${b.rows.map(r => `<tr>${r.map(c => `<td>${inlineHtml(c).replace(/\n/g, '<br>')}</td>`).join('')}</tr>`).join('')}</table>`;
      else if (b.t === 'fig') {
        const body = b.ev.type === 'image' ? `<img src="${b.ev.data}" alt="">` : `<pre>${esc(b.ev.text || '')}</pre>`;
        html += `<figure>${body}<figcaption><i>Figure ${b.n}. ${inlineHtml(subst(b.ev.caption || '', vals)) || '<span class="ph">caption</span>'}</i></figcaption></figure>`;
      }
    }
    html += `<p class="sig">${inlineHtml(subst(m.closing, vals))}</p><p>${esc(m.signoff)}<br>${subst(m.signature, vals).split('\n').map(inlineHtml).join('<br>')}</p>`;
    $('#preview').innerHTML = html;
    const all = allText();
    const left = new Set(Array.from(all.matchAll(PH_RE), x => x[1])).size + (all.match(PROMPT_RE) || []).length;
    $('#saveStatus').dataset.ph = left ? `· ${left} unfilled prompt${left > 1 ? 's' : ''}` : '';
    updateStatus();
  }

  // ---------- checklist (private, never exported) ----------
  function checkItems() {
    return state.checklist.text.split('\n')
      .map(l => l.replace(/^\s*(?:[-*•]|\d+[.)]|\[\s?\]|\[x\])\s*/i, '').trim())
      .filter(Boolean);
  }
  function renderChecklist() {
    const ul = $('#checkList');
    ul.innerHTML = '';
    const items = checkItems();
    let done = 0;
    items.forEach(it => {
      const on = !!state.checklist.done[it];
      if (on) done++;
      ul.append(h('li', { class: on ? 'done' : '' }, h('label', {},
        h('input', { type: 'checkbox', checked: on, onchange: e => { state.checklist.done[it] = e.target.checked; renderChecklist(); save(); } }),
        h('span', { text: it }))));
    });
    $('#checkCount').textContent = items.length ? `${done} of ${items.length} done · private, never exported` : 'private — never exported';
  }

  // ---------- type picker ----------
  function renderTypeGrid() {
    const q = $('#typeSearch').value.trim().toLowerCase();
    const grid = $('#typeGrid');
    grid.innerHTML = '';
    const match = t => !q || [t.name, t.description, ...t.variants.map(v => v.name + ' ' + (v.description || ''))].join(' ').toLowerCase().includes(q);
    const blank = h('button', { class: !state.typeId && pickedType === '__blank' ? 'active' : '', onclick: () => { pickedType = '__blank'; renderTypeGrid(); renderVariants(); } },
      'Blank memo', h('small', { text: 'Header, summary and your own sections' }));
    if (!q) grid.append(blank);
    TYPES.filter(match).forEach(t => grid.append(h('button', {
      class: (pickedType || state.typeId) === t.id ? 'active' : '',
      onclick: () => { pickedType = t.id; renderTypeGrid(); renderVariants(); },
    }, t.name, h('small', { text: `${t.variants.length} draft${t.variants.length > 1 ? 's' : ''}` }))));
  }
  function renderVariants() {
    const panel = $('#variantPanel');
    panel.innerHTML = '';
    const tid = pickedType || state.typeId;
    if (!tid) { panel.hidden = true; return; }
    panel.hidden = false;
    if (tid === '__blank') {
      panel.append(useButton(() => {
        state.typeId = ''; state.variantId = ''; state.vars = {}; state.summary = ''; state.sections = [makeSection({ heading: '', text: '' })];
      }, 'Start a blank memo'));
      return;
    }
    const t = findType(tid);
    if (t.description) panel.append(h('p', { class: 'muted small', text: t.description }));
    let chosen = state.typeId === t.id ? state.variantId : t.variants[0].id;
    t.variants.forEach(v => panel.append(h('label', { class: 'variant' },
      h('input', { type: 'radio', name: 'variant', value: v.id, checked: v.id === chosen, onchange: () => { chosen = v.id; } }),
      h('div', {}, h('b', { text: v.name }), h('span', { text: [v.description, v.source && `From: ${v.source}`].filter(Boolean).join(' — ') })))));
    panel.append(useButton(() => applyVariant(t, t.variants.find(v => v.id === chosen)), 'Use this draft'));
  }
  function useButton(apply, label) {
    const btn = h('button', { class: 'primary', text: label });
    const wrap = h('div', { class: 'variant-actions' }, btn);
    btn.onclick = () => {
      if (hasWork() && !btn.dataset.armed) {
        btn.dataset.armed = '1'; btn.textContent = 'Replace current sections and screenshots? Click again';
        btn.classList.add('danger');
        setTimeout(() => { delete btn.dataset.armed; btn.textContent = label; btn.classList.remove('danger'); }, 4000);
        return;
      }
      apply();
      pickedType = '';
      syncInputs(); renderVars(); renderSectionCards(); renderTypeGrid(); renderVariants(); changed();
      $('#summaryText').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    if (state.typeId) wrap.append(h('span', { class: 'subtle', text: 'Replaces the summary and sections below. Header, hosts and checklist are kept.' }));
    return wrap;
  }

  // ---------- hosts ----------
  function renderHosts() {
    const root = $('#hostRows');
    root.innerHTML = '';
    state.hosts.forEach((hs, i) => {
      const sel = h('select', { onchange: e => { hs.os = e.target.value; hostsChanged(); } }, OS_OPTIONS.map(o => h('option', { text: o })));
      sel.value = OS_OPTIONS.includes(hs.os) ? hs.os : 'Other';
      root.append(h('div', { class: 'hostrow' },
        h('input', { value: hs.name, placeholder: 'Host name, e.g. Ubuntu Ecom', oninput: e => { hs.name = e.target.value; hostsChanged(true); } }),
        sel,
        h('input', { value: hs.ip, placeholder: 'IP address', oninput: e => { hs.ip = e.target.value; hostsChanged(true); } }),
        h('button', { class: 'tiny danger', text: '✕', title: 'Remove host', onclick: () => { state.hosts.splice(i, 1); renderHosts(); hostsChanged(); } })));
    });
    const n = hostsFor('all').length;
    $('#hostCount').textContent = n ? `${n} host${n > 1 ? 's' : ''}` : 'none yet — needed for per-host sections';
  }
  function hostsChanged(typing) {
    saveHosts();
    if (!typing) renderSectionCards(); else changed();
    const n = hostsFor('all').length;
    $('#hostCount').textContent = n ? `${n} host${n > 1 ? 's' : ''}` : 'none yet — needed for per-host sections';
  }
  function saveHosts() { try { localStorage.setItem(HOSTS_KEY, JSON.stringify(state.hosts)); } catch (e) { /* ignore */ } }

  // ---------- vars ----------
  // Declared draft vars first, then any other {{placeholder}} found in the current inject
  // (custom sections and snippets included), so every blank gets its own input box.
  const BUILTIN = new Set(['team', 'company', 'to', 'hosts_all', 'hosts_linux', 'hosts_windows', 'host', 'host_os', 'host_ip']);
  const humanize = k => (k.charAt(0).toUpperCase() + k.slice(1)).replace(/_/g, ' ');
  function varDefs() {
    const v = findVariant(state.typeId, state.variantId);
    const defs = ((v && v.vars) || []).slice();
    const seen = new Set(defs.map(d => d.key));
    const texts = [state.meta.subject, state.summary];
    for (const s of state.sections) {
      texts.push(s.heading, s.text, ...s.evidence.map(e => e.caption));
      if (s.table) texts.push(...s.table.columns, ...s.table.rows.flat());
      if (s.perHost) texts.push(s.perHost.text);
    }
    for (const t of texts) for (const m of String(t || '').matchAll(PH_RE)) {
      if (m[1] === 'company' && !seen.has('company')) { seen.add('company'); defs.unshift({ key: 'company', label: 'Company name', meta: true }); }
      else if (!BUILTIN.has(m[1]) && !seen.has(m[1])) { seen.add(m[1]); defs.push({ key: m[1], label: humanize(m[1]) }); }
    }
    return defs;
  }
  let varKeys = '';
  function renderVars() {
    const defs = varDefs();
    varKeys = defs.map(d => d.key).join('|');
    const root = $('#varInputs');
    root.innerHTML = '';
    defs.forEach(d => root.append(h('label', {}, d.label,
      d.meta
        ? h('input', { value: state.meta[d.key] || '', placeholder: 'Same as the memo header field', oninput: e => { state.meta[d.key] = e.target.value; const hdr = $(`[data-meta="${d.key}"]`); if (hdr) hdr.value = e.target.value; changed(); } })
        : h('input', { value: state.vars[d.key] || '', placeholder: d.placeholder || '', oninput: e => { state.vars[d.key] = e.target.value; changed(); } }))));
    $('#cardVars').hidden = !defs.length;
  }

  // ---------- section cards ----------
  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 700) + 'px'; }
  function textArea(value, oninput, rows = 4) {
    const ta = h('textarea', { rows, spellcheck: 'true' });
    ta.value = value;
    ta.addEventListener('input', () => { oninput(ta.value); autoGrow(ta); });
    requestAnimationFrame(() => autoGrow(ta));
    return ta;
  }
  function sourceDef(s) {
    const v = findVariant(state.typeId, state.variantId);
    return v && s.srcId ? (v.sections || []).find(d => d.id === s.srcId) : null;
  }
  function renderSectionCards() {
    const root = $('#sectionCards');
    root.innerHTML = '';
    state.sections.forEach((s, i) => root.append(sectionCard(s, i)));
    changed();
  }
  function sectionCard(s, i) {
    const card = h('div', { class: 'card' + (s.on ? '' : ' off') });
    const lvl = h('select', { title: 'Heading size', onchange: e => { s.level = +e.target.value; changed(); } },
      h('option', { value: '1', text: 'Heading' }), h('option', { value: '2', text: 'Sub-heading' }));
    lvl.value = String(s.level);
    const move = d => { const j = i + d; if (j < 0 || j >= state.sections.length) return; [state.sections[i], state.sections[j]] = [state.sections[j], state.sections[i]]; renderSectionCards(); };
    const def = sourceDef(s);
    card.append(h('div', { class: 'sechead' },
      h('input', { type: 'checkbox', checked: s.on, title: 'Include this section', onchange: e => { s.on = e.target.checked; card.classList.toggle('off', !s.on); changed(); } }),
      h('input', { type: 'text', value: s.heading, placeholder: '(no heading)', oninput: e => { s.heading = e.target.value; s.edited = true; changed(); } }),
      lvl,
      h('button', { class: 'tiny', text: '↑', title: 'Move up', onclick: () => move(-1) }),
      h('button', { class: 'tiny', text: '↓', title: 'Move down', onclick: () => move(1) }),
      def ? h('button', { class: 'tiny', text: 'Reset', title: 'Restore the draft text for this section', onclick: () => { const fresh = makeSection(def); fresh.uid = s.uid; fresh.evidence = s.evidence; if (fresh.perHost && s.perHost) fresh.perHost.evidence = s.perHost.evidence; state.sections[i] = fresh; renderSectionCards(); } }) : null,
      h('button', { class: 'tiny danger', text: '✕', title: 'Delete section', onclick: () => { state.sections.splice(i, 1); renderSectionCards(); } })));
    const body = h('div', { class: 'secbody' });
    body.append(textArea(s.text, v => { s.text = v; s.edited = true; changed(); }));
    if (s.table) body.append(tableEditor(s.table, s.hostRows ? () => { const rows = hostRowsFor(s.hostRows); if (rows.length) { s.table.rows = rows; renderSectionCards(); } else flash('Add hosts first (section 2).'); } : null));
    body.append(evidenceEditor(s.evidence, s.captions));
    if (s.perHost) body.append(perHostEditor(s));
    card.append(body);
    return card;
  }
  function tableEditor(tb, fillFromHosts) {
    const wrap = h('div');
    const draw = () => {
      wrap.innerHTML = '';
      const thead = h('tr', {}, tb.columns.map((c, ci) => h('th', {}, h('input', { value: c, oninput: e => { tb.columns[ci] = e.target.value; changed(); } }))), h('td', { class: 'rowbtn' }));
      const rows = tb.rows.map((r, ri) => h('tr', {},
        tb.columns.map((_, ci) => h('td', {}, textCell(r[ci] || '', v => { r[ci] = v; changed(); }))),
        h('td', { class: 'rowbtn' }, h('button', { class: 'tiny danger', text: '✕', title: 'Remove row', onclick: () => { tb.rows.splice(ri, 1); draw(); changed(); } }))));
      wrap.append(h('div', { class: 'tablewrap' }, h('table', { class: 'grid' }, thead, rows)),
        h('div', { class: 'row-actions' },
          h('button', { class: 'tiny', text: '+ Row', onclick: () => { tb.rows.push(tb.columns.map(() => '')); draw(); changed(); } }),
          h('button', { class: 'tiny', text: '+ Column', onclick: () => { tb.columns.push('New column'); tb.rows.forEach(r => r.push('')); draw(); changed(); } }),
          tb.columns.length > 1 ? h('button', { class: 'tiny', text: '− Last column', onclick: () => { tb.columns.pop(); tb.rows.forEach(r => r.pop()); draw(); changed(); } }) : null,
          fillFromHosts ? h('button', { class: 'tiny', text: 'Fill rows from hosts', onclick: fillFromHosts }) : null));
    };
    draw();
    return wrap;
  }
  function textCell(value, oninput) {
    const ta = h('textarea', { rows: 1 });
    ta.value = value;
    ta.addEventListener('input', () => oninput(ta.value));
    return ta;
  }
  function perHostEditor(s) {
    const ph = s.perHost;
    const wrap = h('div');
    const hosts = hostsFor(ph.filter);
    const filterName = { all: 'all hosts', linux: 'Linux hosts', windows: 'Windows hosts', other: 'other hosts' }[ph.filter];
    wrap.append(h('div', { class: 'subtle', text: `Per-host — one sub-section for each of the ${filterName} below.` }));
    if (!hosts.length) {
      wrap.append(h('p', { class: 'muted small', text: 'No matching hosts yet. Add them in “2. Environment hosts”.' }));
      return wrap;
    }
    wrap.append(h('div', { class: 'hostpick' }, hosts.map(hs => h('label', {},
      h('input', { type: 'checkbox', checked: !ph.exclude[hs.id], onchange: e => { if (e.target.checked) delete ph.exclude[hs.id]; else ph.exclude[hs.id] = true; renderSectionCards(); } }),
      hs.name))));
    wrap.append(h('label', {}, 'Text under each host (optional — {{host}} is the host name)',
      textArea(ph.text, v => { ph.text = v; changed(); }, 2)));
    for (const hs of hostsFor(ph.filter, ph.exclude)) {
      if (ph.table && !ph.tables[hs.id]) ph.tables[hs.id] = clone(ph.table.rows.length ? ph.table.rows : [ph.table.columns.map(() => '')]);
      const ev = (ph.evidence[hs.id] = ph.evidence[hs.id] || []);
      const block = h('details', { class: 'hostblock', open: !ev.length },
        h('summary', { text: `${hs.name}${ev.length ? ` — ${ev.length} figure${ev.length > 1 ? 's' : ''}` : ''}` }));
      if (ph.table) block.append(tableEditor({ columns: ph.table.columns, rows: ph.tables[hs.id] }));
      block.append(evidenceEditor(ev, ph.captions.map(c => c.replace(PH_RE, (m, k) => k === 'host' ? hs.name : m))));
      wrap.append(block);
    }
    return wrap;
  }

  // ---------- evidence (screenshots + pasted output) ----------
  function evidenceEditor(list, captions) {
    const wrap = h('div', { class: 'evidence' });
    const listEl = h('div');
    const suggest = h('div', { class: 'suggest' });
    const fileIn = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
    const drop = h('div', { class: 'drop', tabindex: '0', text: 'Click here and paste (Ctrl/⌘+V) a screenshot, drop images, or click to choose' });
    const add = files => Array.from(files).filter(f => f.type.startsWith('image/')).forEach(async f => {
      try { list.push({ id: uid(), type: 'image', caption: '', ...(await readImage(f)) }); draw(); changed(); }
      catch (e) { flash('Could not read that image.'); }
    });
    fileIn.onchange = () => { add(fileIn.files); fileIn.value = ''; };
    drop.onclick = () => fileIn.click();
    drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
    drop.ondragleave = () => drop.classList.remove('over');
    drop.ondrop = e => { e.preventDefault(); drop.classList.remove('over'); add(e.dataTransfer.files); };
    wrap.addEventListener('paste', e => {
      const files = Array.from((e.clipboardData && e.clipboardData.files) || []).filter(f => f.type.startsWith('image/'));
      if (!files.length) return;
      e.preventDefault(); e.stopPropagation(); add(files);
    });
    const draw = () => {
      listEl.innerHTML = '';
      list.forEach((ev, i) => {
        const move = d => { const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; draw(); changed(); };
        listEl.append(h('div', { class: 'evrow' },
          ev.type === 'image' ? h('img', { src: ev.data, alt: '' }) : null,
          h('div', { class: 'evbody' },
            ev.type === 'output' ? textArea(ev.text || '', v => { ev.text = v; changed(); }, 3) : null,
            h('input', { value: ev.caption || '', placeholder: 'Caption, e.g. Splunk running on Fedora Webmail forwarding logs to the indexer', oninput: e => { ev.caption = e.target.value; changed(); } }),
            h('div', { class: 'evbtns' },
              h('button', { class: 'tiny', text: '↑', onclick: () => move(-1) }),
              h('button', { class: 'tiny', text: '↓', onclick: () => move(1) }),
              h('button', { class: 'tiny danger', text: 'Remove', onclick: () => { list.splice(i, 1); draw(); changed(); } })))));
      });
      suggest.innerHTML = '';
      if (captions && captions.length) {
        suggest.append(h('span', { class: 'muted small', style: 'margin:0', text: 'Caption ideas:' }));
        const vals = values();
        captions.forEach(c => suggest.append(h('button', {
          text: subst(c, vals), onclick: () => {
            const target = list.find(e => !(e.caption || '').trim());
            if (!target) { flash('Add the screenshot or output first, then click a caption idea.'); return; }
            target.caption = c; draw(); changed();
          },
        })));
      }
    };
    draw();
    wrap.append(suggest, drop, fileIn, listEl,
      h('div', { class: 'evadd' }, h('button', { class: 'tiny', text: '+ Add command output (text)', onclick: () => { list.push({ id: uid(), type: 'output', caption: '', text: '' }); draw(); changed(); } })));
    return wrap;
  }
  function readImage(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let data = fr.result;
          if (!/^data:image\/(png|jpeg)/.test(data)) {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth; c.height = img.naturalHeight;
            c.getContext('2d').drawImage(img, 0, 0);
            data = c.toDataURL('image/png');
          }
          resolve({ data, w: img.naturalWidth, h: img.naturalHeight });
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  // ---------- change plumbing ----------
  let timer = null;
  function changed() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (varDefs().map(d => d.key).join('|') !== varKeys) renderVars();
      renderPreview(); save();
    }, 150);
  }
  function flash(msg) {
    const b = $('#banner');
    b.textContent = msg; b.hidden = false;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => { b.hidden = true; }, 6000);
  }
  let saveMsg = 'Autosaved locally';
  function updateStatus() { const el = $('#saveStatus'); el.textContent = `${saveMsg} ${el.dataset.ph || ''}`; }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); saveMsg = 'Autosaved locally'; }
    catch (e) {
      try {
        const lite = clone(state);
        const strip = l => l.filter(ev => ev.type !== 'image');
        lite.sections.forEach(s => { s.evidence = strip(s.evidence); if (s.perHost) for (const k of Object.keys(s.perHost.evidence)) s.perHost.evidence[k] = strip(s.perHost.evidence[k]); });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
        saveMsg = 'Autosaved without screenshots — use Save draft to keep them';
      } catch (e2) { saveMsg = 'Autosave unavailable — use Save draft'; }
    }
    saveHosts();
    updateStatus();
  }
  function loadState(obj) {
    const base = defaultState();
    const s = Object.assign(base, obj || {});
    s.meta = Object.assign(defaultState().meta, obj && obj.meta);
    s.checklist = Object.assign({ text: '', done: {} }, obj && obj.checklist);
    s.sections = (s.sections || []).map(x => Object.assign({ evidence: [], captions: [], table: null, perHost: null, hostRows: null, level: 1, on: true, heading: '', text: '' }, x));
    s.hosts = (s.hosts || []).map(x => Object.assign({ id: uid(), name: '', os: 'Linux', ip: '' }, x));
    state = s;
  }
  function syncInputs() {
    $$('[data-meta]').forEach(inp => { inp.value = state.meta[inp.dataset.meta] == null ? '' : state.meta[inp.dataset.meta]; });
    $('#summaryText').value = state.summary;
    autoGrow($('#summaryText'));
    $('#checkText').value = state.checklist.text;
  }
  function renderAll() {
    syncInputs(); renderChecklist(); renderTypeGrid(); renderVariants(); renderHosts(); renderVars(); renderSectionCards();
  }
  function download(blob, name) {
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function fileName(ext) {
    const n = state.meta.injectNo.trim();
    return `inject${n ? (/^\d$/.test(n) ? '0' + n : n) : ''}_team${state.meta.team || ''}.${ext}`;
  }

  // ---------- .docx export ----------
  function exportDocx() {
    const D = window.docx;
    if (!D) { flash('The docx library did not load (lib/docx.umd.js).'); return; }
    const vals = values();
    const m = state.meta;
    const border = { style: D.BorderStyle.SINGLE, size: 6, color: '000000' };
    const cellBorder = { style: D.BorderStyle.SINGLE, size: 4, color: '000000' };
    let listInstance = 0;
    const runs = (text, base = {}) => inlineTokens(text).map(k => new D.TextRun({
      text: k.t, ...base,
      bold: base.bold || k.bold || undefined,
      font: k.code ? 'Courier New' : base.font,
      size: k.code ? 21 : base.size,
      highlight: k.ph ? 'yellow' : undefined,
    }));
    const para = (text, opts = {}, base = {}) => new D.Paragraph({ children: runs(text, base), spacing: { after: 160 }, ...opts });
    const heading = (text, level) => new D.Paragraph({
      children: runs(text, { bold: true, size: level === 1 ? 32 : level === 2 ? 28 : 24 }),
      spacing: { before: level === 1 ? 240 : 180, after: 120 }, keepNext: true,
    });
    const codeParas = text => {
      const lines = String(text || '').split('\n');
      return lines.map((line, i) => new D.Paragraph({
        children: [new D.TextRun({ text: line || ' ', font: 'Courier New', size: 18 })],
        shading: { type: D.ShadingType.CLEAR, color: 'auto', fill: 'F2F2F2' },
        spacing: { after: i === lines.length - 1 ? 160 : 0 },
      }));
    };
    const mdParas = blocks => blocks.flatMap(b => {
      if (b.type === 'p') return [para(b.text)];
      if (b.type === 'h3') return [heading(b.text, 3)];
      if (b.type === 'ul') return b.items.map((it, i) => new D.Paragraph({ children: runs(it), bullet: { level: 0 }, spacing: { after: i === b.items.length - 1 ? 160 : 40 } }));
      if (b.type === 'ol') { const inst = ++listInstance; return b.items.map((it, i) => new D.Paragraph({ children: runs(it), numbering: { reference: 'num', level: 0, instance: inst }, spacing: { after: i === b.items.length - 1 ? 160 : 40 } })); }
      return codeParas(b.text);
    });
    const tableEl = b => {
      const total = 9360, w = Math.floor(total / b.columns.length);
      const cell = (t, head) => new D.TableCell({
        width: { size: w, type: D.WidthType.DXA },
        borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder },
        shading: head ? { type: D.ShadingType.CLEAR, color: 'auto', fill: 'D9D9D9' } : undefined,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: String(t || '').split('\n').map(line => new D.Paragraph({ children: runs(line, head ? { bold: true } : {}) })),
      });
      return [new D.Table({
        width: { size: total, type: D.WidthType.DXA },
        columnWidths: b.columns.map(() => w),
        rows: [new D.TableRow({ tableHeader: true, children: b.columns.map(c => cell(c, true)) }),
          ...b.rows.map(r => new D.TableRow({ children: b.columns.map((_, ci) => cell(r[ci], false)) }))],
      }), new D.Paragraph({ children: [], spacing: { after: 120 } })];
    };
    const bytes = url => { const bin = atob(url.split(',')[1]); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; };
    const figure = b => {
      const cap = new D.Paragraph({ spacing: { after: 240 }, children: runs(`Figure ${b.n}. ${subst(b.ev.caption || '', vals) || '{{caption}}'}`, { italics: true }) });
      if (b.ev.type === 'output') return [...codeParas(b.ev.text), cap];
      let w = Math.min(600, b.ev.w || 600), hh = b.ev.w ? w * b.ev.h / b.ev.w : w * 0.6;
      if (hh > 720) { w = w * 720 / hh; hh = 720; }
      return [new D.Paragraph({ keepNext: true, spacing: { before: 120, after: 60 },
        children: [new D.ImageRun({ data: bytes(b.ev.data), transformation: { width: Math.round(w), height: Math.round(hh) } })] }), cap];
    };
    const children = [
      new D.Paragraph({ alignment: D.AlignmentType.CENTER, border: { bottom: border }, spacing: { after: 160 }, children: [new D.TextRun({ text: 'INTEROFFICE MEMORANDUM', bold: true })] }),
      para(`To: ${subst(m.to, vals)}`, { spacing: { after: 120 } }),
      para(`From: ${subst(m.from, vals)}`, { spacing: { after: 120 } }),
      para(`Date: ${fmtDate(m.date)}`, { spacing: { after: 120 } }),
      para(`Subject: ${subst(m.subject, vals)}`, { border: { bottom: border }, spacing: { after: 240 } }),
    ];
    if (m.summaryLabel) children.push(heading(m.summaryLabel, 1));
    children.push(...mdParas(parseBlocks(subst(state.summary, vals))));
    for (const b of docModel()) {
      if (b.t === 'h') children.push(heading(b.text, b.level));
      else if (b.t === 'md') children.push(...mdParas(b.blocks));
      else if (b.t === 'table') children.push(...tableEl(b));
      else if (b.t === 'fig') children.push(...figure(b));
    }
    children.push(para(subst(m.closing, vals), { spacing: { before: 240, after: 200 } }),
      new D.Paragraph({ children: [new D.TextRun(m.signoff)] }),
      ...subst(m.signature, vals).split('\n').map(line => new D.Paragraph({ children: runs(line) })));
    const doc = new D.Document({
      creator: subst(m.from, vals), title: subst(m.subject, vals),
      styles: { default: { document: { run: { font: 'Aptos', size: 24 } } } },
      numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: '%1.', alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children }],
    });
    D.Packer.toBlob(doc).then(blob => download(blob, fileName('docx')), err => { console.error(err); flash('Export failed: ' + err.message); });
  }

  // ---------- wiring ----------
  function wire() {
    $$('[data-meta]').forEach(inp => inp.addEventListener(inp.tagName === 'SELECT' ? 'change' : 'input', () => { state.meta[inp.dataset.meta] = inp.value; changed(); }));
    $('#summaryText').addEventListener('input', e => { state.summary = e.target.value; autoGrow(e.target); changed(); });
    $('#checkText').addEventListener('input', e => { state.checklist.text = e.target.value; renderChecklist(); save(); });
    $('#typeSearch').addEventListener('input', renderTypeGrid);
    $('#btnAddHost').onclick = () => { state.hosts.push({ id: uid(), name: '', os: 'Linux', ip: '' }); renderHosts(); hostsChanged(); const ins = $$('#hostRows .hostrow input'); if (ins.length) ins[ins.length - 2].focus(); };
    $('#btnSampleHosts').onclick = () => {
      const have = new Set(state.hosts.map(x => x.name));
      SAMPLE_HOSTS.filter(([n]) => !have.has(n)).forEach(([name, os, ip]) => state.hosts.push({ id: uid(), name, os, ip }));
      renderHosts(); hostsChanged();
    };
    $('#btnAddSection').onclick = () => { state.sections.push(makeSection({ heading: 'New section', text: '' })); renderSectionCards(); };
    $$('[data-snippet]').forEach(b => b.onclick = () => { state.sections.push(makeSection(SNIPPETS[b.dataset.snippet])); renderSectionCards(); flash('Added at the end — edit the highlighted placeholder.'); });
    $('#btnExport').onclick = exportDocx;
    $('#btnSave').onclick = () => download(new Blob([JSON.stringify(state)], { type: 'application/json' }), fileName('json'));
    $('#btnLoad').onclick = () => $('#fileLoad').click();
    $('#fileLoad').onchange = async e => {
      const f = e.target.files[0];
      e.target.value = '';
      if (!f) return;
      try { loadState(JSON.parse(await f.text())); renderAll(); save(); flash(`Loaded ${f.name}`); }
      catch (err) { flash('That file is not a saved draft.'); }
    };
    const btnNew = $('#btnNew');
    btnNew.onclick = () => {
      if (!btnNew.dataset.armed) {
        btnNew.dataset.armed = '1'; btnNew.textContent = 'Click again to clear'; btnNew.classList.add('danger');
        setTimeout(() => { delete btnNew.dataset.armed; btnNew.textContent = 'New inject'; btnNew.classList.remove('danger'); }, 3000);
        return;
      }
      const keep = state.meta, hosts = state.hosts;
      state = defaultState();
      for (const k of ['team', 'company', 'from', 'summaryLabel', 'closing', 'signoff', 'signature']) state.meta[k] = keep[k];
      state.hosts = hosts;
      pickedType = '';
      delete btnNew.dataset.armed; btnNew.textContent = 'New inject'; btnNew.classList.remove('danger');
      renderAll(); save();
    };
  }

  // ---------- boot ----------
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) loadState(JSON.parse(saved));
    if (!state.hosts.length) {
      const hs = JSON.parse(localStorage.getItem(HOSTS_KEY) || '[]');
      if (Array.isArray(hs)) state.hosts = hs;
    }
  } catch (e) { /* storage blocked or corrupt — start fresh */ }
  wire();
  renderAll();
})();

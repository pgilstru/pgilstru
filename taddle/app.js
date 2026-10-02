/* Taddle (incident report builder) — static, no build step. See README.md. */
(function () {
  'use strict';

  const STORAGE_KEY = 'taddle.draft.v1';
  const CATEGORIES = [
    { key: 'access', label: 'How they got in' },
    { key: 'action', label: 'What they did' },
    { key: 'persistence', label: 'How they stayed' },
  ];
  const SECTIONS = [
    { key: 'summary', title: 'Opening line', help: 'The “Team 07 would like to report evidence of …” sentence at the top of the memo.' },
    { key: 'vulnerability', title: 'Vulnerability', weight: '30%', proof: 'Screenshot of the vulnerability itself, if it can be seen apart from the attack (e.g. vulnerable code, missing patch). Not needed for weak credentials.' },
    { key: 'initialAccess', title: 'Initial Access', weight: 'part of the 30%', proof: 'Logs showing red team abusing the vulnerability to get in.' },
    { key: 'impact', title: 'Impact', weight: '10%', proof: 'Optional: anything showing what changed or which service went down.' },
    { key: 'eradication', title: 'Eradication', weight: '15%', steps: true, proof: 'Commands run (and their output) to remove the attacker’s access.' },
    { key: 'remediation', title: 'Remediation', weight: '20%', steps: true, proof: 'Commands run (and their output) to fix the vulnerability.' },
  ];
  const DETAIL_ROWS = [
    ['Affected Host', 'affected_host'],
    ['Source IP Address', 'source_ip'],
    ['Destination IP Address', 'dest_ip'],
    ['Port and Service', 'port_service'],
    ['Initial Access Timestamp', 'initial_access_time'],
    ['Service Downtime', 'downtime'],
    ['Remediated Timestamp', 'remediated_time'],
    ['Affected Account', 'affected_account'],
  ];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const PB = {};
  (window.IR_PLAYBOOKS || []).forEach(p => { PB[p.id] = p; });

  // ---------- state ----------
  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function defaultState() {
    return {
      meta: { team: '07', tz: 'CST', to: 'CISO', from: 'Team {{team}} – Incident Response Team', date: today(), subject: 'Incident Report' },
      details: {
        affected_host: '', affected_account: '', source_ip: '', dest_ip: '', port_service: '',
        initial_access: '', remediated: '', downtime_start: '', downtime_end: '', downtime_none: false,
      },
      modules: [],
      vars: {},
      steps: {},
      sections: Object.fromEntries(SECTIONS.map(s => [s.key, { text: '', dirty: false }])),
      evidence: Object.fromEntries(SECTIONS.map(s => [s.key, []])),
    };
  }
  let state = defaultState();

  const uid = () => Math.random().toString(36).slice(2, 10);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function orderedModules() {
    const sel = state.modules.map(id => PB[id]).filter(Boolean);
    return CATEGORIES.flatMap(c => sel.filter(m => m.category === c.key));
  }

  // ---------- formatting ----------
  function parseLocal(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(v || '');
    if (!m) return null;
    return { y: +m[1], mo: +m[2], d: +m[3], hh: +m[4], mi: +m[5], ss: m[6] ? +m[6] : null };
  }
  function fmtDay(p) { return `${MONTHS[p.mo - 1]} ${p.d}, ${p.y}`; }
  function fmtClock(p) {
    const ap = p.hh >= 12 ? 'PM' : 'AM';
    const h12 = p.hh % 12 || 12;
    const sec = p.ss != null ? `:${String(p.ss).padStart(2, '0')}` : '';
    return `${h12}:${String(p.mi).padStart(2, '0')}${sec} ${ap}`;
  }
  function fmtTs(v) {
    const p = parseLocal(v);
    return p ? `${fmtDay(p)} – ${fmtClock(p)} ${state.meta.tz}` : '';
  }
  function fmtDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    return m ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : '';
  }
  const tsMs = v => { const p = parseLocal(v); return p ? new Date(p.y, p.mo - 1, p.d, p.hh, p.mi, p.ss || 0).getTime() : null; };
  function fmtDowntime() {
    const d = state.details;
    if (d.downtime_none) return 'No service downtime observed';
    const a = parseLocal(d.downtime_start), b = parseLocal(d.downtime_end);
    if (!a) return '';
    if (!b) return `${fmtDay(a)} – ${fmtClock(a)} ${state.meta.tz} to ongoing`;
    const mins = Math.round((tsMs(d.downtime_end) - tsMs(d.downtime_start)) / 60000);
    const dur = mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} min` : `${mins} min`;
    const sameDay = a.y === b.y && a.mo === b.mo && a.d === b.d;
    const end = sameDay ? fmtClock(b) : `${fmtDay(b)} – ${fmtClock(b)}`;
    return `${fmtDay(a)} – ${fmtClock(a)} to ${end} ${state.meta.tz} (${dur})`;
  }

  function values() {
    const d = state.details;
    const v = {
      team: state.meta.team, tz: state.meta.tz,
      affected_host: d.affected_host, affected_account: d.affected_account,
      source_ip: d.source_ip, dest_ip: d.dest_ip, port_service: d.port_service,
      initial_access_time: fmtTs(d.initial_access), remediated_time: fmtTs(d.remediated),
      downtime: fmtDowntime(),
    };
    for (const [k, val] of Object.entries(state.vars)) if (val) v[k] = val;
    return v;
  }
  const PH_RE = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;
  function subst(text, vals, fallback) {
    return String(text || '').replace(PH_RE, (m, k) => {
      const val = vals[k];
      if (val) return val;
      return fallback != null ? fallback : `{{${k}}}`;
    });
  }
  function unresolved(text) {
    return Array.from(String(text || '').matchAll(PH_RE), m => m[1]);
  }

  // ---------- text generation from playbooks ----------
  function joinList(items) {
    if (items.length <= 1) return items.join('');
    if (items.length === 2) return items.join(' and ');
    return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }
  function generate(key) {
    const mods = orderedModules();
    if (key === 'summary') {
      const phrases = mods.map(m => m.summary).filter(Boolean);
      return `Team {{team}} would like to report evidence of ${phrases.length ? joinList(phrases) : '{{incident_summary}}'}.`;
    }
    const sec = SECTIONS.find(s => s.key === key);
    if (!sec.steps) return mods.map(m => m[key]).filter(Boolean).join('\n\n');
    const withSteps = mods.filter(m => m[key]);
    const multi = withSteps.length > 1;
    return withSteps.map(m => {
      const block = m[key];
      const parts = [];
      if (multi) parts.push(`**${m.shortName || m.name}**`);
      if (block.intro) parts.push(block.intro);
      const items = (block.steps || [])
        .filter(st => stepOn(m.id, st))
        .map(st => '- ' + st.text + (st.commands ? '\n```\n' + st.commands.trim() + '\n```' : ''));
      if (items.length) parts.push(items.join('\n'));
      return parts.join('\n\n');
    }).join('\n\n');
  }
  function stepOn(modId, st) {
    const s = state.steps[modId] || {};
    return st.id in s ? s[st.id] : st.default !== false;
  }

  // ---------- mini markdown ----------
  // Supports: paragraphs, "- " bullets, ``` code fences, **bold**, `code`.
  function parseBlocks(text) {
    const blocks = [];
    let para = [], list = null, code = null;
    const flushPara = () => { if (para.length) blocks.push({ type: 'p', text: para.join(' ') }); para = []; };
    const flushList = () => { if (list) blocks.push({ type: 'ul', items: list }); list = null; };
    for (const line of String(text || '').replace(/\r/g, '').split('\n')) {
      if (code) {
        if (line.trim().startsWith('```')) { blocks.push({ type: 'code', text: code.join('\n') }); code = null; }
        else code.push(line);
        continue;
      }
      if (line.trim().startsWith('```')) { flushPara(); flushList(); code = []; continue; }
      const li = /^\s*[-*]\s+(.*)$/.exec(line);
      if (li) { flushPara(); (list = list || []).push(li[1]); continue; }
      if (!line.trim()) { flushPara(); flushList(); continue; }
      if (list && /^\s{2,}\S/.test(line)) { list[list.length - 1] += ' ' + line.trim(); continue; }
      flushList();
      para.push(line.trim());
    }
    if (code) blocks.push({ type: 'code', text: code.join('\n') });
    flushPara(); flushList();
    return blocks;
  }
  function inlineTokens(text) {
    const out = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\{\{[a-z0-9_]+\}\})/gi;
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
  function inlineHtml(text) {
    return inlineTokens(text).map(k =>
      k.bold ? `<b>${esc(k.t)}</b>` : k.code ? `<code>${esc(k.t)}</code>` : k.ph ? `<span class="ph">${esc(k.t)}</span>` : esc(k.t)
    ).join('');
  }
  function blocksHtml(blocks) {
    return blocks.map(b => {
      if (b.type === 'p') return `<p>${inlineHtml(b.text)}</p>`;
      if (b.type === 'ul') return `<ul>${b.items.map(i => `<li>${inlineHtml(i)}</li>`).join('')}</ul>`;
      return `<pre>${esc(b.text)}</pre>`;
    }).join('');
  }

  // ---------- figures ----------
  function figures() {
    let n = 0;
    const out = {};
    for (const s of SECTIONS) out[s.key] = state.evidence[s.key].map(ev => ({ ...ev, n: ++n }));
    return out;
  }

  // ---------- preview ----------
  function renderPreview() {
    const vals = values();
    const meta = state.meta;
    const figs = figures();
    const detailVal = k => vals[k] ? inlineHtml(vals[k]) : '<span class="ph">missing</span>';
    let html = `<div class="memo">MEMORANDUM</div>
      <div class="hdr">
        <p><b>To:</b> ${inlineHtml(subst(meta.to, vals))}</p>
        <p><b>From:</b> ${inlineHtml(subst(meta.from, vals))}</p>
        <p><b>Date:</b> ${esc(fmtDate(meta.date))}</p>
        <p><b>Subject:</b> ${inlineHtml(subst(meta.subject, vals))}</p>
      </div>`;
    html += blocksHtml(parseBlocks(subst(state.sections.summary.text, vals)));
    html += `<h1>Incident Details</h1><table>${DETAIL_ROWS.map(([label, k]) => `<tr><td>${label}</td><td>${detailVal(k)}</td></tr>`).join('')}</table>`;
    for (const s of SECTIONS) {
      if (s.key === 'summary') continue;
      html += `<h2>${s.title}</h2>`;
      const text = state.sections[s.key].text;
      html += text.trim() ? blocksHtml(parseBlocks(subst(text, vals))) : '<p class="empty">(empty)</p>';
      for (const f of figs[s.key]) {
        const body = f.type === 'image' ? `<img src="${f.data}" alt="">` : `<pre>${esc(f.text || '')}</pre>`;
        html += `<figure>${body}<figcaption>Figure ${f.n}. ${inlineHtml(subst(f.caption || '', vals)) || '<span class="ph">caption</span>'}</figcaption></figure>`;
      }
    }
    html += `<p style="margin-top:22px">If there are any other questions about this incident, please do not hesitate to reach out and Team ${esc(meta.team)} would be happy to provide more information.</p>
      <p>Thank you,<br>Team ${esc(meta.team)}</p>`;
    $('#preview').innerHTML = html;
  }

  // ---------- rubric lint ----------
  function lint() {
    const out = [];
    const add = (grp, level, text) => out.push({ grp, level, text });
    const d = state.details;
    const mods = orderedModules();
    const secText = k => state.sections[k].text.trim();

    // General info
    const G = 'Incident details (5%)';
    const missing = [['affected_host', 'affected host'], ['source_ip', 'source IP'], ['dest_ip', 'destination IP'],
      ['port_service', 'port and service'], ['affected_account', 'affected account'],
      ['initial_access', 'initial access time'], ['remediated', 'remediated time']].filter(([k]) => !d[k]).map(([, l]) => l);
    if (missing.length) add(G, 'fail', `Missing: ${missing.join(', ')}`);
    else add(G, 'ok', 'All fields filled');
    if (d.initial_access && d.remediated && tsMs(d.remediated) < tsMs(d.initial_access)) add(G, 'fail', 'Remediated time is before initial access');
    if (!d.downtime_none && !(d.downtime_start && d.downtime_end)) add(G, 'warn', 'Service downtime needs a start and end, or tick “No service downtime”');
    else if (!d.downtime_none && tsMs(d.downtime_end) < tsMs(d.downtime_start)) add(G, 'fail', 'Downtime ends before it starts');

    // Attack
    const A = 'Vulnerability (30%) & Impact (10%)';
    if (!mods.length && !secText('vulnerability')) add(A, 'fail', 'Pick a playbook or write the Vulnerability section');
    else if (mods.length && !mods.some(m => m.category === 'access')) add(A, 'warn', 'No “how they got in” playbook — explain how red team got access');
    if (secText('vulnerability') && secText('vulnerability').length < 200) add(A, 'warn', 'Vulnerability section is thin — it’s the most heavily weighted section');
    if (!secText('initialAccess')) add(A, 'fail', 'Initial Access section is empty');
    if (!secText('impact')) add(A, 'fail', 'Impact section is empty');
    if (secText('vulnerability') && secText('initialAccess') && secText('impact')) add(A, 'ok', 'Vulnerability, Initial Access and Impact written');

    // Response
    const R = 'Eradication (15%) & Remediation (20%)';
    for (const key of ['eradication', 'remediation']) {
      const title = key === 'eradication' ? 'Eradication' : 'Remediation';
      if (!secText(key)) { add(R, 'fail', `${title} section is empty`); continue; }
      if (state.sections[key].dirty) continue;
      for (const m of mods) {
        const steps = (m[key] && m[key].steps) || [];
        if (steps.length && !steps.some(st => stepOn(m.id, st))) {
          add(R, m.category === 'persistence' ? 'fail' : 'warn',
            `No ${title.toLowerCase()} steps checked for “${m.shortName || m.name}”` +
            (m.category === 'persistence' ? ' — removing the payload but not its persistence loses points' : ''));
        }
      }
    }
    if (!out.some(i => i.grp === R)) add(R, 'ok', 'Eradication and Remediation written');

    // Proof
    const P = 'Proof (10%)';
    const ev = state.evidence;
    const needVuln = mods.some(m => m.vulnScreenshot);
    if (needVuln && !ev.vulnerability.length) add(P, 'warn', 'Screenshot of the vulnerability itself (this playbook has one to show)');
    else if (!needVuln && mods.length && !ev.vulnerability.length) add(P, 'ok', 'Vulnerability screenshot not needed for this type (rubric footnote)');
    if (!ev.initialAccess.length) add(P, 'fail', 'Initial Access: logs showing red team getting in');
    if (!ev.eradication.length) add(P, 'fail', 'Eradication: commands/output showing access removed');
    if (!ev.remediation.length) add(P, 'fail', 'Remediation: commands/output showing the fix');
    const blank = Object.values(ev).flat().filter(e => !(e.caption || '').trim()).length;
    if (blank) add(P, 'warn', `${blank} figure${blank > 1 ? 's' : ''} without a caption`);
    const emptyOut = Object.values(ev).flat().filter(e => e.type === 'output' && !(e.text || '').trim()).length;
    if (emptyOut) add(P, 'warn', `${emptyOut} empty command-output block${emptyOut > 1 ? 's' : ''}`);
    if (!out.some(i => i.grp === P)) add(P, 'ok', 'All four kinds of evidence present');

    // Clarity
    const C = 'Clarity (10%)';
    const vals = values();
    const allText = [state.meta.to, state.meta.from, state.meta.subject,
      ...SECTIONS.map(s => state.sections[s.key].text),
      ...Object.values(ev).flat().map(e => e.caption || '')].map(t => subst(t, vals)).join('\n');
    const ph = [...new Set(unresolved(allText))];
    if (ph.length) add(C, 'fail', `Unfilled placeholders: ${ph.map(p => `{{${p}}}`).join(', ')}`);
    else add(C, 'ok', 'No unfilled placeholders');
    const drafts = mods.filter(m => m.draft);
    if (drafts.length) add(C, 'warn', `Temporary playbook text in use (${drafts.map(m => m.shortName || m.name).join(', ')}) — reread it against what actually happened`);
    return out;
  }
  function renderLint() {
    const ul = $('#lintList');
    ul.innerHTML = '';
    let grp = null;
    const icon = { ok: '✓', warn: '!', fail: '✗' };
    for (const it of lint()) {
      if (it.grp !== grp) { grp = it.grp; ul.append(h('li', { class: 'grp', text: grp })); }
      ul.append(h('li', { class: it.level }, h('span', { class: 'ico', text: icon[it.level] }), h('span', { text: it.text })));
    }
  }

  // ---------- module picker / vars / splunk ----------
  function renderModulePicker() {
    const root = $('#modulePicker');
    root.innerHTML = '';
    for (const c of CATEGORIES) {
      const mods = Object.values(PB).filter(m => m.category === c.key);
      if (!mods.length) continue;
      root.append(h('div', { class: 'catlabel', text: c.label }));
      root.append(h('div', { class: 'modules' }, mods.map(m =>
        h('label', { class: 'module' },
          h('input', { type: 'checkbox', 'data-module': m.id, checked: state.modules.includes(m.id), onchange: e => toggleModule(m.id, e.target.checked) }),
          h('div', {}, h('b', {}, m.name, m.draft ? h('span', { class: 'badge', text: 'DRAFT' }) : null), h('span', { text: m.description || '' })))
      )));
    }
    if (!Object.keys(PB).length) root.append(h('p', { class: 'muted', text: 'No playbooks loaded. Check the <script> tags in index.html.' }));
  }
  function toggleModule(id, on) {
    const m = PB[id];
    if (on && !state.modules.includes(id)) {
      state.modules.push(id);
      for (const [k, v] of Object.entries(m.defaults || {})) {
        if (!state.details[k]) { state.details[k] = v; const inp = $(`[data-detail="${k}"]`); if (inp) inp.value = v; }
      }
    } else if (!on) {
      state.modules = state.modules.filter(x => x !== id);
    }
    structureChanged();
  }
  function renderVars() {
    const root = $('#varInputs');
    root.innerHTML = '';
    const seen = new Set();
    for (const m of orderedModules()) {
      for (const v of m.vars || []) {
        if (seen.has(v.key)) continue;
        seen.add(v.key);
        root.append(h('label', {}, v.label,
          h('input', { value: state.vars[v.key] || '', placeholder: v.placeholder || '', oninput: e => { state.vars[v.key] = e.target.value; changed(); } })));
      }
    }
    $('#cardVars').hidden = !seen.size;
  }
  function renderSplunk() {
    const root = $('#splunkList');
    root.innerHTML = '';
    const vals = values();
    let count = 0;
    for (const m of orderedModules()) {
      for (const q of m.splunk || []) {
        count++;
        const spl = subst(q.spl.trim(), vals, '*');
        const btn = h('button', { class: 'tiny', text: 'Copy' });
        btn.onclick = () => copyText(spl, btn);
        root.append(h('div', { class: 'spl' },
          h('div', { class: 'head' }, h('span', { text: `${m.shortName || m.name}: ${q.title}` }), btn),
          h('pre', { class: 'codeblock', text: spl })));
      }
    }
    $('#cardSplunk').hidden = !count;
  }
  function copyText(text, btn) {
    const done = () => { const t = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = t; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const ta = h('textarea', {}, text);
    document.body.append(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    ta.remove();
  }

  // ---------- section cards ----------
  const secUI = {};
  function buildSectionCards() {
    const root = $('#sectionCards');
    SECTIONS.forEach((s, i) => {
      const ui = {};
      ui.steps = s.steps ? h('div', { class: 'steps' }) : null;
      ui.ta = h('textarea', { rows: 4, spellcheck: 'true' });
      ui.ta.addEventListener('input', () => {
        state.sections[s.key].text = ui.ta.value;
        state.sections[s.key].dirty = ui.ta.value !== generate(s.key);
        autoGrow(ui.ta); renderDirty(s.key); changed();
      });
      ui.dirty = h('div', { class: 'dirty', hidden: true });
      const card = h('div', { class: 'card' },
        h('h2', {}, `${i + 4}. ${s.title}`, s.weight ? h('span', { class: 'weight', text: s.weight }) : null),
        s.help ? h('p', { class: 'muted small', text: s.help }) : null,
        s.steps ? h('p', { class: 'muted small', text: 'Tick only what you actually did — the text below follows the checkboxes.' }) : null,
        ui.steps, ui.ta, ui.dirty);
      if (s.key !== 'summary') {
        ui.suggest = h('div', { class: 'suggest' });
        ui.list = h('div');
        const fileIn = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
        fileIn.onchange = () => { Array.from(fileIn.files).forEach(f => addImage(s.key, f)); fileIn.value = ''; };
        const drop = h('div', { class: 'drop', tabindex: '0', text: 'Click here and paste (Ctrl/⌘+V) a screenshot, drop image files, or click to choose' });
        drop.onclick = () => fileIn.click();
        drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
        drop.ondragleave = () => drop.classList.remove('over');
        drop.ondrop = e => { e.preventDefault(); drop.classList.remove('over'); Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).forEach(f => addImage(s.key, f)); };
        card.addEventListener('paste', e => {
          const files = Array.from((e.clipboardData && e.clipboardData.files) || []).filter(f => f.type.startsWith('image/'));
          if (!files.length) return;
          e.preventDefault();
          files.forEach(f => addImage(s.key, f));
        });
        card.append(h('div', { class: 'evidence' },
          h('h3', { text: `Evidence — ${s.proof}` }),
          ui.suggest, drop, fileIn, ui.list,
          h('div', { class: 'evadd' },
            h('button', { class: 'tiny', text: '+ Add command output (text)', onclick: () => addOutput(s.key) }))));
      }
      secUI[s.key] = ui;
      root.append(card);
    });
  }
  function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 600) + 'px'; }
  function renderSteps(key) {
    const ui = secUI[key];
    if (!ui.steps) return;
    ui.steps.innerHTML = '';
    for (const m of orderedModules()) {
      const steps = (m[key] && m[key].steps) || [];
      if (!steps.length) continue;
      ui.steps.append(h('div', { class: 'stepgroup' },
        h('div', { text: m.shortName || m.name }),
        steps.map(st => h('label', { class: 'step' },
          h('input', {
            type: 'checkbox', checked: stepOn(m.id, st),
            onchange: e => { (state.steps[m.id] = state.steps[m.id] || {})[st.id] = e.target.checked; regen(key); changed(); },
          }),
          h('span', { text: st.text.replace(PH_RE, (x, k) => state.vars[k] || `{{${k}}}`) })))));
    }
  }
  function renderDirty(key) {
    const ui = secUI[key];
    const sec = state.sections[key];
    ui.dirty.hidden = !(sec.dirty && state.modules.length);
    ui.dirty.innerHTML = '';
    ui.dirty.append('Edited by hand — playbook and checkbox changes won’t update this section.',
      h('button', { class: 'tiny', text: 'Reset to playbook text', onclick: () => { sec.dirty = false; regen(key); changed(); } }));
  }
  function regen(key) {
    const sec = state.sections[key];
    if (sec.dirty) return;
    sec.text = generate(key);
    secUI[key].ta.value = sec.text;
    autoGrow(secUI[key].ta);
    renderDirty(key);
  }
  function renderSuggest(key) {
    const ui = secUI[key];
    if (!ui.suggest) return;
    ui.suggest.innerHTML = '';
    const tips = orderedModules().flatMap(m => (m.evidence && m.evidence[key]) || []);
    if (!tips.length) return;
    ui.suggest.append(h('span', { class: 'muted small', style: 'margin:0', text: 'Caption ideas:' }));
    const vals = values();
    tips.forEach(t => ui.suggest.append(h('button', {
      text: subst(t, vals), title: 'Use as the caption of the first figure without one',
      onclick: () => {
        const target = state.evidence[key].find(e => !(e.caption || '').trim());
        if (!target) { flash('Add the screenshot or output first, then click a caption idea to use it.'); return; }
        target.caption = t; renderEvidence(key); changed();
      },
    })));
  }
  function renderEvidence(key) {
    const ui = secUI[key];
    if (!ui.list) return;
    ui.list.innerHTML = '';
    const list = state.evidence[key];
    list.forEach((ev, i) => {
      const move = dir => { const j = i + dir; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; renderEvidence(key); changed(); };
      const body = h('div', { class: 'evbody' },
        ev.type === 'output'
          ? h('textarea', { placeholder: 'Paste the command and its output here', oninput: e => { ev.text = e.target.value; changed(); } }, ev.text || '')
          : null,
        h('input', { value: ev.caption || '', placeholder: 'Caption, e.g. Unauthorized SSH logins to goomonsu from 10.128.51.9', oninput: e => { ev.caption = e.target.value; changed(); } }),
        h('div', { class: 'evbtns' },
          h('button', { class: 'tiny', text: '↑', title: 'Move up', onclick: () => move(-1) }),
          h('button', { class: 'tiny', text: '↓', title: 'Move down', onclick: () => move(1) }),
          h('button', { class: 'tiny danger', text: 'Remove', onclick: () => { list.splice(i, 1); renderEvidence(key); changed(); } })));
      ui.list.append(h('div', { class: 'evrow' }, ev.type === 'image' ? h('img', { src: ev.data, alt: '' }) : null, body));
    });
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
          // Word only reliably embeds PNG/JPEG — convert anything else.
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
  async function addImage(key, file) {
    try {
      const img = await readImage(file);
      state.evidence[key].push({ id: uid(), type: 'image', caption: '', ...img });
      renderEvidence(key); changed();
    } catch (e) { flash('Could not read that image.'); }
  }
  function addOutput(key) {
    state.evidence[key].push({ id: uid(), type: 'output', caption: '', text: '' });
    renderEvidence(key); changed();
    const tas = $$('textarea', secUI[key].list);
    if (tas.length) tas[tas.length - 1].focus();
  }

  // ---------- change plumbing ----------
  let timer = null;
  function changed() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      renderPreview(); renderLint(); renderSplunk();
      SECTIONS.forEach(s => renderSuggest(s.key));
      save();
    }, 150);
  }
  function structureChanged() {
    renderVars();
    for (const s of SECTIONS) { renderSteps(s.key); renderSuggest(s.key); regen(s.key); }
    changed();
  }
  function flash(msg) {
    const b = $('#banner');
    b.textContent = msg; b.hidden = false;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => { b.hidden = true; }, 6000);
  }

  // ---------- persistence ----------
  function save() {
    const status = $('#saveStatus');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      status.textContent = 'Autosaved locally';
    } catch (e) {
      try {
        const lite = JSON.parse(JSON.stringify(state));
        for (const k of Object.keys(lite.evidence)) lite.evidence[k] = lite.evidence[k].filter(ev => ev.type !== 'image');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
        status.textContent = 'Autosaved without screenshots — use Save draft to keep them';
      } catch (e2) {
        status.textContent = 'Autosave unavailable — use Save draft';
      }
    }
  }
  function loadState(obj) {
    const base = defaultState();
    const s = Object.assign(base, obj || {});
    s.meta = Object.assign(defaultState().meta, obj && obj.meta);
    s.details = Object.assign(defaultState().details, obj && obj.details);
    for (const sec of SECTIONS) {
      s.sections[sec.key] = Object.assign({ text: '', dirty: false }, s.sections && s.sections[sec.key]);
      s.evidence[sec.key] = (s.evidence && s.evidence[sec.key]) || [];
    }
    s.modules = (s.modules || []).filter(id => PB[id]);
    state = s;
  }
  function syncInputs() {
    $$('[data-meta]').forEach(inp => { inp.value = state.meta[inp.dataset.meta] || ''; });
    $$('[data-detail]').forEach(inp => {
      const k = inp.dataset.detail;
      if (inp.type === 'checkbox') inp.checked = !!state.details[k];
      else inp.value = state.details[k] || '';
    });
    $$('[data-detail="downtime_start"],[data-detail="downtime_end"]').forEach(i => { i.disabled = state.details.downtime_none; });
  }
  function renderAll() {
    syncInputs();
    renderModulePicker();
    renderVars();
    for (const s of SECTIONS) {
      renderSteps(s.key); renderSuggest(s.key); renderEvidence(s.key);
      if (!state.sections[s.key].dirty) state.sections[s.key].text = generate(s.key);
      secUI[s.key].ta.value = state.sections[s.key].text;
      autoGrow(secUI[s.key].ta);
      renderDirty(s.key);
    }
    renderPreview(); renderLint(); renderSplunk();
  }
  function download(blob, name) {
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function fileSlug() {
    const m = orderedModules()[0];
    const base = (m && (m.fileSlug || m.shortName || m.name)) || 'Incident';
    return base.replace(/[^A-Za-z0-9]+/g, '');
  }

  // ---------- .docx export ----------
  function exportDocx() {
    const D = window.docx;
    if (!D) { flash('The docx library did not load (lib/docx.umd.js).'); return; }
    const vals = values();
    const figs = figures();
    const FONT = 'Times New Roman';
    const border = { style: D.BorderStyle.SINGLE, size: 4, color: '000000' };
    const runs = (text, base = {}) => inlineTokens(text).map(k => new D.TextRun({
      text: k.t, ...base,
      bold: base.bold || k.bold || undefined,
      font: k.code ? 'Courier New' : base.font,
      size: k.code ? 21 : base.size,
      highlight: k.ph ? 'yellow' : undefined,
    }));
    const para = (text, opts = {}, base = {}) => new D.Paragraph({ children: runs(text, base), spacing: { after: 160 }, ...opts });
    const codeParas = text => {
      const lines = String(text || '').split('\n');
      return lines.map((line, i) => new D.Paragraph({
        children: [new D.TextRun({ text: line || ' ', font: 'Courier New', size: 18 })],
        shading: { type: D.ShadingType.CLEAR, color: 'auto', fill: 'F2F2F2' },
        spacing: { after: i === lines.length - 1 ? 160 : 0 },
      }));
    };
    const blocks = text => parseBlocks(subst(text, vals)).flatMap(b => {
      if (b.type === 'p') return [para(b.text)];
      if (b.type === 'ul') return b.items.map((it, i) => new D.Paragraph({ children: runs(it), bullet: { level: 0 }, spacing: { after: i === b.items.length - 1 ? 160 : 40 } }));
      return codeParas(b.text);
    });
    const heading = (text, size) => new D.Paragraph({ children: [new D.TextRun({ text, bold: true, size })], spacing: { before: 320, after: 140 }, keepNext: true });
    const dataUrlBytes = url => {
      const bin = atob(url.split(',')[1]);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    };
    const caption = f => new D.Paragraph({
      alignment: D.AlignmentType.CENTER, spacing: { after: 240 },
      children: runs(`Figure ${f.n}. ${subst(f.caption || '', vals) || '{{caption}}'}`, { italics: true, size: 22 }),
    });
    const figureParas = f => {
      if (f.type === 'output') return [...codeParas(f.text), caption(f)];
      const maxW = 600, maxH = 720;
      let w = Math.min(maxW, f.w || maxW);
      let hgt = f.w ? w * f.h / f.w : w * 0.6;
      if (hgt > maxH) { w = w * maxH / hgt; hgt = maxH; }
      return [
        new D.Paragraph({ alignment: D.AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
          children: [new D.ImageRun({ data: dataUrlBytes(f.data), transformation: { width: Math.round(w), height: Math.round(hgt) } })] }),
        caption(f),
      ];
    };

    const meta = state.meta;
    const hdrLine = (label, value, last) => new D.Paragraph({
      children: [new D.TextRun({ text: `${label}: `, bold: true }), ...runs(value)],
      border: last ? { bottom: border } : undefined,
      spacing: { after: last ? 280 : 0 },
    });
    const children = [
      new D.Paragraph({ alignment: D.AlignmentType.CENTER, border: { bottom: border }, spacing: { after: 200 },
        children: [new D.TextRun({ text: 'MEMORANDUM', bold: true })] }),
      hdrLine('To', subst(meta.to, vals)),
      hdrLine('From', subst(meta.from, vals)),
      hdrLine('Date', fmtDate(meta.date)),
      hdrLine('Subject', subst(meta.subject, vals), true),
      ...blocks(state.sections.summary.text),
      heading('Incident Details', 32),
      new D.Table({
        columnWidths: [3300, 4700],
        rows: DETAIL_ROWS.map(([label, k]) => new D.TableRow({
          children: [label, vals[k] || '{{' + k + '}}'].map((t, ci) => new D.TableCell({
            width: { size: ci ? 4700 : 3300, type: D.WidthType.DXA },
            borders: { top: border, bottom: border, left: border, right: border },
            margins: { top: 80, bottom: 80, left: 110, right: 110 },
            children: [new D.Paragraph({ children: runs(t) })],
          })),
        })),
      }),
    ];
    for (const s of SECTIONS) {
      if (s.key === 'summary') continue;
      children.push(heading(s.title, 28));
      children.push(...blocks(state.sections[s.key].text));
      figs[s.key].forEach(f => children.push(...figureParas(f)));
    }
    children.push(
      para(`If there are any other questions about this incident, please do not hesitate to reach out and Team ${meta.team} would be happy to provide more information.`, { spacing: { before: 360, after: 240 } }),
      new D.Paragraph({ children: [new D.TextRun('Thank you,')] }),
      new D.Paragraph({ children: [new D.TextRun(`Team ${meta.team}`)] }),
    );
    const doc = new D.Document({
      creator: `Team ${meta.team}`,
      title: meta.subject,
      styles: { default: { document: { run: { font: FONT, size: 24 } } } },
      sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children }],
    });
    D.Packer.toBlob(doc).then(
      blob => download(blob, `Team${meta.team}_Incident_Response_${fileSlug()}.docx`),
      err => { console.error(err); flash('Export failed: ' + err.message); });
  }

  // ---------- wiring ----------
  function wire() {
    $$('[data-meta]').forEach(inp => inp.addEventListener('input', () => { state.meta[inp.dataset.meta] = inp.value; changed(); }));
    $$('[data-detail]').forEach(inp => inp.addEventListener(inp.type === 'checkbox' ? 'change' : 'input', () => {
      const k = inp.dataset.detail;
      state.details[k] = inp.type === 'checkbox' ? inp.checked : inp.value;
      if (k === 'downtime_none') syncInputs();
      changed();
    }));
    $('#btnExport').onclick = exportDocx;
    $('#btnSave').onclick = () => {
      const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
      download(blob, `Team${state.meta.team}_IR_draft_${fileSlug()}.json`);
    };
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
        setTimeout(() => { delete btnNew.dataset.armed; btnNew.textContent = 'New report'; btnNew.classList.remove('danger'); }, 3000);
        return;
      }
      const keep = { ...state.meta, date: today() };
      state = defaultState();
      state.meta = keep;
      delete btnNew.dataset.armed; btnNew.textContent = 'New report'; btnNew.classList.remove('danger');
      renderAll(); save();
    };
  }

  // ---------- boot ----------
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) loadState(JSON.parse(saved));
  } catch (e) { /* storage blocked or corrupt — start fresh */ }
  buildSectionCards();
  wire();
  renderAll();
})();

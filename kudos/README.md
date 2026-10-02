# Kudos

Kudos is our builder: a static page that builds a response as a `.docx` in our team's memo format: "INTEROFFICE MEMORANDUM", To/From/Date/Subject, a bold "Summary:", sections, tables with a gray header row, italic "Figure N." captions, and our closing and sign-off.

Pick the type and a variant, and the page lays out a **template**: the sections, tables, and screenshot slots that kind of request usually needs. Every `[[prompt]]` is highlighted until you replace it with what your team actually did, and the count of unfilled prompts shows next to "Autosaved".

> Templates give structure, not answers. Always read the whole request, paste its deliverables into **requirements**, and tick them off before you submit.

## Using it

1. **requirements (private):** paste the deliverables from the request, one per line, and tick them off. This box is never exported.
2. **Memo header:** team number, number, To, subject, and sign-off. The exported file is named `NN_teamXX.docx`.
3. **writing type:** pick the type, then the variant closest to the request, then **Use this draft**. Search works on type and variant names. **Blank memo** starts with just the header and summary.
4. **Environment hosts:** enter the competition's hosts once, or load the sample 8-host topology. Per-host sections ("Ubuntu Ecom:" + screenshot) and table rows are built from this list, and it's kept between them.
5. **Draft details:** every `{{placeholder}}` in it gets a box here, so you never have to hunt through the text for blanks. Anything still unfilled is highlighted in the preview and in the Word file, and is counted next to "Autosaved".
6. **Sections:** untick sections you don't need, edit the text and headings, reorder them, and use **Reset** to get the draft text back. Tables are editable grids, and **Fill rows from hosts** rebuilds the rows from your host list.
7. **Evidence:** click a dashed box and paste a screenshot (Ctrl/⌘+V), drop images onto it, or add pasted command output as text. Click a *caption idea* to caption the first figure that doesn't have one yet.
8. **Insert:** quick buttons for phrases we use often: the "unable to finish" note, a bold **Please note** callout, the AI-use disclosure, and a Sources section.
9. **Export .docx.**

Drafts autosave in your browser. **Save draft** / **Load draft** passes one (screenshots included) to a teammate as a `.json` file. **New** keeps the team settings and hosts and clears everything else, and needs two clicks.

Everything runs in the browser and nothing is uploaded. It works offline from a local copy: open `index.html` directly.


## Text formatting

In any text box: blank line = new paragraph, `- ` bullets, `1. ` numbered steps, `### ` small heading, `[[prompt]]` text still to be written (highlighted), triple-backtick fences for commands/code, `**bold**`, `` `inline code` ``.

## Adding or changing drafts

Each type is one file in `drafts/`. To add a type, copy a file, change it, and add a `<script src="drafts/your-file.js"></script>` line to `index.html`.

```js
window.INJECT_TYPES.push({
  id: 'unique-id',
  name: 'Name in the picker',
  description: 'One line shown above the variants.',
  variants: [{
    id: 'variant-id',
    name: 'Variant name',
    description: 'What this variant covers.',
    subject: 'Default subject line',
    to: 'CISO',                           // only used if To is empty
    vars: [{ key: 'siem', label: 'SIEM', default: 'Splunk' }],
    summary: 'Text under "Summary:".',
    sections: [
      { id: 'a', heading: 'Heading', level: 1, text: 'Body text', evidence: ['Caption idea'] },
      { id: 'b', heading: 'Optional bit', on: false, text: '…' },            // off by default
      { id: 'c', heading: 'A table', text: '',
        table: { columns: ['Col 1', 'Col 2'], rows: [['a', 'b']] } },
      { id: 'd', heading: 'One row per host', text: '',
        table: { columns: ['Host', 'IP', 'Notes'], rows: [],
                 hostRows: { filter: 'all', cells: ['{{host}}', '{{host_ip}}', ''] } } },
      { id: 'e', heading: 'Per host', text: '',
        perHost: { filter: 'linux', label: '{{host}}:', text: '', evidence: ['Screenshot on {{host}}'],
                   table: { columns: [...], rows: [...] } } },                  // table optional
    ],
  }],
});
```

**Placeholders available everywhere:** `{{team}}`, `{{company}}`, `{{to}}`, `{{hosts_all}}`, `{{hosts_linux}}`, `{{hosts_windows}}`, plus any `vars`. Inside per-host sections and host rows: `{{host}}`, `{{host_ip}}`, `{{host_os}}`. Any other `{{name}}` automatically gets an input box under Draft details.

Host filters are `all`, `linux`, `windows`, or `other`.

If a file declares top-level `const`s (e.g. a long script reused in several sections), wrap the file in `(() => { … })();` so it can't clash with other draft files.

## Files

```
index.html        page + list of draft <script> tags
app.js            form, drafts, hosts, tables, evidence, preview, .docx export
styles.css
drafts/*.js       one template file per type (23 types, 95 variants)
lib/docx.umd.js   docx 8.5.0 (MIT), included locally so the page works offline
```

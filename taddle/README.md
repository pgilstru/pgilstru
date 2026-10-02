# Taddle

Taddle is our incident report builder: a static page that builds a CCDC incident report memo as a `.docx`. It uses the same layout as our template: memo header, Incident Details table, Vulnerability / Initial Access / Impact / Eradication / Remediation, and figures with captions.

Pick what happened from a list of **playbooks**, fill in the incident details, tick the steps you actually took, and paste in screenshots. The page writes the draft text, checks the report against the IR scoring rubric, and exports a Word file.

> ⚠️ The four included playbooks are **temporary prototype text**, marked `draft: true` (they show a DRAFT badge). Have the team review and rewrite them before a competition.

## Using it

1. **What happened?** Tick one or more playbooks. Chain them the way the attack went:
   *how they got in* (access) → *what they did* (action) → *how they stayed* (persistence).
2. **Playbook details.** Fill in the values the playbooks use, such as the task name or web shell path.
3. **Incident details.** Enter exact timestamps. The page formats them as `March 6, 2026 – 10:42:32 AM CST` and works out the downtime length.
4. **Sections.** The text comes from the playbooks. For Eradication and Remediation, **tick only what you actually did**; the text follows the checkboxes. You can edit any section freely. Once you edit one, it stops updating from the playbooks until you click *Reset to playbook text*.
5. **Evidence.** In each section, click the dashed box and paste a screenshot (Ctrl/⌘+V), or drop image files onto it. *+ Add command output* adds a block of pasted command output, which the rubric accepts in place of a screenshot. Click a *caption idea* to caption the first figure that doesn't have one yet.
6. **Rubric check** (right side) lists what would still cost points: missing fields, missing evidence, unfilled `{{placeholders}}`, and persistence steps that weren't done.
7. **Export .docx** downloads `Team07_Incident_Response_<Type>.docx`. Any placeholder left unfilled is highlighted yellow in the Word file so it's easy to spot.

Drafts are autosaved in your browser. Use **Save draft** / **Load draft** to pass a report (screenshots included) to a teammate as a `.json` file. **New report** needs two clicks, so one stray click won't wipe a draft.

Everything runs in the browser. Nothing is uploaded anywhere. It works offline from a local copy (open `index.html` directly), which matters if competition internet is limited.

## Hosting on GitHub Pages

Commit this folder to the repo, then turn on **Settings → Pages → Deploy from a branch** and pick the branch and folder. There's no build step.


## Adding a playbook

1. Copy a file in `playbooks/` to a new name, e.g. `playbooks/cron-persistence.js`.
2. Edit it (the format is below).
3. Add a `<script src="playbooks/cron-persistence.js"></script>` line to `index.html`, above `app.js`.

```js
window.IR_PLAYBOOKS.push({
  id: 'unique-id',
  name: 'Name shown in the picker',
  shortName: 'Short name',           // used for sub-headings when several playbooks are combined
  fileSlug: 'Cron',                  // goes in the exported file name
  category: 'access',                // 'access' | 'action' | 'persistence'
  draft: true,                       // shows a DRAFT badge + rubric warning; remove once reviewed
  description: 'One line for the picker.',
  vulnScreenshot: true,              // can the vulnerability be shown apart from its abuse? (rubric footnote)
  defaults: { port_service: '22/TCP – SSH' },   // fills empty incident fields when selected
  vars: [{ key: 'cron_file', label: 'Cron file', placeholder: '/etc/cron.d/x' }],

  summary: 'phrase that finishes "Team 07 would like to report evidence of …"',
  vulnerability: 'Paragraphs. Blank line = new paragraph.',
  initialAccess: '…',
  impact: '…',
  eradication: {
    intro: 'Team {{team}} removed the attacker\'s access by doing the following:',
    steps: [
      { id: 'a', text: 'What we did.', commands: String.raw`command here`, default: true },
    ],
  },
  remediation: { intro: '…', steps: [ /* same as eradication */ ] },
  splunk: [{ title: 'What this finds', spl: String.raw`index=* …` }],
  evidence: {                        // caption ideas per section
    vulnerability: ['…'], initialAccess: ['…'], eradication: ['…'], remediation: ['…'],
  },
});
```

**Placeholders** available everywhere: `{{team}}`, `{{affected_host}}`, `{{affected_account}}`, `{{source_ip}}`, `{{dest_ip}}`, `{{port_service}}`, `{{initial_access_time}}`, `{{remediated_time}}`, `{{downtime}}`, `{{tz}}`, plus any `vars` keys from selected playbooks. In Splunk searches, an empty placeholder becomes `*`.

**Text formatting** in sections: `- ` for bullets, triple-backtick fences for command blocks, `**bold**`, `` `inline code` ``.

Wrap commands and SPL in `String.raw` so backslashes in Windows paths and regexes come through unchanged. (You can't use backticks inside a `String.raw` string.)

## Writing good playbooks

- Write the Vulnerability section to explain **why** it was possible (the root cause), not only what red team did. That section is 30% of the score.
- Split eradication steps finely enough that people can untick the ones they didn't do. A report that claims steps you didn't take will cost you more than one that leaves them out.
- Every persistence playbook should remove **both** the payload **and** whatever restarts it. The rubric specifically docks points for leaving the scheduled task behind.
- Keep the repo general. It's public, so red team can read it too. No environment details, IPs, or passwords.

## Files

```
index.html          page + list of playbook <script> tags
app.js              form, text generation, rubric check, .docx export
styles.css
playbooks/*.js      one file per playbook
lib/docx.umd.js  docx 8.5.0 (MIT), included locally so the page works offline
```

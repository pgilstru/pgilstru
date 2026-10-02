// TEMPORARY prototype playbook — have the team review and rewrite before competition.
window.IR_PLAYBOOKS.push({
  id: 'web-unauthorized-file',
  name: 'Web shell in the web root',
  shortName: 'Web shell',
  fileSlug: 'Webshell',
  category: 'access',
  platform: 'Web (Linux or Windows)',
  draft: true,
  description: 'A malicious script in the web root let red team run commands as the web server.',
  vulnScreenshot: true, // rubric example: show the malicious/vulnerable code itself
  defaults: { port_service: '80/TCP, 443/TCP – HTTP/HTTPS', affected_account: 'www-data' },
  vars: [
    { key: 'webshell_path', label: 'Web shell file path', placeholder: '/var/www/html/uploads/img.php' },
    { key: 'web_app', label: 'Web application', placeholder: 'the company intranet site' },
    { key: 'entry_point', label: 'How the file got there', placeholder: 'an unrestricted file upload form' },
  ],

  summary: 'a malicious web shell on {{affected_host}} that allowed remote command execution',

  vulnerability:
`{{web_app}} on {{affected_host}} allowed a file to be placed in the web root through {{entry_point}}. The web server was set up to run scripts from that directory, so the attacker's file ({{webshell_path}}) ran as server-side code whenever it was requested. This gave anyone who knew the file's URL the ability to run operating-system commands as the web server account ({{affected_account}}).`,

  initialAccess:
`At {{initial_access_time}}, {{source_ip}} placed {{webshell_path}} on {{affected_host}} ({{dest_ip}}) and then sent HTTP requests to it. The web server access logs show repeated requests from {{source_ip}} to this file carrying command parameters. Commands run through it executed as {{affected_account}}.`,

  impact:
`The attacker could run commands on {{affected_host}} as {{affected_account}}, read or change the website and its configuration (including any database credentials in it), and use the host to reach other internal systems. Service downtime: {{downtime}}.`,

  eradication: {
    intro: 'Team {{team}} removed the attacker\'s access by doing the following:',
    steps: [
      { id: 'preserve', text: 'Saved a copy and hash of the web shell for evidence before removing it.',
        commands: String.raw`sha256sum {{webshell_path}}
sudo cp -p {{webshell_path}} /root/ir-evidence/` },
      { id: 'remove', text: 'Deleted {{webshell_path}} from the web root.',
        commands: String.raw`sudo rm -f {{webshell_path}}` },
      { id: 'hunt', text: 'Searched the web root for other recently changed or suspicious script files and removed any the team did not recognize.',
        commands: String.raw`sudo find /var/www -type f -name "*.php" -mmin -720 -ls
sudo grep -rlE "(system|shell_exec|passthru|proc_open|popen)\s*\(" /var/www` },
      { id: 'procs', text: 'Ended processes started by the web server account that were not part of the web server itself.',
        commands: String.raw`ps -u {{affected_account}} -f --forest` },
      { id: 'block', text: 'Blocked {{source_ip}} at the firewall.', default: false },
    ],
  },

  remediation: {
    intro: 'To close the vulnerability, Team {{team}}:',
    steps: [
      { id: 'upload', text: 'Fixed {{entry_point}} so it only accepts expected file types and stores uploads outside the web root.' },
      { id: 'noexec', text: 'Disabled script execution in upload directories.',
        commands: String.raw`# Apache: <Directory /var/www/html/uploads> php_admin_flag engine off </Directory>
# nginx:  location ^~ /uploads/ { location ~ \.php$ { deny all; } }
sudo apachectl configtest && sudo systemctl reload apache2` },
      { id: 'perms', text: 'Made the web root owned by root and not writable by the web server account, except for directories that must be.',
        commands: String.raw`sudo chown -R root:root /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;` },
      { id: 'phpini', text: 'Disabled dangerous PHP functions the site does not need.', default: false,
        commands: String.raw`# php.ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen` },
      { id: 'creds', text: 'Changed any credentials stored in the web application\'s configuration (e.g. database passwords).', default: false },
    ],
  },

  splunk: [
    { title: 'Requests to the web shell', spl: String.raw`
index=* (sourcetype=access_combined* OR sourcetype=apache* OR sourcetype=nginx* OR sourcetype=iis) "{{webshell_path}}"
| table _time host clientip method uri status useragent` },
    { title: 'Requests carrying command-like parameters', spl: String.raw`
index=* (sourcetype=access_combined* OR sourcetype=apache* OR sourcetype=nginx* OR sourcetype=iis)
  (uri_query="*cmd=*" OR uri_query="*exec=*" OR uri_query="*command=*")
| stats count earliest(_time) as first latest(_time) as last by clientip uri_path
| convert ctime(first) ctime(last)` },
    { title: 'Uploads (POSTs) from the source IP', spl: String.raw`
index=* "{{source_ip}}" (method=POST OR "POST ") | table _time host uri status` },
  ],

  evidence: {
    vulnerability: [
      'Contents of the web shell {{webshell_path}}',
      'Upload code that accepts any file type',
    ],
    initialAccess: [
      'Web server logs showing {{source_ip}} requesting the web shell',
    ],
    eradication: [
      'Hash and removal of {{webshell_path}}',
      'Searching the web root for other suspicious files',
    ],
    remediation: [
      'Script execution disabled in the uploads directory',
      'Corrected web root ownership and permissions',
    ],
  },
});

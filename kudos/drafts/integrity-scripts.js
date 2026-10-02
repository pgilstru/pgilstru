// Template: Integrity scripts. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "integrity-scripts",
  "name": "Integrity scripts",
  "description": "Web page hashing scripts, Linux file integrity monitoring run from cron/startup, and website integrity with rapid restore.",
  "variants": [
    {
      "id": "web-hash",
      "name": "Web page integrity script (Python)",
      "subject": "Web Page Integrity",
      "to": "Network Operations Management",
      "vars": [
        {
          "key": "web_dirs",
          "label": "Directories monitored"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "dirs",
          "heading": "What Is Monitored",
          "text": "[[Write this section: What Is Monitored]]"
        },
        {
          "id": "script",
          "heading": "The Script",
          "text": "```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "how",
          "heading": "How It Works",
          "text": "- **hashFile()** [[Describe]]\n- **listFiles()** [[Describe]]\n- **grabHashes()** [[Describe]]\n- **establishBaseline()** [[Describe]]\n- **verifyFiles()** [[Describe]]"
        },
        {
          "id": "run",
          "heading": "Running the Script",
          "text": "[[Write this section: Running the Script]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "proof",
          "heading": "Proof of Functionality",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Baseline created",
            "Script detecting a manual change to a web page",
            "Cron entry running the script every 5 minutes"
          ]
        }
      ]
    },
    {
      "id": "linux-fim",
      "name": "Linux file integrity scripts + run at startup",
      "subject": "File Integrity Monitoring Scripts",
      "to": "System Administrator",
      "vars": [
        {
          "key": "dirs",
          "label": "Directories monitored"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "scripts",
          "heading": "Script Description",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n- **genesis.py** [[Describe]]\n- **check.py** [[Describe]]",
          "evidence": [
            "Successful run of genesis.py and the created baseline file"
          ]
        },
        {
          "id": "dirs",
          "heading": "Directories Monitored",
          "text": "[[Write this section: Directories Monitored]]"
        },
        {
          "id": "code",
          "heading": "Source Code",
          "text": "```\n[[Paste the commands, script, or output]]\n```\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "deploy",
          "heading": "Running Every 5 Minutes and at Startup",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "Integrity check installed and scheduled on {{host}}"
            ]
          }
        },
        {
          "id": "proof",
          "heading": "Proof of Functionality",
          "text": "",
          "evidence": [
            "A modified file reported in syslog"
          ]
        }
      ]
    },
    {
      "id": "web-restore",
      "name": "Website integrity & rapid recovery",
      "subject": "Website Integrity & Rapid Recovery",
      "to": "CISO",
      "vars": [
        {
          "key": "live_file",
          "label": "Live file",
          "default": "/var/www/html/index.php"
        },
        {
          "key": "backup_file",
          "label": "Backup copy"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "check",
          "heading": "Web Integrity Check",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "The web_integrity_check.sh script"
          ]
        },
        {
          "id": "restore",
          "heading": "Web Restore Script",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "The web_restore.sh script"
          ]
        },
        {
          "id": "proof",
          "heading": "Proof of Functionality",
          "text": "",
          "evidence": [
            "Crontab running both scripts every 5 minutes",
            "Integrity check passing",
            "Defaced web page used to test the scripts",
            "Restored web page after the crontab ran"
          ]
        }
      ]
    }
  ]
});

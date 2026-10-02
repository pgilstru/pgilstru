// Template: Monitoring scripts. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "monitoring-scripts",
  "name": "Monitoring scripts",
  "description": "Disk space monitoring on Windows and Linux, and DoS detection.",
  "variants": [
    {
      "id": "disk-windows",
      "name": "Windows disk space monitor",
      "subject": "Windows Script to Monitor Disk Space",
      "to": "IT Director",
      "vars": [
        {
          "key": "threshold",
          "label": "Alert threshold",
          "default": "10% free space"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "how",
          "heading": "",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Alert example tested with a low threshold",
            "The task in Task Scheduler"
          ]
        },
        {
          "id": "script",
          "heading": "Appendix 1: The PowerShell Script",
          "text": "```\n[[Paste the commands, script, or output]]\n```"
        }
      ]
    },
    {
      "id": "disk-linux",
      "name": "Linux disk space monitor",
      "subject": "Monitoring Disk Space on Linux",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "how",
          "heading": "",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "The disk monitor script"
          ]
        },
        {
          "id": "test",
          "heading": "Testing",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Test run of the disk usage script"
          ]
        },
        {
          "id": "cron",
          "heading": "Deployment",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "Cron entry for the disk monitor on {{host}}"
            ]
          }
        }
      ]
    },
    {
      "id": "dos",
      "name": "DoS detection script (Linux)",
      "subject": "Linux DoS Mitigation Script",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "script",
          "heading": "noDos.py",
          "text": "```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "systemd",
          "heading": "Service and Timer",
          "text": "```\n[[Paste the commands, script, or output]]\n```\n\n```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "dosdetect timer",
            "dosdetect service"
          ]
        },
        {
          "id": "hosts",
          "heading": "Installation Evidence",
          "text": "",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "dosdetect timer active on {{host}}"
            ]
          }
        },
        {
          "id": "logs",
          "heading": "Evidence of the Script Running",
          "text": "",
          "evidence": [
            "Script output logged in journalctl"
          ]
        }
      ]
    }
  ]
});

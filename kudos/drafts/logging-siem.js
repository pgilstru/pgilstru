// Template: Logging / SIEM. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "logging-siem",
  "name": "Logging / SIEM",
  "description": "Central logging, logging best practices, validating Linux/Windows logging, reviewing logs, regex explanations, and Wazuh guides.",
  "variants": [
    {
      "id": "central",
      "name": "Set up centralized logging",
      "subject": "Centralized Logging",
      "to": "CISO",
      "vars": [
        {
          "key": "siem",
          "label": "SIEM",
          "default": "Splunk"
        },
        {
          "key": "siem_host",
          "label": "SIEM server",
          "default": "Splunk (Oracle 9)"
        },
        {
          "key": "siem_ip",
          "label": "SIEM server IP",
          "placeholder": "172.20.242.20"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "repo",
          "heading": "Central Repository",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Evidence of all hosts forwarding logs to {{siem}}"
          ]
        },
        {
          "id": "fw",
          "heading": "Firewall Policy Changes",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Firewall security policy allowing {{siem}} ports 8000 and 9997"
          ]
        },
        {
          "id": "fwd",
          "heading": "Forwarding Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "all",
            "label": "{{host}}:",
            "evidence": [
              "{{siem}} forwarder running on {{host}}"
            ]
          }
        },
        {
          "id": "test",
          "heading": "Test Messages",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Test-message records from Linux in the central repository",
            "Test-message records from Windows in the central repository"
          ]
        },
        {
          "id": "review",
          "heading": "Reviewing Logs",
          "on": false,
          "text": "[[Write this section: Reviewing Logs]]"
        },
        {
          "id": "time",
          "heading": "Timestamps",
          "on": false,
          "text": "[[Write this section: Timestamps]]"
        }
      ]
    },
    {
      "id": "best-practices",
      "name": "Logging best practices (Linux & Windows)",
      "subject": "Logging Best Practices",
      "to": "CISO",
      "vars": [
        {
          "key": "siem",
          "label": "SIEM",
          "default": "Splunk"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "linux-table",
          "heading": "LINUX Available Logging Facilities",
          "text": "",
          "table": {
            "columns": [
              "Logging Facility",
              "Description",
              "Benefits",
              "Cons"
            ],
            "rows": [
              [
                "Auditd",
                "",
                "",
                ""
              ],
              [
                "Snoopy",
                "",
                "",
                ""
              ],
              [
                "systemd-journald",
                "",
                "",
                ""
              ],
              [
                "rsyslog",
                "",
                "",
                ""
              ],
              [
                "{{siem}} Forwarder",
                "",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "linux-rec",
          "heading": "Recommendation for Linux",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{siem}} forwarder running and forwarding logs to the indexer",
            "Example of auditd rules configured in /etc/audit/audit.rules",
            "Example of snoopy configuration in /etc/snoopy.ini"
          ]
        },
        {
          "id": "win-table",
          "heading": "WINDOWS Available Logging Facilities",
          "text": "",
          "table": {
            "columns": [
              "Logging Facility",
              "Description",
              "Benefits",
              "Cons"
            ],
            "rows": [
              [
                "Sysmon",
                "",
                "",
                ""
              ],
              [
                "Windows Event Log",
                "",
                "",
                ""
              ],
              [
                "{{siem}} Forwarder",
                "",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "win-rec",
          "heading": "Recommendation for Windows",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Advanced auditing script ran on Windows",
            "{{siem}} running on Windows"
          ]
        },
        {
          "id": "integrity",
          "heading": "Ensuring the Integrity of Logs",
          "text": "[[Write this section: Ensuring the Integrity of Logs]]"
        }
      ]
    },
    {
      "id": "validate-linux",
      "name": "Validate Linux logging & auditing",
      "subject": "Validation of Linux Logging & Auditing",
      "to": "CISO",
      "vars": [
        {
          "key": "test_user",
          "label": "Account used for test logons",
          "default": "ccdcuser1"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "hosts",
          "heading": "",
          "text": "",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}",
            "evidence": [
              "Results from running ‘systemctl status rsyslog’ on {{host}}",
              "Results from running ‘systemctl status systemd-journald’ on {{host}}",
              "Results from running ‘systemctl status auditd’ on {{host}}",
              "System message logs showing the test message was successfully logged",
              "Service logging showing logs after running ‘sudo systemctl restart ssh’",
              "SSH logs showing a successful logon attempt for {{test_user}}",
              "SSH logs showing a failed logon attempt for {{test_user}}",
              "Audit rules loaded (‘auditctl -l’)",
              "Results from triggering a kernel message"
            ]
          }
        }
      ]
    },
    {
      "id": "validate-windows",
      "name": "Validate Windows logging & auditing",
      "subject": "Windows Logging Evaluation",
      "to": "CISO",
      "vars": [
        {
          "key": "win_host",
          "label": "Windows host shown",
          "default": "Server 2022 FTP"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "logs",
          "heading": "Security, System, and Application Logs",
          "text": "",
          "evidence": [
            "Security, System, and Application logs enabled on {{win_host}}"
          ]
        },
        {
          "id": "logon",
          "heading": "Logon and Logoff",
          "text": "",
          "evidence": [
            "Logon event (4624) on {{win_host}}",
            "Logoff event (4634) on {{win_host}}"
          ]
        },
        {
          "id": "folder",
          "heading": "Folder Audit",
          "text": "",
          "evidence": [
            "Folder auditing configured",
            "File delete event recorded"
          ]
        },
        {
          "id": "group",
          "heading": "Group Membership",
          "text": "",
          "evidence": [
            "Group created (4727/4731)",
            "Group membership changed (4728/4732)",
            "Group deleted (4730/4734)"
          ]
        }
      ]
    },
    {
      "id": "review-iocs",
      "name": "Monitor & review log messages",
      "subject": "Monitor & Review Log Messages",
      "to": "CISO",
      "vars": [
        {
          "key": "siem",
          "label": "SIEM",
          "default": "Splunk"
        },
        {
          "key": "siem_host",
          "label": "SIEM server",
          "default": "Splunk (Oracle)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "collect",
          "heading": "Log Collection",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Evidence of all hosts forwarding logs to {{siem}}",
            "Example Linux monitor configuration showing syslog (messages) forwarding",
            "Example Windows configuration showing the apps which forward Event Logs"
          ]
        },
        {
          "id": "findings",
          "heading": "Findings",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Suspicious log entries found in {{siem}}"
          ]
        },
        {
          "id": "how",
          "heading": "How Messages Are Reviewed",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{siem}} alert query that detects ZeroLogon on Windows hosts"
          ]
        },
        {
          "id": "time",
          "heading": "Timestamps",
          "text": "[[Write this section: Timestamps]]"
        },
        {
          "id": "close",
          "heading": "",
          "text": "[[Write this paragraph]]"
        }
      ]
    },
    {
      "id": "regex",
      "name": "Explain a firewall-log regex",
      "subject": "Regex Patterns Explanation",
      "to": "Network Operations Management",
      "vars": [
        {
          "key": "regex",
          "label": "The regex",
          "placeholder": "(?:iptables|netfilter).*DROP.*SRC=(?P<src>\\d{1,3}(?:\\.\\d{1,3}){3})"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "pattern",
          "heading": "The Pattern",
          "text": "```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "tokens",
          "heading": "Breakdown of the Regex Tokens",
          "text": "",
          "table": {
            "columns": [
              "Token",
              "Meaning",
              "Explanation"
            ],
            "rows": [
              [
                "(?:iptables|netfilter)",
                "",
                ""
              ],
              [
                ".*",
                "",
                ""
              ],
              [
                "DROP",
                "",
                ""
              ],
              [
                "SRC=",
                "",
                ""
              ],
              [
                "(?P<src>...)",
                "",
                ""
              ],
              [
                "\\d{1,3}(?:\\.\\d{1,3}){3}",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "example",
          "heading": "Example Match",
          "text": "[[Write this section: Example Match]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Write this section: Example Match]]"
        }
      ]
    },
    {
      "id": "wazuh",
      "name": "Wazuh documentation / dashboard guide",
      "subject": "Wazuh Dashboard and Guide",
      "to": "CTO",
      "vars": [
        {
          "key": "wazuh_url",
          "label": "Wazuh URL",
          "placeholder": "https://10.100.118.240"
        },
        {
          "key": "wazuh_host",
          "label": "Wazuh server",
          "placeholder": "Explorer (Ubuntu 22.04)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "what",
          "heading": "What does it do?",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Wazuh dashboard"
          ]
        },
        {
          "id": "connected",
          "heading": "What is it connected to?",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "List of Wazuh agents",
            "Wazuh server users"
          ]
        },
        {
          "id": "dashboard",
          "heading": "Wazuh Dashboard",
          "on": false,
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Visualization displaying network activity being sent and received across the network hosts",
            "Visualization displaying known logins onto our systems",
            "Visualization displaying alerts on a per-host basis"
          ]
        },
        {
          "id": "howto",
          "heading": "“How-To” Guide for Analysts",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Wazuh home display",
            "Dashboard selection in the drop-down"
          ]
        },
        {
          "id": "recover",
          "heading": "Instructions to bring the system back up if Wazuh goes down",
          "on": false,
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "wazuh-manager service running"
          ]
        }
      ]
    }
  ]
});

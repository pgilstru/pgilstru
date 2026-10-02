// Template: Hardening / remove unneeded stuff. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "hardening",
  "name": "Hardening / remove unneeded stuff",
  "description": "Hardening checklists, unnecessary software audits, cleaning up attacker debris, legacy Windows services, and SMB hardening.",
  "variants": [
    {
      "id": "checklist",
      "name": "Hardening checklist with industry controls",
      "subject": "Server Hardening",
      "to": "Network Operations Management",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "win",
          "heading": "Windows-Based Devices",
          "text": "",
          "evidence": [
            "Windows Defender Firewall enabled for domain, private, and public networks",
            "Local users audited (Get-LocalUser)",
            "Unnecessary services disabled"
          ],
          "table": {
            "columns": [
              "Hardening Technique",
              "Industry Control",
              "Implementation on Team {{team}} Devices"
            ],
            "rows": [
              [
                "Changing Default Credentials",
                "",
                ""
              ],
              [
                "Windows Defender Firewall",
                "",
                ""
              ],
              [
                "Disable SSH / unused remote access",
                "",
                ""
              ],
              [
                "",
                "",
                ""
              ],
              [
                "Disable Unnecessary Services",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "lin",
          "heading": "Linux-Based Devices",
          "text": "",
          "evidence": [
            "Local users audited (awk -F: '$3 >= 1000 {print $1}' /etc/passwd)",
            "Host firewall rules",
            "SSH configuration"
          ],
          "table": {
            "columns": [
              "Hardening Technique",
              "Industry Control",
              "Implementation on Team {{team}} Devices"
            ],
            "rows": [
              [
                "Changing Default Credentials",
                "",
                ""
              ],
              [
                "Update Device",
                "",
                ""
              ],
              [
                "Host-Based Firewall",
                "",
                ""
              ],
              [
                "SSH Configuration",
                "",
                ""
              ],
              [
                "",
                "",
                ""
              ],
              [
                "Disable Unnecessary Services",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "steps",
          "heading": "Steps Followed",
          "on": false,
          "text": "[[Write this section: Steps Followed]]\n\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n[[Write this section: Steps Followed]]\n\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n[[Write this section: Steps Followed]]"
        }
      ]
    },
    {
      "id": "unnecessary-software",
      "name": "Unnecessary software / services audit",
      "subject": "Removal of Unnecessary Applications",
      "to": "CTO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "table",
          "heading": "Unnecessary Service Audit",
          "text": "",
          "table": {
            "columns": [
              "IP",
              "Name",
              "OS",
              "Unneeded Services/Applications",
              "Unneeded Ports"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host_ip}}",
                "{{host}}",
                "{{host_os}}",
                "",
                ""
              ]
            },
            "rows": []
          }
        },
        {
          "id": "note",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "proof",
          "heading": "Proof of Removal",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "all",
            "label": "{{host}}:",
            "evidence": [
              "Unneeded services on {{host}} before removal",
              "Services stopped and removed on {{host}}"
            ]
          }
        }
      ]
    },
    {
      "id": "attacker-debris",
      "name": "Clean up attacker debris",
      "subject": "Removal of Malicious Remnants",
      "to": "IT Manager",
      "vars": [
        {
          "key": "actor",
          "label": "Who left it",
          "default": "the attacker"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "table",
          "heading": "",
          "text": "",
          "evidence": [
            "Malicious scheduled task / service removed",
            "Unauthorized sudo users removed"
          ],
          "table": {
            "columns": [
              "Hostname",
              "IP",
              "OS",
              "Remnants",
              "Resolution"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                "{{host_ip}}",
                "{{host_os}}",
                "",
                ""
              ]
            },
            "rows": []
          }
        }
      ]
    },
    {
      "id": "legacy-services",
      "name": "Legacy / unneeded Windows services",
      "subject": "Windows AD Server Unneeded Services",
      "to": "IT Director",
      "vars": [
        {
          "key": "server",
          "label": "Server audited",
          "default": "Windows 2019 AD/DNS server"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "how",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "needed",
          "heading": "Services",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n- [[Item]]\n- [[Item]]\n\n[[Describe what was done and what the evidence below shows]]\n\n- [[Item]]\n- [[Item]]\n- [[Item]]",
          "evidence": [
            "Legacy services disabled on the {{server}}"
          ]
        },
        {
          "id": "ports",
          "heading": "Required Ports",
          "text": "[[Write this section: Required Ports]]",
          "table": {
            "columns": [
              "Service",
              "Port"
            ],
            "rows": [
              [
                "DNS",
                ""
              ],
              [
                "Kerberos",
                ""
              ],
              [
                "RPC Endpoint Mapper",
                ""
              ],
              [
                "LDAP",
                ""
              ],
              [
                "SMB",
                ""
              ],
              [
                "LDAP Global Catalog",
                ""
              ]
            ]
          }
        },
        {
          "id": "policy",
          "heading": "",
          "on": false,
          "text": "[[Write this paragraph]]"
        }
      ]
    },
    {
      "id": "smb",
      "name": "SMB hardening",
      "subject": "SMB Hardening",
      "to": "COO",
      "vars": [
        {
          "key": "share",
          "label": "Share",
          "default": "FTPRoot"
        },
        {
          "key": "server",
          "label": "Server",
          "placeholder": "the FTP server"
        },
        {
          "key": "client",
          "label": "Test client",
          "placeholder": "Cortex"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "steps",
          "heading": "Steps Taken",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{share}} connected over SMB",
            "{{share}} shared to the network",
            "Sharing disabled",
            "No {{share}} access over SMB"
          ]
        },
        {
          "id": "why",
          "heading": "Why This Matters",
          "text": "[[Write this section: Why This Matters]]"
        }
      ]
    }
  ]
});

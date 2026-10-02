// Template: Accounts & passwords. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "accounts-passwords",
  "name": "Accounts & passwords",
  "description": "Admin account audits, password policies (GPO, Linux, audits), and protecting SSH access.",
  "variants": [
    {
      "id": "admin-audit",
      "name": "Admin account & activity audit",
      "subject": "Admin Account Audit",
      "to": "CTO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "admins",
          "heading": "Administrative Accounts",
          "text": "",
          "table": {
            "columns": [
              "IP",
              "Name",
              "OS",
              "Administrative Accounts",
              "Account Permissions"
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
          "id": "logons",
          "heading": "Logon Activity",
          "on": false,
          "text": "",
          "table": {
            "columns": [
              "Name",
              "Account",
              "Number of Logons"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                "",
                ""
              ]
            },
            "rows": []
          }
        },
        {
          "id": "how",
          "heading": "How This Was Verified",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Windows admin group membership and logon events",
            "Linux sudo group membership and logon counts"
          ]
        },
        {
          "id": "removed",
          "heading": "Removed Unauthorized Users",
          "text": "[[Write this section: Removed Unauthorized Users]]\n\n- [[Item]]\n\n[[Write this section: Removed Unauthorized Users]]"
        },
        {
          "id": "pw-note",
          "heading": "",
          "text": "[[Write this paragraph]]"
        }
      ]
    },
    {
      "id": "gpo",
      "name": "Windows password policy (GPO)",
      "subject": "GPO Password Policy",
      "to": "CISO",
      "vars": [
        {
          "key": "dc",
          "label": "Domain controller",
          "default": "Windows 2019 AD/DNS server"
        },
        {
          "key": "min_length",
          "label": "Minimum length",
          "default": "15"
        },
        {
          "key": "max_age",
          "label": "Maximum age (days)",
          "default": "90"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "policy",
          "heading": "Company Password Policy",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "gpo",
          "heading": "Implementation with Group Policy on the {{dc}}",
          "text": "",
          "evidence": [
            "Configured password policy on the domain controller"
          ]
        },
        {
          "id": "nist",
          "heading": "Reasoning",
          "text": "[[Write this section: Reasoning]]"
        },
        {
          "id": "lockout",
          "heading": "Account Lockout Policy",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Configured account lockout on the domain controller"
          ]
        }
      ]
    },
    {
      "id": "linux",
      "name": "Linux password policy",
      "subject": "Linux Password Policy Configuration",
      "to": "CISO",
      "vars": [
        {
          "key": "min_length",
          "label": "Minimum length",
          "default": "15"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "complexity",
          "heading": "Complexity",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "pwquality.conf settings"
          ]
        },
        {
          "id": "aging",
          "heading": "Aging",
          "text": "[[Write this section: Aging]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Write this section: Aging]]"
        },
        {
          "id": "history",
          "heading": "History Reuse",
          "text": "[[Write this section: History Reuse]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "lockout",
          "heading": "Lockout",
          "text": "[[Write this section: Lockout]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "hash",
          "heading": "Hashing",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Password hashing algorithm"
          ]
        },
        {
          "id": "inactive",
          "heading": "Inactivity",
          "text": "[[Write this section: Inactivity]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "src",
          "heading": "Sources",
          "level": 2,
          "text": "- [[Item]]\n- [[Item]]"
        }
      ]
    },
    {
      "id": "audit",
      "name": "Password strength audit & enforcement",
      "subject": "Password Audit and Policy Update",
      "to": "CTO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "table",
          "heading": "Password Policies for Hosts",
          "text": "",
          "table": {
            "columns": [
              "Hostnames",
              "Current Password Policy",
              "New Password Policy",
              "Change Notes"
            ],
            "rows": [
              [
                "{{hosts_windows}}",
                "",
                "",
                ""
              ],
              [
                "{{hosts_linux}}",
                "",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "nist",
          "heading": "NIST Framework Compliance",
          "text": "[[Write this section: NIST Framework Compliance]]"
        },
        {
          "id": "proof",
          "heading": "Proof of Updated Password Policy",
          "text": "",
          "evidence": [
            "Updated password policy for Windows systems",
            "Updated PAM file on a Linux host"
          ]
        }
      ]
    },
    {
      "id": "ssh",
      "name": "Plan & protect SSH access",
      "subject": "Plan & Protect SSH Access",
      "to": "CISO",
      "vars": [
        {
          "key": "admin_user",
          "label": "Admin account allowed",
          "default": "ccdcuser1"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "edge",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "linux",
          "heading": "Linux Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "Secure sshd configuration on {{host}}"
            ]
          }
        },
        {
          "id": "win",
          "heading": "Windows Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "windows",
            "label": "{{host}}:",
            "evidence": [
              "SSH running and securely configured on {{host}}"
            ]
          }
        }
      ]
    }
  ]
});

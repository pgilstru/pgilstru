// Template: Business / management memos. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "business-memos",
  "name": "Business / management memos",
  "description": "Lessons learned, malware protection, ATT&CK-style incident catalog, interview checklist, status report, legal report, signed evidence, budget, AI, and current security state.",
  "variants": [
    {
      "id": "avoided",
      "name": "How the incident could have been avoided",
      "subject": "How the Incident Could Have Been Avoided",
      "to": "CISO",
      "vars": [
        {
          "key": "incident",
          "label": "Incident (short)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "human",
          "heading": "Human Controls",
          "text": "1. **Education:** [[Describe]]\n1. **Test Phishing Scenarios:** [[Describe]]"
        },
        {
          "id": "policy",
          "heading": "Policy and Procedure",
          "text": "1. **Implement Multi-Factor Authentication:** [[Describe]]\n1. **Zero Trust and Least Privilege Architecture:** [[Describe]]"
        },
        {
          "id": "tech",
          "heading": "Technical Controls",
          "text": "1. **Antivirus or EDR:** [[Describe]]\n1. **Block Access to Potentially Malicious URLs:** [[Describe]]\n1. **Reduce Attack Surface:** [[Describe]]"
        },
        {
          "id": "sources",
          "heading": "Resources",
          "level": 2,
          "text": "- [[Item]]"
        }
      ]
    },
    {
      "id": "malware-protection",
      "name": "Memo on protection from malware",
      "subject": "How We Protect From Malware",
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
          "id": "win",
          "heading": "Windows",
          "text": "[[Write this section: Windows]]"
        },
        {
          "id": "lin",
          "heading": "Linux",
          "text": "[[Write this section: Linux]]"
        },
        {
          "id": "siem",
          "heading": "Monitoring",
          "text": "[[Write this section: Monitoring]]"
        },
        {
          "id": "policy",
          "heading": "Policy",
          "text": "[[Write this section: Policy]]"
        }
      ]
    },
    {
      "id": "attack-catalog",
      "name": "Catalog incidents by ATT&CK-style category",
      "subject": "Mitigation Plans",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "catalog",
          "heading": "Incident Reports by Category",
          "text": "[[Write this section: Incident Reports by Category]]",
          "table": {
            "columns": [
              "Category",
              "Incident Report(s)",
              "What the Attacker Did"
            ],
            "rows": [
              [
                "Reconnaissance",
                "",
                ""
              ],
              [
                "Initial Access",
                "",
                ""
              ],
              [
                "Execution",
                "",
                ""
              ],
              [
                "Persistence",
                "",
                ""
              ],
              [
                "Privilege Escalation",
                "",
                ""
              ],
              [
                "Lateral Movement",
                "",
                ""
              ],
              [
                "Command & Control (C2)",
                "",
                ""
              ],
              [
                "Collection & Exfiltration",
                "",
                ""
              ],
              [
                "Impact / Objective",
                "",
                ""
              ],
              [
                "Evasion & Anti-Detection",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "chosen",
          "heading": "Two Chosen Categories",
          "text": "### {{category_1}}\n\n[[Write this section: Two Chosen Categories]]\n\n### {{category_2}}\n\n[[Write this section: Two Chosen Categories]]"
        },
        {
          "id": "ai",
          "heading": "AI Integration",
          "on": false,
          "text": "[[Write this section: AI Integration]]"
        }
      ]
    },
    {
      "id": "interview",
      "name": "Interview checklist",
      "subject": "Interview Checklist",
      "to": "IT Director",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "topics",
          "heading": "Topics",
          "text": "- **Windows Administration:** [[Describe]]\n- **Firewalls:** [[Describe]]\n- **Network and Systems Engineering:** [[Describe]]\n- **Incident Response and Threat Hunting:** [[Describe]]"
        },
        {
          "id": "attrs",
          "heading": "Attributes",
          "text": "- [[Item]]"
        },
        {
          "id": "general",
          "heading": "General Interview Questions",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "tech",
          "heading": "Technical Interview Questions",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        }
      ]
    },
    {
      "id": "status",
      "name": "Status report to management",
      "subject": "Day 1 Accomplishments",
      "to": "CISO & CEO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "goals",
          "heading": "Goals",
          "text": "[[Write this section: Goals]]"
        },
        {
          "id": "incidents",
          "heading": "Incidents",
          "text": "[[Write this section: Incidents]]"
        },
        {
          "id": "mgmt",
          "heading": "Management",
          "text": "[[Write this section: Management]]\n\n- [[Item]]"
        },
        {
          "id": "assess",
          "heading": "Assessment",
          "text": "[[Write this section: Assessment]]"
        }
      ]
    },
    {
      "id": "legal",
      "name": "Legal department report on damage",
      "subject": "Legal Department Report",
      "to": "Legal Department",
      "vars": [
        {
          "key": "server",
          "label": "Server",
          "default": "Ubuntu Ecom server"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "cause",
          "heading": "Cause of the Server Failure",
          "text": "[[Write this section: Cause of the Server Failure]]"
        },
        {
          "id": "repairs",
          "heading": "Repairs Taken",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "intent",
          "heading": "Final Assessment on Possible Malicious Intent",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Unauthorized SSH keys identified and removed"
          ]
        },
        {
          "id": "evidence",
          "heading": "How Evidence and Integrity Have Been Preserved",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Website currently functioning and operational"
          ]
        }
      ]
    },
    {
      "id": "signed",
      "name": "Secure a report with digital signatures",
      "subject": "Secured Report with Digital Signatures",
      "to": "Legal Department",
      "vars": [
        {
          "key": "server",
          "label": "Where the file is stored",
          "default": "Windows Server 2022 FTP"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "pdf",
          "heading": "",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "The file is stored as a PDF",
            "The PDF has a CONFIDENTIAL watermark over the content of each page",
            "Only administrators can access the report file",
            "Digital signature on the PDF"
          ]
        },
        {
          "id": "pubkey",
          "heading": "Verifying the Signature",
          "text": "[[Write this section: Verifying the Signature]]"
        }
      ]
    },
    {
      "id": "budget",
      "name": "Upgrade & improvement budget",
      "subject": "Upgrade and Improvement Recommendations",
      "to": "Management",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "hw",
          "heading": "Hardware",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "red",
          "heading": "Redundancy",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "sw",
          "heading": "Software Applications",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        }
      ]
    },
    {
      "id": "ai",
      "name": "Role of AI in cyber defense",
      "subject": "Role of AI in Cyber Defense",
      "to": "IT Director",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "intro",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "us",
          "heading": "How We Have Used AI",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Troubleshooting a service conflict with AI",
            "Monitoring script created with a free AI tool"
          ]
        },
        {
          "id": "next",
          "heading": "Moving Forward",
          "text": "[[Write this section: Moving Forward]]"
        },
        {
          "id": "src",
          "heading": "Sources",
          "level": 2,
          "text": "- [[Item]]"
        }
      ]
    },
    {
      "id": "state",
      "name": "Current network security state",
      "subject": "Current Network Security State",
      "to": "CTO",
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
          "id": "creds",
          "heading": "Rotating Credentials",
          "text": "[[Write this section: Rotating Credentials]]"
        },
        {
          "id": "svc",
          "heading": "Rotated Service Credentials",
          "text": "[[Write this section: Rotated Service Credentials]]"
        },
        {
          "id": "hostfw",
          "heading": "Deploying Host-Based Firewalls",
          "text": "[[Write this section: Deploying Host-Based Firewalls]]"
        },
        {
          "id": "netfw",
          "heading": "Deployed Network-Wide Firewall",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Router firewall rules"
          ]
        },
        {
          "id": "siem",
          "heading": "Installed {{siem}} for Network Monitoring",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{siem}} web interface"
          ]
        },
        {
          "id": "web",
          "heading": "Secured Web Applications",
          "on": false,
          "text": "[[Write this section: Secured Web Applications]]"
        },
        {
          "id": "edr",
          "heading": "Additional Tools",
          "text": "[[Write this section: Additional Tools]]"
        }
      ]
    }
  ]
});

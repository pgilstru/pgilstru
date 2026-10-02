// Template: Threat hunting / traffic analysis. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "threat-hunting",
  "name": "Threat hunting / traffic analysis",
  "description": "Deny-any analysis, C2 beacon hunts, beacon detection scripts, AI threat hunting plans, server traffic profiles, cross-segment traffic, and DNS exfiltration.",
  "variants": [
    {
      "id": "deny-any",
      "name": "Default-deny policy + analyze dropped traffic",
      "subject": "Default Deny Firewall Policy",
      "to": "System Administrator",
      "vars": [
        {
          "key": "fw1",
          "label": "Firewall 1",
          "default": "Palo Alto"
        },
        {
          "key": "fw2",
          "label": "Firewall 2",
          "default": "Cisco FTD"
        },
        {
          "key": "minutes",
          "label": "Minutes monitored",
          "default": "15"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "fw2",
          "heading": "{{fw2}} Firewall Rules",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{fw2}} rules ending in default deny"
          ]
        },
        {
          "id": "fw1",
          "heading": "{{fw1}} Firewall Rules",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{fw1}} rules ending in default deny"
          ]
        },
        {
          "id": "logs",
          "heading": "Proof of Denied Traffic Logs",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Denied traffic logs on {{fw1}}",
            "Denied traffic logs on {{fw2}}"
          ]
        },
        {
          "id": "analysis",
          "heading": "Analysis of Dropped Traffic",
          "text": "[[Write this section: Analysis of Dropped Traffic]]",
          "table": {
            "columns": [
              "Firewall",
              "Dropped Traffic Observed",
              "Assessment"
            ],
            "rows": [
              [
                "{{fw1}}",
                "",
                ""
              ],
              [
                "{{fw2}}",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "investigate",
          "heading": "How Denied Packets Will Be Investigated",
          "text": "[[Write this section: How Denied Packets Will Be Investigated]]"
        }
      ]
    },
    {
      "id": "c2",
      "name": "Hunt for a C2 beacon",
      "subject": "C2 Beacon Identification",
      "to": "System Administrator",
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
          "id": "steps",
          "heading": "Hunting Steps",
          "text": "[[Write this section: Hunting Steps]]\n\n1. **Antivirus on each device:** [[Describe]]\n1. **Network traffic monitoring:** [[Describe]]\n1. **Identifying running processes:** [[Describe]]\n1. **Firewall logs:** [[Describe]]"
        },
        {
          "id": "found",
          "heading": "Beacon Identified",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Repeated outbound connections from the beacon in {{siem}}",
            "The beacon process on the host"
          ]
        },
        {
          "id": "removed",
          "heading": "Removal",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Beacon process and persistence removed",
            "Firewall rule blocking the C2 destination"
          ]
        },
        {
          "id": "rules",
          "heading": "Ongoing Detection",
          "on": false,
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "iptables rules logging outbound packets that were dropped"
          ]
        }
      ]
    },
    {
      "id": "beacon-script",
      "name": "Script to detect beaconing (UDP/TCP)",
      "subject": "Script to Detect Beaconing Software",
      "to": "CISO",
      "vars": [
        {
          "key": "proto",
          "label": "Protocol to detect",
          "default": "UDP"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "how",
          "heading": "How the Scripts Work",
          "text": "[[Write this section: How the Scripts Work]]"
        },
        {
          "id": "linux",
          "heading": "Linux Script",
          "text": "```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "Linux beacon detection script output"
          ]
        },
        {
          "id": "win",
          "heading": "Windows Script",
          "text": "```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "Windows beacon detection script output"
          ]
        },
        {
          "id": "results",
          "heading": "Results",
          "text": "[[Write this section: Results]]"
        },
        {
          "id": "ai",
          "heading": "AI Use",
          "on": false,
          "text": "[[Write this section: AI Use]]\n\n- [[Item]]\n- [[Item]]"
        }
      ]
    },
    {
      "id": "ai-hunting",
      "name": "Plan for threat hunting with AI",
      "subject": "Threat Hunting with AI",
      "to": "IT Director",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "today",
          "heading": "How We Use AI Today",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Example of asking AI to explain a suspicious log entry"
          ]
        },
        {
          "id": "plan",
          "heading": "Plan",
          "text": "1. **Triage:** [[Describe]]\n1. **Query building:** [[Describe]]\n1. **Script building:** [[Describe]]\n1. **Verification:** [[Describe]]"
        },
        {
          "id": "future",
          "heading": "Future Goals",
          "text": "[[Write this section: Future Goals]]"
        }
      ]
    },
    {
      "id": "profile",
      "name": "Profile a server’s traffic",
      "subject": "Server Network Traffic Analysis",
      "to": "CISO",
      "vars": [
        {
          "key": "server",
          "label": "Server",
          "default": "Windows AD server"
        },
        {
          "key": "server_ip",
          "label": "Server IP",
          "placeholder": "172.20.240.102"
        },
        {
          "key": "capture_tool",
          "label": "Capture method"
        },
        {
          "key": "duration",
          "label": "Capture length",
          "default": "3 minutes"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "capture",
          "heading": "Capturing the Traffic",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{server}} IP address",
            "Configured capture filter",
            "Protocol hierarchy of sent and received traffic"
          ]
        },
        {
          "id": "table",
          "heading": "Analysis of Network Traffic",
          "text": "",
          "table": {
            "columns": [
              "",
              "Observed",
              "Additional Notes"
            ],
            "rows": [
              [
                "Common Ports",
                "",
                ""
              ],
              [
                "Common Applications",
                "",
                ""
              ],
              [
                "Suspicious Packets",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "protocols",
          "heading": "Protocols Used",
          "on": false,
          "text": "- **DNS:** [[Describe]]\n- **LDAP / Kerberos / NetBIOS:** [[Describe]]\n- **NTP:** [[Describe]]\n- **Splunk (9997):** [[Describe]]"
        },
        {
          "id": "suspicious",
          "heading": "Indication of Suspicious Packet Flows",
          "text": "[[Write this section: Indication of Suspicious Packet Flows]]"
        }
      ]
    },
    {
      "id": "cross-segment",
      "name": "Characterize cross-segment traffic",
      "subject": "Cross Network Traffic",
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
          "id": "bulk",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "fw1",
          "heading": "Firewall 1",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Live traffic logs on Firewall 1",
            "Network activity view from Firewall 1 (last 24 hours)"
          ]
        },
        {
          "id": "fw2",
          "heading": "Firewall 2",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Live traffic logs on Firewall 2",
            "Network activity view from Firewall 2"
          ]
        },
        {
          "id": "conclusion",
          "heading": "Summary",
          "text": "[[Write this section: Summary]]"
        }
      ]
    },
    {
      "id": "dns-exfil",
      "name": "Assess a DNS packet for exfiltration",
      "subject": "Assessment of DNS Packet for Data Exfiltration",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "packet",
          "heading": "Packet Analysis",
          "text": "",
          "evidence": [
            "DNS packet in Wireshark showing the TXT record",
            "Decoding the recovered string"
          ]
        },
        {
          "id": "next",
          "heading": "Next Steps",
          "on": false,
          "text": "[[Write this section: Next Steps]]"
        }
      ]
    }
  ]
});

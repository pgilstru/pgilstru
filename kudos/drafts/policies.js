// Template: Policies. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "policies",
  "name": "Policies",
  "description": "Incident response policy/form/procedure, elements of an IR report, and employee security, browsing, and malware awareness policies.",
  "variants": [
    {
      "id": "ir-policy",
      "name": "Incident response policy + form",
      "subject": "Incident Response Policy and Form",
      "to": "CTO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "purpose",
          "heading": "Incident Response Policy",
          "text": "### Purpose\n\n[[Write this section: Incident Response Policy]]\n\n### Audience\n\n[[Write this section: Incident Response Policy]]\n\n### Policy\n\n[[Write this section: Incident Response Policy]]"
        },
        {
          "id": "plan",
          "heading": "Incident Response Plan",
          "level": 2,
          "text": "[[Write this section: Incident Response Plan]]\n\n1. **Triage:** [[Describe]]\n1. **Identification:** [[Describe]]\n1. **Analysis:** [[Describe]]\n1. **Contain:** [[Describe]]\n1. **Eradicate:** [[Describe]]\n1. **Recover:** [[Describe]]\n1. **Review:** [[Describe]]"
        },
        {
          "id": "comms",
          "heading": "Notification and Communication",
          "level": 2,
          "text": "[[Write this section: Notification and Communication]]"
        },
        {
          "id": "enforce",
          "heading": "Enforcement",
          "level": 2,
          "text": "[[Write this section: Enforcement]]"
        },
        {
          "id": "refs",
          "heading": "References",
          "level": 2,
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "form",
          "heading": "Incident Response Form",
          "text": "",
          "table": {
            "columns": [
              "Field",
              "Details"
            ],
            "rows": [
              [
                "Date/Time",
                ""
              ],
              [
                "",
                ""
              ],
              [
                "Description",
                ""
              ],
              [
                "Affected Host(s)",
                ""
              ],
              [
                "Source IP Address",
                ""
              ],
              [
                "Attack Vector",
                ""
              ],
              [
                "Impact on Services",
                ""
              ],
              [
                "Service Downtime",
                ""
              ],
              [
                "Impact on Information",
                ""
              ],
              [
                "Remediation",
                ""
              ]
            ]
          }
        },
        {
          "id": "close",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "submit",
          "heading": "Instructions for the Incident Reporting System",
          "on": false,
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]"
        }
      ]
    },
    {
      "id": "ir-procedure",
      "name": "Incident response procedure (SANS)",
      "subject": "Incident Response Procedure",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "prep",
          "heading": "Preparation",
          "text": "[[Write this section: Preparation]]\n\n- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "ident",
          "heading": "Identification",
          "text": "[[Write this section: Identification]]"
        },
        {
          "id": "contain",
          "heading": "Containment",
          "text": "[[Write this section: Containment]]"
        },
        {
          "id": "erad",
          "heading": "Eradication",
          "text": "[[Write this section: Eradication]]"
        },
        {
          "id": "recover",
          "heading": "Recovery",
          "text": "[[Write this section: Recovery]]"
        },
        {
          "id": "lessons",
          "heading": "Lessons Learned",
          "text": "[[Write this section: Lessons Learned]]"
        },
        {
          "id": "src",
          "heading": "Resources",
          "level": 2,
          "text": "- [[Item]]"
        }
      ]
    },
    {
      "id": "ir-elements",
      "name": "Elements of a complete incident report",
      "subject": "Incident Response Report Elements",
      "to": "IT Director",
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
          "id": "table",
          "heading": "Elements",
          "text": "[[Write this section: Elements]]",
          "table": {
            "columns": [
              "Element",
              "Incident Artifact",
              "Reason"
            ],
            "rows": [
              [
                "Preparation",
                "",
                ""
              ],
              [
                "Identification",
                "",
                ""
              ],
              [
                "Containment",
                "",
                ""
              ],
              [
                "Eradication",
                "",
                ""
              ],
              [
                "Recovery",
                "",
                ""
              ],
              [
                "Lessons Learned",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "info",
          "heading": "Information We Collect",
          "text": "[[Write this section: Information We Collect]]\n\n- [[Item]]\n- [[Item]]\n- [[Item]]\n\n[[Write this section: Information We Collect]]"
        }
      ]
    },
    {
      "id": "infosec",
      "name": "Employee information security policy",
      "subject": "Employee Information Security Best Practices Policy",
      "to": "CEO",
      "vars": [
        {
          "key": "policy_name",
          "label": "Policy name (for sign-off)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "scope",
          "heading": "Scope & Purpose",
          "text": "[[Write this section: Scope & Purpose]]"
        },
        {
          "id": "roles",
          "heading": "Roles & Responsibilities",
          "text": "- **CEO:** [[Describe]]\n- **Security Team:** [[Describe]]\n- **Company Employees:** [[Describe]]"
        },
        {
          "id": "aup",
          "heading": "Statement of Acceptable Use",
          "text": "- **Software:** [[Describe]]\n- **Systems:** [[Describe]]\n- **Privacy:** [[Describe]]"
        },
        {
          "id": "data",
          "heading": "Handling of Data & Company Information",
          "text": "[[Write this section: Handling of Data & Company Information]]"
        },
        {
          "id": "phys",
          "heading": "Physical Security",
          "text": "[[Write this section: Physical Security]]"
        },
        {
          "id": "se",
          "heading": "Social Engineering",
          "text": "[[Write this section: Social Engineering]]"
        },
        {
          "id": "noncomp",
          "heading": "Non-Compliance",
          "text": "[[Write this section: Non-Compliance]]"
        },
        {
          "id": "ack",
          "heading": "Employee Acknowledgment and Sign-off",
          "text": "[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]"
        }
      ]
    },
    {
      "id": "browsing",
      "name": "Employee browsing / internet usage policy",
      "subject": "Employee Browsing Policy",
      "to": "CISO",
      "vars": [
        {
          "key": "policy_name",
          "label": "Policy name (for sign-off)",
          "default": "Employee Browsing Policy"
        },
        {
          "key": "effective",
          "label": "Effective date",
          "placeholder": "01/27/26"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "purpose",
          "heading": "Purpose and Scope",
          "text": "[[Write this section: Purpose and Scope]]"
        },
        {
          "id": "accept",
          "heading": "Acceptable Use",
          "text": "[[Write this section: Acceptable Use]]"
        },
        {
          "id": "prohib",
          "heading": "Prohibited Use",
          "text": "[[Write this section: Prohibited Use]]"
        },
        {
          "id": "req",
          "heading": "Requirements",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "mitigate",
          "heading": "How This Policy Prevents Malware",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "privacy",
          "heading": "Privacy Expectations",
          "text": "[[Write this section: Privacy Expectations]]"
        },
        {
          "id": "noncomp",
          "heading": "Non-Compliance",
          "text": "[[Write this section: Non-Compliance]]"
        },
        {
          "id": "ack",
          "heading": "Employee Acknowledgment and Sign-off",
          "text": "[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]"
        },
        {
          "id": "src",
          "heading": "Resources",
          "level": 2,
          "text": "- [[Item]]\n- [[Item]]"
        }
      ]
    },
    {
      "id": "malware-awareness",
      "name": "Employee malware awareness policy",
      "subject": "Employee Malware Awareness Policy",
      "to": "CISO, CEO",
      "vars": [
        {
          "key": "policy_name",
          "label": "Policy name (for sign-off)"
        },
        {
          "key": "effective",
          "label": "Effective date",
          "placeholder": "01/27/2026"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "purpose",
          "heading": "Purpose",
          "text": "[[Write this section: Purpose]]"
        },
        {
          "id": "scope",
          "heading": "Scope",
          "text": "[[Write this section: Scope]]"
        },
        {
          "id": "terms",
          "heading": "Definition of Terms",
          "text": "- **Malware:** [[Describe]]\n- **Ransomware:** [[Describe]]\n- **Phishing:** [[Describe]]\n- **Social Engineering:** [[Describe]]\n- **Removable Media:** [[Describe]]"
        },
        {
          "id": "emp",
          "heading": "Employee Responsibilities",
          "text": "[[Write this section: Employee Responsibilities]]"
        },
        {
          "id": "org",
          "heading": "Organization’s Responsibilities",
          "text": "[[Write this section: Organization’s Responsibilities]]"
        },
        {
          "id": "disc",
          "heading": "Disciplinary Action",
          "text": "[[Write this section: Disciplinary Action]]"
        },
        {
          "id": "ack",
          "heading": "Employee Acknowledgment and Sign-off",
          "text": "[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]\n\n[[Write this section: Employee Acknowledgment and Sign-off]]"
        }
      ]
    }
  ]
});

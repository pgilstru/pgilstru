// Template: Service documentation. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "service-documentation",
  "name": "Service documentation",
  "description": "Server build documentation (e.g. ECOM), DNS infrastructure, and admin/user guides for an application.",
  "variants": [
    {
      "id": "server-doc",
      "name": "Server / application documentation",
      "subject": "{{app}} Server Documentation",
      "to": "CISO",
      "vars": [
        {
          "key": "app",
          "label": "Application",
          "placeholder": "ECOM (OpenCart)"
        },
        {
          "key": "server",
          "label": "Server",
          "placeholder": "Ubuntu 24 server"
        },
        {
          "key": "url",
          "label": "Site URL",
          "placeholder": "http://172.25.27.11"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "software",
          "heading": "Software Used",
          "text": "",
          "table": {
            "columns": [
              "Software",
              "Version"
            ],
            "rows": [
              [
                "Web application",
                ""
              ],
              [
                "Web server",
                ""
              ],
              [
                "PHP",
                ""
              ],
              [
                "Database",
                ""
              ]
            ]
          }
        },
        {
          "id": "install",
          "heading": "Installation",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]"
        },
        {
          "id": "config",
          "heading": "Software Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Application configuration file",
            "Web server site configuration"
          ]
        },
        {
          "id": "os",
          "heading": "OS Configuration",
          "text": "[[Write this section: OS Configuration]]"
        },
        {
          "id": "location",
          "heading": "Location of Web Content",
          "text": "[[Write this section: Location of Web Content]]"
        },
        {
          "id": "test",
          "heading": "Testing Website Functionality",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]"
        }
      ]
    },
    {
      "id": "dns",
      "name": "Document the DNS infrastructure",
      "subject": "DNS Infrastructure",
      "to": "CISO",
      "vars": [
        {
          "key": "dns_server",
          "label": "DNS server",
          "default": "Windows Server 2019"
        },
        {
          "key": "zone",
          "label": "Zone",
          "placeholder": "ccdcteam.com"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "model",
          "heading": "Overview",
          "text": "",
          "table": {
            "columns": [
              "DNS Hosting Model",
              "Zone",
              "IP Addresses of Server",
              "Primary & Secondary",
              "Records"
            ],
            "rows": [
              [
                "Active Directory-integrated",
                "",
                "",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "soa",
          "heading": "Start of Authority",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "SOA configuration"
          ]
        },
        {
          "id": "records",
          "heading": "Records",
          "text": "",
          "table": {
            "columns": [
              "Record",
              "Purpose"
            ],
            "rows": [
              [
                "A",
                ""
              ],
              [
                "NS",
                ""
              ],
              [
                "SOA",
                ""
              ],
              [
                "CNAME",
                ""
              ],
              [
                "PTR",
                ""
              ]
            ]
          }
        },
        {
          "id": "recursion",
          "heading": "Recursion Handling",
          "text": "[[Write this section: Recursion Handling]]"
        },
        {
          "id": "split",
          "heading": "Split-Brain Topology",
          "text": "[[Write this section: Split-Brain Topology]]"
        },
        {
          "id": "reverse",
          "heading": "Reverse Lookup Zone",
          "text": "",
          "evidence": [
            "Reverse lookup zone"
          ]
        }
      ]
    },
    {
      "id": "user-guide",
      "name": "Admin / user guide for an application",
      "subject": "{{app}} Administration Guide",
      "to": "CTO",
      "vars": [
        {
          "key": "app",
          "label": "Application",
          "placeholder": "OSPOS"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "login",
          "heading": "Logging In",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{app}} login page",
            "Welcome screen"
          ]
        },
        {
          "id": "tasks",
          "heading": "Common Tasks",
          "text": "### {{task_1}}\n\n[[Write this section: Common Tasks]]\n\n### {{task_2}}\n\n[[Write this section: Common Tasks]]"
        },
        {
          "id": "help",
          "heading": "",
          "text": "[[Write this paragraph]]"
        }
      ]
    }
  ]
});

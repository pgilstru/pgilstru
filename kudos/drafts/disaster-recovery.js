// Template: Disaster recovery / backup. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "disaster-recovery",
  "name": "Disaster recovery / backup",
  "description": "Hot sites, DR activation plans, diagnosing failed servers, return-to-production plans, repairs, and config backups.",
  "variants": [
    {
      "id": "hot-site",
      "name": "Create a hot site",
      "subject": "Created Hot Site for {{service}}",
      "to": "CISO",
      "vars": [
        {
          "key": "service",
          "label": "Service",
          "default": "ECOM"
        },
        {
          "key": "hot_server",
          "label": "Hot site server",
          "default": "Windows Server 2022 FTP"
        },
        {
          "key": "primary",
          "label": "Primary server",
          "default": "Ubuntu Ecom"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "server",
          "heading": "Selected Server",
          "text": "[[Write this section: Selected Server]]"
        },
        {
          "id": "software",
          "heading": "Supporting Software",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "steps",
          "heading": "Steps for Implementing the Hot Site",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]",
          "evidence": [
            "CGI installed on IIS",
            "PHP handler mapping",
            "php.ini changes",
            "MySQL configured"
          ]
        },
        {
          "id": "proof",
          "heading": "Evidence of the Functioning Hot Site",
          "text": "",
          "evidence": [
            "{{service}} site running on {{hot_server}}"
          ]
        }
      ]
    },
    {
      "id": "dr-plan",
      "name": "DR activation plan",
      "subject": "Disaster Recovery Plan",
      "to": "CISO",
      "vars": [
        {
          "key": "service",
          "label": "Service",
          "default": "Ecom website"
        },
        {
          "key": "hot_server",
          "label": "Hot site server",
          "default": "Windows Server 2022 FTP"
        },
        {
          "key": "hot_ip",
          "label": "Hot site IP",
          "placeholder": "172.25.27.162"
        },
        {
          "key": "primary_ip",
          "label": "Primary IP",
          "placeholder": "172.25.27.11"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "s1",
          "heading": "Step 1: Traffic Redirection and DNS Shift",
          "text": "[[Write this section: Step 1: Traffic Redirection and DNS Shift]]"
        },
        {
          "id": "s2",
          "heading": "Step 2: Service Activation",
          "text": "[[Write this section: Step 2: Service Activation]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "s3",
          "heading": "Step 3: Validation",
          "text": "[[Write this section: Step 3: Validation]]"
        },
        {
          "id": "s4",
          "heading": "Step 4: Post-Failover Monitoring",
          "text": "[[Write this section: Step 4: Post-Failover Monitoring]]"
        }
      ]
    },
    {
      "id": "failed-server",
      "name": "Diagnose & report on a failed server",
      "subject": "Report on Failed Server",
      "to": "IT Director",
      "vars": [
        {
          "key": "server",
          "label": "Server",
          "default": "Ubuntu Ecom web server"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "table",
          "heading": "Issues Identified",
          "text": "",
          "table": {
            "columns": [
              "Issue Identified",
              "Repairs Taken"
            ],
            "rows": [
              [
                "Corrupt startup files",
                ""
              ],
              [
                "",
                ""
              ],
              [
                "Missing or corrupt package sources",
                ""
              ],
              [
                "Wrong DNS server",
                ""
              ],
              [
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "evidence",
          "heading": "Evidence of Repair",
          "text": "",
          "evidence": [
            "Unauthorized SSH keys removed",
            "Corrected Apache configuration",
            "Corrected DNS and package sources"
          ]
        },
        {
          "id": "func",
          "heading": "Evidence of Current Functionality",
          "text": "",
          "evidence": [
            "The web service available again"
          ]
        }
      ]
    },
    {
      "id": "return-plan",
      "name": "Return-to-production plan",
      "subject": "Return to Production Plan",
      "to": "IT Director",
      "vars": [
        {
          "key": "service",
          "label": "Service",
          "default": "Ecom web service"
        },
        {
          "key": "primary",
          "label": "Repaired server",
          "default": "Ubuntu Ecom"
        },
        {
          "key": "hot_server",
          "label": "Hot site",
          "default": "Windows 2022 FTP"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "steps",
          "heading": "Steps for Returning the Service",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]"
        },
        {
          "id": "restore",
          "heading": "Restoring Functionality",
          "text": "[[Write this section: Restoring Functionality]]"
        },
        {
          "id": "network",
          "heading": "Restoring Network Access",
          "text": "[[Write this section: Restoring Network Access]]"
        },
        {
          "id": "harden",
          "heading": "Continuous Hardening",
          "text": "[[Write this section: Continuous Hardening]]"
        }
      ]
    },
    {
      "id": "repair",
      "name": "Repair / full restoration report",
      "subject": "Full Restoration",
      "to": "IT Director",
      "vars": [
        {
          "key": "service",
          "label": "Service",
          "default": "ecommerce website"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "machine",
          "heading": "Machine-Level Fixes",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "GRUB update",
            "Default target fixed",
            "Correct DNS configuration",
            "Updated package sources"
          ]
        },
        {
          "id": "services",
          "heading": "Service Fixes",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "MySQL service refreshed",
            "Apache2 service refreshed",
            "PHP service refreshed"
          ]
        },
        {
          "id": "security",
          "heading": "Security Tooling",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Web application firewall blocking a malicious command",
            "EDR configured"
          ]
        },
        {
          "id": "net",
          "heading": "Network Rules",
          "text": "",
          "evidence": [
            "Firewall rule allowing web traffic to the restored server"
          ]
        },
        {
          "id": "avail",
          "heading": "Verification of Availability",
          "text": "",
          "evidence": [
            "Website available to customers"
          ]
        }
      ]
    },
    {
      "id": "backup-configs",
      "name": "Backup site for firewall/router configs",
      "subject": "Backup Repositories for Network Devices",
      "to": "CISO",
      "vars": [
        {
          "key": "backup_server",
          "label": "Backup server",
          "default": "Oracle 9 Splunk server"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "steps",
          "heading": "",
          "text": "[[Write this paragraph]]\n\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]"
        },
        {
          "id": "evidence",
          "heading": "",
          "text": "",
          "evidence": [
            "Cron job that creates the backups on the {{backup_server}}",
            "Cron job on the router automating the daily backup",
            "Backups from the firewalls and router on the {{backup_server}}"
          ]
        }
      ]
    }
  ]
});

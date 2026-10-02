// Template: VPN. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "vpn",
  "name": "VPN",
  "description": "Research three VPN options and recommend one; implement it with an employee user guide.",
  "variants": [
    {
      "id": "research",
      "name": "Research 3 VPN options",
      "subject": "VPN Options",
      "to": "COO",
      "vars": [
        {
          "key": "pick",
          "label": "Recommended VPN",
          "default": "Tailscale"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "what",
          "heading": "What Is a VPN?",
          "text": "[[Write this section: What Is a VPN?]]"
        },
        {
          "id": "table",
          "heading": "Comparison",
          "text": "",
          "table": {
            "columns": [
              "",
              "Tailscale",
              "WireGuard",
              "ZeroTier"
            ],
            "rows": [
              [
                "Benefits",
                "",
                "",
                ""
              ],
              [
                "Cons",
                "",
                "",
                ""
              ],
              [
                "Authentication",
                "",
                "",
                ""
              ],
              [
                "Cost",
                "",
                "",
                ""
              ],
              [
                "Automation (Ansible)",
                "",
                "",
                ""
              ]
            ]
          }
        },
        {
          "id": "tests",
          "heading": "Testing the VPNs",
          "text": "",
          "evidence": [
            "{{pick}} installed and running",
            "External device connected through the VPN",
            "External device pinging an internal host"
          ]
        },
        {
          "id": "rec",
          "heading": "Recommendation",
          "text": "[[Write this section: Recommendation]]"
        }
      ]
    },
    {
      "id": "implement",
      "name": "Implement VPN + user guide",
      "subject": "VPN Installation",
      "to": "CEO",
      "vars": [
        {
          "key": "vpn",
          "label": "VPN",
          "default": "Tailscale"
        },
        {
          "key": "device1",
          "label": "First device",
          "placeholder": "Windows 2019 Server (hippocampus)"
        },
        {
          "key": "device2",
          "label": "Second device",
          "placeholder": "Windows 2022 Server (metis)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "install",
          "heading": "Installation",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]",
          "evidence": [
            "{{vpn}} installed on {{device1}}",
            "{{vpn}} installed on {{device2}}",
            "Both devices connected in the admin console"
          ]
        },
        {
          "id": "guide",
          "heading": "A Guide to Using {{vpn}}",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n[[Write this section: A Guide to Using {{vpn}}]]"
        }
      ]
    }
  ]
});

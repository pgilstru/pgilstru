// Template: Network infrastructure. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "network-infrastructure",
  "name": "Network infrastructure",
  "description": "Connectivity checks, secure SNMP, IPv6, multicast design, and ARP poisoning mitigation.",
  "variants": [
    {
      "id": "connectivity",
      "name": "Verify network connectivity",
      "subject": "Network Connectivity",
      "to": "Management",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "hosts",
          "heading": "",
          "text": "",
          "perHost": {
            "filter": "all",
            "label": "{{host}}",
            "evidence": [
              "External connectivity from {{host}}",
              "Internal connectivity from {{host}}"
            ]
          }
        },
        {
          "id": "ticket",
          "heading": "",
          "text": "[[Write this paragraph]]"
        }
      ]
    },
    {
      "id": "snmp",
      "name": "Plan & implement secure SNMP",
      "subject": "Securing SNMP",
      "to": "CISO",
      "vars": [
        {
          "key": "devices",
          "label": "Devices configured",
          "default": "both Palo Alto firewalls"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "versions",
          "heading": "Choosing an SNMP Version",
          "text": "[[Write this section: Choosing an SNMP Version]]"
        },
        {
          "id": "auth",
          "heading": "Users, Authentication, and Encryption",
          "text": "[[Write this section: Users, Authentication, and Encryption]]"
        },
        {
          "id": "view",
          "heading": "View Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "SNMP view on device 1",
            "SNMPv3 user on device 1",
            "SNMP view on device 2",
            "SNMPv3 user on device 2"
          ]
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
      "id": "ipv6",
      "name": "Implement IPv6 (dual stack)",
      "subject": "IPv6 Implementation",
      "to": "CISO",
      "vars": [
        {
          "key": "prefix",
          "label": "IPv6 prefix",
          "placeholder": "fd00:20:240::/48"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "plan",
          "heading": "Addressing Plan",
          "text": "[[Write this section: Addressing Plan]]",
          "table": {
            "columns": [
              "Host",
              "IPv4",
              "IPv6"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                "{{host_ip}}",
                ""
              ]
            },
            "rows": []
          }
        },
        {
          "id": "win",
          "heading": "Windows",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "windows",
            "label": "{{host}}:",
            "evidence": [
              "IPv6 configured on {{host}}"
            ]
          }
        },
        {
          "id": "lin",
          "heading": "Linux",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "IPv6 configured on {{host}}"
            ]
          }
        },
        {
          "id": "test",
          "heading": "Testing",
          "text": "",
          "evidence": [
            "IPv6 ping between hosts"
          ]
        }
      ]
    },
    {
      "id": "multicast",
      "name": "Design a multicast solution",
      "subject": "Multicast Network Solution",
      "to": "IT Director",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "switch",
          "heading": "Switch Requirements",
          "text": "[[Write this section: Switch Requirements]]\n\n- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "mc",
          "heading": "Setting Up Multicast",
          "text": "[[Write this section: Setting Up Multicast]]"
        },
        {
          "id": "vrrp",
          "heading": "Firewall Failover Redundancy",
          "text": "[[Write this section: Firewall Failover Redundancy]]"
        }
      ]
    },
    {
      "id": "arp",
      "name": "Mitigate ARP cache poisoning",
      "subject": "Mitigate ARP Cache Poisoning",
      "to": "CISO",
      "vars": [
        {
          "key": "gw_ip",
          "label": "Gateway IP",
          "placeholder": "172.20.240.254"
        },
        {
          "key": "gw_mac",
          "label": "Gateway MAC",
          "placeholder": "bc:24:11:cb:6c:a8"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "what",
          "heading": "What Is ARP Poisoning?",
          "text": "[[Write this section: What Is ARP Poisoning?]]"
        },
        {
          "id": "how",
          "heading": "Static ARP Entries",
          "text": "[[Write this section: Static ARP Entries]]\n\n[[Write this section: Static ARP Entries]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Write this section: Static ARP Entries]]\n\n```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "hosts",
          "heading": "Completion on Each Device",
          "text": "",
          "perHost": {
            "filter": "all",
            "label": "{{host}}:",
            "evidence": [
              "Permanent ARP entry on {{host}}"
            ]
          }
        },
        {
          "id": "router",
          "heading": "Router Configuration",
          "text": "",
          "evidence": [
            "Static ARP entries on the router"
          ]
        }
      ]
    }
  ]
});

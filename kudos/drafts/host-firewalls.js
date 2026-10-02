// Template: Host firewalls. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "host-firewalls",
  "name": "Host firewalls",
  "description": "Default-deny host firewalls on Windows and Linux, with rules per server and a review of dropped packets.",
  "variants": [
    {
      "id": "default-deny",
      "name": "Default-deny host firewalls + review drops",
      "subject": "Server Software Firewalls",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "linux",
          "heading": "Firewall Rules on Linux Devices",
          "text": "",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "text": "[[Optional notes for {{host}}]]",
            "evidence": [
              "iptables rules on {{host}}"
            ]
          }
        },
        {
          "id": "windows",
          "heading": "Firewall Rules on Windows Devices",
          "text": "",
          "perHost": {
            "filter": "windows",
            "label": "{{host}}:",
            "text": "[[Optional notes for {{host}}]]",
            "evidence": [
              "Inbound rules on {{host}}",
              "Outbound rules on {{host}}",
              "Default policy and logging settings on {{host}}"
            ]
          }
        },
        {
          "id": "drops",
          "heading": "Packet Log Analysis",
          "text": "[[Write this section: Packet Log Analysis]]",
          "table": {
            "columns": [
              "Hostname",
              "Packet Log Analysis"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                ""
              ]
            },
            "rows": []
          }
        }
      ]
    }
  ]
});

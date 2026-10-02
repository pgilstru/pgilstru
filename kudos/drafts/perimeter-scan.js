// Template: Perimeter scan. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "perimeter-scan",
  "name": "Perimeter scan",
  "description": "Masscan the perimeter, Nmap the hosts it finds, and table what should be exposed.",
  "variants": [
    {
      "id": "masscan-nmap",
      "name": "Masscan → Nmap perimeter assessment",
      "subject": "Perimeter Assessment",
      "to": "CISO",
      "vars": [
        {
          "key": "public_net",
          "label": "Public network",
          "placeholder": "172.25.27.0/24"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "masscan",
          "heading": "Masscan",
          "text": "```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Masscan command and results"
          ]
        },
        {
          "id": "nmap",
          "heading": "Nmap on Hosts Discovered by Masscan",
          "text": "```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "Nmap TCP scan results",
            "Nmap UDP scan results"
          ]
        },
        {
          "id": "table",
          "heading": "Results",
          "text": "[[Write this section: Results]]",
          "table": {
            "columns": [
              "Hostname",
              "OS / Version",
              "Private IP",
              "Public IP",
              "Services",
              "Ports",
              "Should it be exposed externally?"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                "{{host_os}}",
                "{{host_ip}}",
                "",
                "",
                "",
                ""
              ]
            },
            "rows": []
          }
        },
        {
          "id": "action",
          "heading": "Actions Taken",
          "on": false,
          "text": "[[Write this section: Actions Taken]]"
        }
      ]
    }
  ]
});

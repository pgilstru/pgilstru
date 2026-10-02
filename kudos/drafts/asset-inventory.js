// Template: Asset inventory / needed services. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "asset-inventory",
  "name": "Asset inventory / needed services",
  "description": "Per-host needed-services tables and full asset inventories with a network diagram.",
  "variants": [
    {
      "id": "needed-services",
      "name": "Needed services on each device",
      "subject": "Needed Services on Each Device",
      "to": "Network Operations Management",
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
            "table": {
              "columns": [
                "Direction",
                "Service/Application",
                "Port(s)",
                "Destination / Source",
                "Network Scope"
              ],
              "rows": [
                [
                  "O",
                  "",
                  "",
                  "",
                  ""
                ],
                [
                  "O",
                  "",
                  "",
                  "",
                  ""
                ],
                [
                  "",
                  "",
                  "",
                  "",
                  ""
                ]
              ]
            }
          }
        }
      ]
    },
    {
      "id": "inventory",
      "name": "Asset inventory + network diagram",
      "subject": "Asset Inventory",
      "to": "CEO",
      "vars": [
        {
          "key": "subnet",
          "label": "Network",
          "placeholder": "192.168.1.0/24"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "table",
          "heading": "Inventory List",
          "text": "[[Write this section: Inventory List]]",
          "table": {
            "columns": [
              "Hostname",
              "IP Addresses",
              "Operating System",
              "Services/Containers",
              "Required Ports for Operation"
            ],
            "hostRows": {
              "filter": "all",
              "cells": [
                "{{host}}",
                "{{host_ip}}",
                "{{host_os}}",
                "",
                ""
              ]
            },
            "rows": []
          }
        },
        {
          "id": "accounts",
          "heading": "Accounts on Each System",
          "on": false,
          "text": "",
          "table": {
            "columns": [
              "Hostname",
              "Accounts"
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
        },
        {
          "id": "deps",
          "heading": "Dependencies Between Systems",
          "text": "- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "diagram",
          "heading": "Network Diagram",
          "text": "",
          "evidence": [
            "Network diagram"
          ]
        },
        {
          "id": "outcome",
          "heading": "",
          "on": false,
          "text": "[[Write this paragraph]]"
        }
      ]
    }
  ]
});

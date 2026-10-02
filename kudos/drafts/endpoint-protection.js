// Template: Endpoint protection. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "endpoint-protection",
  "name": "Endpoint protection",
  "description": "Wazuh agents and ClamAV (or RedBaron) on every host, with scans and dashboard evidence.",
  "variants": [
    {
      "id": "wazuh-clamav",
      "name": "Deploy Wazuh agents + ClamAV",
      "subject": "Deploy End-Point Protection",
      "to": "CISO",
      "vars": [
        {
          "key": "wazuh_host",
          "label": "Wazuh dashboard host",
          "placeholder": "Ubuntu Workstation"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "dashboard",
          "heading": "Wazuh Dashboard",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Wazuh dashboard showing all agents connected"
          ]
        },
        {
          "id": "why",
          "heading": "Why ClamAV",
          "on": false,
          "text": "[[Write this section: Why ClamAV]]"
        },
        {
          "id": "linux",
          "heading": "Completion on Linux Devices",
          "text": "",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "Wazuh agent running on {{host}}",
              "ClamAV enabled and running on {{host}}",
              "Full system scan on {{host}}"
            ]
          }
        },
        {
          "id": "windows",
          "heading": "Completion on Windows Devices",
          "text": "",
          "perHost": {
            "filter": "windows",
            "label": "{{host}}:",
            "evidence": [
              "Wazuh agent running on {{host}}",
              "ClamAV installed on {{host}}",
              "Full system scan on {{host}}"
            ]
          }
        },
        {
          "id": "findings",
          "heading": "Malware Detection",
          "text": "[[Write this section: Malware Detection]]\n\n- [[Item]]"
        },
        {
          "id": "alt",
          "heading": "",
          "on": false,
          "text": "[[Write this paragraph]]"
        }
      ]
    }
  ]
});

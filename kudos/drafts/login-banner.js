// Template: Login banner. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "login-banner",
  "name": "Login banner",
  "description": "Key elements of a legal login banner, our banner text, and proof on every device.",
  "variants": [
    {
      "id": "banner",
      "name": "Company login banner",
      "subject": "Company Login Banner",
      "to": "CISO",
      "vars": [],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "why",
          "heading": "",
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "elements",
          "heading": "Key Elements of a Login Banner",
          "text": "[[Write this section: Key Elements of a Login Banner]]\n\n- [[Item]]\n- [[Item]]\n- [[Item]]"
        },
        {
          "id": "text",
          "heading": "New Login Banner",
          "text": "```\n[[Paste the commands, script, or output]]\n```"
        },
        {
          "id": "previous",
          "heading": "",
          "on": false,
          "text": "[[Write this paragraph]]"
        },
        {
          "id": "linux",
          "heading": "Completion on Linux Devices",
          "text": "",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "Login banner on {{host}}"
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
              "Login banner on {{host}}"
            ]
          }
        }
      ]
    }
  ]
});

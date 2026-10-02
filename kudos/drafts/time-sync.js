// Template: Time sync. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "time-sync",
  "name": "Time sync",
  "description": "Chrony NTP server with broadcast/multicast clients, and PTP + NTP.",
  "variants": [
    {
      "id": "chrony",
      "name": "Chrony NTP server + broadcast clients",
      "subject": "NTP Setup",
      "to": "Network Operations Management",
      "vars": [
        {
          "key": "ntp_server",
          "label": "NTP server",
          "placeholder": "Ubuntu Workstation"
        },
        {
          "key": "lan",
          "label": "Allowed network",
          "default": "172.20.0.0/16"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "server",
          "heading": "NTP Server",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "chrony server configuration with the allow rule",
            "systemctl status chrony showing the service running and syncing",
            "Time zone resolving correctly (timedatectl)"
          ]
        },
        {
          "id": "clients",
          "heading": "Clients",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "perHost": {
            "filter": "linux",
            "label": "{{host}}:",
            "evidence": [
              "chrony client configuration on {{host}}",
              "chronyc sources on {{host}}"
            ]
          }
        },
        {
          "id": "windows",
          "heading": "Windows",
          "on": false,
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "w32tm /query /status"
          ]
        }
      ]
    },
    {
      "id": "ptp-ntp",
      "name": "Precision time (PTP + NTP) for central logging",
      "subject": "Precision Time Synchronization",
      "to": "CEO",
      "vars": [
        {
          "key": "ptp_hosts",
          "label": "Hosts needing PTP",
          "placeholder": "the research servers"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "ptp",
          "heading": "PTP Configuration",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "ptp4l running",
            "phc2sys synchronizing the system clock"
          ]
        },
        {
          "id": "ntp",
          "heading": "NTP and Time Zone on Every Device",
          "text": "",
          "perHost": {
            "filter": "all",
            "label": "{{host}}:",
            "evidence": [
              "Time zone and NTP status on {{host}}"
            ]
          }
        }
      ]
    }
  ]
});

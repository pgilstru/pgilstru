// Template: Deploy a business service. Fill in every [[prompt]] with what your team actually did.
window.INJECT_TYPES.push({
  "id": "deploy-service",
  "name": "Deploy a business service",
  "description": "Chat platforms, file shares/SFTP, network management tools, research software + Docker, and PowerShell on Linux.",
  "variants": [
    {
      "id": "chat",
      "name": "Internal chat / communication platform",
      "subject": "Company Communication Platform",
      "to": "CTO",
      "vars": [
        {
          "key": "app",
          "label": "Platform",
          "default": "Nextcloud Talk"
        },
        {
          "key": "server",
          "label": "Server",
          "placeholder": "Cowbuntu"
        },
        {
          "key": "app_url",
          "label": "URL",
          "placeholder": "http://10.100.105.98"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "deploy",
          "heading": "Deployment/Technical Guide",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{app}} installed and running on {{server}}"
          ]
        },
        {
          "id": "user",
          "heading": "User Guide",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Login screen",
            "Navigation bar Talk button",
            "Communication menu",
            "New conversation form"
          ]
        }
      ]
    },
    {
      "id": "file-share",
      "name": "File share / SFTP drop box",
      "subject": "File Share Solution",
      "to": "CTO",
      "vars": [
        {
          "key": "app",
          "label": "Solution",
          "default": "Nextcloud"
        },
        {
          "key": "server",
          "label": "Server",
          "placeholder": "Ubuntu server"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "why",
          "heading": "Why",
          "text": "[[Write this section: Why]]"
        },
        {
          "id": "deploy",
          "heading": "Steps to Deploy",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{app}} running on {{server}}"
          ]
        },
        {
          "id": "sftp",
          "heading": "SFTP Service Setup",
          "on": false,
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n\n```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "sshd_config SFTP block",
            "Successful SFTP connection"
          ]
        },
        {
          "id": "user",
          "heading": "User Guide",
          "text": "1. [[Step]]\n1. [[Step]]\n1. [[Step]]",
          "evidence": [
            "Login screen",
            "Files page"
          ]
        }
      ]
    },
    {
      "id": "nms",
      "name": "Install a network management tool",
      "subject": "Install a Network Management Tool",
      "to": "CISO",
      "vars": [
        {
          "key": "tool",
          "label": "Tool",
          "default": "LibreNMS"
        },
        {
          "key": "server",
          "label": "Server",
          "placeholder": "Ubuntu Workstation"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "prep",
          "heading": "Preparing the System",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "System updated and time zone verified",
            "Network connectivity"
          ]
        },
        {
          "id": "install",
          "heading": "Installation",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "{{tool}} database user and configuration",
            "{{tool}} web interface"
          ]
        },
        {
          "id": "devices",
          "heading": "Monitored Devices",
          "text": "[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Devices added to {{tool}}"
          ]
        }
      ]
    },
    {
      "id": "research",
      "name": "Research a new software platform (talking points)",
      "subject": "{{software}} Overview",
      "to": "CEO",
      "vars": [
        {
          "key": "software",
          "label": "Software",
          "placeholder": "NeuroDebian"
        },
        {
          "key": "server",
          "label": "Where it would run",
          "placeholder": "Debian 12 (hera)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "intro",
          "heading": "[Intro]",
          "text": "[[Write this section: [Intro]]]"
        },
        {
          "id": "helps",
          "heading": "[How It Helps the Company]",
          "text": "1. [[Step]]\n1. [[Step]]"
        },
        {
          "id": "conclusion",
          "heading": "[Conclusion]",
          "text": "[[Write this section: [Conclusion]]]"
        },
        {
          "id": "qa",
          "heading": "[Common Questions]",
          "text": "[[Write this section: [Common Questions]]]\n\n[[Write this section: [Common Questions]]]\n\n[[Write this section: [Common Questions]]]"
        }
      ]
    },
    {
      "id": "docker",
      "name": "Deploy software in a Docker container",
      "subject": "{{software}} Docker Container",
      "to": "IT Manager",
      "vars": [
        {
          "key": "software",
          "label": "Software",
          "placeholder": "NeuroDebian"
        },
        {
          "key": "image",
          "label": "Docker image",
          "placeholder": "neurodebian:latest"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "install",
          "heading": "Docker Installation",
          "text": "1. [[Step]]\n1. [[Step]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n1. [[Step]]\n\n```\n[[Paste the commands, script, or output]]\n```\n\n[[Describe what was done and what the evidence below shows]]",
          "evidence": [
            "Image pulled",
            "Shell inside the running container"
          ]
        },
        {
          "id": "tools",
          "heading": "Tools",
          "text": "[[Write this section: Tools]]\n\n### Tool 1\n\n[[Write this section: Tools]]\n\n### Tool 2\n\n[[Write this section: Tools]]"
        }
      ]
    },
    {
      "id": "powershell-linux",
      "name": "PowerShell on Linux",
      "subject": "PowerShell on Linux",
      "to": "IT Manager",
      "vars": [
        {
          "key": "server",
          "label": "Linux host",
          "placeholder": "Hermes (Ubuntu 25.04)"
        }
      ],
      "summary": "[[One or two sentences: what was requested and what this memo provides]]",
      "sections": [
        {
          "id": "steps",
          "heading": "Installation",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]\n1. [[Step]]",
          "evidence": [
            "PowerShell successfully installed on {{server}}"
          ]
        },
        {
          "id": "use",
          "heading": "Using PowerShell",
          "text": "[[Describe what was done and what the evidence below shows]]\n\n```\n[[Paste the commands, script, or output]]\n```",
          "evidence": [
            "Running the command shows the OS of {{server}}"
          ]
        }
      ]
    }
  ]
});

// TEMPORARY prototype playbook — have the team review and rewrite before competition.
window.IR_PLAYBOOKS.push({
  id: 'ssh-weak-credentials',
  name: 'SSH login with default / weak credentials',
  shortName: 'SSH default credentials',
  fileSlug: 'SSH',
  category: 'access',
  platform: 'Linux',
  draft: true,
  description: 'Red team logged in over SSH with a default or guessable password.',
  vulnScreenshot: false, // rubric footnote: weak credentials have no separate evidence beyond their abuse
  defaults: { port_service: '22/TCP – SSH' },
  vars: [],

  summary: 'unauthorized SSH access to {{affected_host}} using default credentials for the {{affected_account}} account',

  vulnerability:
`The {{affected_account}} account on {{affected_host}} was still using a default password, and the SSH service accepted password authentication from any network. Anyone who knew or guessed the default password could log in remotely with that account's privileges. Because {{affected_account}} had administrative (sudo) rights, this gave the attacker full control of the host.`,

  initialAccess:
`At {{initial_access_time}}, the attacker logged in over SSH as {{affected_account}} from {{source_ip}} to {{affected_host}} ({{dest_ip}}). The authentication logs show a successful password login ("Accepted password") for {{affected_account}} from {{source_ip}}, which is not an address our team uses.`,

  impact:
`With an interactive administrative session, the attacker could read and change any file, add accounts, install software and stop services on {{affected_host}}. Service downtime: {{downtime}}.`,

  eradication: {
    intro: 'Team {{team}} removed the attacker\'s access by doing the following:',
    steps: [
      { id: 'sessions', text: 'Identified and terminated the attacker\'s active SSH sessions.',
        commands: String.raw`who -a
ps -ef --forest | grep -i "sshd:"
sudo pkill -KILL -t pts/<N>   # the attacker's terminal only` },
      { id: 'passwd', text: 'Changed the password for {{affected_account}} and all other local accounts that could log in.',
        commands: String.raw`sudo passwd {{affected_account}}
awk -F: '$7 !~ /(nologin|false)$/ {print $1}' /etc/passwd` },
      { id: 'keys', text: 'Checked every user\'s authorized_keys file and removed keys the team did not add.',
        commands: String.raw`sudo find / -name authorized_keys -path "*/.ssh/*" 2>/dev/null -exec ls -l {} \; -exec cat {} \;` },
      { id: 'accounts', text: 'Checked for accounts or sudo rights the attacker added, and removed them.',
        commands: String.raw`awk -F: '$3 == 0 || $3 >= 1000 {print $1, $3, $7}' /etc/passwd
sudo grep -vE '^\s*(#|$)' /etc/sudoers /etc/sudoers.d/* 2>/dev/null
getent group sudo wheel` },
      { id: 'block', text: 'Blocked the source address {{source_ip}} at the host firewall.', default: false,
        commands: String.raw`sudo iptables -I INPUT -s {{source_ip}} -j DROP` },
    ],
  },

  remediation: {
    intro: 'To stop this from happening again, Team {{team}}:',
    steps: [
      { id: 'rotate', text: 'Replaced default passwords on all accounts across the Linux hosts with unique, strong passwords.' },
      { id: 'root', text: 'Disabled direct root login over SSH and limited SSH to the accounts that need it.',
        commands: String.raw`# /etc/ssh/sshd_config
PermitRootLogin no
AllowUsers <admin-account>
sudo sshd -t && sudo systemctl restart sshd` },
      { id: 'fw', text: 'Restricted SSH (22/TCP) at the host firewall to trusted management addresses only.', default: false,
        commands: String.raw`sudo iptables -A INPUT -p tcp --dport 22 -s <mgmt-subnet> -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j DROP` },
      { id: 'monitor', text: 'Set a Splunk alert for successful SSH logins from addresses outside the team\'s range.', default: false },
    ],
  },

  splunk: [
    { title: 'Successful SSH password logins', spl: String.raw`
index=* (sourcetype=linux_secure OR source="/var/log/auth.log" OR source="/var/log/secure") "Accepted password"
| rex "Accepted password for (?<user>\S+) from (?<src>\S+)"
| stats earliest(_time) as first_seen latest(_time) as last_seen count by host user src
| convert ctime(first_seen) ctime(last_seen)` },
    { title: 'Everything from the source IP', spl: String.raw`
index=* "{{source_ip}}" | sort _time | table _time host source _raw` },
    { title: 'Failed logins before success (guessing)', spl: String.raw`
index=* (sourcetype=linux_secure OR source="/var/log/auth.log" OR source="/var/log/secure") "Failed password"
| rex "Failed password for (invalid user )?(?<user>\S+) from (?<src>\S+)"
| stats count by host user src | sort - count` },
  ],

  evidence: {
    initialAccess: [
      'Successful SSH logins as {{affected_account}} from {{source_ip}}',
      'Splunk results showing unauthorized logins to {{affected_host}}',
    ],
    eradication: [
      'Terminating the attacker\'s SSH session',
      'Changing the {{affected_account}} password',
      'Reviewing authorized_keys files',
    ],
    remediation: [
      'Updated sshd_config disabling root login',
      'Host firewall rules restricting SSH',
    ],
  },
});

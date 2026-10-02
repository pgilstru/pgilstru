// TEMPORARY prototype playbook — have the team review and rewrite before competition.
window.IR_PLAYBOOKS.push({
  id: 'netlogon-zerologon',
  name: 'Zerologon (CVE-2020-1472) on a domain controller',
  shortName: 'Zerologon',
  fileSlug: 'Zerologon',
  category: 'access',
  platform: 'Windows / AD',
  draft: true,
  description: 'Unpatched Netlogon on a DC let red team take over the domain.',
  vulnScreenshot: true, // missing patch / enforcement setting can be shown on its own
  defaults: { port_service: '135/TCP + dynamic RPC – Netlogon (MS-NRPC)' },
  vars: [
    { key: 'dc_account', label: 'DC machine account', placeholder: 'DC01$' },
    { key: 'domain', label: 'Domain', placeholder: 'corp.local' },
  ],

  summary: 'exploitation of the Zerologon vulnerability (CVE-2020-1472) against the domain controller {{affected_host}}',

  vulnerability:
`The domain controller {{affected_host}} was missing Microsoft's Netlogon security updates for CVE-2020-1472 ("Zerologon") and was not in Netlogon secure-channel enforcement mode. This flaw in the Netlogon Remote Protocol lets an unauthenticated attacker with network access to a domain controller take over the DC's own machine account ({{dc_account}}) and reset its password. That account has directory replication rights, so the attacker can then pull password hashes for any domain account, including domain administrators, and control the whole {{domain}} domain.`,

  initialAccess:
`At {{initial_access_time}}, {{source_ip}} connected to the Netlogon service on {{affected_host}} ({{dest_ip}}) with no credentials. The Security log on {{affected_host}} records the {{dc_account}} machine account being changed by ANONYMOUS LOGON (Event ID 4742), which only happens when this vulnerability is abused. The attacker then used the domain controller's account to request replication of account password data from the directory.`,

  impact:
`The attacker gained the ability to act as the domain controller and to obtain password hashes for every account in {{domain}}, giving them domain administrator access to every domain-joined system. Resetting the DC's machine account password also breaks the DC's trust with the rest of the domain until it is repaired, which can stop authentication and replication. Service downtime: {{downtime}}.`,

  eradication: {
    intro: 'Because every domain credential should be treated as stolen, Team {{team}} did the following:',
    steps: [
      { id: 'machinepw', text: 'Reset the {{dc_account}} machine account password so it once again matches between the DC and Active Directory.',
        commands: String.raw`Reset-ComputerMachinePassword -Server <other-DC-or-self> -Credential <DOMAIN\admin>
nltest /sc_verify:{{domain}}` },
      { id: 'krbtgt', text: 'Reset the krbtgt account password twice, allowing replication between resets, to invalidate any forged Kerberos tickets.',
        commands: String.raw`# Use Microsoft's New-KrbtgtKeys.ps1 or:
Set-ADAccountPassword -Identity krbtgt -Reset -NewPassword (Read-Host -AsSecureString)
repadmin /syncall /AdeP
# ...wait for replication, then reset a second time` },
      { id: 'privpw', text: 'Reset passwords for all privileged accounts (Domain Admins, Enterprise Admins, service accounts).' },
      { id: 'groups', text: 'Reviewed privileged group membership and recently created accounts, and removed anything the team did not create.',
        commands: String.raw`Get-ADGroupMember "Domain Admins" -Recursive | Select Name,SamAccountName
Get-ADGroupMember "Enterprise Admins" -Recursive | Select Name,SamAccountName
Get-ADUser -Filter * -Properties whenCreated | Where-Object { $_.whenCreated -gt (Get-Date).AddHours(-12) } | Select Name,whenCreated` },
      { id: 'block', text: 'Blocked {{source_ip}} at the firewall.', default: false },
    ],
  },

  remediation: {
    intro: 'To close the vulnerability, Team {{team}}:',
    steps: [
      { id: 'patch', text: 'Installed the latest cumulative Windows update on every domain controller (includes the CVE-2020-1472 fix).',
        commands: String.raw`Get-HotFix | Sort-Object InstalledOn -Descending | Select -First 5` },
      { id: 'enforce', text: 'Turned on Netlogon secure-channel enforcement mode (this setting only works once the update is installed).',
        commands: String.raw`reg add HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters /v FullSecureChannelProtection /t REG_DWORD /d 1 /f
reg query HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters /v FullSecureChannelProtection` },
      { id: 'allowlist', text: 'Confirmed the "Allow vulnerable Netlogon secure channel connections" Group Policy is not set.',
        commands: String.raw`reg query HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters /v VulnerableChannelAllowList` },
      { id: 'fw', text: 'Restricted RPC and SMB to the domain controllers to internal subnets that need them.', default: false },
    ],
  },

  splunk: [
    { title: 'DC machine account changed by ANONYMOUS LOGON (4742)', spl: String.raw`
index=* EventCode=4742 "ANONYMOUS LOGON"
| table _time host Account_Name Target_Account_Name src_ip _raw` },
    { title: 'Netlogon vulnerable-connection events', spl: String.raw`
index=* (EventCode=5827 OR EventCode=5828 OR EventCode=5829 OR EventCode=5805)
| table _time host EventCode Message` },
    { title: 'Directory replication requests (possible credential dump)', spl: String.raw`
index=* EventCode=4662 ("1131f6aa-9c07-11d1-f79f-00c04fc2dcd2" OR "1131f6ad-9c07-11d1-f79f-00c04fc2dcd2")
| table _time host Account_Name _raw` },
    { title: 'Logons from the source IP', spl: String.raw`
index=* EventCode=4624 "{{source_ip}}" | table _time host Account_Name Logon_Type src_ip` },
  ],

  evidence: {
    vulnerability: [
      'Missing Netlogon update on {{affected_host}}',
      'FullSecureChannelProtection not set on {{affected_host}}',
    ],
    initialAccess: [
      'Event 4742: {{dc_account}} changed by ANONYMOUS LOGON',
      'Replication request from {{source_ip}}',
    ],
    eradication: [
      'Resetting the {{dc_account}} machine account password',
      'Resetting the krbtgt password',
      'Reviewing Domain Admins membership',
    ],
    remediation: [
      'Installed update on {{affected_host}}',
      'FullSecureChannelProtection set to 1',
    ],
  },
});

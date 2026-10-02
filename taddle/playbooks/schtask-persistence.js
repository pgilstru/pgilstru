// TEMPORARY prototype playbook — have the team review and rewrite before competition.
window.IR_PLAYBOOKS.push({
  id: 'schtask-persistence',
  name: 'Malicious scheduled task',
  shortName: 'Scheduled task',
  fileSlug: 'SchTask',
  category: 'persistence',
  platform: 'Windows',
  draft: true,
  description: 'Red team kept access with a scheduled task that relaunches their program.',
  vulnScreenshot: false,
  defaults: {},
  vars: [
    { key: 'task_name', label: 'Scheduled task name', placeholder: '\\Microsoft\\Windows\\UpdateCheck' },
    { key: 'task_binary', label: 'Program the task runs', placeholder: 'C:\\ProgramData\\svchost.exe' },
    { key: 'task_trigger', label: 'Task trigger', placeholder: 'every 5 minutes and at startup' },
  ],

  summary: 'a malicious scheduled task on {{affected_host}} used to keep access',

  // Persistence isn't the vulnerability itself — it adds to the access playbook's text.
  vulnerability: '',

  initialAccess:
`After getting in, the attacker created a scheduled task named "{{task_name}}" on {{affected_host}} that runs {{task_binary}} {{task_trigger}}. The task was made to look like a normal Windows task so that it would be overlooked, and it would restart the attacker's program even after the program was killed or the host was rebooted.`,

  impact:
`The scheduled task gave the attacker a way back onto {{affected_host}} that would survive reboots and password changes. Removing {{task_binary}} alone would not have been enough, because the task would keep trying to start it.`,

  eradication: {
    intro: 'Team {{team}} removed the persistence by doing the following:',
    steps: [
      { id: 'find', text: 'Listed all scheduled tasks outside the built-in Microsoft folder and identified "{{task_name}}".',
        commands: String.raw`Get-ScheduledTask | Where-Object { $_.TaskPath -notlike '\Microsoft\*' -or $_.Author -eq $null } |
  Select TaskPath,TaskName,State,@{n='Runs';e={($_.Actions | % { $_.Execute + ' ' + $_.Arguments }) -join '; '}}` },
      { id: 'stop', text: 'Stopped and deleted the scheduled task.',
        commands: String.raw`schtasks /end /tn "{{task_name}}"
schtasks /delete /tn "{{task_name}}" /f` },
      { id: 'proc', text: 'Ended the running process started by the task.',
        commands: String.raw`Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -eq '{{task_binary}}' } | Select ProcessId,ParentProcessId,CommandLine
Stop-Process -Id <PID> -Force` },
      { id: 'file', text: 'Recorded the hash of {{task_binary}} and then deleted it.',
        commands: String.raw`Get-FileHash '{{task_binary}}' -Algorithm SHA256
Remove-Item '{{task_binary}}' -Force` },
      { id: 'siblings', text: 'Checked other common persistence locations (Run keys, services, startup folders) for anything else the attacker added.',
        commands: String.raw`Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Run, HKCU:\Software\Microsoft\Windows\CurrentVersion\Run
Get-CimInstance Win32_Service | Where-Object { $_.PathName -notmatch 'Windows\\system32' } | Select Name,PathName,StartMode` },
    ],
  },

  remediation: {
    intro: '',
    steps: [
      { id: 'audit', text: 'Enabled auditing of scheduled task creation so new tasks are logged (Event ID 4698) and forwarded to Splunk.',
        commands: String.raw`auditpol /set /subcategory:"Other Object Access Events" /success:enable /failure:enable` },
      { id: 'alert', text: 'Added a Splunk alert for new scheduled tasks on servers.', default: false },
    ],
  },

  splunk: [
    { title: 'Scheduled task created (4698)', spl: String.raw`
index=* EventCode=4698 | table _time host Account_Name Task_Name _raw` },
    { title: 'Task Scheduler operational log', spl: String.raw`
index=* source="*TaskScheduler/Operational*" (EventCode=106 OR EventCode=200 OR EventCode=129)
| table _time host EventCode Message` },
    { title: 'Process runs of the task program (Sysmon 1)', spl: String.raw`
index=* EventCode=1 Image="{{task_binary}}" | table _time host ParentImage Image CommandLine User` },
  ],

  evidence: {
    initialAccess: [
      'Event 4698 showing "{{task_name}}" being created',
      'Scheduled task "{{task_name}}" running {{task_binary}}',
    ],
    eradication: [
      'Deleting the "{{task_name}}" scheduled task',
      'Hash and removal of {{task_binary}}',
    ],
    remediation: [
      'Enabling scheduled task creation auditing',
    ],
  },
});

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  X, CalendarDays, ChevronRight, Users, CheckSquare, Clock, Bell, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  PROJECTS, USERS, type AuditType, type Frequency,
} from '@/lib/governance-data'

interface AuditSchedulerModalProps {
  type: AuditType
  presetTitle?: string
  presetProjectIds?: string[]
  presetItemIds?: string[]
  onClose: () => void
  onSave: (data: { name: string; frequency: Frequency; auditorId: string; note: string }) => void
}

const FREQUENCIES: Frequency[] = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']

function computeNextRuns(frequency: Frequency, startDate: string, count = 3): string[] {
  const base = new Date(startDate)
  const results: string[] = []
  let current = new Date(base)
  for (let i = 0; i < count; i++) {
    if (i > 0) {
      switch (frequency) {
        case 'Daily':       current = new Date(current.setDate(current.getDate() + 1)); break
        case 'Weekly':      current = new Date(current.setDate(current.getDate() + 7)); break
        case 'Monthly':     current = new Date(current.setMonth(current.getMonth() + 1)); break
        case 'Quarterly':   current = new Date(current.setMonth(current.getMonth() + 3)); break
        case 'Semi-Annual': current = new Date(current.setMonth(current.getMonth() + 6)); break
        case 'Annual':      current = new Date(current.setFullYear(current.getFullYear() + 1)); break
        default:            current = new Date(current.setDate(current.getDate() + 30)); break
      }
    }
    results.push(current.toISOString().slice(0, 10))
  }
  return results
}

function frequencyHuman(f: Frequency): string {
  switch (f) {
    case 'Daily': return 'Every day'
    case 'Weekly': return 'Every week'
    case 'Monthly': return 'Every month'
    case 'Quarterly': return 'Every 3 months'
    case 'Semi-Annual': return 'Every 6 months'
    case 'Annual': return 'Once per year'
    case 'One-time': return 'Single occurrence'
    case 'Custom': return 'Custom schedule'
  }
}

const TYPE_LABELS: Record<AuditType, { label: string; color: string; desc: string }> = {
  controls: { label: 'Controls Audit', color: 'text-gold', desc: 'Audit internal controls (CTL-*)' },
  risk: { label: 'Risk Audit', color: 'text-red', desc: 'Review risk register entries (R-*)' },
  compliance: { label: 'Compliance Audit', color: 'text-teal', desc: 'Verify compliance requirements (CMP-*)' },
}

export function AuditSchedulerModal({
  type, presetTitle = '', presetProjectIds = [], onClose, onSave,
}: AuditSchedulerModalProps) {
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState(presetTitle)
  const [frequency, setFrequency] = React.useState<Frequency>('Monthly')
  const [startDate, setStartDate] = React.useState('2026-07-01')
  const [time, setTime] = React.useState('09:00')
  const [auditorId, setAuditorId] = React.useState('USR-007')
  const [ownerId, setOwnerId] = React.useState('USR-003')
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>(presetProjectIds)
  const [reminderDays, setReminderDays] = React.useState(5)
  const [graceDays, setGraceDays] = React.useState(3)
  const [notifyChannels, setNotifyChannels] = React.useState(['Dashboard'])
  const [saved, setSaved] = React.useState(false)

  const nextRuns = computeNextRuns(frequency, startDate)
  const tl = TYPE_LABELS[type]
  const auditors = USERS.filter((u) => ['Auditor', 'Portfolio Controls Lead', 'Contractor Compliance Reviewer', 'Risk Owner'].includes(u.role))
  const owners = USERS.filter((u) => ['Portfolio Controls Lead', 'Control Owner', 'Risk Owner', 'Portfolio Director', 'Senior Director'].includes(u.role))

  const toggleProject = (pid: string) => {
    setSelectedProjects((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    )
  }

  const toggleChannel = (ch: string) => {
    setNotifyChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    )
  }

  const handleSave = () => {
    onSave({ name, frequency, auditorId, note: '' })
    setSaved(true)
    setTimeout(onClose, 900)
  }

  const steps = ['Details', 'Scope', 'Notifications', 'Review']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-line rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-foreground">New Audit Schedule</h2>
              <p className={cn('text-[11px] font-medium', tl.color)}>{tl.label} · {tl.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-4 pb-2">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => setStep(i)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all',
                  step === i ? 'bg-gold/15 text-gold' : i < step ? 'text-green' : 'text-muted-foreground'
                )}
              >
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border',
                  step === i ? 'bg-gold text-navy border-gold' : i < step ? 'bg-green text-white border-green' : 'border-line text-muted-foreground'
                )}>{i < step ? '✓' : i + 1}</span>
                {s}
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 mx-0.5" />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {step === 0 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Schedule Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`e.g. Monthly ${tl.label} — Henderson Substation`}
                  className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Frequency</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={cn(
                        'px-2.5 py-2 rounded-lg text-[11.5px] font-medium border transition-all',
                        frequency === f ? 'bg-gold/15 text-gold border-gold/40 font-semibold' : 'bg-secondary text-muted-foreground border-line hover:border-gold/30 hover:text-foreground'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Users className="w-3 h-3 inline mr-1" />Assigned Auditor
                  </label>
                  <select
                    value={auditorId}
                    onChange={(e) => setAuditorId(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {auditors.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Users className="w-3 h-3 inline mr-1" />Accountable Owner
                  </label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {owners.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live preview panel */}
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold mb-2">Schedule Preview</p>
                <p className="text-[12.5px] text-foreground font-medium mb-3">
                  {frequencyHuman(frequency)} · starting {startDate} at {time}
                </p>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next 3 occurrences</p>
                  {nextRuns.map((d, i) => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gold/20 text-gold text-[9px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-[12px] font-mono text-foreground">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Projects in Scope</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROJECTS.map((p) => (
                    <label key={p.id} className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all',
                      selectedProjects.includes(p.id) ? 'border-gold/40 bg-gold/8 text-foreground' : 'border-line bg-secondary text-muted-foreground hover:border-gold/20'
                    )}>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(p.id)}
                        onChange={() => toggleProject(p.id)}
                        className="w-3.5 h-3.5 accent-gold"
                      />
                      <div>
                        <p className="text-[12px] font-medium">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.program}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">{selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Bell className="w-3 h-3 inline mr-1" />Reminder Lead Days
                  </label>
                  <input
                    type="number"
                    value={reminderDays}
                    onChange={(e) => setReminderDays(Number(e.target.value))}
                    min={1} max={30}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <p className="text-[10.5px] text-muted-foreground mt-1">A-206 sends reminder {reminderDays} days before due</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Clock className="w-3 h-3 inline mr-1" />Grace Days
                  </label>
                  <input
                    type="number"
                    value={graceDays}
                    onChange={(e) => setGraceDays(Number(e.target.value))}
                    min={0} max={14}
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-line bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <p className="text-[10.5px] text-muted-foreground mt-1">After due + {graceDays}d without completion → Overdue</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notification Channels</label>
                <div className="flex gap-2">
                  {['Dashboard', 'Email', 'Slack'].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all',
                        notifyChannels.includes(ch) ? 'bg-gold/15 text-gold border-gold/40' : 'bg-secondary text-muted-foreground border-line hover:border-gold/20'
                      )}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Review & Confirm</p>
              {[
                { label: 'Schedule Name', value: name || '(not set)' },
                { label: 'Audit Type', value: tl.label },
                { label: 'Frequency', value: frequency },
                { label: 'Start Date', value: `${startDate} at ${time}` },
                { label: 'Auditor', value: USERS.find((u) => u.id === auditorId)?.name ?? auditorId },
                { label: 'Owner', value: USERS.find((u) => u.id === ownerId)?.name ?? ownerId },
                { label: 'Projects', value: selectedProjects.length ? `${selectedProjects.length} project(s)` : 'All projects' },
                { label: 'Reminder', value: `${reminderDays} days before due` },
                { label: 'Grace Period', value: `${graceDays} days` },
                { label: 'Notify via', value: notifyChannels.join(', ') },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3 py-2 border-b border-line last:border-0">
                  <span className="text-[11px] font-semibold text-muted-foreground w-36 shrink-0">{label}</span>
                  <span className="text-[12.5px] text-foreground">{value}</span>
                </div>
              ))}
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-3 mt-2">
                <p className="text-[11px] text-muted-foreground">
                  <RefreshCw className="w-3 h-3 inline mr-1 text-gold" />
                  A-206 Audit Sentinel will automatically generate occurrences from this schedule, send reminders, and escalate overdue audits.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-secondary/20">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[12px] border-line"
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
            {step < steps.length - 1 ? (
              <Button
                size="sm"
                className="h-9 text-[12px] bg-gold text-navy border border-gold font-semibold"
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !name.trim()}
              >
                Next: {steps[step + 1]}
              </Button>
            ) : (
              <Button
                size="sm"
                className={cn('h-9 text-[12px] font-semibold', saved ? 'bg-green text-white border-green' : 'bg-gold text-navy border border-gold')}
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? 'Schedule Created' : 'Create Schedule'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

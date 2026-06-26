'use client'

import * as React from 'react'
import { X, CalendarDays, Users, Bell, RefreshCw, ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  PROJECTS, USERS, CONTROLS, RISK_ITEMS, COMPLIANCE_ITEMS,
  type AuditType, type Frequency,
} from '@/lib/governance-data'

interface AuditSchedulerModalProps {
  type: AuditType
  presetTitle?: string
  presetProjectIds?: string[]
  presetItemIds?: string[]
  onClose: () => void
  onSave: (data: { name: string; frequency: Frequency; auditorId: string }) => void
}

const FREQUENCIES: Frequency[] = [
  'One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom',
]

function computeNextRuns(frequency: Frequency, startDate: string, count = 3): string[] {
  if (!startDate) return []
  const results: string[] = []
  let current = new Date(startDate)
  for (let i = 0; i < count; i++) {
    if (i > 0) {
      const d = new Date(current)
      switch (frequency) {
        case 'Daily':       d.setDate(d.getDate() + 1); break
        case 'Weekly':      d.setDate(d.getDate() + 7); break
        case 'Monthly':     d.setMonth(d.getMonth() + 1); break
        case 'Quarterly':   d.setMonth(d.getMonth() + 3); break
        case 'Semi-Annual': d.setMonth(d.getMonth() + 6); break
        case 'Annual':      d.setFullYear(d.getFullYear() + 1); break
        default:            d.setDate(d.getDate() + 30); break
      }
      current = d
    }
    results.push(current.toISOString().slice(0, 10))
  }
  return results
}

function frequencyHuman(f: Frequency, time: string): string {
  const t = time || '09:00'
  switch (f) {
    case 'Daily':       return `Every day at ${t}`
    case 'Weekly':      return `Every week on Monday at ${t}`
    case 'Monthly':     return `Every month on the 1st at ${t}`
    case 'Quarterly':   return `Every quarter (Jan/Apr/Jul/Oct 1) at ${t}`
    case 'Semi-Annual': return `Every 6 months at ${t}`
    case 'Annual':      return `Once a year at ${t}`
    case 'One-time':    return `One-time occurrence`
    case 'Custom':      return `Custom schedule (cron)`
    default:            return f
  }
}

function typeLabel(type: AuditType): string {
  return type === 'controls' ? 'Control' : type === 'risk' ? 'Risk' : 'Compliance Requirement'
}

function getScopeItems(type: AuditType) {
  if (type === 'controls') return CONTROLS.map(c => ({ id: c.id, label: `${c.id} — ${c.name}` }))
  if (type === 'risk') return RISK_ITEMS.map(r => ({ id: r.id, label: `${r.id} — ${r.title}` }))
  return COMPLIANCE_ITEMS.map(c => ({ id: c.id, label: `${c.id} — ${c.requirement}` }))
}

const typeColor: Record<AuditType, string> = {
  controls:   'bg-blue-50 text-blue-700 border-blue-200',
  risk:       'bg-red-50 text-red-700 border-red-200',
  compliance: 'bg-teal-50 text-teal-700 border-teal-200',
}

const typeAccent: Record<AuditType, string> = {
  controls:   'border-[#1A6DC8]',
  risk:       'border-red-500',
  compliance: 'border-teal-500',
}

export function AuditSchedulerModal({ type, presetTitle, presetProjectIds, presetItemIds, onClose, onSave }: AuditSchedulerModalProps) {
  const [step, setStep] = React.useState(1)
  const [name, setName] = React.useState(presetTitle ?? '')
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>(presetProjectIds ?? [])
  const [selectedItems, setSelectedItems] = React.useState<string[]>(presetItemIds ?? [])
  const [itemSearch, setItemSearch] = React.useState('')
  const [frequency, setFrequency] = React.useState<Frequency>('Monthly')
  const [startDate, setStartDate] = React.useState('2026-07-01')
  const [time, setTime] = React.useState('09:00')
  const [timezone, setTimezone] = React.useState('America/New_York')
  const [auditorId, setAuditorId] = React.useState('')
  const [ownerId, setOwnerId] = React.useState('')
  const [reminderDays, setReminderDays] = React.useState(5)
  const [graceDays, setGraceDays] = React.useState(3)
  const [customCron, setCustomCron] = React.useState('0 9 1 */3 *')
  const [errors, setErrors] = React.useState<string[]>([])

  const scopeItems = getScopeItems(type)
  const filteredItems = scopeItems.filter(i =>
    i.label.toLowerCase().includes(itemSearch.toLowerCase())
  )
  const nextRuns = computeNextRuns(frequency, startDate)

  function toggleProject(id: string) {
    setSelectedProjects(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }
  function toggleItem(id: string) {
    setSelectedItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function validate(): boolean {
    const errs: string[] = []
    if (!name.trim()) errs.push('Schedule name is required.')
    if (selectedItems.length === 0) errs.push(`At least one ${typeLabel(type)} must be in scope.`)
    if (!auditorId) errs.push('Assigned auditor is required.')
    setErrors(errs)
    return errs.length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({ name, frequency, auditorId })
    onClose()
  }

  const stepLabels = ['Details', 'Scope', 'Schedule', 'Notifications']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] border-l-4 ${typeAccent[type]}`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${typeColor[type]}`}>
              {type.toUpperCase()} AUDIT
            </span>
            <h2 className="text-[15px] font-semibold text-[#1E293B]">New Audit Schedule</h2>
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3 border-b border-[#E2E8F0] bg-[#F7F9FC]">
          {stepLabels.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => setStep(i + 1)}
                className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                  step === i + 1
                    ? 'bg-[#1A6DC8] text-white'
                    : step > i + 1
                    ? 'text-[#059669]'
                    : 'text-[#64748B]'
                }`}
              >
                {i + 1}. {s}
              </button>
              {i < stepLabels.length - 1 && <ChevronRight className="h-3 w-3 text-[#CBD5E1] mx-1 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 space-y-1">
                {errors.map(e => <div key={e}>• {e}</div>)}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-1">Schedule Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`e.g. Monthly ${typeLabel(type)} Review — Henderson`}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1A6DC8] focus:ring-1 focus:ring-[#1A6DC8]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-1">Assigned Auditor *</label>
                  <select
                    value={auditorId}
                    onChange={e => setAuditorId(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                  >
                    <option value="">Select auditor...</option>
                    {USERS.filter(u => ['Auditor', 'Portfolio Controls Lead', 'Contractor Compliance Reviewer', 'Risk Owner'].includes(u.role)).map(u => (
                      <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-1">Accountable Owner</label>
                  <select
                    value={ownerId}
                    onChange={e => setOwnerId(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                  >
                    <option value="">Defaults to item owner...</option>
                    {USERS.map(u => (
                      <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-2">Projects</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PROJECTS.map(p => (
                      <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                        selectedProjects.includes(p.id)
                          ? 'border-[#1A6DC8] bg-blue-50 text-[#1A6DC8]'
                          : 'border-[#E2E8F0] text-[#475569] hover:bg-[#F7F9FC]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(p.id)}
                          onChange={() => toggleProject(p.id)}
                          className="accent-[#1A6DC8]"
                        />
                        <span className="font-mono font-medium">{p.code}</span>
                        <span className="truncate">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-1.5">
                    In-Scope {typeLabel(type)}s * ({selectedItems.length} selected)
                  </label>
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    placeholder={`Search ${typeLabel(type).toLowerCase()}s...`}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1A6DC8] mb-2"
                  />
                  <div className="border border-[#E2E8F0] rounded-lg max-h-52 overflow-y-auto divide-y divide-[#F1F5F9]">
                    {filteredItems.map(item => (
                      <label key={item.id} className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                        selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-[#F7F9FC]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="accent-[#1A6DC8] shrink-0"
                        />
                        <span className={`font-mono font-semibold shrink-0 ${selectedItems.includes(item.id) ? 'text-[#1A6DC8]' : 'text-[#64748B]'}`}>
                          {item.id}
                        </span>
                        <span className="text-[#475569] truncate">{item.label.split(' — ').slice(1).join(' — ')}</span>
                      </label>
                    ))}
                    {filteredItems.length === 0 && (
                      <div className="px-3 py-4 text-xs text-[#94A3B8] text-center">No items match your search.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E293B] mb-2">Frequency</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FREQUENCIES.map(f => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                          frequency === f
                            ? 'bg-[#1A6DC8] text-white border-[#1A6DC8]'
                            : 'border-[#E2E8F0] text-[#475569] hover:border-[#1A6DC8] hover:text-[#1A6DC8]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {frequency === 'Custom' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Cron Expression</label>
                    <input
                      type="text"
                      value={customCron}
                      onChange={e => setCustomCron(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm font-mono text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    />
                    <p className="text-xs text-[#64748B] mt-1">Format: min hour day month weekday</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    >
                      <option value="America/New_York">ET (New York)</option>
                      <option value="America/Chicago">CT (Chicago)</option>
                      <option value="America/Los_Angeles">PT (Los Angeles)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Reminder Lead Days</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={reminderDays}
                      onChange={e => setReminderDays(Number(e.target.value))}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    />
                    <p className="text-xs text-[#94A3B8] mt-0.5">A-206 sends reminder N days before due</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1E293B] mb-1">Grace Days</label>
                    <input
                      type="number"
                      min={0}
                      max={14}
                      value={graceDays}
                      onChange={e => setGraceDays(Number(e.target.value))}
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1A6DC8]"
                    />
                    <p className="text-xs text-[#94A3B8] mt-0.5">Days after due before flipping to Overdue</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-[#F7F9FC] rounded-lg p-4 space-y-2 border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-4 w-4 text-[#1A6DC8]" />
                    <span className="text-xs font-semibold text-[#1E293B]">A-206 Audit Sentinel Notifications</span>
                  </div>
                  {[
                    { label: `Reminder ${reminderDays}d before due`, checked: true },
                    { label: 'Overdue escalation (email + Task Inbox)', checked: true },
                    { label: 'Finding created → Task Inbox of remediation owner', checked: true },
                    { label: 'Review approval notification to accountable owner', checked: true },
                    { label: 'Weekly digest of open findings', checked: false },
                  ].map(n => (
                    <label key={n.label} className="flex items-center gap-2 text-xs text-[#475569]">
                      <input type="checkbox" defaultChecked={n.checked} className="accent-[#1A6DC8]" />
                      {n.label}
                    </label>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  <strong>A-206 will automatically:</strong> generate occurrences from this schedule, flip overdue status after {graceDays} grace days, and push findings to the responsible owner&apos;s Task Inbox.
                </div>
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div className="w-60 border-l border-[#E2E8F0] bg-[#F7F9FC] p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-[#64748B]" />
              <span className="text-xs font-semibold text-[#475569] uppercase tracking-wide">Preview</span>
            </div>
            <div className="space-y-3">
              {name && (
                <div>
                  <div className="text-[10px] text-[#94A3B8] uppercase font-medium mb-0.5">Name</div>
                  <div className="text-xs font-medium text-[#1E293B]">{name}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-medium mb-0.5">Recurrence</div>
                <div className="text-xs text-[#1E293B] font-medium">{frequencyHuman(frequency, time)}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-medium mb-1">Next 3 Runs</div>
                <div className="space-y-1">
                  {nextRuns.map((d, i) => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#94A3B8] w-3">{i + 1}.</span>
                      <span className="text-xs text-[#1A6DC8] font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedItems.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#94A3B8] uppercase font-medium mb-1">Scope</div>
                  <div className="text-xs text-[#475569]">{selectedItems.length} {typeLabel(type)}{selectedItems.length !== 1 ? 's' : ''} selected</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedItems.slice(0, 6).map(id => (
                      <span key={id} className="text-[10px] font-mono bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[#475569]">{id}</span>
                    ))}
                    {selectedItems.length > 6 && (
                      <span className="text-[10px] text-[#94A3B8]">+{selectedItems.length - 6} more</span>
                    )}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-medium mb-0.5">Reminders</div>
                <div className="text-xs text-[#475569]">{reminderDays}d lead · {graceDays}d grace</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-white">
          <button
            onClick={onClose}
            className="text-xs text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setStep(s => s - 1)}>
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button size="sm" className="text-xs bg-[#1A6DC8] hover:bg-[#1558a0] text-white" onClick={() => setStep(s => s + 1)}>
                Next
              </Button>
            ) : (
              <Button size="sm" className="text-xs bg-[#1A6DC8] hover:bg-[#1558a0] text-white" onClick={handleSave}>
                Create Schedule
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

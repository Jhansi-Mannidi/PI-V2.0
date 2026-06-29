'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CalendarDays, Users, Bell, ChevronRight, Eye, Shield,
  AlertTriangle, Scale, Search, Check, Clock, RefreshCw,
  CalendarCheck, UserCheck, Info, Layers, ArrowRight,
  ClipboardList, Settings2, Repeat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PagePanel } from '@/components/page-panel'
import {
  PROJECTS, USERS, CONTROLS, RISK_ITEMS, COMPLIANCE_ITEMS,
  type AuditType, type Frequency,
} from '@/lib/governance-data'

/* ─────────────────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────────────────── */
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

const TYPE_META: Record<AuditType, { label: string; Icon: React.ElementType; accent: string; border: string; bg: string; chip: string }> = {
  controls:   { label: 'Controls',   Icon: Shield,         accent: 'text-gold',    border: 'border-gold/30',    bg: 'bg-gold/8',    chip: 'bg-gold/10 text-gold border-gold/25' },
  risk:       { label: 'Risk',        Icon: AlertTriangle,  accent: 'text-gold',    border: 'border-gold/30',    bg: 'bg-gold/8',    chip: 'bg-gold/10 text-gold border-gold/25' },
  compliance: { label: 'Compliance',  Icon: Scale,          accent: 'text-gold',    border: 'border-gold/30',    bg: 'bg-gold/8',    chip: 'bg-gold/10 text-gold border-gold/25' },
}

const STEPS = [
  { id: 1, label: 'Details',        icon: ClipboardList,  desc: 'Name, auditor & owner' },
  { id: 2, label: 'Scope',          icon: Layers,         desc: 'Controls, projects & items' },
  { id: 3, label: 'Schedule',       icon: CalendarDays,   desc: 'Frequency, date & time' },
  { id: 4, label: 'Notifications',  icon: Bell,           desc: 'Alerts & reminders' },
]

function computeNextRuns(frequency: Frequency, startDate: string, count = 3): string[] {
  if (!startDate) return []
  const results: string[] = []
  let current = new Date(startDate)
  for (let i = 0; i < count; i++) {
    if (i > 0) {
      const d = new Date(current)
      switch (frequency) {
        case 'Daily':       d.setDate(d.getDate() + 1);        break
        case 'Weekly':      d.setDate(d.getDate() + 7);        break
        case 'Monthly':     d.setMonth(d.getMonth() + 1);      break
        case 'Quarterly':   d.setMonth(d.getMonth() + 3);      break
        case 'Semi-Annual': d.setMonth(d.getMonth() + 6);      break
        case 'Annual':      d.setFullYear(d.getFullYear() + 1); break
        default:            d.setDate(d.getDate() + 30);       break
      }
      current = d
    }
    results.push(current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
  }
  return results
}

function frequencyHuman(f: Frequency, time: string): string {
  const t = time || '09:00'
  const fmt = (raw: string) => { const [h, m] = raw.split(':'); const hr = Number(h); return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}` }
  switch (f) {
    case 'Daily':       return `Every day at ${fmt(t)}`
    case 'Weekly':      return `Every Monday at ${fmt(t)}`
    case 'Monthly':     return `1st of every month at ${fmt(t)}`
    case 'Quarterly':   return `Jan / Apr / Jul / Oct 1st at ${fmt(t)}`
    case 'Semi-Annual': return `Every 6 months at ${fmt(t)}`
    case 'Annual':      return `Once a year at ${fmt(t)}`
    case 'One-time':    return 'One-time occurrence'
    case 'Custom':      return 'Custom cron schedule'
    default:            return f
  }
}

function getScopeItems(type: AuditType) {
  if (type === 'controls')   return CONTROLS.map(c   => ({ id: c.id,    label: c.name }))
  if (type === 'risk')       return RISK_ITEMS.map(r  => ({ id: r.id,    label: r.title }))
  return COMPLIANCE_ITEMS.map(c => ({ id: c.id, label: c.requirement }))
}

/* ─────────────────────────────────────────────────────────
   Shared field components
───────────────────────────────────────────────────────── */
function FieldLabel({ icon: Icon, children, required }: { icon?: React.ElementType; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground mb-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  )
}

function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full h-10 px-3.5 text-[13px] border border-line rounded-xl bg-background text-foreground',
        'placeholder:text-muted-foreground/40',
        'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
        'transition-all duration-150',
        className,
      )}
    />
  )
}

function FieldSelect({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'w-full h-10 px-3.5 text-[13px] border border-line rounded-xl bg-background text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
        'transition-all duration-150',
        className,
      )}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
export function AuditSchedulerModal({
  type,
  presetTitle,
  presetProjectIds,
  presetItemIds,
  onClose,
  onSave,
}: AuditSchedulerModalProps) {
  const meta = TYPE_META[type]
  const TypeIcon = meta.Icon

  const [step, setStep]                     = React.useState(1)
  const [name, setName]                     = React.useState(presetTitle ?? '')
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>(presetProjectIds ?? [])
  const [selectedItems, setSelectedItems]   = React.useState<string[]>(presetItemIds ?? [])
  const [itemSearch, setItemSearch]         = React.useState('')
  const [frequency, setFrequency]           = React.useState<Frequency>('Monthly')
  const [startDate, setStartDate]           = React.useState('2026-07-01')
  const [time, setTime]                     = React.useState('09:00')
  const [timezone, setTimezone]             = React.useState('America/New_York')
  const [auditorId, setAuditorId]           = React.useState('')
  const [ownerId, setOwnerId]               = React.useState('')
  const [reminderDays, setReminderDays]     = React.useState(5)
  const [graceDays, setGraceDays]           = React.useState(3)
  const [customCron, setCustomCron]         = React.useState('0 9 1 */3 *')
  const [errors, setErrors]                 = React.useState<string[]>([])
  const [notifs, setNotifs]                 = React.useState({
    reminder: true, overdue: true, finding: true, review: true, digest: false,
  })

  const scopeItems  = getScopeItems(type)
  const filtered    = scopeItems.filter(i => i.label.toLowerCase().includes(itemSearch.toLowerCase()))
  const nextRuns    = computeNextRuns(frequency, startDate)
  const auditor     = USERS.find(u => u.id === auditorId)
  const owner       = USERS.find(u => u.id === ownerId)

  function toggleProject(id: string) { setSelectedProjects(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]) }
  function toggleItem(id: string)    { setSelectedItems(p    => p.includes(id) ? p.filter(x => x !== id) : [...p, id]) }

  function validate(): boolean {
    const errs: string[] = []
    if (!name.trim())             errs.push('Schedule name is required.')
    if (selectedItems.length === 0) errs.push('At least one in-scope item is required.')
    if (!auditorId)               errs.push('Assigned auditor is required.')
    setErrors(errs)
    return errs.length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({ name, frequency, auditorId })
    onClose()
  }

  /* ── Step completion state ── */
  const stepComplete: Record<number, boolean> = {
    1: !!name.trim() && !!auditorId,
    2: selectedItems.length > 0,
    3: !!startDate && !!time,
    4: true,
  }
  const progress = Math.round((Object.values(stepComplete).filter(Boolean).length / 4) * 100)

  /* ── Footer ── */
  const footer = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-28 h-1.5 rounded-full bg-line overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gold"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{progress}%</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Step {step} of 4 — {STEPS[step - 1].desc}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 px-5 text-[12px] border-line" onClick={onClose}>
          Cancel
        </Button>
        {step > 1 && (
          <Button variant="outline" size="sm" className="h-9 px-4 text-[12px] border-line gap-1.5" onClick={() => setStep(s => s - 1)}>
            Back
          </Button>
        )}
        {step < 4 ? (
          <Button size="sm" className="h-9 px-6 text-[12px] bg-gold text-navy font-semibold gap-1.5" onClick={() => setStep(s => s + 1)}>
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button
            size="sm"
            className={cn(
              'h-9 px-6 text-[12px] font-semibold gap-1.5',
              stepComplete[1] && stepComplete[2] && stepComplete[3]
                ? 'bg-gold text-navy font-semibold hover:bg-gold/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed',
            )}
            onClick={handleSave}
            disabled={!(stepComplete[1] && stepComplete[2] && stepComplete[3])}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Create Schedule
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <PagePanel
      open={true}
      onClose={onClose}
      title={`Schedule ${meta.label} Audit`}
      description="Configure a new recurring or one-time audit — set scope, cadence, auditor, and automated notifications."
      footer={footer}
    >
      <div className="flex h-full min-h-0">

        {/* ── LEFT: Step nav strip ── */}
        <aside className="w-56 shrink-0 border-r border-line bg-card flex flex-col py-6 px-4 gap-1 hidden lg:flex">
          {/* Audit type badge */}
          <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-4', meta.bg, meta.border)}>
            <TypeIcon className={cn('w-4 h-4', meta.accent)} />
            <div>
              <p className={cn('text-[11px] font-bold', meta.accent)}>{meta.label} Audit</p>
              <p className="text-[10px] text-muted-foreground">New schedule</p>
            </div>
          </div>

          {STEPS.map((s) => {
            const StepIcon = s.icon
            const done = stepComplete[s.id] && step > s.id
            const active = step === s.id
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group w-full',
                  active ? 'bg-gold/10 border border-gold/30' : 'hover:bg-secondary',
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors text-[11px] font-bold',
                  done   ? 'bg-green text-white' :
                  active ? 'bg-gold text-navy' :
                           'bg-secondary text-muted-foreground',
                )}>
                  {done ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-[12px] font-semibold leading-tight', active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground')}>{s.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.desc}</p>
                </div>
              </button>
            )
          })}

          {/* Mini preview card */}
          {name && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-auto rounded-xl border border-gold/25 bg-gold-pale p-3 space-y-1.5"
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
                <Eye className="w-2.5 h-2.5" /> Preview
              </p>
              <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{name}</p>
              <div className="flex gap-1 flex-wrap mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/15 text-gold font-mono border border-gold/20">{frequency}</span>
                {auditor && <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-line">{auditor.name.split(' ')[0]}</span>}
                {selectedItems.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-line">{selectedItems.length} items</span>}
              </div>
            </motion.div>
          )}
        </aside>

        {/* ── MAIN: Form area ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="p-6 xl:p-8 space-y-6"
            >

              {/* Step heading */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(STEPS[step - 1].icon, { className: cn('w-4 h-4', meta.accent) })}
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Step {step} of 4</span>
                </div>
                <h3 className="text-[18px] font-bold text-foreground">{STEPS[step - 1].label}</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">{STEPS[step - 1].desc}</p>
              </div>

              {/* Errors */}
              <AnimatePresence>
                {errors.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-xl border border-red/25 bg-red-bg p-3.5 space-y-1">
                    {errors.map(e => (
                      <p key={e} className="text-[11px] text-red flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" /> {e}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Step 1: Details ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <FieldLabel icon={ClipboardList} required>Schedule Name</FieldLabel>
                    <FieldInput
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={`e.g. Monthly ${meta.label} Review — Henderson`}
                    />
                    {name && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green" /> Name looks good
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel icon={UserCheck} required>Assigned Auditor</FieldLabel>
                      <FieldSelect value={auditorId} onChange={e => setAuditorId(e.target.value)}>
                        <option value="">Select auditor...</option>
                        {USERS.filter(u => ['Auditor', 'Portfolio Controls Lead', 'Contractor Compliance Reviewer', 'Risk Owner'].includes(u.role)).map(u => (
                          <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                        ))}
                      </FieldSelect>
                      {auditor && (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-line">
                          <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-bold text-gold">{auditor.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-foreground">{auditor.name}</p>
                            <p className="text-[10px] text-muted-foreground">{auditor.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <FieldLabel icon={Users}>Accountable Owner</FieldLabel>
                      <FieldSelect value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                        <option value="">Defaults to item owner</option>
                        {USERS.map(u => (
                          <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                        ))}
                      </FieldSelect>
                      {owner && (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-line">
                          <div className="w-6 h-6 rounded-full bg-navy/15 border border-navy/25 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-bold text-navy">{owner.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-foreground">{owner.name}</p>
                            <p className="text-[10px] text-muted-foreground">{owner.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audit type info banner */}
                  <div className={cn('flex items-start gap-3 p-4 rounded-xl border', meta.bg, meta.border)}>
                    <TypeIcon className={cn('w-4 h-4 mt-0.5 shrink-0', meta.accent)} />
                    <div>
                      <p className={cn('text-[11px] font-bold', meta.accent)}>{meta.label} Audit Schedule</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        This schedule will automatically generate occurrences, track completion, and push findings to the responsible owner&apos;s Task Inbox.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Scope ── */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Projects */}
                  <div>
                    <FieldLabel icon={Layers}>Projects <span className="text-muted-foreground font-normal normal-case text-[10px]">(optional)</span></FieldLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROJECTS.map(p => {
                        const on = selectedProjects.includes(p.id)
                        return (
                          <button
                            key={p.id}
                            onClick={() => toggleProject(p.id)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-[12px]',
                            on ? 'bg-gold/8 border-gold/40 text-gold' : 'bg-background border-line text-muted-foreground hover:border-gold/40 hover:text-foreground',
                          )}
                        >
                          <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors', on ? 'bg-gold border-gold' : 'border-line bg-background')}>
                              {on && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="font-mono font-semibold text-[10px] shrink-0">{p.code}</span>
                            <span className="truncate text-[11px]">{p.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* In-scope items */}
                  <div>
                    <FieldLabel icon={meta.Icon} required>
                      In-Scope {meta.label}s
                      {selectedItems.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gold/15 text-gold text-[9px] font-bold border border-gold/25 normal-case tracking-normal">
                          {selectedItems.length} selected
                        </span>
                      )}
                    </FieldLabel>

                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <FieldInput
                        type="text"
                        value={itemSearch}
                        onChange={e => setItemSearch(e.target.value)}
                        placeholder={`Search ${meta.label.toLowerCase()}s...`}
                        className="pl-9"
                      />
                    </div>

                    <div className="border border-line rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-line">
                      {filtered.map(item => {
                        const on = selectedItems.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                              on ? 'bg-gold/5' : 'bg-background hover:bg-secondary/50',
                            )}
                          >
                            <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors', on ? 'bg-gold border-gold' : 'border-line bg-background')}>
                              {on && <Check className="w-2.5 h-2.5 text-navy" />}
                            </div>
                            <span className={cn('text-[10px] font-mono font-bold shrink-0', on ? 'text-gold' : 'text-muted-foreground')}>{item.id}</span>
                            <span className={cn('text-[12px] truncate', on ? 'text-foreground font-medium' : 'text-muted-foreground')}>{item.label}</span>
                          </button>
                        )
                      })}
                      {filtered.length === 0 && (
                        <div className="py-6 text-center text-[12px] text-muted-foreground">No items match your search.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Schedule ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <FieldLabel icon={Repeat} required>Frequency</FieldLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {FREQUENCIES.map(f => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className={cn(
                            'px-4 py-2 rounded-xl border text-[12px] font-medium transition-all',
                            frequency === f
                              ? 'bg-gold text-navy border-gold shadow-sm scale-[1.02]'
                              : 'bg-background border-line text-muted-foreground hover:border-gold/40 hover:text-foreground',
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {frequency === 'Custom' && (
                    <div>
                      <FieldLabel icon={Settings2}>Cron Expression</FieldLabel>
                      <FieldInput
                        type="text"
                        value={customCron}
                        onChange={e => setCustomCron(e.target.value)}
                        className="font-mono"
                        placeholder="0 9 1 */3 *"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1.5">Format: min hour day month weekday</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <FieldLabel icon={CalendarDays} required>Start Date</FieldLabel>
                      <FieldInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel icon={Clock} required>Time</FieldLabel>
                      <FieldInput type="time" value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel icon={Settings2}>Timezone</FieldLabel>
                      <FieldSelect value={timezone} onChange={e => setTimezone(e.target.value)}>
                        <option value="America/New_York">ET (New York)</option>
                        <option value="America/Chicago">CT (Chicago)</option>
                        <option value="America/Los_Angeles">PT (Los Angeles)</option>
                        <option value="UTC">UTC</option>
                      </FieldSelect>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel icon={Bell}>Reminder Lead Days</FieldLabel>
                      <FieldInput
                        type="number" min={0} max={30} value={reminderDays}
                        onChange={e => setReminderDays(Number(e.target.value))}
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Sends reminder N days before due</p>
                    </div>
                    <div>
                      <FieldLabel icon={AlertTriangle}>Grace Days</FieldLabel>
                      <FieldInput
                        type="number" min={0} max={14} value={graceDays}
                        onChange={e => setGraceDays(Number(e.target.value))}
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Days before flipping to Overdue</p>
                    </div>
                  </div>

                  {/* Next runs preview */}
                  {nextRuns.length > 0 && (
                    <div className="rounded-xl border border-gold/25 bg-gold-pale p-4 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gold flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3" /> Upcoming occurrences
                      </p>
                      <p className="text-[11px] text-muted-foreground mb-2">{frequencyHuman(frequency, time)}</p>
                      <div className="flex gap-3 flex-wrap">
                        {nextRuns.map((d, i) => (
                          <div key={d} className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-gold/25 border border-gold/35 flex items-center justify-center text-[8px] font-bold text-gold">{i + 1}</span>
                            <span className="text-[11px] font-medium text-foreground">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Notifications ── */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    {[
                      { key: 'reminder', icon: Bell,         label: `Reminder ${reminderDays}d before due`,             desc: 'Sent to auditor and owner' },
                      { key: 'overdue',  icon: AlertTriangle, label: 'Overdue escalation',                               desc: 'Email + Task Inbox notification' },
                      { key: 'finding',  icon: Search,        label: 'Finding created → remediation owner',              desc: 'Auto-routes to Task Inbox' },
                      { key: 'review',   icon: UserCheck,     label: 'Review approval notification',                     desc: 'Sent to accountable owner' },
                      { key: 'digest',   icon: RefreshCw,     label: 'Weekly digest of open findings',                   desc: 'Summary email every Monday' },
                    ].map(({ key, icon: Icon, label, desc }) => {
                      const on = notifs[key as keyof typeof notifs]
                      return (
                        <button
                          key={key}
                          onClick={() => setNotifs(n => ({ ...n, [key]: !on }))}
                          className={cn(
                            'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all',
                            on ? 'bg-gold/8 border-gold/30' : 'bg-background border-line hover:border-gold/30',
                          )}
                        >
                          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors', on ? 'bg-gold/15' : 'bg-secondary')}>
                            <Icon className={cn('w-4 h-4', on ? 'text-gold' : 'text-muted-foreground')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-[12px] font-semibold', on ? 'text-foreground' : 'text-muted-foreground')}>{label}</p>
                            <p className="text-[10px] text-muted-foreground">{desc}</p>
                          </div>
                          <div className={cn(
                            'w-10 h-6 rounded-full border flex items-center px-0.5 transition-all shrink-0',
                            on ? 'bg-gold border-gold justify-end' : 'bg-secondary border-line justify-start',
                          )}>
                            <motion.div
                              layout
                              className={cn('w-5 h-5 rounded-full shadow-sm', on ? 'bg-white' : 'bg-white/80')}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* A-206 info banner */}
                  <div className="rounded-xl border border-teal/25 bg-teal/5 p-4 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-teal">A-206 Audit Sentinel</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Automatically generates occurrences from this schedule, flips overdue status after {graceDays} grace days, and routes findings to the responsible owner&apos;s Task Inbox.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Live preview panel ── */}
        <aside className="w-64 shrink-0 border-l border-line bg-card flex flex-col py-6 px-4 gap-4 overflow-y-auto hidden xl:flex">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Live Preview</span>
          </div>

          {/* Card preview */}
          <div className="rounded-2xl border border-line bg-background p-4 space-y-3 shadow-sm">
            <div className={cn('flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-fit text-[10px] font-bold', meta.chip)}>
              <TypeIcon className="w-3 h-3" />
              {meta.label.toUpperCase()} AUDIT
            </div>
            <p className="text-[13px] font-semibold text-foreground leading-snug min-h-[2.5rem]">
              {name || <span className="text-muted-foreground/40 font-normal italic">Schedule name...</span>}
            </p>
            <div className="space-y-2 pt-1 border-t border-line">
              {[
                { label: 'Auditor',   value: auditor?.name ?? '—',         icon: UserCheck },
                { label: 'Frequency', value: frequency,                     icon: Repeat },
                { label: 'Start',     value: startDate || '—',              icon: CalendarDays },
                { label: 'Scope',     value: `${selectedItems.length} items`, icon: Layers },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
                  <span className="text-[11px] text-foreground font-medium truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion checklist */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground mb-2">Completion</p>
            {STEPS.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', stepComplete[s.id] ? 'bg-green' : 'bg-secondary border border-line')}>
                  {stepComplete[s.id] && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className={cn('text-[11px]', stepComplete[s.id] ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Next run dates */}
          {nextRuns.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground mb-2">Next Runs</p>
              {nextRuns.map((d, i) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-[8px] font-bold text-gold shrink-0">{i + 1}</span>
                  <span className="text-[11px] text-foreground">{d}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </PagePanel>
  )
}

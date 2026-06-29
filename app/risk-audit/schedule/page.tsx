'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft, CalendarClock, Loader2, Save,
  AlertTriangle, Users, Calendar, ClipboardList, ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  PROJECTS, USERS, RISK_ITEMS, type Frequency,
} from '@/lib/governance-data'
import {
  saveNewSchedule, generateScheduleId,
  type RichAuditSchedule, type TrailEntry,
} from '@/lib/audit-store'

const FREQUENCIES: Frequency[] = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']

const WORKFLOW_STEPS = [
  { label: 'Audit details',   icon: ClipboardList },
  { label: 'Scope & risks',   icon: AlertTriangle },
  { label: 'Assign & schedule', icon: Calendar },
]

const ease = [0.25, 0.46, 0.45, 0.94]

export default function RiskAuditSchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    purpose: '',
    requestedById: '',
    approvedById: '',
    frequency: 'Monthly' as Frequency,
    auditorId: '',
    startDate: new Date().toISOString().slice(0, 10),
    time: '09:00',
    projectIds: [] as string[],
    riskIds: [] as string[],
    notes: '',
  })

  const isValid = formData.name.trim() && formData.auditorId && formData.riskIds.length > 0
  const progress = [
    formData.name.trim() && formData.purpose.trim(),
    formData.auditorId,
    formData.riskIds.length > 0,
  ].filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const id = generateScheduleId('risk')
    const now = new Date().toISOString()

    const auditor = USERS.find(u => u.id === formData.auditorId)
    const owner = USERS.find(u => u.id !== formData.auditorId) ?? USERS[0]
    const requester = USERS.find(u => u.id === formData.requestedById) ?? USERS[0]
    const approver = USERS.find(u => u.id === formData.approvedById) ?? USERS[0]
    const creator = USERS[0]

    const scopeNames = formData.riskIds
      .slice(0, 3)
      .map(id => RISK_ITEMS.find(r => r.id === id)?.title ?? id)
      .join(', ')
    const scopeDescription = `${formData.riskIds.length} risks${formData.projectIds.length > 0 ? ` across ${formData.projectIds.length} project(s)` : ''}. ${scopeNames}${formData.riskIds.length > 3 ? '…' : ''}`

    const trail: TrailEntry[] = [
      {
        id: `${id}-T1`, action: 'Created',
        actor: creator.name, actorInitials: creator.initials, actorRole: creator.role, ts: now,
        detail: 'Schedule created via Risk Audit Schedule form.',
      },
      ...(formData.requestedById ? [{
        id: `${id}-T2`, action: 'Requested by' as const,
        actor: requester.name, actorInitials: requester.initials, actorRole: requester.role, ts: now,
        detail: 'Risk audit requirement raised and schedule requested.',
      }] : []),
      ...(formData.approvedById ? [{
        id: `${id}-T3`, action: 'Approved by' as const,
        actor: approver.name, actorInitials: approver.initials, actorRole: approver.role, ts: now,
        detail: 'Schedule reviewed and approved.',
      }] : []),
    ]

    const newSchedule: RichAuditSchedule = {
      id,
      name: formData.name,
      type: 'risk',
      scopeProjects: formData.projectIds,
      scopeItemIds: formData.riskIds,
      frequency: formData.frequency,
      startDate: formData.startDate,
      time: formData.time,
      timezone: 'UTC',
      assignedAuditorId: formData.auditorId,
      assignedAuditorName: auditor?.name ?? 'Unknown',
      accountableOwnerId: owner.id,
      accountableOwnerName: owner.name,
      reminderLeadDays: 3,
      graceDays: 2,
      status: 'Active',
      nextRun: formData.startDate,
      lastRun: null,
      createdById: creator.id,
      createdByName: creator.name,
      createdByRole: creator.role,
      requestedById: requester.id,
      requestedByName: requester.name,
      requestedByRole: requester.role,
      approvedById: approver.id,
      approvedByName: approver.name,
      approvedByRole: approver.role,
      purpose: formData.purpose || formData.notes || '',
      sourceModule: 'Risk Register — Risk Audit',
      regulatoryRef: '',
      createdAt: now,
      updatedAt: now,
      scopeDescription,
      lifecycle: 'Scheduled',
      trail,
      comments: formData.notes ? [{
        id: `${id}-C1`,
        author: creator.name,
        authorInitials: creator.initials,
        authorRole: creator.role,
        ts: now,
        text: formData.notes,
      }] : [],
    }

    saveNewSchedule(newSchedule)
    toast.success('Risk audit schedule created', {
      description: `${newSchedule.name} (${newSchedule.id}) is now active — visible in the Audit Intelligence Hub.`,
    })
    router.push('/audit-hub')
  }

  const labelClass = 'block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5'
  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-line bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all'

  return (
    <AppShell>
      <div className="min-h-screen bg-background">

        {/* ── Page Header ── */}
        <div className="border-b border-line bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer" onClick={() => router.push('/audit-hub')}>
                Audit Hub
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hover:text-foreground cursor-pointer" onClick={() => router.push('/risk-audit')}>
                Risk Audit
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-foreground">New Audit Schedule</span>
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="flex h-[calc(100vh-57px)]">

          {/* ── LEFT PANEL ── */}
          <div className="w-80 shrink-0 border-r border-line bg-card flex flex-col gap-5 px-5 py-6 overflow-y-auto">

            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease }}
              className="rounded-xl border border-line bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-4.5 h-4.5 text-gold" />
                </div>
                <div>
                  <span className="inline-block text-[9.5px] font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/15 rounded px-1.5 py-0.5 mb-1.5">
                    New Schedule
                  </span>
                  <p className="text-[13px] font-bold text-foreground leading-snug">Schedule Risk Audit</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Create a recurring audit schedule for risks across projects and programs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Scope stats */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04, ease }}
              className="rounded-xl border border-line bg-background p-4 space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Scope
              </p>
              {[
                { label: 'Available Risks',    value: RISK_ITEMS.length },
                { label: 'Selected Risks',     value: formData.riskIds.length },
                { label: 'Available Auditors', value: USERS.filter(u => u.role === 'Auditor' || u.role === 'Portfolio Director').length },
                { label: 'Available Projects', value: PROJECTS.length },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[11.5px] text-muted-foreground">{row.label}</span>
                  <span className={cn(
                    'text-[12px] font-bold font-mono',
                    row.label === 'Selected Risks' && formData.riskIds.length > 0 ? 'text-gold' : 'text-foreground'
                  )}>{row.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Workflow steps */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08, ease }}
              className="rounded-xl border border-line bg-background p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">
                Steps
              </p>
              <ol className="space-y-2.5">
                {WORKFLOW_STEPS.map((step, i) => {
                  const done = i === 0
                    ? !!(formData.name.trim() && formData.auditorId)
                    : i === 1
                    ? formData.riskIds.length > 0
                    : !!(formData.startDate && formData.time)
                  return (
                    <li key={step.label} className="flex items-center gap-2.5">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                        done ? 'bg-gold text-white' : 'bg-secondary text-muted-foreground border border-line'
                      )}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={cn('text-[12px]', done ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                        {step.label}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </motion.div>

            {/* Audit trail note */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.12, ease }}
              className="rounded-xl border border-line bg-background p-3.5 flex gap-2.5"
            >
              <ClipboardList className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This schedule is logged to the immutable audit trail with timestamp, actor, and all field values.
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: FORM ── */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.06 }}
              className="w-full space-y-5"
            >
              {/* Form header with progress */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h1 className="text-[18px] font-bold text-foreground">Audit Details</h1>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">Complete all required fields to create the schedule</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full bg-gold rounded-full"
                      animate={{ width: `${(progress / 3) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{progress}/3</span>
                </div>
              </div>

              {/* ── AUDIT DETAILS section ── */}
              <div className="bg-card rounded-xl border border-line overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary/30">
                  <CalendarClock className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">Audit Details</span>
                </div>
                <div className="p-4 space-y-4">

                  {/* Audit Name */}
                  <div>
                    <label className={labelClass}>
                      Audit Name <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Q3 Portfolio Risk Review"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className={labelClass}>Purpose / Why this audit exists <span className="text-gold">*</span></label>
                    <textarea
                      placeholder="Describe why this audit is required — regulatory driver, risk mitigated, or business objective..."
                      value={formData.purpose}
                      onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))}
                      rows={3}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  {/* Requested by + Approved by */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Requested by</label>
                      <select
                        value={formData.requestedById}
                        onChange={e => setFormData(p => ({ ...p, requestedById: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select person...</option>
                        {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Approved by</label>
                      <select
                        value={formData.approvedById}
                        onChange={e => setFormData(p => ({ ...p, approvedById: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select approver...</option>
                        {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Frequency + Auditor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Frequency</label>
                      <select
                        value={formData.frequency}
                        onChange={e => setFormData(p => ({ ...p, frequency: e.target.value as Frequency }))}
                        className={inputClass}
                      >
                        {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Assigned Auditor <span className="text-gold">*</span>
                      </label>
                      <select
                        value={formData.auditorId}
                        onChange={e => setFormData(p => ({ ...p, auditorId: e.target.value }))}
                        className={inputClass}
                        required
                      >
                        <option value="">Select auditor...</option>
                        {USERS.filter(u => u.role === 'Auditor' || u.role === 'Portfolio Director').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Start Date + Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        <Calendar className="inline w-3 h-3 mr-1" />Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <ClipboardList className="inline w-3 h-3 mr-1" />Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── AUDIT SCOPE section ── */}
              <div className="bg-card rounded-xl border border-line overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary/30">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">
                    Audit Scope <span className="text-gold normal-case font-medium">*</span>
                  </span>
                </div>
                <div className="p-4 space-y-4">

                  {/* Select Risks */}
                  <div>
                    <label className={labelClass}>Select Risks to Audit</label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                      {RISK_ITEMS.map(risk => {
                        const checked = formData.riskIds.includes(risk.id)
                        return (
                          <label
                            key={risk.id}
                            className={cn(
                              'flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors text-left',
                              checked ? 'bg-gold/15 border border-gold/30' : 'hover:bg-secondary/60'
                            )}
                          >
                            <div className={cn(
                              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                              checked ? 'bg-gold border-gold' : 'border-line bg-background'
                            )}>
                              {checked && <span className="text-white text-[8px] font-bold leading-none">✓</span>}
                            </div>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={e => setFormData(p => ({
                                ...p,
                                riskIds: e.target.checked
                                  ? [...p.riskIds, risk.id]
                                  : p.riskIds.filter(id => id !== risk.id),
                              }))}
                            />
                            <div className="min-w-0">
                              <p className="text-[11.5px] font-medium text-foreground leading-snug line-clamp-2">{risk.title}</p>
                              <p className="text-[10px] text-gold font-mono mt-0.5">{risk.id}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    {formData.riskIds.length > 0 && (
                      <p className="text-[11px] text-gold font-medium mt-1.5">
                        {formData.riskIds.length} risk{formData.riskIds.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {/* Select Projects */}
                  <div>
                    <label className={labelClass}>
                      <Users className="inline w-3 h-3 mr-1" />Select Projects
                      <span className="normal-case font-normal text-muted-foreground ml-1">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                      {PROJECTS.map(proj => {
                        const checked = formData.projectIds.includes(proj.id)
                        return (
                          <label
                            key={proj.id}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                              checked ? 'bg-gold/15 border border-gold/30' : 'hover:bg-secondary/60'
                            )}
                          >
                            <div className={cn(
                              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                              checked ? 'bg-gold border-gold' : 'border-line bg-background'
                            )}>
                              {checked && <span className="text-white text-[8px] font-bold leading-none">✓</span>}
                            </div>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={e => setFormData(p => ({
                                ...p,
                                projectIds: e.target.checked
                                  ? [...p.projectIds, proj.id]
                                  : p.projectIds.filter(id => id !== proj.id),
                              }))}
                            />
                            <span className="text-[11.5px] font-medium text-foreground truncate">{proj.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── NOTES section ── */}
              <div className="bg-card rounded-xl border border-line overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary/30">
                  <ClipboardList className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">Notes</span>
                  <span className="text-[10px] text-muted-foreground font-normal ml-1">(Optional)</span>
                </div>
                <div className="p-4">
                  <textarea
                    placeholder="Add any special instructions or context for this audit..."
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    className={cn(inputClass, 'resize-none')}
                  />
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-6 border-t border-line">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-5 h-9 text-sm border-line hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className={cn(
                    'px-6 h-9 text-sm font-semibold transition-all',
                    isValid
                      ? 'bg-gold hover:bg-gold/90 text-white'
                      : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" />Create Schedule</>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

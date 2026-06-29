'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft, CalendarClock, Loader2, Save,
  Shield, Users, Calendar, Clock, ClipboardList, ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  PROJECTS, USERS, CONTROLS, type Frequency,
} from '@/lib/governance-data'
import {
  saveNewSchedule, generateScheduleId,
  type RichAuditSchedule, type TrailEntry,
} from '@/lib/audit-store'

const FREQUENCIES: Frequency[] = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']

const WORKFLOW_STEPS = [
  { label: 'Audit details', icon: ClipboardList },
  { label: 'Scope & controls', icon: Shield },
  { label: 'Assign & schedule', icon: Calendar },
]

export default function ControlsAuditSchedulePage() {
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
    controlIds: [] as string[],
    notes: '',
  })

  const isValid = formData.name.trim() && formData.auditorId && formData.controlIds.length > 0
  const progress = [
    formData.name.trim() && formData.purpose.trim(),
    formData.auditorId,
    formData.controlIds.length > 0,
  ].filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const id = generateScheduleId('controls')
    const now = new Date().toISOString()

    const auditor = USERS.find(u => u.id === formData.auditorId)
    const owner = USERS.find(u => u.id !== formData.auditorId) ?? USERS[0]
    const requester = USERS.find(u => u.id === formData.requestedById) ?? USERS[0]
    const approver = USERS.find(u => u.id === formData.approvedById) ?? USERS[0]
    const creator = USERS[0] // Brian Smith — current session user

    const scopeNames = formData.controlIds
      .slice(0, 3)
      .map(id => CONTROLS.find(c => c.id === id)?.name ?? id)
      .join(', ')
    const scopeDescription = `${formData.controlIds.length} controls${formData.projectIds.length > 0 ? ` across ${formData.projectIds.length} project(s)` : ''}. ${scopeNames}${formData.controlIds.length > 3 ? '…' : ''}`

    const trail: TrailEntry[] = [
      {
        id: `${id}-T1`, action: 'Created',
        actor: creator.name, actorInitials: creator.initials, actorRole: creator.role, ts: now,
        detail: 'Schedule created via Controls Audit Schedule form.',
      },
      ...(formData.requestedById ? [{
        id: `${id}-T2`, action: 'Requested by' as const,
        actor: requester.name, actorInitials: requester.initials, actorRole: requester.role, ts: now,
        detail: 'Audit requirement raised and schedule requested.',
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
      type: 'controls',
      scopeProjects: formData.projectIds,
      scopeItemIds: formData.controlIds,
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
      sourceModule: 'Controls Library — Controls Audit',
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
    toast.success('Audit schedule created', {
      description: `${newSchedule.name} (${newSchedule.id}) is now active — visible in the Audit Intelligence Hub.`,
    })
    router.push('/audit-hub')
  }

  const labelClass = 'block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5'
  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-line bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all'

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
              <span className="hover:text-foreground cursor-pointer" onClick={() => router.push('/controls-audit')}>
                Controls Audit
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">New Audit Schedule</span>
            </div>
          </div>
        </div>

        {/* ── Body: left panel + form ── */}
        <div className="flex h-[calc(100vh-57px)]">

          {/* ── LEFT PANEL ── */}
          <div className="w-80 shrink-0 border-r border-line bg-card flex flex-col gap-5 px-5 py-6 overflow-y-auto">

            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-line bg-gold/5 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shrink-0">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-gold text-white mb-2">
                    New Schedule
                  </span>
                  <h2 className="text-sm font-bold text-foreground leading-tight">
                    Schedule Control Audit
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Create a recurring audit schedule for controls across projects and programs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Context stats */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="rounded-xl border border-line bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-secondary/60">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">Scope</p>
              </div>
              <dl className="divide-y divide-line">
                {[
                  { label: 'Available Controls', value: CONTROLS.length },
                  { label: 'Selected Controls', value: formData.controlIds.length },
                  { label: 'Available Auditors', value: USERS.filter(u => u.role === 'Auditor' || u.role === 'Portfolio Controls Lead').length },
                  { label: 'Available Projects', value: PROJECTS.length },
                ].map(row => (
                  <div key={row.label} className="grid grid-cols-2 gap-x-4 px-4 py-2.5">
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className={cn(
                      'text-xs font-bold text-right',
                      row.label === 'Selected Controls' && row.value > 0 ? 'text-gold' : 'text-foreground',
                    )}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Workflow steps */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="rounded-xl border border-line bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-secondary/60">
                <ClipboardList className="w-3.5 h-3.5 text-gold" />
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">Steps</p>
              </div>
              <div className="p-3 space-y-2">
                {WORKFLOW_STEPS.map((step, i) => {
                  const done = i < progress
                  const Icon = step.icon
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all',
                        done ? 'bg-gold border-gold' : 'bg-muted border-line',
                      )}>
                        <Icon className={cn('w-2.5 h-2.5', done ? 'text-white' : 'text-muted-foreground')} />
                      </div>
                      <span className={cn(
                        'text-xs font-medium',
                        done ? 'text-foreground' : 'text-muted-foreground',
                      )}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Audit trail note */}
            <div className="rounded-lg border border-line bg-secondary/40 px-3 py-2.5 flex gap-2">
              <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This schedule is logged to the immutable audit trail with timestamp, actor, and all field values.
              </p>
            </div>
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

              {/* Progress + section title */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-base font-bold text-foreground">Audit Details</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete all required fields to create the schedule</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-24 h-1.5 rounded-full bg-line overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress / 3) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gold">{progress}/3</span>
                </div>
              </div>

              {/* ── Section 1: Audit Details ── */}
              <div className="bg-card border border-line rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-line bg-secondary/50">
                  <ClipboardList className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">Audit Details</span>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className={labelClass}>Audit Name <span className="text-red normal-case tracking-normal font-normal">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g., Q3 Approval Authority Controls"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Purpose / Why this audit exists <span className="text-red normal-case tracking-normal font-normal">*</span></label>
                    <textarea
                      placeholder="Describe why this audit is required — regulatory driver, risk mitigated, or business objective..."
                      value={formData.purpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                      rows={3}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Requested by</label>
                      <select
                        value={formData.requestedById}
                        onChange={(e) => setFormData(prev => ({ ...prev, requestedById: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, approvedById: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select approver...</option>
                        {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Frequency</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as Frequency }))}
                        className={inputClass}
                      >
                        {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Assigned Auditor <span className="text-red normal-case tracking-normal font-normal">*</span></label>
                      <select
                        value={formData.auditorId}
                        onChange={(e) => setFormData(prev => ({ ...prev, auditorId: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select auditor...</option>
                        {USERS.filter(u => u.role === 'Auditor' || u.role === 'Portfolio Controls Lead').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <Clock className="inline w-3 h-3 mr-1" />
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Controls Selection ── */}
              <div className="bg-card border border-line rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">Audit Scope</span>
                    <span className="text-red text-[11px]">*</span>
                  </div>
                  {formData.controlIds.length > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                      {formData.controlIds.length} selected
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className={labelClass}>Select Controls to Audit</label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                      {CONTROLS.map(control => {
                        const checked = formData.controlIds.includes(control.id)
                        return (
                          <label
                            key={control.id}
                            className={cn(
                              'flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all text-left',
                              checked
                                ? 'bg-gold/8 border border-gold/25'
                                : 'hover:bg-secondary/60 border border-transparent',
                            )}
                          >
                            <div className={cn(
                              'mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all',
                              checked ? 'bg-gold border-gold' : 'bg-background border-line',
                            )}>
                              {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>}
                            </div>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                controlIds: e.target.checked
                                  ? [...prev.controlIds, control.id]
                                  : prev.controlIds.filter(id => id !== control.id),
                              }))}
                              className="sr-only"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{control.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{control.id}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <label className={labelClass}>
                      <Users className="inline w-3 h-3 mr-1" />
                      Select Projects <span className="normal-case tracking-normal font-normal text-muted-foreground">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                      {PROJECTS.map(project => {
                        const checked = formData.projectIds.includes(project.id)
                        return (
                          <label
                            key={project.id}
                            className={cn(
                              'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all',
                              checked
                                ? 'bg-gold/8 border border-gold/25'
                                : 'hover:bg-secondary/60 border border-transparent',
                            )}
                          >
                            <div className={cn(
                              'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all',
                              checked ? 'bg-gold border-gold' : 'bg-background border-line',
                            )}>
                              {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>}
                            </div>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                projectIds: e.target.checked
                                  ? [...prev.projectIds, project.id]
                                  : prev.projectIds.filter(id => id !== project.id),
                              }))}
                              className="sr-only"
                            />
                            <span className="text-xs font-medium text-foreground truncate">{project.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Notes ── */}
              <div className="bg-card border border-line rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-line bg-secondary/50">
                  <ClipboardList className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">Notes</span>
                  <span className="text-[10px] text-muted-foreground">(Optional)</span>
                </div>
                <div className="p-5">
                  <textarea
                    placeholder="Add any special instructions or context for this audit..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className={cn(inputClass, 'resize-none')}
                  />
                </div>
              </div>

              {/* ── Footer Actions ── */}
              <div className="flex items-center justify-between gap-4 pt-2 pb-8 border-t border-line">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-5 text-sm border-line"
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  {!isValid && (
                    <p className="text-[11px] text-muted-foreground">
                      Complete required fields to continue
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="px-6 text-sm bg-gold hover:bg-gold/90 text-white font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Schedule
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

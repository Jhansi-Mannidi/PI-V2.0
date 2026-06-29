'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Scale, ChevronRight, Loader2, CalendarDays, Users, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  PROJECTS, USERS, COMPLIANCE_ITEMS, type Frequency, type AuditSchedule,
} from '@/lib/governance-data'

const FREQUENCIES: Frequency[] = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']
const LS_KEY = 'compliance_audit_schedules_user'
const ease = [0.25, 0.1, 0.25, 1]

function loadUserSchedules(): AuditSchedule[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] }
}

function saveUserSchedule(s: AuditSchedule) {
  const existing = loadUserSchedules()
  localStorage.setItem(LS_KEY, JSON.stringify([...existing, s]))
}

export default function ComplianceAuditSchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    frequency: 'Quarterly' as Frequency,
    auditorId: '',
    startDate: new Date().toISOString().slice(0, 10),
    time: '09:00',
    projectIds: [] as string[],
    complianceIds: [] as string[],
  })

  // live progress for the left panel step tracker
  const filled = [
    !!formData.name,
    !!formData.auditorId,
    formData.complianceIds.length > 0,
  ]
  const completedCount = filled.filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const existing = loadUserSchedules()
    const nextIndex = 206 + existing.length
    const id = `AS-${nextIndex}`

    const auditor = USERS.find(u => u.id === formData.auditorId)
    const owner = USERS.find(u => u.id !== formData.auditorId) ?? USERS[0]

    const newSchedule: AuditSchedule = {
      id,
      name: formData.name,
      type: 'compliance',
      scopeProjects: formData.projectIds,
      scopeItemIds: formData.complianceIds,
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
    }

    saveUserSchedule(newSchedule)
    toast.success('Compliance audit schedule created', {
      description: `${newSchedule.name} (${newSchedule.id}) is now active and will run ${newSchedule.frequency.toLowerCase()}.`,
    })
    router.push('/compliance-audit')
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-line bg-background text-foreground text-[12.5px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all'
  const selectCls = inputCls

  const steps = [
    { label: 'Audit details', icon: CalendarDays, done: filled[0] },
    { label: 'Scope & obligations', icon: Scale, done: filled[2] },
    { label: 'Assign & schedule', icon: Users, done: filled[1] },
  ]

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-background">

        {/* ── BREADCRUMB HEADER ── */}
        <div className="flex items-center gap-2 px-6 py-3.5 border-b border-line bg-card text-[12px] text-muted-foreground shrink-0">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Controls Audit
          </button>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-foreground font-medium">New Audit Schedule</span>
        </div>

        {/* ── TWO-COLUMN BODY ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT PANEL ── */}
          <div className="w-80 shrink-0 border-r border-line bg-card flex flex-col gap-5 px-5 py-6 overflow-y-auto">

            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease }}
              className="rounded-xl border border-gold/30 bg-gold/5 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                  <Scale className="w-4.5 h-4.5 text-gold" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold bg-gold/15 border border-gold/25 px-2 py-0.5 rounded-full">New Schedule</span>
                </div>
              </div>
              <p className="text-[13px] font-bold text-foreground leading-snug">Schedule Compliance Audit</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Create a recurring compliance audit schedule for regulatory and contractual obligations across projects.
              </p>
            </motion.div>

            {/* Scope stats */}
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05, ease }}
              className="rounded-xl border border-line bg-background p-4 space-y-2.5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Scope
              </p>
              {[
                { label: 'Available Requirements', value: COMPLIANCE_ITEMS.length },
                { label: 'Selected Requirements', value: formData.complianceIds.length, highlight: formData.complianceIds.length > 0 },
                { label: 'Available Auditors', value: USERS.filter(u => u.role === 'Auditor' || u.role === 'Legal').length },
                { label: 'Available Projects', value: PROJECTS.length },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                  <span className={cn('text-[12px] font-bold font-mono', stat.highlight ? 'text-gold' : 'text-foreground')}>{stat.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Step tracker */}
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1, ease }}
              className="rounded-xl border border-line bg-background p-4 space-y-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Steps
              </p>
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    step.done ? 'border-gold bg-gold/15' : 'border-line bg-background'
                  )}>
                    {step.done
                      ? <div className="w-2 h-2 rounded-full bg-gold" />
                      : <span className="text-[9px] text-muted-foreground font-bold">{i + 1}</span>
                    }
                  </div>
                  <span className={cn('text-[12px] transition-colors', step.done ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                    {step.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Audit trail note */}
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15, ease }}
              className="rounded-xl border border-line bg-background p-3.5 flex items-start gap-2.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10.5px] text-muted-foreground leading-relaxed">
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
              {/* Form header */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h1 className="text-[18px] font-bold text-foreground leading-snug">Audit Details</h1>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">Complete all required fields to create the schedule</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${(completedCount / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">{completedCount}/3</span>
                </div>
              </div>

              {/* ── AUDIT DETAILS SECTION ── */}
              <div className="bg-card rounded-xl border border-line shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-line flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Audit Details</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Audit Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      Audit Name <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Q3 Approval Authority Controls"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* Frequency + Auditor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> Frequency
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={e => setFormData(p => ({ ...p, frequency: e.target.value as Frequency }))}
                        className={selectCls}
                      >
                        {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> Assigned Auditor <span className="text-gold">*</span>
                      </label>
                      <select
                        value={formData.auditorId}
                        onChange={e => setFormData(p => ({ ...p, auditorId: e.target.value }))}
                        className={selectCls}
                      >
                        <option value="">Select auditor...</option>
                        {USERS.filter(u => u.role === 'Auditor' || u.role === 'Legal').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Start Date + Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── AUDIT SCOPE SECTION ── */}
              <div className="bg-card rounded-xl border border-line shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-line flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Audit Scope</span>
                  <span className="text-gold">*</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Compliance requirements */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Select Compliance Requirements
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                      {COMPLIANCE_ITEMS.map(item => {
                        const checked = formData.complianceIds.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFormData(p => ({
                              ...p,
                              complianceIds: checked
                                ? p.complianceIds.filter(id => id !== item.id)
                                : [...p.complianceIds, item.id]
                            }))}
                            className={cn(
                              'flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all',
                              checked
                                ? 'border-gold/40 bg-gold/8 shadow-sm'
                                : 'border-transparent bg-background hover:border-line'
                            )}
                          >
                            <div className={cn(
                              'w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                              checked ? 'border-gold bg-gold' : 'border-line bg-background'
                            )}>
                              {checked && <div className="w-1.5 h-1.5 rounded-sm bg-background" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-foreground leading-snug line-clamp-2">{item.requirement}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{item.id} · {item.framework}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {formData.complianceIds.length > 0 && (
                      <p className="text-[11px] text-gold font-medium">
                        {formData.complianceIds.length} requirement{formData.complianceIds.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ASSIGN & SCHEDULE SECTION ── */}
              <div className="bg-card rounded-xl border border-line shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-line flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Select Projects</span>
                  <span className="text-[10px] text-muted-foreground">(Optional)</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto rounded-lg border border-line bg-secondary/20 p-2">
                    {PROJECTS.map(proj => {
                      const checked = formData.projectIds.includes(proj.id)
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => setFormData(p => ({
                            ...p,
                            projectIds: checked
                              ? p.projectIds.filter(id => id !== proj.id)
                              : [...p.projectIds, proj.id]
                          }))}
                          className={cn(
                            'flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all',
                            checked
                              ? 'border-gold/40 bg-gold/8 shadow-sm'
                              : 'border-transparent bg-background hover:border-line'
                          )}
                        >
                          <div className={cn(
                            'w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                            checked ? 'border-gold bg-gold' : 'border-line bg-background'
                          )}>
                            {checked && <div className="w-1.5 h-1.5 rounded-sm bg-background" />}
                          </div>
                          <span className="text-[11.5px] font-medium text-foreground">{proj.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── ACTIONS ── */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2 rounded-lg border border-line bg-background text-[12.5px] font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.auditorId || formData.complianceIds.length === 0}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2 rounded-lg text-[12.5px] font-semibold transition-all',
                    isLoading || !formData.name || !formData.auditorId || formData.complianceIds.length === 0
                      ? 'bg-gold/40 text-background cursor-not-allowed'
                      : 'bg-gold hover:bg-gold/90 text-background shadow-sm'
                  )}
                >
                  {isLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</>
                    : <><Scale className="w-3.5 h-3.5" /> Create Schedule</>
                  }
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

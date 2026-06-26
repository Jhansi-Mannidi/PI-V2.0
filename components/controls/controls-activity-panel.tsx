'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Activity, CheckCircle2, XCircle, AlertTriangle, Clock,
  User, ArrowUpRight, Play, Shield, ClipboardCheck,
  BarChart3, StickyNote, UserCog, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PagePanel } from '@/components/page-panel'
import { usePIPStore, CURRENT_USER } from '@/hooks/use-pip-store'
import { USERS } from '@/lib/governance-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const RESULT_META = {
  PASS: { icon: CheckCircle2, color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30', label: 'Pass' },
  PARTIAL: { icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30', label: 'Partial' },
  FAIL: { icon: XCircle, color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30', label: 'Fail' },
  NOT_TESTED: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-line', label: 'Not Tested' },
} as const

// Quick test runner — full-body PagePanel
function QuickTestRunner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, runControlTest } = usePIPStore()
  const controls = Object.values(state.controls)
  const [controlId, setControlId] = React.useState(controls[0]?.id ?? '')
  const [result, setResult] = React.useState<'PASS' | 'PARTIAL' | 'FAIL'>('PASS')
  const [score, setScore] = React.useState(85)
  const [notes, setNotes] = React.useState('')
  const [reviewerId, setReviewerId] = React.useState('')

  const selectedCtrl = state.controls[controlId]

  const RESULT_OPTS = [
    { value: 'PASS', label: 'Pass', icon: CheckCircle2, color: 'text-green', bg: 'bg-green/6', border: 'border-green/25' },
    { value: 'PARTIAL', label: 'Partial', icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber/6', border: 'border-amber/25' },
    { value: 'FAIL', label: 'Fail', icon: XCircle, color: 'text-red', bg: 'bg-red/6', border: 'border-red/25' },
  ] as const

  const selectedResult = RESULT_OPTS.find((r) => r.value === result)!

  const handle = () => {
    const ctrl = state.controls[controlId]
    if (!ctrl) return
    runControlTest({
      controlId,
      controlTitle: ctrl.name,
      testedById: CURRENT_USER.id,
      testedByName: CURRENT_USER.name,
      reviewedById: reviewerId || null,
      reviewedByName: reviewerId ? (USERS.find((u) => u.id === reviewerId)?.name ?? null) : null,
      result,
      score,
      notes,
      affectedRiskIds: ctrl.linkedRiskIds,
      affectedParties: [ctrl.ownerName ?? 'Unassigned', CURRENT_USER.name],
    })
    onClose()
  }

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <ClipboardCheck className="w-3.5 h-3.5 text-gold" />
        Result will be logged to the audit trail immediately.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="h-9 px-5 border-line text-[12px]" onClick={onClose}>Cancel</Button>
        <Button size="sm" className="h-9 px-6 bg-gold text-navy font-semibold gap-1.5 text-[12px]" onClick={handle}>
          <Zap className="w-3.5 h-3.5" />
          Record Test Run
        </Button>
      </div>
    </div>
  )

  return (
    <PagePanel
      open={open}
      onClose={onClose}
      title="Run Control Test"
      description="Record a manual or agent-assisted test run against a specific control. Results post to the audit trail."
      footer={footer}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-line">

        {/* LEFT — control + scoring ── */}
        <div className="px-6 py-6 space-y-6">

          {/* Control selector */}
          <div>
            <FieldLabel icon={ClipboardCheck}>Control being tested</FieldLabel>
            <select value={controlId} onChange={(e) => setControlId(e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all">
              {controls.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.name.slice(0, 55)}</option>)}
            </select>
          </div>

          {/* Selected control info */}
          {selectedCtrl && (
            <motion.div
              key={controlId}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-line bg-secondary/40 p-4 space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Control details</p>
              <p className="text-[13px] font-semibold text-foreground">{selectedCtrl.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Category</p>
                  <p className="text-[11px] text-foreground">{selectedCtrl.category}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Owner</p>
                  <p className="text-[11px] text-foreground">{selectedCtrl.ownerName ?? '—'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Result */}
          <div>
            <FieldLabel icon={selectedResult.icon}>Result</FieldLabel>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {RESULT_OPTS.map((opt) => {
                const on = result === opt.value
                return (
                  <button key={opt.value} onClick={() => setResult(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 py-3 rounded-xl border text-center transition-all',
                      on ? `${opt.bg} ${opt.border} scale-105 shadow-sm` : 'bg-secondary border-line hover:border-gold/40',
                    )}>
                    <opt.icon className={cn('w-4 h-4', on ? opt.color : 'text-muted-foreground')} />
                    <span className={cn('text-[11px] font-semibold', on ? opt.color : 'text-muted-foreground')}>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Score */}
          <div>
            <FieldLabel icon={BarChart3}>Score (0–100)</FieldLabel>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={0} max={100} value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="flex-1 h-2 accent-gold cursor-pointer" />
              <div className={cn(
                'w-14 text-center rounded-xl border py-1.5 text-[14px] font-bold',
                score >= 80 ? 'bg-green/8 border-green/25 text-green'
                : score >= 60 ? 'bg-amber/8 border-amber/25 text-amber'
                : 'bg-red/8 border-red/25 text-red',
              )}>
                {score}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — reviewer + notes ── */}
        <div className="px-6 py-6 space-y-6">

          {/* Tester */}
          <div>
            <FieldLabel icon={User}>Tested by</FieldLabel>
            <div className="mt-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-line bg-secondary/40">
              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-gold">{CURRENT_USER.name.split(' ').map((n) => n[0]).join('')}</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-foreground">{CURRENT_USER.name}</p>
                <p className="text-[10px] text-muted-foreground">{CURRENT_USER.role}</p>
              </div>
            </div>
          </div>

          {/* Reviewer */}
          <div>
            <FieldLabel icon={UserCog}>Reviewer <span className="text-muted-foreground font-normal normal-case text-[10px]">(optional)</span></FieldLabel>
            <select value={reviewerId} onChange={(e) => setReviewerId(e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all">
              <option value="">— None —</option>
              {USERS.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="flex-1">
            <FieldLabel icon={StickyNote}>Notes & findings</FieldLabel>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6}
              placeholder="Describe test findings, observations, evidence reviewed, and any exceptions noted…"
              className="w-full mt-2 px-3.5 py-2.5 text-[12px] border border-line rounded-xl bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all resize-none leading-relaxed" />
          </div>

          {/* Live score preview */}
          <motion.div
            key={`${result}-${score}`}
            initial={{ opacity: 0.6, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'rounded-2xl border p-4 flex items-center justify-between',
              selectedResult.bg, selectedResult.border,
            )}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Outcome preview</p>
              <p className={cn('text-[16px] font-bold mt-0.5', selectedResult.color)}>{selectedResult.label}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Score</p>
              <p className={cn('text-[22px] font-bold', selectedResult.color)}>{score}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </PagePanel>
  )
}

/* ── Shared label helper ── */
function FieldLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
      <Icon className="w-3 h-3" />
      {children}
    </label>
  )
}

export function ControlsActivityPanel() {
  const { state, recentActivity } = usePIPStore()
  const [showRunner, setShowRunner] = React.useState(false)

  const controlActivity = recentActivity.filter(
    (a) => a.kind === 'CONTROL_TESTED' || a.kind === 'CONTROL_UPDATED' || a.kind === 'CONTROL_OWNER_CHANGED'
  )

  const testRuns = state.controlTestRuns.slice(0, 8)

  return (
    <>
      <div className="bg-card rounded-2xl border border-line p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Controls — Audit Trail
          </p>
          <Button size="sm" className="h-7 text-[11px] bg-gold text-navy gap-1" onClick={() => setShowRunner(true)}>
            <Play className="w-3 h-3" /> Run Test
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test run history */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Recent Test Runs</p>
            <div className="space-y-1.5">
              {testRuns.length === 0 && (
                <p className="text-[11px] text-muted-foreground py-3 text-center">No test runs recorded yet.</p>
              )}
              {testRuns.map((run, i) => {
                const m = RESULT_META[run.result]
                const timeAgo = Math.round((Date.now() - run.runAt) / 60000)
                const label = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`
                return (
                  <motion.div key={run.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.04 }}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-lg border border-line bg-secondary/40"
                  >
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border', m.bg, m.border)}>
                      <m.icon className={cn('w-3.5 h-3.5', m.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[11px] font-semibold text-foreground line-clamp-1">{run.controlTitle}</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">{label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-[9px] font-semibold', m.color)}>{m.label}</span>
                        <span className="text-[9px] text-muted-foreground">Score {run.score}</span>
                        <span className="text-[9px] text-muted-foreground">by {run.testedByName}</span>
                      </div>
                      {run.reviewedByName && (
                        <p className="text-[9px] text-muted-foreground mt-0.5">Reviewed by {run.reviewedByName}</p>
                      )}
                      {run.notes && <p className="text-[9px] text-muted-foreground mt-0.5 italic line-clamp-1">{run.notes}</p>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Who did what */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Activity — Who, What, When</p>
            <div className="space-y-2">
              {controlActivity.length === 0 && (
                <p className="text-[11px] text-muted-foreground py-3 text-center">No control activity yet.</p>
              )}
              {controlActivity.slice(0, 6).map((act, i) => {
                const timeAgo = Math.round((Date.now() - act.at) / 60000)
                const label = timeAgo < 2 ? 'just now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`
                return (
                  <motion.div key={act.id} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.04 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal/20 border border-teal/35 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-teal">
                        {act.actorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-foreground">{act.actorName}</span>
                        <span className="text-[9px] text-muted-foreground">{label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{act.detail}</p>
                      {act.affectedParties?.filter(Boolean).length > 0 && (
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {act.affectedParties.filter(Boolean).slice(0, 2).map((p) => (
                            <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <QuickTestRunner open={showRunner} onClose={() => setShowRunner(false)} />
    </>
  )
}

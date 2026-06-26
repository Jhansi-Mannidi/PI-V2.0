'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Activity, CheckCircle2, XCircle, AlertTriangle, Clock,
  User, ArrowUpRight, Play, Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePIPStore, CURRENT_USER } from '@/hooks/use-pip-store'
import { USERS } from '@/lib/governance-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const RESULT_META = {
  PASS: { icon: CheckCircle2, color: 'text-green', bg: 'bg-green-bg', border: 'border-green/30', label: 'Pass' },
  PARTIAL: { icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber-bg', border: 'border-amber/30', label: 'Partial' },
  FAIL: { icon: XCircle, color: 'text-red', bg: 'bg-red-bg', border: 'border-red/30', label: 'Fail' },
  NOT_TESTED: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-line', label: 'Not Tested' },
} as const

// Quick test runner for a specific control
function QuickTestRunner({ onClose }: { onClose: () => void }) {
  const { state, runControlTest } = usePIPStore()
  const controls = Object.values(state.controls)
  const [controlId, setControlId] = React.useState(controls[0]?.id ?? '')
  const [result, setResult] = React.useState<'PASS' | 'PARTIAL' | 'FAIL'>('PASS')
  const [score, setScore] = React.useState(85)
  const [notes, setNotes] = React.useState('')
  const [reviewerId, setReviewerId] = React.useState('')

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-line rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Run Control Test</h3>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Control</label>
            <select value={controlId} onChange={(e) => setControlId(e.target.value)}
              className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60">
              {controls.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.name.slice(0, 50)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Result</label>
              <select value={result} onChange={(e) => setResult(e.target.value as typeof result)}
                className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60">
                <option value="PASS">Pass</option>
                <option value="PARTIAL">Partial</option>
                <option value="FAIL">Fail</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Score (0–100)</label>
              <input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))}
                className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Reviewer</label>
            <select value={reviewerId} onChange={(e) => setReviewerId(e.target.value)}
              className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60">
              <option value="">— None —</option>
              {USERS.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Describe findings or observations..."
              className="w-full text-xs border border-line rounded-lg px-3 py-2 bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-gold/60" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="flex-1 bg-gold text-navy" onClick={handle}>Record Test Run</Button>
        </div>
      </motion.div>
    </div>
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

      <AnimatePresence>
        {showRunner && <QuickTestRunner onClose={() => setShowRunner(false)} />}
      </AnimatePresence>
    </>
  )
}

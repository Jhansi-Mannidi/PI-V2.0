'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FileSearch, ChevronDown, ArrowRight, CircleCheck, CircleAlert, CircleX } from 'lucide-react'
import { AUDITS, BAND_META, type AuditStatus } from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const STATUS_STYLE: Record<AuditStatus, string> = {
  Scheduled: 'bg-secondary text-muted-foreground border-line',
  'In progress': 'bg-teal/10 text-teal border-teal/20',
  'Findings raised': 'bg-amber-bg text-amber border-amber/30',
  Remediating: 'bg-gold-pale text-gold border-gold/30',
  Closed: 'bg-green-bg text-green border-green/30',
}

// R-05 Audit Console — schedule, in-flight audits, findings ledger, finding→risk links (§7)
export function AuditConsole() {
  const [open, setOpen] = React.useState<string | null>(AUDITS[0]?.id ?? null)

  return (
    <div className="space-y-4">
      {/* Lifecycle legend */}
      <div className="bg-card rounded-xl border border-line p-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
            <FileSearch className="w-4.5 h-4.5 text-gold" />
          </div>
          <div>
            <h3 className="font-sans text-base font-semibold text-foreground">Audit Console</h3>
            <p className="text-[11px] text-muted-foreground">R-05 · Findings are risks with proof — every finding links to a scored risk inheriting its evidence</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap text-[10px] font-semibold">
          {['Template', 'Schedule', 'Execute', 'Findings', 'Link → Risk', 'Track'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className="px-2 py-1 rounded-md bg-secondary text-muted-foreground">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Audit instances */}
      <div className="space-y-2.5">
        {AUDITS.map((a, idx) => {
          const isOpen = open === a.id
          const cp = a.controlPoints
          const pct = cp.total > 0 ? Math.round(((cp.pass + cp.partial * 0.5) / cp.total) * 100) : 0
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04, ease }}
              className="bg-card rounded-xl border border-line overflow-hidden shadow-sm"
            >
              <button onClick={() => setOpen(isOpen ? null : a.id)} className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-secondary/30 transition-colors">
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 transition-transform', isOpen && 'rotate-180')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground">{a.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-secondary text-muted-foreground border border-line">{a.type}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-semibold border', STATUS_STYLE[a.status])}>{a.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate mt-0.5">{a.scope}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{a.project} · {a.program} · {a.auditorRole} · {a.cadence}</p>
                </div>
                {/* control point summary */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-0.5 text-green"><CircleCheck className="w-3 h-3" />{cp.pass}</span>
                    <span className="inline-flex items-center gap-0.5 text-amber"><CircleAlert className="w-3 h-3" />{cp.partial}</span>
                    <span className="inline-flex items-center gap-0.5 text-red"><CircleX className="w-3 h-3" />{cp.fail}</span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-mono font-bold text-foreground">{pct}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden mt-0.5">
                      <div className={cn('h-full rounded-full', pct >= 80 ? 'bg-green' : pct >= 50 ? 'bg-amber' : 'bg-red')} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                    <div className="px-5 pb-4 pt-1 border-t border-line">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-3 mb-2">
                        Findings ledger {a.findings.length > 0 && `(${a.findings.length})`}
                      </p>
                      {a.findings.length === 0 ? (
                        <p className="text-[12px] text-muted-foreground py-2">
                          {a.status === 'Scheduled' ? 'Audit scheduled — control points not yet worked.' : 'No findings — all control points passed.'}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {a.findings.map((f) => (
                            <div key={f.id} className="flex items-start gap-2.5 rounded-lg border border-line p-3 bg-secondary/20">
                              <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', BAND_META[f.severity].cell.split(' ')[0])} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-mono text-muted-foreground">{f.id}</span>
                                  <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold', BAND_META[f.severity].bg, BAND_META[f.severity].text)}>{f.severity}</span>
                                  {f.linkedRisk && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-teal/10 text-teal border border-teal/20 inline-flex items-center gap-1">
                                      links → {f.linkedRisk}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-foreground mt-1 leading-snug">{f.description}</p>
                                <p className="text-[11px] text-muted-foreground mt-1 leading-snug"><span className="font-semibold">Remediation:</span> {f.remediation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

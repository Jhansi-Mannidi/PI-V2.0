'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GitBranch, Clock, DollarSign } from 'lucide-react'
import { ISSUE_COLUMNS, ISSUES, type RiskState } from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const COL_ACCENT: Record<RiskState, string> = {
  Materialised: 'border-t-red',
  Mitigating: 'border-t-gold',
  Escalated: 'border-t-red',
  Resolved: 'border-t-green',
  Identified: 'border-t-line', Assessed: 'border-t-line', Accepted: 'border-t-line',
}

// R-04 Issue Board — materialised issues, corrective-action kanban by state
export function IssueBoard() {
  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-red-bg flex items-center justify-center">
          <GitBranch className="w-4.5 h-4.5 text-red" />
        </div>
        <div>
          <h3 className="font-sans text-base font-semibold text-foreground">Issue Board</h3>
          <p className="text-[11px] text-muted-foreground">R-04 · Materialised issues · corrective-action kanban</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[860px] grid grid-cols-4 gap-3 p-4">
          {ISSUE_COLUMNS.map((col) => {
            const cards = ISSUES.filter((i) => i.state === col.id)
            const total = cards.reduce((s, c) => s + c.impactCost, 0)
            return (
              <div key={col.id} className={cn('bg-secondary/30 rounded-xl border border-line border-t-2 overflow-hidden', COL_ACCENT[col.id])}>
                <div className="px-3 py-2.5 border-b border-line flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{col.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-red">${total.toFixed(1)}M</span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-card rounded-full px-1.5 py-0.5 border border-line">{cards.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {cards.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease }}
                      className="bg-card rounded-lg border border-line p-3 hover:border-gold/40 transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-mono text-muted-foreground">{c.id}</span>
                        {c.fromRisk && <span className="text-[9px] font-mono text-teal">← {c.fromRisk}</span>}
                      </div>
                      <p className="text-[12px] font-semibold text-foreground leading-snug">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{c.project} · {c.program}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug border-l-2 border-line pl-1.5">{c.correctiveAction}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-line">
                        <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1"><Clock className="w-3 h-3" />{c.age}</span>
                        <span className="text-[10px] font-mono text-red inline-flex items-center gap-0.5"><DollarSign className="w-3 h-3" />{c.impactCost.toFixed(1)}M · {c.impactDays}d</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/70 mt-1">{c.ownerRole}</p>
                    </motion.div>
                  ))}
                  {cards.length === 0 && <p className="text-[11px] text-muted-foreground/50 text-center py-6">No issues</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

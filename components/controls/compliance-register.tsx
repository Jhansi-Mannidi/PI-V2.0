'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, FileCheck2, Scale, ScrollText } from 'lucide-react'
import { GrowBar } from '@/components/animated-primitives'
import { POLICIES, CONTROLS, complianceBadge, resultBadge, type PolicySource } from '@/lib/controls-data'

const sourceLabel: Record<PolicySource, string> = {
  INTERNAL_STANDARD: 'Internal Standard',
  REGULATORY: 'Regulatory',
  CONTRACTUAL: 'Contractual',
  BEST_PRACTICE: 'Best Practice',
}

const sourceCls: Record<PolicySource, string> = {
  INTERNAL_STANDARD: 'bg-navy/10 text-navy border-navy/20',
  REGULATORY: 'bg-red-bg text-red border-red/30',
  CONTRACTUAL: 'bg-gold/15 text-gold border-gold/30',
  BEST_PRACTICE: 'bg-teal/10 text-teal border-teal/25',
}

export function ComplianceRegister() {
  const [expanded, setExpanded] = React.useState<string | null>('POL-03')

  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
          <Scale className="w-4 h-4 text-gold" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Policy & Compliance Register</h3>
          <p className="text-[11px] text-muted-foreground">Every obligation maps to controls that enforce it</p>
        </div>
      </div>

      <div className="divide-y divide-line">
        {POLICIES.map((pol) => {
          const cb = complianceBadge(pol.complianceState)
          const isOpen = expanded === pol.id
          const linked = CONTROLS.filter((c) => pol.controlIds.includes(c.id))
          return (
            <div key={pol.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : pol.id)}
                className={cn('w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-secondary/30 transition-colors', isOpen && 'bg-secondary/20')}
              >
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-muted-foreground">{pol.id}</span>
                    <span className={cn('px-1.5 py-0.5 rounded border text-[9px] font-semibold', sourceCls[pol.source])}>{sourceLabel[pol.source]}</span>
                  </div>
                  <p className="text-[13px] font-medium text-foreground mt-0.5 truncate">{pol.title}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <GrowBar widthPct={pol.compliancePct} className={cn('h-full rounded-full', pol.compliancePct >= 85 ? 'bg-green' : pol.compliancePct >= 60 ? 'bg-amber' : 'bg-red')} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-foreground w-9 text-right">{pol.compliancePct}%</span>
                </div>
                <span className={cn('shrink-0 px-2 py-1 rounded-md border text-[10px] font-semibold', cb.cls)}>{cb.label}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-1 bg-secondary/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-[11px]">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ScrollText className="w-3.5 h-3.5" /> Authority: <span className="text-foreground font-medium">{pol.authority}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileCheck2 className="w-3.5 h-3.5" /> Applies to: <span className="text-foreground font-medium">{pol.applicability}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Enforcing controls ({linked.length})
                      </p>
                      <div className="space-y-1.5">
                        {linked.map((c) => {
                          const rb = resultBadge(c.lastResult)
                          return (
                            <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-card border border-line">
                              <span className="text-[10px] font-mono text-muted-foreground shrink-0">{c.id}</span>
                              <span className="text-[12px] text-foreground flex-1 min-w-0 truncate">{c.title}</span>
                              <span className="text-[10px] text-muted-foreground hidden md:inline shrink-0">{c.lastTestedLabel}</span>
                              <span className={cn('shrink-0 px-1.5 py-0.5 rounded border text-[9px] font-bold', rb.cls)}>{rb.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

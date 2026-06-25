'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Activity, Bot, Play, ArrowUpRight, Cpu, ListChecks } from 'lucide-react'
import { PulseIndicator, GrowBar } from '@/components/animated-primitives'
import { Button } from '@/components/ui/button'
import {
  RECENT_VERDICTS, TEST_QUEUE, GENERATOR_MIX,
  resultBadge, generatorMeta, CONTROL_KPIS,
} from '@/lib/controls-data'
import { useToast } from '@/hooks/use-toast'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function AutoAuditConsole() {
  const { toast } = useToast()
  const [ticker, setTicker] = React.useState(CONTROL_KPIS.testsToday)

  // Simulated live test counter
  React.useEffect(() => {
    const t = setInterval(() => setTicker((v) => v + Math.floor(Math.random() * 3) + 1), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-4">
      {/* Console header banner */}
      <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-soft flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Auto-Audit Engine</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-bg border border-green/30 text-green text-[10px] font-semibold">
                  <PulseIndicator color="bg-green" size="w-1.5 h-1.5" /> LIVE
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Continuously generating & running control tests · A-305</p>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap items-center gap-6 lg:justify-center">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tests Today</p>
              <span className="text-2xl font-mono font-bold text-foreground tabular-nums">{ticker.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Precision</p>
              <span className="text-2xl font-mono font-bold text-green">{CONTROL_KPIS.autoAuditPrecision}%</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Queue Depth</p>
              <span className="text-2xl font-mono font-bold text-gold">{TEST_QUEUE.length}</span>
            </div>
          </div>

          <Button
            onClick={() => toast({ title: 'Audit sweep queued', description: `${TEST_QUEUE.length} high-priority controls scheduled for immediate re-test.` })}
            className="shrink-0 font-semibold h-9 text-xs gap-1.5 bg-gold text-navy border border-gold"
          >
            <Play className="w-3.5 h-3.5" />
            Run Priority Sweep
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* Live verdict stream */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-line overflow-hidden shadow-sm flex flex-col h-full">
          <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal" /> Live Verdict Stream
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">auto-refresh · 15s</span>
          </div>
          <div className="divide-y divide-line flex-1 min-h-[460px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {RECENT_VERDICTS.map((v, i) => {
                const rb = resultBadge(v.result)
                const gm = generatorMeta(v.generator)
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease }}
                    className="px-5 py-3.5 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold', rb.cls)}>
                          {rb.label}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-muted-foreground">{v.controlId}</span>
                          <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-semibold', gm.cls)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', gm.dot)} /> {gm.short}
                          </span>
                          {v.raisesRisk && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-bg text-red border border-red/30 text-[9px] font-semibold">
                              <ArrowUpRight className="w-2.5 h-2.5" /> Risk raised
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground ml-auto">{v.timeLabel}</span>
                        </div>
                        <p className="text-[12.5px] font-medium text-foreground mt-1 leading-snug">{v.controlTitle}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{v.evidence}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9.5px] uppercase tracking-wide text-muted-foreground">Confidence</span>
                          <div className="w-20 h-1 rounded-full bg-secondary overflow-hidden">
                            <GrowBar widthPct={v.confidence} className={cn('h-full rounded-full', v.confidence >= 90 ? 'bg-green' : v.confidence >= 75 ? 'bg-teal' : 'bg-amber')} />
                          </div>
                          <span className="text-[10px] font-mono font-semibold text-foreground">{v.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: generator mix + queue */}
        <div className="space-y-4">
          {/* Generator mix */}
          <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-gold" /> Test Generator Mix
            </h4>
            <div className="space-y-3.5">
              {GENERATOR_MIX.map((g, i) => {
                const gm = generatorMeta(g.generator)
                return (
                  <div key={g.generator}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                        <span className={cn('w-2 h-2 rounded-full', gm.dot)} /> {g.label}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-foreground">{g.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <GrowBar widthPct={g.pct} delay={i * 0.1} className={cn('h-full rounded-full', gm.dot)} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">Precision {g.precision}%</span>
                      <span className={cn(
                        'text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide',
                        g.mode === 'PRIMARY' ? 'bg-green-bg text-green' : 'bg-secondary text-muted-foreground'
                      )}>
                        {g.mode}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Test queue */}
          <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-teal" /> Test Queue
              <span className="text-[10px] font-normal text-muted-foreground ml-auto">by assurance gain</span>
            </h4>
            <div className="space-y-2">
              {TEST_QUEUE.map((q) => {
                const gm = generatorMeta(q.generator)
                return (
                  <div key={q.controlId} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                    <div className="w-9 text-center">
                      <span className={cn(
                        'text-[12px] font-mono font-bold',
                        q.priority >= 85 ? 'text-red' : q.priority >= 65 ? 'text-amber' : 'text-teal'
                      )}>{q.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground truncate">{q.controlTitle}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{q.reason}</p>
                    </div>
                    <span className={cn('shrink-0 px-1.5 py-0.5 rounded border text-[9px] font-semibold', gm.cls)}>{gm.short}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

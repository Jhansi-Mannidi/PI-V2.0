'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  AlertTriangle, DollarSign, Users, Clock, ArrowUpRight,
  ShieldCheck, BarChart3, Activity,
} from 'lucide-react'
import Link from 'next/link'
import { usePIPStore } from '@/hooks/use-pip-store'
import { computeScore, bandForScore, BAND_META } from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function LiveCommandPanel() {
  const { riskList, openBreaches, recentActivity, totalExposure, risksByState } = usePIPStore()

  const escalated = riskList.filter((r) => r.state === 'Escalated')
  const highCritical = riskList.filter((r) => {
    const b = bandForScore(computeScore(r.drivers))
    return b === 'High' || b === 'Critical'
  })
  const totalSchedule = riskList.reduce((s, r) => s + (r.impactDays ?? 0), 0)

  return (
    <div className="bg-card rounded-2xl border border-line p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live Portfolio Command</span>
        </div>
        <Link href="/risk" className="text-[11px] text-gold hover:underline flex items-center gap-1">
          View Risk Register <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { icon: DollarSign, label: 'Total Exposure', value: `$${totalExposure.toFixed(1)}M`, sub: 'unmitigated', tone: 'red', href: '/risk' },
          { icon: AlertTriangle, label: 'Escalated Risks', value: escalated.length, sub: 'need leadership', tone: 'red', href: '/risk' },
          { icon: BarChart3, label: 'High / Critical', value: highCritical.length, sub: 'score ≥ 70', tone: 'amber', href: '/risk' },
          { icon: Clock, label: 'SLA Breaches', value: openBreaches.length, sub: 'open breaches', tone: 'amber', href: '/sla' },
        ].map((k, i) => (
          <Link key={k.label} href={k.href}>
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: i * 0.05, ease }}
              className={cn(
                'rounded-xl border p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:border-gold/40',
                k.tone === 'red' ? 'bg-red-bg border-red/20' : 'bg-amber-bg border-amber/20'
              )}
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                k.tone === 'red' ? 'bg-red/20' : 'bg-amber/20'
              )}>
                <k.icon className={cn('w-4 h-4', k.tone === 'red' ? 'text-red' : 'text-amber')} />
              </div>
              <div>
                <p className={cn('text-xl font-mono font-bold', k.tone === 'red' ? 'text-red' : 'text-amber')}>{k.value}</p>
                <p className="text-[11px] font-semibold text-foreground">{k.label}</p>
                <p className="text-[10px] text-muted-foreground">{k.sub}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Two-column: escalated risks + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Escalated risks needing action */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-red" /> Escalated — Needs Your Action
          </p>
          <div className="space-y-1.5">
            {escalated.length === 0 && (
              <p className="text-[11px] text-muted-foreground py-3 text-center">No escalated risks.</p>
            )}
            {escalated.slice(0, 4).map((r, i) => {
              const score = computeScore(r.drivers)
              const meta = BAND_META[bandForScore(score)]
              return (
                <motion.div key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/50 border border-line hover:border-gold/40 transition-colors"
                >
                  <div className={cn('w-8 h-8 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono font-bold border text-[11px]', meta.bg, meta.ring, meta.text)}>
                    {score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground line-clamp-1">{r.title}</p>
                    <p className="text-[9px] text-muted-foreground">{r.program} · {r.ownerRole}</p>
                  </div>
                  <span className="text-[9px] text-red font-semibold shrink-0">${r.impactCost.toFixed(1)}M</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent activity feed */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> Recent Activity — Who Did What
          </p>
          <div className="space-y-2">
            {recentActivity.length === 0 && (
              <p className="text-[11px] text-muted-foreground py-3 text-center">No recent activity.</p>
            )}
            {recentActivity.slice(0, 5).map((act, i) => {
              const timeAgo = Math.round((Date.now() - act.at) / 60000)
              const label = timeAgo < 2 ? 'just now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo / 60)}h ago`
              return (
                <motion.div key={act.id} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-gold">
                      {act.actorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-foreground">{act.actorName}</span>
                      <span className="text-[9px] text-muted-foreground ml-auto shrink-0">{label}</span>
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
  )
}

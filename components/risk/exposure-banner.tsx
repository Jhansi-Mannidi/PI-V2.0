'use client'

import * as React from 'react'
import { TrendingUp, DollarSign, CalendarClock, ShieldAlert, Bot, FileSearch, ArrowUpRight } from 'lucide-react'
import {
  TOTAL_EXPOSURE_COST, TOTAL_EXPOSURE_DAYS, OPEN_RISK_COUNT,
  OPEN_ISSUE_COUNT, DISCOVERED_COUNT, OPEN_AUDIT_COUNT,
} from '@/lib/risk-data'
import { AnimNum } from '@/components/animated-primitives'

// §6.3 Aggregate exposure & the weekly triage banner
export function ExposureBanner() {
  const stats = [
    { label: 'Open Risks', value: OPEN_RISK_COUNT, icon: ShieldAlert, accent: 'text-red', bg: 'bg-red-bg', ring: 'hover:border-red/40' },
    { label: 'Live Issues', value: OPEN_ISSUE_COUNT, icon: TrendingUp, accent: 'text-amber', bg: 'bg-amber-bg', ring: 'hover:border-amber/40' },
    { label: 'AI-Discovered', value: DISCOVERED_COUNT, icon: Bot, accent: 'text-teal', bg: 'bg-teal-soft', ring: 'hover:border-teal/40' },
    { label: 'Open Audits', value: OPEN_AUDIT_COUNT, icon: FileSearch, accent: 'text-gold', bg: 'bg-gold-pale', ring: 'hover:border-gold/40' },
  ]

  return (
    <div className="relative bg-card rounded-xl border border-line shadow-sm overflow-hidden">
      {/* Accent rail */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red via-amber to-gold" />

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 p-4 pl-5">
        {/* Headline exposure */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red" />
            </span>
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              This week&apos;s predicted exposure
            </p>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <div className="flex items-baseline gap-1">
              <DollarSign className="w-4.5 h-4.5 text-red self-center" />
              <AnimNum value={TOTAL_EXPOSURE_COST.toFixed(1)} className="text-3xl sm:text-4xl font-mono font-bold text-foreground tabular-nums tracking-tight" />
              <span className="text-base font-mono font-semibold text-muted-foreground">M</span>
            </div>
            <span className="text-muted-foreground/40 text-xl font-light">/</span>
            <div className="flex items-baseline gap-1.5">
              <CalendarClock className="w-4.5 h-4.5 text-amber self-center" />
              <AnimNum value={TOTAL_EXPOSURE_DAYS} className="text-3xl sm:text-4xl font-mono font-bold text-foreground tabular-nums tracking-tight" />
              <span className="text-xs text-muted-foreground">schedule days</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed max-w-xl">
            Open, quantified exposure summed across the portfolio — rolls down to each program &amp; project via the materialized-path roll-up.
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-line shrink-0" />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0 lg:w-[390px]">
          {stats.map((s) => (
            <button
              key={s.label}
              className={`group flex flex-col gap-1.5 rounded-xl border border-line px-3 py-2.5 text-left transition-all hover:shadow-sm hover:-translate-y-0.5 ${s.bg} ${s.ring}`}
            >
              <div className="flex items-center justify-between">
                <s.icon className={`w-3.5 h-3.5 ${s.accent}`} />
                <ArrowUpRight className="w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors" />
              </div>
              <div>
                <p className={`text-xl font-mono font-bold leading-none ${s.accent}`}>
                  <AnimNum value={s.value} />
                </p>
                <p className="text-[9px] text-muted-foreground mt-1 whitespace-nowrap">{s.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

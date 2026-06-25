'use client'

import * as React from 'react'
import { ShieldCheck, Layers, Bot, AlertOctagon, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimNum, FadeUp, ProgressRing } from '@/components/animated-primitives'
import { CONTROL_KPIS } from '@/lib/controls-data'

interface Kpi {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  tone: 'gold' | 'green' | 'amber' | 'red' | 'teal'
  ring?: number
}

const toneMap: Record<Kpi['tone'], { text: string; bg: string; ring: string }> = {
  gold: { text: 'text-gold', bg: 'bg-gold/15', ring: 'stroke-gold' },
  green: { text: 'text-green', bg: 'bg-green-bg', ring: 'stroke-green' },
  amber: { text: 'text-amber', bg: 'bg-amber-bg', ring: 'stroke-amber' },
  red: { text: 'text-red', bg: 'bg-red-bg', ring: 'stroke-red' },
  teal: { text: 'text-teal', bg: 'bg-teal-soft', ring: 'stroke-teal' },
}

export function ControlsKpiStrip() {
  const k = CONTROL_KPIS
  const kpis: Kpi[] = [
    { label: 'Compliance Posture', value: `${k.compliancePosture}`, sub: 'criticality-weighted', icon: ShieldCheck, tone: 'amber', ring: k.compliancePosture },
    { label: 'Controls Covered', value: `${k.controlsCovered}%`, sub: `${k.totalControls} controls in scope`, icon: Layers, tone: 'teal', ring: k.controlsCovered },
    { label: 'Auto-Audit Precision', value: `${k.autoAuditPrecision}%`, sub: `${k.testsToday.toLocaleString()} tests today`, icon: Bot, tone: 'green', ring: k.autoAuditPrecision },
    { label: 'Open Control Gaps', value: `${k.openGaps}`, sub: 'unverified or stale', icon: AlertOctagon, tone: 'red' },
    { label: 'Gap Exposure', value: `$${k.gapExposure}M`, sub: 'blast radius at risk', icon: Gauge, tone: 'gold' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, i) => {
        const tone = toneMap[kpi.tone]
        return (
          <FadeUp key={kpi.label} delay={i * 0.05}>
            <div className="h-full bg-card rounded-xl border border-line p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', tone.bg)}>
                  <kpi.icon className={cn('w-4.5 h-4.5', tone.text)} />
                </div>
                {kpi.ring !== undefined && (
                  <div className="relative shrink-0">
                    <ProgressRing progress={kpi.ring} size={38} strokeWidth={3.5} color={tone.ring} />
                    <span className={cn('absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold', tone.text)}>
                      {kpi.ring}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className={cn('text-2xl font-mono font-bold leading-none', tone.text)}>
                  <AnimNum value={kpi.value} delay={i * 0.05} />
                </p>
                <p className="text-[12px] font-semibold text-foreground mt-1.5 leading-tight">{kpi.label}</p>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          </FadeUp>
        )
      })}
    </div>
  )
}

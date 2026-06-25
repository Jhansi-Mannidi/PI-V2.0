'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import { ShieldCheck, Download, Bell, LayoutGrid, Activity, Scale, AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PulseIndicator } from '@/components/animated-primitives'
import { ControlsKpiStrip } from '@/components/controls/controls-kpi-strip'
import { ControlHeatmap } from '@/components/controls/control-heatmap'
import { AutoAuditConsole } from '@/components/controls/auto-audit-console'
import { ComplianceRegister } from '@/components/controls/compliance-register'
import { ControlGapExplorer } from '@/components/controls/control-gap-explorer'
import { useToast } from '@/hooks/use-toast'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const tabs = [
  { id: 'posture', label: 'Posture', icon: LayoutGrid },
  { id: 'audit', label: 'Auto-Audit', icon: Activity },
  { id: 'compliance', label: 'Compliance', icon: Scale },
  { id: 'gaps', label: 'Control Gaps', icon: AlertOctagon },
] as const

type TabId = (typeof tabs)[number]['id']

export default function ControlsPage() {
  const { toast } = useToast()
  const [tab, setTab] = React.useState<TabId>('posture')

  return (
    <AppShell title="Controls & Auto-Audit" subtitle="Compliance posture, control health & continuous assurance" activeHref="/controls">
      <div className="space-y-4 sm:space-y-6 w-full">
        {/* ── Header ── */}
        <div className="bg-card rounded-xl border border-line p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5.5 h-5.5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold tracking-wide uppercase">
                    Controls · Compliance · Auto-Audit
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-bg border border-green/30 text-green text-[10px] font-semibold">
                    <PulseIndicator color="bg-green" size="w-1.5 h-1.5" /> Engine live
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1.5 leading-tight">
                  Are our controls actually working — everywhere, right now?
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  248 controls continuously generated, tested and scored across 4 programs · last sweep 2 min ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => toast({ title: 'Subscribed', description: 'You will be alerted on new critical control breaks.' })}
                className="h-9 text-xs gap-1.5 border-line hover:border-gold/40"
              >
                <Bell className="w-3.5 h-3.5" /> Alerts
              </Button>
              <Button
                onClick={() => toast({ title: 'Export started', description: 'Compliance posture pack is being prepared as PDF.' })}
                className="h-9 text-xs gap-1.5 bg-gold text-navy hover:bg-gold/90 border border-gold font-semibold"
              >
                <Download className="w-3.5 h-3.5" /> Export Pack
              </Button>
            </div>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <ControlsKpiStrip />

        {/* ── Tab Strip ── */}
        <div className="sticky top-0 z-10 -mx-1 px-1">
          <div className="flex items-center gap-1.5 p-1 bg-card border border-line rounded-xl overflow-x-auto shadow-sm">
            {tabs.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all',
                    active ? 'bg-gold text-navy shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className="space-y-4 sm:space-y-6"
        >
          {tab === 'posture' && (
            <>
              <ControlHeatmap />
              <ControlGapExplorer />
            </>
          )}
          {tab === 'audit' && <AutoAuditConsole />}
          {tab === 'compliance' && <ComplianceRegister />}
          {tab === 'gaps' && <ControlGapExplorer />}
        </motion.div>
      </div>
    </AppShell>
  )
}

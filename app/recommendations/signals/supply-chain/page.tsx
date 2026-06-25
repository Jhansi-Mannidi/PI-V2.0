'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  PackageSearch, ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Clock, DollarSign, ChevronRight, ExternalLink, Factory, Truck, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const commoditySignals = [
  {
    id: 'SC-001',
    commodity: 'Structural Steel',
    category: 'Materials',
    severity: 'red',
    currentLead: '11 weeks',
    previousLead: '8 weeks',
    change: '+37.5%',
    direction: 'up' as const,
    priceChange: '+8.2% YoY',
    source: 'Steel Service Center Institute Q2 Report',
    detail: 'Regional lead time has increased from 8 weeks to 11 weeks due to tariff uncertainty and mill maintenance shutdowns in the Southeast.',
    affectedProjects: ['Henderson Substation', 'Council Bluffs Phase 4'],
    cashflowRisk: '$1.2M forward exposure',
    recommendation: 'REC-2026-0590',
    lastUpdated: '1d ago',
  },
  {
    id: 'SC-002',
    commodity: 'Transformer Units (>5 MVA)',
    category: 'Equipment',
    severity: 'red',
    currentLead: '52-78 weeks',
    previousLead: '48-72 weeks',
    change: '+8%',
    direction: 'up' as const,
    priceChange: '+12.4% YoY',
    source: 'Allianz Commercial Construction Risk Report 2026; CBRE Supply Chain Outlook',
    detail: 'Global transformer shortage continues. Lead times for units >5 MVA now exceeding 52 weeks in NA markets.',
    affectedProjects: ['KNC-Hub2-1&3', 'STB-Hub1-1', 'GBL-Hub2-1'],
    cashflowRisk: '$8.2M forward exposure',
    recommendation: 'REC-2026-0588',
    lastUpdated: '3d ago',
  },
  {
    id: 'SC-003',
    commodity: 'Copper Wire (THHN)',
    category: 'Materials',
    severity: 'amber',
    currentLead: '4 weeks',
    previousLead: '3 weeks',
    change: '+33%',
    direction: 'up' as const,
    priceChange: '+14% YoY',
    source: 'COMEX Copper Futures + Distributor Survey',
    detail: 'Moderate increase in copper wire lead times driven by COMEX price increase. LME spot $11,840/t.',
    affectedProjects: ['Mesa Power Upgrade', 'All projects in MEP procurement'],
    cashflowRisk: '$680K across portfolio',
    recommendation: null,
    lastUpdated: '6h ago',
  },
  {
    id: 'SC-004',
    commodity: 'Switchgear (HV >15kV)',
    category: 'Equipment',
    severity: 'amber',
    currentLead: '38 weeks',
    previousLead: '26 weeks',
    change: '+46%',
    direction: 'up' as const,
    priceChange: '+6.8% YoY',
    source: 'ENR / Schneider Electric / ABB quarterly lead times',
    detail: 'High-voltage switchgear lead times extended significantly. Recommend early procurement for Q4 energization targets.',
    affectedProjects: ['ARA-Hub1-1&2', 'CLB-Hub1-3', 'WES-Hub1-2', 'ADC-Hub1-3', 'EBP-Hub1-1', 'SGR-Hub1-1'],
    cashflowRisk: '$3.4M if delays materialize',
    recommendation: 'REC-2026-0585',
    lastUpdated: '2d ago',
  },
  {
    id: 'SC-005',
    commodity: 'Concrete (Ready-mix)',
    category: 'Materials',
    severity: 'green',
    currentLead: '3 days',
    previousLead: '3 days',
    change: '0%',
    direction: 'flat' as const,
    priceChange: '+2.1% YoY',
    source: 'Regional supplier contracts; Portland Cement Association',
    detail: 'Stable supply across all NA regions. Locked pricing through Q3 2026 on major projects.',
    affectedProjects: [],
    cashflowRisk: 'None - contracted',
    recommendation: null,
    lastUpdated: '1w ago',
  },
]

const priceIndex = [
  { commodity: 'Copper', current: '$11,840/t', change: '+14%', trend: 'up' },
  { commodity: 'Steel (HRC)', current: '$1,120/t', change: '+8%', trend: 'up' },
  { commodity: 'Aluminum', current: '$2,640/t', change: '+5%', trend: 'up' },
  { commodity: 'Diesel', current: '$3.42/gal', change: '-2%', trend: 'down' },
]

const supplierRisk = [
  { supplier: 'ABB Power Systems', category: 'Transformers', risk: 'low', leadTime: 'On track', projects: 3 },
  { supplier: 'Schneider Electric', category: 'Switchgear', risk: 'medium', leadTime: '+4 weeks', projects: 6 },
  { supplier: 'Eaton Corporation', category: 'Distribution', risk: 'low', leadTime: 'On track', projects: 4 },
  { supplier: 'Siemens Energy', category: 'HV Equipment', risk: 'high', leadTime: '+8 weeks', projects: 2 },
]

export default function SupplyChainSignalsPage() {
  const { aiEnabled } = useAI()
  const [expandedSignal, setExpandedSignal] = useState<string | null>('SC-001')

  if (!aiEnabled) {
    return (
      <AppShell title="Supply Chain Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto">
              <PackageSearch className="w-8 h-8 text-amber" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle to access supply chain monitoring.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Supply Chain Signals"
      subtitle="Material lead times, commodity pricing, and supplier risk tracking across the portfolio"
      activeHref="/recommendations/signals"
    >
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">
        {/* Back Link */}
        <motion.div variants={sectionVariants}>
          <Link href="/recommendations/signals" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to External Signals
          </Link>
        </motion.div>

        {/* KPI Strip */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Watches', value: '9', sublabel: '2 red · 3 amber', color: 'amber', icon: AlertTriangle },
              { label: 'Commodities Tracked', value: '24', sublabel: 'Materials & equipment', color: 'sky', icon: PackageSearch },
              { label: 'At-Risk Exposure', value: '$13.5M', sublabel: 'Forward quarter', color: 'red', icon: DollarSign },
              { label: 'Data Freshness', value: '6h', sublabel: 'Auto-refresh daily', color: 'slate', icon: Clock },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-xl border border-border/50 p-4 bg-card/80 dark:bg-card/60 backdrop-blur-sm overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sublabel}</p>
                  </div>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', `bg-${kpi.color}/10`)}>
                    <kpi.icon className={cn('w-4 h-4', `text-${kpi.color}`)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Commodity Price Index */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {priceIndex.map((item, i) => (
              <motion.div
                key={item.commodity}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-3 rounded-lg bg-muted/30 border border-border/30"
              >
                <p className="text-[10px] text-muted-foreground/60 mb-1">{item.commodity}</p>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-bold font-mono text-foreground">{item.current}</p>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-semibold',
                    item.trend === 'up' ? 'text-red' : item.trend === 'down' ? 'text-green' : 'text-muted-foreground'
                  )}>
                    {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {item.change} YoY
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Commodity Lead Time Signals */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Lead Time Signals</h3>
                  <p className="text-[10px] text-muted-foreground/60">Click to expand details and affected projects</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {commoditySignals.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => setExpandedSignal(expandedSignal === signal.id ? null : signal.id)}
                >
                  <div className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'w-2 h-2 rounded-full',
                          signal.severity === 'red' ? 'bg-red' : signal.severity === 'amber' ? 'bg-amber' : 'bg-green'
                        )} />
                        <span className="text-xs font-bold text-foreground">{signal.commodity}</span>
                        <span className="text-[10px] text-muted-foreground/50">({signal.category})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'flex items-center gap-1 text-xs font-bold font-mono',
                          signal.direction === 'up' ? 'text-red' : signal.direction === 'down' ? 'text-green' : 'text-muted-foreground'
                        )}>
                          {signal.direction === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : signal.direction === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                          {signal.change}
                        </span>
                        <ChevronRight className={cn('w-4 h-4 text-muted-foreground/40 transition-transform', expandedSignal === signal.id && 'rotate-90')} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60">
                      <span>Lead: <span className="font-mono font-semibold text-foreground">{signal.currentLead}</span></span>
                      <span className="line-through">{signal.previousLead}</span>
                      <span>Price: {signal.priceChange}</span>
                    </div>
                  </div>

                  {expandedSignal === signal.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-3">
                        <p className="text-xs text-muted-foreground/80">{signal.detail}</p>
                        <div className="flex flex-wrap gap-1">
                          {signal.affectedProjects.map(p => (
                            <span key={p} className="text-[9px] px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20">
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/20">
                          <div className="text-[10px]">
                            <span className="text-muted-foreground/50">Risk: </span>
                            <span className="font-mono font-bold text-red">{signal.cashflowRisk}</span>
                          </div>
                          {signal.recommendation && (
                            <Link
                              href={`/recommendations?rec=${signal.recommendation}`}
                              className="flex items-center gap-1 text-[10px] font-medium text-teal hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {signal.recommendation}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <p className="text-[9px] text-muted-foreground/40">Source: {signal.source} · Updated {signal.lastUpdated}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Supplier Risk Matrix */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center">
                  <Factory className="w-4 h-4 text-slate" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Supplier Risk Matrix</h3>
                  <p className="text-[10px] text-muted-foreground/60">Key supplier delivery performance</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Supplier</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Category</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Risk Level</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Lead Time</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {supplierRisk.map((supplier) => (
                    <tr key={supplier.supplier} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground">{supplier.supplier}</td>
                      <td className="p-3 text-xs text-muted-foreground">{supplier.category}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          supplier.risk === 'high' ? 'bg-red/10 text-red' :
                          supplier.risk === 'medium' ? 'bg-amber/10 text-amber' :
                          'bg-green/10 text-green'
                        )}>
                          {supplier.risk}
                        </span>
                      </td>
                      <td className="p-3 text-center text-xs font-mono">{supplier.leadTime}</td>
                      <td className="p-3 text-center text-xs font-mono">{supplier.projects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Source Attribution */}
        <motion.section variants={sectionVariants}>
          <div className="text-center py-4 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50">
              Sources: COMEX · LME · Steel Service Center Institute · ENR Construction Cost Index · Allianz Commercial · CBRE
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Commodity data refreshes daily. Supplier performance updated weekly. Critical alerts pushed within 24 hours.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  )
}

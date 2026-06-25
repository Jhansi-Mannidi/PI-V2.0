'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  HardHat, ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Users,
  DollarSign, Clock, ChevronRight, ExternalLink, MapPin, GraduationCap,
  Building2, Briefcase, ChevronDown
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

const laborSignals = [
  {
    id: 'LAB-001',
    trade: 'Electricians (Journeyman)',
    severity: 'red',
    headline: '300,000+ electricians needed for AI-driven demand by 2030',
    region: 'NA-W & NA-E',
    metrics: [
      { label: 'Annual openings', value: '81,000', source: 'BLS OOH' },
      { label: 'Retirements/yr', value: '~20,000', source: 'ITIF, Jan 2026' },
      { label: 'Age 50-70', value: '~30%', source: 'IBEW data' },
      { label: 'NoVA wages', value: '$120K-$240K', source: 'Fortune, Mar 2026' },
    ],
    affectedProjects: '11 NA-W projects, 4 NA-E projects',
    recommendation: 'REC-2026-0592',
  },
  {
    id: 'LAB-002',
    trade: 'Mechanical / Pipefitters / HVAC',
    severity: 'amber',
    headline: '82% of mechanical contractors now require fabrication capability',
    region: 'All Regions',
    metrics: [
      { label: 'Workforce retiring by 2031', value: '41%', source: 'iRecruit, Apr 2026' },
      { label: 'Construction unemployment', value: '3.2%', source: 'BLS CES' },
      { label: 'Hardest to staff', value: 'HVAC techs', source: 'Data Center Geeks' },
    ],
    affectedProjects: '8 projects across all regions',
    recommendation: null,
  },
  {
    id: 'LAB-003',
    trade: 'Project Managers (Hyperscale DC)',
    severity: 'amber',
    headline: 'PMs with hyperscale experience now a top-3 recruiting bottleneck',
    region: 'All Regions',
    metrics: [
      { label: 'Difficulty finding candidates', value: '53%', source: 'Uptime Institute 2024' },
      { label: 'Cite staffing as constraint', value: '90%', source: 'JLL 2025' },
    ],
    affectedProjects: 'CHB, MNK, GBL, WES, ADC, SGR',
    recommendation: null,
  },
]

const wageHeatmap = [
  { region: 'Northern Virginia (NA-E)', backlog: '14.2 mo', wageInflation: '+11.4%', premium: '+28%', risk: 'red', riskAmount: '$4.2M', projects: 'ARA, CLB' },
  { region: 'Dallas / Red Oak (NA-W)', backlog: '12.8 mo', wageInflation: '+9.7%', premium: '+24%', risk: 'amber', riskAmount: '$3.1M', projects: 'ADC, KAS' },
  { region: 'Atlanta metro (NA-E)', backlog: '11.5 mo', wageInflation: '+8.1%', premium: '+22%', risk: 'amber', riskAmount: '$1.8M', projects: 'SGR, EBP-NA' },
  { region: 'Phoenix metro (NA-W)', backlog: '9.4 mo', wageInflation: '+6.8%', premium: '+18%', risk: 'green', riskAmount: 'Stable', projects: 'MNK adjacent' },
  { region: 'Dublin, IE (EMEA)', backlog: '13.6 mo', wageInflation: '+9.2%', premium: '+31%', risk: 'red', riskAmount: '$5.8M', projects: 'STB, LPP' },
  { region: 'Frankfurt (EMEA)', backlog: '11.2 mo', wageInflation: '+7.4%', premium: '+25%', risk: 'amber', riskAmount: '$3.4M', projects: 'GBL, VLB' },
  { region: 'London (EMEA)', backlog: '12.1 mo', wageInflation: '+8.6%', premium: '+27%', risk: 'amber', riskAmount: '$2.9M', projects: 'WES, WXT' },
  { region: 'Singapore / KL / BKK (APAC)', backlog: '10.7 mo', wageInflation: '+6.2%', premium: '+20%', risk: 'amber', riskAmount: '$4.0M', projects: 'CHB, BSN, KAY, MNK' },
]

const activeSignals = [
  { signal: 'IBEW Local 26 (DMV) wage settlement +7.8%', region: 'NA-E', date: 'May 14', severity: 'red', projects: 3, impact: '+$1.4M', rec: 'REC-2026-0581' },
  { signal: 'Tier-1 NoVA GC: 14-week electrician lead time', region: 'NA-E', date: 'May 12', severity: 'red', projects: 2, impact: '6w risk', rec: 'REC-2026-0573' },
  { signal: 'Dublin grid moratorium drives +22% commissioning eng wage', region: 'EMEA', date: 'May 8', severity: 'red', projects: 2, impact: '+$2.1M', rec: 'REC-2026-0560' },
  { signal: 'Frankfurt pipefitter backlog: 16 weeks', region: 'EMEA', date: 'May 5', severity: 'amber', projects: 2, impact: '4w risk', rec: 'REC-2026-0552' },
  { signal: 'T&T 2026: NoVA data center labor +11.4% YoY', region: 'NA-E', date: 'May 3', severity: 'amber', projects: 4, impact: '+$2.8M', rec: 'REC-2026-0548' },
  { signal: 'Texas labor migration from AZ: +14% supply', region: 'NA-W', date: 'Apr 28', severity: 'green', projects: 2, impact: '-$0.6M', rec: 'REC-2026-0540' },
  { signal: 'BCA Singapore apprenticeship intake +12%', region: 'APAC', date: 'Apr 22', severity: 'green', projects: 0, impact: 'Stabilizing', rec: null },
]

const apprenticeshipPipeline = [
  { region: 'NA-East', '2026': '+1,820', '2027': '+2,140', '2028': '+2,260', '2029': '+2,380', note: 'DMV electricians union doubled membership 2018→Jan 2026' },
  { region: 'NA-West', '2026': '+1,420', '2027': '+1,710', '2028': '+1,840', '2029': '+1,960', note: 'Texas and Arizona growth markets' },
  { region: 'EMEA', '2026': '+680', '2027': '+810', '2028': '+940', '2029': '+1,070', note: 'Constrained by EU mobility & apprenticeship structure' },
  { region: 'APAC', '2026': '+1,940', '2027': '+2,180', '2028': '+2,360', '2029': '+2,540', note: 'Strong domestic pipelines via ITE Singapore, CIDB Malaysia' },
]

export default function LaborMarketSignalsPage() {
  const { aiEnabled } = useAI()
  const [expandedTrade, setExpandedTrade] = useState<string | null>('LAB-001')
  const [showSources, setShowSources] = useState(false)

  if (!aiEnabled) {
    return (
      <AppShell title="Labor Market Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto">
              <HardHat className="w-8 h-8 text-green" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle to access labor market signals.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Labor Market Signals"
      subtitle="Workforce supply, wage pressure, trade availability, and apprenticeship pipeline across the portfolio"
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

        {/* Context Callout */}
        <motion.section variants={sectionVariants}>
          <div className="p-4 rounded-xl border-l-4 border-gold bg-gold/5 border border-gold/20">
            <p className="text-xs text-foreground leading-relaxed">
              <strong>Labor is the single most material external constraint on the ODC portfolio in 2026.</strong> Per ABC, U.S. construction needs 349,000 net new workers in 2026. Per ITIF, the shortage already stands at 439,000. Hyperscale data-center electrical work accounts for 45-70% of total construction cost (IBEW) and the journeyman-electrician pipeline is the binding constraint.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-2">Source: Fortune, Mar 2026; ITIF, Jan 2026; BLS Occupational Outlook Handbook 2024-2034</p>
          </div>
        </motion.section>

        {/* KPI Strip */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Signals', value: '14', sublabel: '4 red · 6 amber', color: 'amber', icon: AlertTriangle },
              { label: 'Wage Inflation', value: '8.4%', sublabel: 'Portfolio avg YoY', color: 'red', icon: TrendingUp },
              { label: 'At-Risk Exposure', value: '$23.2M', sublabel: 'Labor cost headwind', color: 'red', icon: DollarSign },
              { label: 'Data Freshness', value: '1d', sublabel: 'BLS monthly release', color: 'green', icon: Clock },
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

        {/* Skilled Trades Supply */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-red/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-red" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">U.S. Skilled-Trades Supply</h3>
                  <p className="text-[10px] text-muted-foreground/60">Critical workforce constraints by trade</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {laborSignals.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => setExpandedTrade(expandedTrade === signal.id ? null : signal.id)}
                >
                  <div className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'w-2 h-2 rounded-full',
                          signal.severity === 'red' ? 'bg-red' : 'bg-amber'
                        )} />
                        <span className="text-xs font-bold text-foreground">{signal.trade}</span>
                        <span className="text-[10px] text-muted-foreground/50">({signal.region})</span>
                      </div>
                      <ChevronRight className={cn('w-4 h-4 text-muted-foreground/40 transition-transform', expandedTrade === signal.id && 'rotate-90')} />
                    </div>
                    <p className="text-xs text-muted-foreground/80">{signal.headline}</p>
                  </div>

                  {expandedTrade === signal.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {signal.metrics.map((m) => (
                            <div key={m.label} className="text-center p-2 rounded-lg bg-background/50">
                              <p className="text-lg font-bold font-mono text-foreground">{m.value}</p>
                              <p className="text-[9px] text-muted-foreground/60">{m.label}</p>
                              <p className="text-[8px] text-muted-foreground/40">{m.source}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/20 text-[10px]">
                          <span className="text-muted-foreground/60">Affected: <span className="text-foreground">{signal.affectedProjects}</span></span>
                          {signal.recommendation && (
                            <Link
                              href={`/recommendations?rec=${signal.recommendation}`}
                              className="flex items-center gap-1 text-teal hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {signal.recommendation}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Regional Wage Heatmap */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Regional Wage & Backlog Pressure</h3>
                  <p className="text-[10px] text-muted-foreground/60">Data center markets labor cost analysis</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Region</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Backlog</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Wage YoY</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">DC Premium</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Cost Headwind</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {wageHeatmap.map((row) => (
                    <tr key={row.region} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground">{row.region}</td>
                      <td className="p-3 text-center text-xs font-mono">{row.backlog}</td>
                      <td className="p-3 text-center">
                        <span className="text-xs font-mono text-red">{row.wageInflation}</span>
                      </td>
                      <td className="p-3 text-center text-xs font-mono text-amber">{row.premium}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          row.risk === 'red' ? 'bg-red/10 text-red' :
                          row.risk === 'amber' ? 'bg-amber/10 text-amber' :
                          'bg-green/10 text-green'
                        )}>
                          {row.riskAmount}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{row.projects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-border/30 text-[9px] text-muted-foreground/50 italic">
              Backlog: ABC Construction Backlog Indicator, Q1 2026. Wage inflation: Turner & Townsend International Construction Market Survey, 2026. DC Premium: WSJ analysis per ITIF.
            </div>
          </div>
        </motion.section>

        {/* Apprenticeship Pipeline */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-teal/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Apprenticeship & Training Pipeline</h3>
                  <p className="text-[10px] text-muted-foreground/60">Projected net journeyman additions by region</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Region</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">2026</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">2027</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">2028</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">2029</th>
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {apprenticeshipPipeline.map((row) => (
                    <tr key={row.region} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground">{row.region}</td>
                      <td className="p-3 text-center text-xs font-mono text-green">{row['2026']}</td>
                      <td className="p-3 text-center text-xs font-mono text-green">{row['2027']}</td>
                      <td className="p-3 text-center text-xs font-mono text-green">{row['2028']}</td>
                      <td className="p-3 text-center text-xs font-mono text-green">{row['2029']}</td>
                      <td className="p-3 text-[10px] text-muted-foreground/70 max-w-[200px]">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-border/30 text-[9px] text-muted-foreground/50 italic">
              Apprenticeships take 4-5 years to complete; today&apos;s intake sets the 2030 supply curve. Sources: Electrical Training Alliance (NECA/IBEW), Cedefop, BCA Singapore.
            </div>
          </div>
        </motion.section>

        {/* Active Labor Signals Table */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-slate" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Active Labor Signals</h3>
                  <p className="text-[10px] text-muted-foreground/60">Recent signals affecting ODC portfolio</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Signal</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Region</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Date</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Severity</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Projects</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Impact</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase">Rec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {activeSignals.map((sig) => (
                    <tr key={sig.signal} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-xs text-foreground max-w-[280px]">{sig.signal}</td>
                      <td className="p-3 text-center text-[10px] text-muted-foreground">{sig.region}</td>
                      <td className="p-3 text-center text-[10px] font-mono">{sig.date}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'w-2 h-2 rounded-full inline-block',
                          sig.severity === 'red' ? 'bg-red' : sig.severity === 'amber' ? 'bg-amber' : 'bg-green'
                        )} />
                      </td>
                      <td className="p-3 text-center text-xs font-mono">{sig.projects}</td>
                      <td className="p-3 text-center text-xs font-mono font-semibold">{sig.impact}</td>
                      <td className="p-3 text-center">
                        {sig.rec ? (
                          <Link href={`/recommendations?rec=${sig.rec}`} className="text-[10px] text-teal hover:underline">
                            {sig.rec}
                          </Link>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/40">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Source Bibliography */}
        <motion.section variants={sectionVariants}>
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
          >
            <span className="text-xs font-semibold text-foreground">Source Bibliography</span>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showSources && 'rotate-180')} />
          </button>
          {showSources && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 p-4 rounded-xl bg-muted/20 border border-border/30 space-y-4"
            >
              {[
                { title: 'Primary Government & Statistical', sources: ['U.S. Bureau of Labor Statistics (BLS) — OES, OOH, CES', 'Eurostat — Labour Force Survey (LFS)', 'BCA Singapore — Building & Construction Authority'] },
                { title: 'Industry Associations', sources: ['Associated Builders and Contractors (ABC)', 'IBEW (International Brotherhood of Electrical Workers)', 'NECA/IBEW Electrical Training Alliance'] },
                { title: 'Research & Consulting', sources: ['Turner & Townsend — International Construction Market Survey 2026', 'CBRE — North America Data Center Trends 2025/2026', 'Uptime Institute — Global Data Center Survey 2024'] },
                { title: 'Trade Press', sources: ['Engineering News-Record (ENR)', 'Fortune (Mar 2026 data center electrician feature)', 'Wall Street Journal (Te-Ping Chen, Nov 2025)'] },
              ].map((section) => (
                <div key={section.title}>
                  <p className="text-[10px] font-semibold text-foreground mb-1">{section.title}</p>
                  <ul className="space-y-0.5">
                    {section.sources.map(s => (
                      <li key={s} className="text-[10px] text-muted-foreground/70">• {s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Source Attribution */}
        <motion.section variants={sectionVariants}>
          <div className="text-center py-4 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50">
              Data: BLS · IBEW · ABC · Turner & Townsend · Uptime Institute · CBRE · JLL · Regional union settlements
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Labor data updated daily. Wage settlements pushed within 24 hours of publication.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  )
}

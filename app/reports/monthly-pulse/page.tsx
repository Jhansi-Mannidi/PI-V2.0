'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import {
  FileText,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Edit3,
  Check,
  X,
  Presentation,
  Link2,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { exportToPDF, exportToSlides, copyShareLink } from '@/lib/export-utils'
import { toast } from 'sonner'

// Animation ease
const ease = [0.25, 0.46, 0.45, 0.94] as const

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const portfolioKPIs = [
  { label: 'Portfolio CPI', value: '0.94', delta: '0.02', direction: 'down', status: 'amber' },
  { label: 'Portfolio SPI', value: '0.89', delta: '0.02', direction: 'down', status: 'amber' },
  { label: 'Annual Plan Variance', value: '-$143.52M', delta: '-21%', direction: 'down', status: 'red' },
  { label: 'P1 Risks Open', value: '9', delta: '2', direction: 'up', status: 'red' },
  { label: 'FDOB Schedule Performance', value: '71%', delta: '3pp', direction: 'up', status: 'green' },
]

const portfolioComposition = [
  { type: 'Seed Pipeline', count: 55, approved: '$122.8M', color: 'bg-emerald-500' },
  { type: 'Construction', count: 27, approved: '$457.6M', color: 'bg-violet-500' },
  { type: 'CLC', count: 5, approved: '$22.6M', color: 'bg-fuchsia-500' },
]

const regionalCashflow = [
  { region: 'Hubs', plan: 563.55, cashflow: 444.43, variance: -119.12, variancePct: -27, ytdWip: 65.36, ytdActuals: 65.38 },
  { region: 'CLC', plan: 104.23, cashflow: 58.22, variance: -46.01, variancePct: -79, ytdWip: 2.25, ytdActuals: 0.72 },
  { region: 'Prof. Fees', plan: 9.72, cashflow: 7.49, variance: -2.22, variancePct: -30, ytdWip: 2.42, ytdActuals: 1.52 },
]

const cashflowConfidence = [
  { label: 'High-Committed', value: 248.39, pct: 47, color: 'bg-status-green' },
  { label: 'Medium-Budgeted', value: 129.63, pct: 24, color: 'bg-status-amber' },
  { label: 'Low-Forecast', value: 156.01, pct: 29, color: 'bg-muted-foreground' },
]

const keyDrivers = [
  { driver: 'Strategic changes', subtext: '2-Story, Enlarged Kitchen, Concurrent Build, Variant Design', impact: 'Schedule', variance: '-$123M', narrative: 'NA-W: WEN (Marcus), SCF' },
  { driver: 'YAWN/Campus driven', subtext: 'BDP, YAWN Schedule, new projects', impact: 'Schedule', variance: '-$22M', narrative: 'NASA: ARA, NOL, GVO, EWD, KAS, MOS, SKW, WCK, SGW, MUS' },
  { driver: 'Leadership Approvals', subtext: 'Funding, Design, Feasibility & DC Ops, Guardrail, VE', impact: 'Schedule', variance: '-$22M', narrative: 'NASA: CLC Construction Funding postponed; EMEA: STB, VLB, WES, GBL, LPP, GRQ' },
  { driver: 'Field Conditions & FFC', subtext: 'Permitting, Mobilization, PCOs, Bid update, Q4 Movement', impact: 'Cost & Schedule', variance: '+$28M', narrative: 'NASA: in-flight projects; EMEA: WXT, HGB; APAC: EMB, EPB' },
  { driver: 'Misc Pre-Con', subtext: 'RFP/Estimating, Contract/PO', impact: 'Schedule', variance: '-$5M', narrative: 'CLC Buyout, 2-Story estimating impact' },
]

const fdobPerformance = [
  { region: 'APAC', designTarget: '11m', caTarget: '13m', performance: 62, withinTarget: '16/26' },
  { region: 'EMEA', designTarget: '15m', caTarget: '16m', performance: 74, withinTarget: '20/27' },
  { region: 'NA-East', designTarget: '13.5m', caTarget: '15m', performance: 78, withinTarget: '14/18' },
  { region: 'NA-West', designTarget: '13.5m', caTarget: '15m', performance: 69, withinTarget: '11/16' },
]

const projectsNotWithinTarget = [
  { project: 'ARA-Hub1-1&2', region: 'NA-W', variance: '+4.2', narrative: 'Design stopped and redesigned', owner: 'Lisa McIntyre' },
  { project: 'KNC-Hub2-1&3', region: 'NA-W', variance: '+3.8', narrative: 'AE PO Delay & RFP delay', owner: 'Lisa McIntyre' },
  { project: 'STB-Hub1-1', region: 'EMEA', variance: '+5.1', narrative: 'Major Permitting Delays in Jurisdiction', owner: 'Paul Cahill' },
  { project: 'KAS-Hub1-1&2', region: 'NA-W', variance: '+2.9', narrative: 'Enlarger Kitchen Cut delay', owner: 'Loren Smith' },
  { project: 'WEN-Hub2-1', region: 'NA-W', variance: '+3.4', narrative: 'Awaiting Leadership Decision on Bldg Config', owner: 'Marcus' },
  { project: 'CHB-Hub1-2', region: 'APAC', variance: '+1.8', narrative: 'YAWN Civil Designer pending', owner: 'Sam Long' },
]

const strategicInitiatives = [
  { name: 'ODC Hub MVAC', description: 'AirReps/Daikin mechanical', target: 'TD May 2026', progress: '95% complete', status: 'green' },
  { name: 'Mass Timber', description: 'Mercer MMT for NASA 2-Story', target: 'GOR project · TD May 2026', progress: 'On track', status: 'green' },
  { name: 'Light Gauge Steel & Surefoot', description: 'X-Calibr + concrete-free piers', target: 'Testing Apr 26–Mar 27', progress: 'In progress', status: 'amber' },
  { name: 'ODC Hub POR Variant', description: 'PB3.0R5.0 for HJS, KNC Hub2, UNO Hub2, HRF Hub2, NCH, PCH, CER', target: 'Target late June', progress: '95% design done', status: 'amber' },
  { name: '2-Story HUBs', description: 'NASA approved 5/13/25', target: 'Approved', progress: 'Complete', status: 'green' },
]

// ─────────────────────────────────────────────────────────────
// Donut Chart Component
// ─────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: typeof cashflowConfidence }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let cumulative = 0
  
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {data.map((segment, i) => {
          const pct = segment.value / total
          const startAngle = cumulative * 360
          cumulative += pct
          const endAngle = cumulative * 360
          
          const startRad = (startAngle - 90) * (Math.PI / 180)
          const endRad = (endAngle - 90) * (Math.PI / 180)
          
          const x1 = 70 + 50 * Math.cos(startRad)
          const y1 = 70 + 50 * Math.sin(startRad)
          const x2 = 70 + 50 * Math.cos(endRad)
          const y2 = 70 + 50 * Math.sin(endRad)
          
          const largeArc = pct > 0.5 ? 1 : 0
          
          const colors: Record<string, string> = {
            'bg-status-green': '#22c55e',
            'bg-status-amber': '#f59e0b',
            'bg-muted-foreground': '#64748b',
          }
          
          return (
            <path
              key={i}
              d={`M 70 70 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[segment.color] || '#64748b'}
              className="transition-opacity hover:opacity-80"
            />
          )
        })}
        <circle cx="70" cy="70" r="30" className="fill-card" />
        <text x="70" y="66" textAnchor="middle" className="fill-foreground text-lg font-bold">$534M</text>
        <text x="70" y="82" textAnchor="middle" className="fill-muted-foreground text-[10px]">Target</text>
      </svg>
      <div className="flex flex-col gap-1.5 text-xs">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={cn('w-2.5 h-2.5 rounded-full', d.color)} />
            <span className="text-muted-foreground">{d.label}:</span>
            <span className="font-medium text-foreground">${d.value}M ({d.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Editable Narrative Cell
// ─────────────────────────────────────────────────────────────

function EditableNarrative({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false)
  const [text, setText] = React.useState(value)
  
  const handleSave = () => {
    onSave(text)
    setEditing(false)
  }
  
  const handleCancel = () => {
    setText(value)
    setEditing(false)
  }
  
  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-2 py-1 text-xs bg-secondary border border-line rounded focus:outline-none focus:ring-1 focus:ring-gold"
          autoFocus
        />
        <button onClick={handleSave} className="p-1 text-status-green hover:bg-status-green/10 rounded">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleCancel} className="p-1 text-status-red hover:bg-status-red/10 rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }
  
  return (
    <div className="group flex items-center gap-1.5 cursor-pointer" onClick={() => setEditing(true)}>
      <span className="text-xs text-muted-foreground">{text}</span>
      <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────

export default function MonthlyPulsePage() {
  const [narratives, setNarratives] = React.useState<Record<string, string>>(
    Object.fromEntries(projectsNotWithinTarget.map(p => [p.project, p.narrative]))
  )
  
  const handleNarrativeSave = (project: string, value: string) => {
    setNarratives(prev => ({ ...prev, [project]: value }))
  }
  
  const totals = {
    plan: regionalCashflow.reduce((s, r) => s + r.plan, 0),
    cashflow: regionalCashflow.reduce((s, r) => s + r.cashflow, 0),
    variance: regionalCashflow.reduce((s, r) => s + r.variance, 0),
    ytdWip: regionalCashflow.reduce((s, r) => s + r.ytdWip, 0),
    ytdActuals: regionalCashflow.reduce((s, r) => s + r.ytdActuals, 0),
  }

  return (
    <AppShell title="Monthly Pulse Report">
      <motion.div 
        className="min-h-screen space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
        }}
      >
        {/* ─── Header Band ─── */}
        <motion.header
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="bg-card border border-border rounded-xl px-4 sm:px-6 py-5 sm:py-6"
        >
          <div className="w-full">
            {/* Back link and title row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <Link 
                  href="/reports" 
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to Reports"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <h1 className="text-sm sm:text-base font-semibold text-foreground">
                  Portfolio Pulse — May 2026
                </h1>
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-mono">
                Generated 04:12 PDT, May 18, 2026
              </span>
            </div>
            
            <p className="text-[10px] text-muted-foreground/60 ml-10 mb-2">
              ODC Capital Portfolio · 87 active projects · 4 regions · presented by Brian Chen
            </p>
            <div className="ml-10 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold text-navy text-[10px] font-semibold rounded-full uppercase tracking-wide">
                Monthly Pulse · May 2026
              </span>
            </div>
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'portfolio-pulse-may-2026', title: 'Portfolio Pulse — May 2026' })}
                className="h-8 px-3 inline-flex items-center gap-1.5 bg-gold text-navy text-xs font-medium rounded-lg hover:bg-gold-soft transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button 
                onClick={() => exportToSlides({ filename: 'portfolio-pulse-may-2026', title: 'Portfolio Pulse — May 2026' })}
                className="h-8 px-3 inline-flex items-center gap-1.5 bg-gold/20 border border-gold text-navy dark:text-foreground text-xs font-medium rounded-lg hover:bg-gold/30 transition-colors"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export to Slides</span>
                <span className="sm:hidden">Slides</span>
              </button>
              <button 
                onClick={() => copyShareLink('/reports/monthly-pulse')}
                className="h-8 px-3 inline-flex items-center gap-1.5 bg-secondary border border-line text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Link</span>
                <span className="sm:hidden">Share</span>
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 inline-flex items-center gap-1.5 bg-secondary border border-line text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule
              </button>
            </div>
          </div>
        </motion.header>

        {/* ─── Main Content ─── */}
        <main className="px-4 sm:px-6 w-full space-y-5">
          
          {/* ─── Executive Summary Card ─── */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
            className="bg-card border border-line rounded-xl overflow-hidden shadow-sm"
          >
            <div className="border-l-4 border-gold p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Executive Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Headline */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Headline</h3>
                  <p className="text-sm text-foreground leading-relaxed mb-2">
                    <span className="font-semibold">$677.55M Annual Plan;</span> May Cashflow projecting <span className="text-status-red font-semibold">-$143.52M (-21%)</span> vs target.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Variance driven by strategic changes (-$123M) and YAWN/Campus shifts (-$22M); partially offset by Field Conditions & FFC (+$28M).
                  </p>
                </div>
                
                {/* What's Working */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What&apos;s Working</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-status-green mt-0.5 shrink-0" />
                      <span className="text-foreground">Seed PO cycle: 14-day SLA target; current average <span className="text-status-green font-medium">11 days</span> (down from 14)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-status-green mt-0.5 shrink-0" />
                      <span className="text-foreground">NA-East Schedule Performance: <span className="text-status-green font-medium">78%</span> within FDOB target (up from 71%)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-status-green mt-0.5 shrink-0" />
                      <span className="text-foreground">Zero key-person continuity flags raised this period</span>
                    </li>
                  </ul>
                </div>
                
                {/* What Needs Attention */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What Needs Attention</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-status-amber mt-0.5 shrink-0" />
                      <span className="text-foreground">Construction PO legal review averaging <span className="text-status-red font-medium">74 days</span> (vs 30-day target)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-status-amber mt-0.5 shrink-0" />
                      <span className="text-foreground">APAC FDOB Schedule Performance dropped to <span className="text-status-amber font-medium">62%</span></span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-status-amber mt-0.5 shrink-0" />
                      <span className="text-foreground">Five P1 risks open; three are field-condition driven</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ─── Portfolio Health Strip ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
              <h2 className="text-sm font-semibold text-foreground">Portfolio Health</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {portfolioKPIs.map((kpi, i) => {
                const statusColors: Record<string, string> = {
                  green: 'border-l-status-green',
                  amber: 'border-l-status-amber',
                  red: 'border-l-status-red',
                }
                return (
                  <div
                    key={i}
                    className={cn(
                      'bg-card border border-line rounded-lg p-3 border-l-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]',
                      statusColors[kpi.status]
                    )}
                  >
                    <div className="mb-1.5">
                      <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide leading-tight">{kpi.label}</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-foreground font-mono tabular-nums mb-1">{kpi.value}</div>
                    <div className={cn(
                      'text-[10px] font-medium flex items-center gap-1',
                      kpi.direction === 'up' && kpi.status === 'red' ? 'text-status-red' :
                      kpi.direction === 'down' && kpi.status === 'red' ? 'text-status-red' :
                      kpi.direction === 'up' && kpi.status === 'green' ? 'text-status-green' :
                      kpi.direction === 'down' && kpi.status === 'green' ? 'text-status-green' :
                      'text-status-amber'
                    )}>
                      {kpi.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.delta} wk/wk
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* ─── Project Portfolio Breakdown ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="bg-card border border-line rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal via-teal/70 to-teal/30" />
              <h2 className="text-sm font-semibold text-foreground">Active Portfolio Composition</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {portfolioComposition.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className={cn('w-3 h-10 rounded-full', item.color)} />
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.type}</div>
                    <div className="text-xs text-muted-foreground">{item.count} active · {item.approved} approved</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Forecast Construction Funding Pipeline */}
            <div className="border-t border-line pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Forecast Construction Funding Pipeline</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>0–3 months</span>
                    <span className="font-medium text-foreground">18 projects</span>
                  </div>
                  <div className="h-6 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>3–6 months</span>
                    <span className="font-medium text-foreground">11 projects</span>
                  </div>
                  <div className="h-6 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ─── Regional Cashflow Table + Donut ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="bg-card border border-line rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
              <h2 className="text-sm font-semibold text-foreground">Cashflow by Region — May 2026 (USD millions)</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Table */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Region</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Plan</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Cashflow</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Variance</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Var %</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground hidden sm:table-cell">YTD WIP</th>
                      <th className="text-right py-2 px-2 font-semibold text-muted-foreground hidden sm:table-cell">YTD Actuals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalCashflow.map((row, i) => (
                      <tr key={i} className="border-b border-line/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{row.region}</td>
                        <td className="text-right py-2 px-2 text-foreground">{row.plan.toFixed(2)}</td>
                        <td className="text-right py-2 px-2 text-foreground">{row.cashflow.toFixed(2)}</td>
                        <td className={cn('text-right py-2 px-2 font-medium', row.variance < 0 ? 'text-status-red' : 'text-status-green')}>
                          {row.variance.toFixed(2)}
                        </td>
                        <td className={cn('text-right py-2 px-2 font-medium', row.variancePct < 0 ? 'text-status-red' : 'text-status-green')}>
                          {row.variancePct}%
                        </td>
                        <td className="text-right py-2 px-2 text-foreground hidden sm:table-cell">{row.ytdWip.toFixed(2)}</td>
                        <td className="text-right py-2 px-2 text-foreground hidden sm:table-cell">{row.ytdActuals.toFixed(2)}</td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-secondary/50 font-semibold">
                      <td className="py-2 px-2 text-foreground">Total</td>
                      <td className="text-right py-2 px-2 text-foreground">{totals.plan.toFixed(2)}</td>
                      <td className="text-right py-2 px-2 text-foreground">{totals.cashflow.toFixed(2)}</td>
                      <td className="text-right py-2 px-2 text-status-red">{totals.variance.toFixed(2)}</td>
                      <td className="text-right py-2 px-2 text-status-red">-25%</td>
                      <td className="text-right py-2 px-2 text-foreground hidden sm:table-cell">{totals.ytdWip.toFixed(2)}</td>
                      <td className="text-right py-2 px-2 text-foreground hidden sm:table-cell">{totals.ytdActuals.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Donut Chart */}
              <div className="lg:w-[280px] flex justify-center">
                <DonutChart data={cashflowConfidence} />
              </div>
            </div>
          </motion.section>

          {/* ─── Key Drivers Table ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
            className="bg-card border border-line rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber via-amber/70 to-amber/30" />
              <h2 className="text-sm font-semibold text-foreground">2026 CFLOW Key Drivers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Key Driver</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground hidden sm:table-cell">Impact</th>
                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Variance</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground hidden md:table-cell">Key Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {keyDrivers.map((row, i) => (
                    <tr key={i} className="border-b border-line/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-medium text-foreground">{row.driver}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{row.subtext}</div>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{row.impact}</td>
                      <td className={cn('text-right py-3 px-2 font-semibold', row.variance.startsWith('+') ? 'text-status-green' : 'text-status-red')}>
                        {row.variance}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs hidden md:table-cell">{row.narrative}</td>
                    </tr>
                  ))}
                  <tr className="bg-secondary/50 font-semibold">
                    <td className="py-3 px-2 text-foreground" colSpan={2}>Total Movement from 2026 Cflow to Future years</td>
                    <td className="text-right py-3 px-2 text-status-red">-$143M</td>
                    <td className="py-3 px-2 hidden md:table-cell" />
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* ─── FDOB Timeline Performance ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal via-teal/70 to-teal/30" />
              <h2 className="text-sm font-semibold text-foreground">FDOB Timeline Performance</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {fdobPerformance.map((region, i) => {
                const statusColor = region.performance >= 75 ? 'text-status-green' : region.performance >= 65 ? 'text-status-amber' : 'text-status-red'
                const bgColor = region.performance >= 75 ? 'bg-status-green' : region.performance >= 65 ? 'bg-status-amber' : 'bg-status-red'
                return (
                  <div key={i} className="bg-card border border-line rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground">{region.region}</span>
                      <span className={cn('text-base font-bold font-mono tabular-nums', statusColor)}>{region.performance}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                      <div className={cn('h-full rounded-full transition-all', bgColor)} style={{ width: `${region.performance}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground/60">Design→CA:</span>
                        <span className="ml-1 font-medium text-foreground">{region.designTarget}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60">CA→FDOB:</span>
                        <span className="ml-1 font-medium text-foreground">{region.caTarget}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 text-[10px] text-muted-foreground/60">
                      {region.withinTarget} within target
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* ─── Projects Not Within Target ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease }}
            className="bg-card border border-line rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red via-red/70 to-red/30" />
              <h2 className="text-sm font-semibold text-foreground">Projects Not Within Target</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Project</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Region</th>
                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Variance</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground hidden sm:table-cell">Narrative</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground hidden md:table-cell">Owner</th>
                    <th className="py-2 px-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {projectsNotWithinTarget.map((row, i) => (
                    <tr key={i} className="border-b border-line/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-2">
                        <Link href="/projects" className="font-medium text-foreground hover:text-gold transition-colors">
                          {row.project}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-mono">
                          {row.region}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2 font-semibold text-status-red">{row.variance}m</td>
                      <td className="py-3 px-2 hidden sm:table-cell max-w-[200px]">
                        <EditableNarrative 
                          value={narratives[row.project]} 
                          onSave={(v) => handleNarrativeSave(row.project, v)} 
                        />
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{row.owner}</td>
                      <td className="py-3 px-2">
                        <Link href="/projects" className="text-muted-foreground hover:text-gold transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* ─── Strategic Initiatives Status ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal via-teal/70 to-teal/30" />
              <h2 className="text-sm font-semibold text-foreground">Strategic Initiatives Status</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {strategicInitiatives.map((init, i) => {
                const statusColors: Record<string, string> = {
                  green: 'border-l-status-green bg-status-green/5',
                  amber: 'border-l-status-amber bg-status-amber/5',
                  red: 'border-l-status-red bg-status-red/5',
                }
                const badgeColors: Record<string, string> = {
                  green: 'bg-status-green/20 text-status-green',
                  amber: 'bg-status-amber/20 text-status-amber',
                  red: 'bg-status-red/20 text-status-red',
                }
                return (
                  <div key={i} className={cn('bg-card border border-line rounded-lg p-4 border-l-4', statusColors[init.status])}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{init.name}</h3>
                      <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full', badgeColors[init.status])}>
                        {init.progress}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{init.description}</p>
                    <p className="text-[10px] text-muted-foreground">{init.target}</p>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* ─── Footer Strip ─── */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease }}
            className="border-t border-line pt-6 mt-8"
          >
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Generated 04:12 PDT, May 18, 2026 · odc_semantic v2.4.1 · 38 sec generation time · LineSight previously: 4-hour manual cycle
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                Source systems: BigQuery, eBuilder, SAP, Primavera P6, Quickbase, Buying Hub
              </p>
            </div>
          </motion.footer>
        </main>
      </motion.div>
    </AppShell>
  )
}

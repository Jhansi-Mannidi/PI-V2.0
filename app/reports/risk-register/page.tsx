'use client'

import * as React from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  ArrowUpDown,
  X,
  Shield,
  Users,
  TrendingDown,
  ArrowLeft,
} from 'lucide-react'

// Animated counter component
function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  React.useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest)
    })
  }, [display])

  return <span ref={ref}>{displayValue}</span>
}

// Types
type Priority = 'P1' | 'P2' | 'P3'
type SupportRequested = 'Yes' | 'None at present' | 'N/A'
type RiskStatus = 'Open' | 'Mitigated' | 'Closed'

interface Risk {
  id: string
  priority: Priority
  site: string
  identifiedRisk: string
  riskOwner: string
  supportRequested: SupportRequested
  mitigation: string
  targetDate: string
  status: RiskStatus
  region: string
  riskType: string
}

// Priority config - Balanced professional colors (visible but not harsh)
const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string; barBg: string }> = {
  P1: { label: 'P1', color: 'text-[#C06060] dark:text-[#E08080]', bg: 'bg-[#FDF5F5] dark:bg-[#2D2020]', border: 'border-l-[#D88080]', barBg: 'bg-[#D88080] dark:bg-[#C87070]' },
  P2: { label: 'P2', color: 'text-[#B89040] dark:text-[#D8B060]', bg: 'bg-[#FDFAF2] dark:bg-[#2D2818]', border: 'border-l-[#D4B070]', barBg: 'bg-[#D4B070] dark:bg-[#C4A060]' },
  P3: { label: 'P3', color: 'text-[#4A9080] dark:text-[#70B8A8]', bg: 'bg-[#F2FAF8] dark:bg-[#182D28]', border: 'border-l-[#7FC0B0]', barBg: 'bg-[#7FC0B0] dark:bg-[#6FB0A0]' },
}

// Sample data
const risks: Risk[] = [
  { id: 'R001', priority: 'P1', site: 'WEN-Hub2-1', identifiedRisk: 'Awaiting Leadership Decision on Building Configuration', riskOwner: 'ODC+FeP+ELS', supportRequested: 'Yes', mitigation: 'Escalate to Brian for decision by May 25', targetDate: 'May 25, 2026', status: 'Open', region: 'NA-W', riskType: 'Funding / Approvals' },
  { id: 'R002', priority: 'P1', site: 'STB-Hub1-1', identifiedRisk: 'Major Permitting Delays in Jurisdiction', riskOwner: 'FeP', supportRequested: 'Yes', mitigation: 'Engage local jurisdiction lead; weekly status', targetDate: 'Ongoing', status: 'Open', region: 'NA-W', riskType: 'Permitting / Jurisdictional' },
  { id: 'R003', priority: 'P1', site: 'ARA-Hub1-1&2', identifiedRisk: 'Design stopped and redesigned', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'Redesign complete; awaiting AE submission', targetDate: 'Underway', status: 'Open', region: 'NA-E', riskType: 'Design / Engineering' },
  { id: 'R004', priority: 'P1', site: 'KAS-Hub1-1&2', identifiedRisk: 'Enlarger Kitchen Cut delay', riskOwner: 'ODC+ELS', supportRequested: 'Yes', mitigation: 'Cut scope reviewed; awaiting cost impact', targetDate: 'Under Development', status: 'Open', region: 'APAC', riskType: 'Design / Engineering' },
  { id: 'R005', priority: 'P1', site: 'KNC-Hub2-1&3', identifiedRisk: 'AE PO Delay & RFP delay', riskOwner: 'ODC', supportRequested: 'N/A', mitigation: 'AE engaged; PO target Jun 15', targetDate: 'Jun 15, 2026', status: 'Open', region: 'NA-E', riskType: 'Procurement / Contracting' },
  { id: 'R006', priority: 'P1', site: 'EBP-Hub1-1', identifiedRisk: 'YF initiation delay', riskOwner: 'ODC+FeP', supportRequested: 'Yes', mitigation: 'Cap Planning escalation in progress', targetDate: 'May 30, 2026', status: 'Open', region: 'EMEA', riskType: 'Funding / Approvals' },
  { id: 'R007', priority: 'P1', site: 'Legal Review (Construction)', identifiedRisk: 'Cycle time 74 days vs 30d target', riskOwner: 'ODC+ELS', supportRequested: 'Yes', mitigation: 'Hyperterm process under review; Legal lead engaged', targetDate: 'Ongoing', status: 'Open', region: 'NA-W', riskType: 'Operational Continuity' },
  { id: 'R008', priority: 'P1', site: 'CLC Construction Funding', identifiedRisk: 'Postponed for GR/VE', riskOwner: 'ODC', supportRequested: 'Yes', mitigation: 'Awaiting GR finalization', targetDate: 'Under Development', status: 'Open', region: 'NA-W', riskType: 'Funding / Approvals' },
  { id: 'R009', priority: 'P1', site: 'SA Guardrail Development', identifiedRisk: 'Slowing strategic SA portfolio', riskOwner: 'ODC', supportRequested: 'Yes', mitigation: 'Specification finalization in progress', targetDate: 'Underway', status: 'Open', region: 'EMEA', riskType: 'Procurement / Contracting' },
  { id: 'R010', priority: 'P2', site: 'CHB-Hub1-2', identifiedRisk: 'YAWN Civil Designer pending', riskOwner: 'FeP', supportRequested: 'None at present', mitigation: 'Designer assignment expected May 22', targetDate: 'May 22, 2026', status: 'Open', region: 'NA-E', riskType: 'Design / Engineering' },
  { id: 'R011', priority: 'P2', site: 'WXT-Hub1-2', identifiedRisk: 'Field condition discovered; PCO submitted', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'PCO under PgM review', targetDate: 'Underway', status: 'Open', region: 'NA-W', riskType: 'Field Conditions' },
  { id: 'R012', priority: 'P2', site: 'GBL-Hub2-1', identifiedRisk: 'RFP cycle extension', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'Bid evaluation in progress', targetDate: 'May 28, 2026', status: 'Open', region: 'EMEA', riskType: 'Procurement / Contracting' },
  { id: 'R013', priority: 'P2', site: 'ADC-Hub1-3', identifiedRisk: 'Multi-step PO delay', riskOwner: 'ODC', supportRequested: 'Yes', mitigation: 'Process audit triggered', targetDate: 'Underway', status: 'Open', region: 'APAC', riskType: 'Procurement / Contracting' },
  { id: 'R014', priority: 'P2', site: 'CHW-Hub1-1', identifiedRisk: 'RFP on hold pending APAC CLC POR', riskOwner: 'ODC+ELS', supportRequested: 'Yes', mitigation: 'POR finalization gated on Atishu', targetDate: 'Ongoing', status: 'Open', region: 'APAC', riskType: 'Procurement / Contracting' },
  { id: 'R015', priority: 'P2', site: 'NCH-Hub1-1', identifiedRisk: 'POR Variant design 95% (target late June)', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'Design completion on track', targetDate: 'Jun 30, 2026', status: 'Open', region: 'NA-W', riskType: 'Design / Engineering' },
  { id: 'R016', priority: 'P2', site: 'HDL-Hub1-1&2&3', identifiedRisk: 'Finance approval delay', riskOwner: 'ODC+FeP', supportRequested: 'Yes', mitigation: 'Escalation to Finance lead', targetDate: 'Jun 5, 2026', status: 'Open', region: 'NA-W', riskType: 'Funding / Approvals' },
  { id: 'R017', priority: 'P2', site: 'PYB-Hub1-1&2&3', identifiedRisk: 'MW Mismatch identified in BDP', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'BDP reconciliation in progress', targetDate: 'Underway', status: 'Open', region: 'NA-E', riskType: 'Design / Engineering' },
  { id: 'R018', priority: 'P2', site: 'SGL-Hub1-2', identifiedRisk: 'GC scope clarification pending', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'Scope meeting scheduled May 20', targetDate: 'May 20, 2026', status: 'Open', region: 'EMEA', riskType: 'Procurement / Contracting' },
  { id: 'R019', priority: 'P3', site: 'TRV-Hub1-1', identifiedRisk: 'Minor permit revision needed', riskOwner: 'FeP', supportRequested: 'None at present', mitigation: 'Revision submitted', targetDate: 'Jun 10, 2026', status: 'Open', region: 'NA-W', riskType: 'Permitting / Jurisdictional' },
  { id: 'R020', priority: 'P3', site: 'BRK-Hub2-1', identifiedRisk: 'Weather delay potential', riskOwner: 'ODC', supportRequested: 'N/A', mitigation: 'Monitoring weather patterns', targetDate: 'Ongoing', status: 'Open', region: 'NA-E', riskType: 'Field Conditions' },
  { id: 'R021', priority: 'P3', site: 'MLK-Hub1-2', identifiedRisk: 'Material lead time extended', riskOwner: 'ODC', supportRequested: 'None at present', mitigation: 'Alternative suppliers identified', targetDate: 'Jun 15, 2026', status: 'Open', region: 'EMEA', riskType: 'Procurement / Contracting' },
  { id: 'R022', priority: 'P3', site: 'QNS-Hub1-1', identifiedRisk: 'Utility coordination pending', riskOwner: 'FeP', supportRequested: 'None at present', mitigation: 'Utility meeting scheduled', targetDate: 'May 25, 2026', status: 'Open', region: 'NA-E', riskType: 'Permitting / Jurisdictional' },
]

// Closed risks
const closedRisks = [
  { id: 'RC01', site: 'VAN-Hub1-1', risk: 'AE contract negotiation delay', closedDate: 'May 3, 2026', reason: 'Contract signed', residualRisk: 'None' },
  { id: 'RC02', site: 'DEN-Hub2-1', risk: 'Permitting hold', closedDate: 'May 5, 2026', reason: 'Permit approved', residualRisk: 'None' },
  { id: 'RC03', site: 'PHX-Hub1-2', risk: 'Budget variance >10%', closedDate: 'May 8, 2026', reason: 'VE complete; within tolerance', residualRisk: 'Monitor at next gate' },
  { id: 'RC04', site: 'SEA-Hub1-1', risk: 'GC mobilization delay', closedDate: 'May 10, 2026', reason: 'GC on site', residualRisk: 'None' },
  { id: 'RC05', site: 'ATL-Hub2-2', risk: 'Design coordination issue', closedDate: 'May 12, 2026', reason: 'Coordination complete', residualRisk: 'None' },
  { id: 'RC06', site: 'BOS-Hub1-1', risk: 'Funding approval pending', closedDate: 'May 14, 2026', reason: 'PO issued', residualRisk: 'None' },
]

// Regional distribution
const regionalData = [
  { region: 'NA-W', total: 16, p1: 4, p2: 7, p3: 5 },
  { region: 'NA-E', total: 11, p1: 2, p2: 4, p3: 5 },
  { region: 'EMEA', total: 13, p1: 2, p2: 5, p3: 6 },
  { region: 'APAC', total: 7, p1: 1, p2: 2, p3: 4 },
]

// Risk type breakdown - Balanced colors
const riskTypeData = [
  { type: 'Design / Engineering', count: 12, color: 'bg-[#7FC0B0]' },
  { type: 'Procurement / Contracting', count: 9, color: 'bg-[#D4B070]' },
  { type: 'Permitting / Jurisdictional', count: 8, color: 'bg-[#C8A060]' },
  { type: 'Field Conditions', count: 7, color: 'bg-[#7898A8]' },
  { type: 'Funding / Approvals', count: 6, color: 'bg-[#80B8A0]' },
  { type: 'Operational Continuity', count: 5, color: 'bg-[#D88080]' },
]

// Ownership breakdown - Balanced colors
const ownershipData = [
  { owner: 'ODC alone', count: 18, color: 'bg-[#7898A8]' },
  { owner: 'ODC+FeP', count: 8, color: 'bg-[#D4B070]' },
  { owner: 'FeP alone', count: 6, color: 'bg-[#7FC0B0]' },
  { owner: 'ODC+FeP+ELS', count: 6, color: 'bg-[#C8A060]' },
  { owner: 'ODC+ELS', count: 5, color: 'bg-[#80B8A0]' },
  { owner: 'ELS alone', count: 4, color: 'bg-[#D88080]' },
]

// Trend data
const trendData = [
  { week: 'Feb 24', p1: 5 },
  { week: 'Mar 3', p1: 6 },
  { week: 'Mar 10', p1: 6 },
  { week: 'Mar 17', p1: 7 },
  { week: 'Mar 24', p1: 7 },
  { week: 'Mar 31', p1: 8 },
  { week: 'Apr 7', p1: 8 },
  { week: 'Apr 14', p1: 8 },
  { week: 'Apr 21', p1: 7 },
  { week: 'Apr 28', p1: 8 },
  { week: 'May 5', p1: 9, annotation: 'WEN-Hub2-1 escalated' },
  { week: 'May 12', p1: 9 },
  { week: 'May 19', p1: 9 },
]

export default function PortfolioRiskRegisterPage() {
  const [search, setSearch] = React.useState('')
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | 'All'>('All')
  const [regionFilter, setRegionFilter] = React.useState<string>('All')
  const [sortField, setSortField] = React.useState<keyof Risk>('priority')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')
  const [showClosed, setShowClosed] = React.useState(false)
  const [selectedRisk, setSelectedRisk] = React.useState<Risk | null>(null)

  // Filter and sort
  const filtered = React.useMemo(() => {
    return risks
      .filter(r => {
        if (priorityFilter !== 'All' && r.priority !== priorityFilter) return false
        if (regionFilter !== 'All' && r.region !== regionFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return r.site.toLowerCase().includes(q) || 
                 r.identifiedRisk.toLowerCase().includes(q) ||
                 r.riskOwner.toLowerCase().includes(q)
        }
        return true
      })
      .sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        if (sortDir === 'asc') return String(aVal).localeCompare(String(bVal))
        return String(bVal).localeCompare(String(aVal))
      })
  }, [search, priorityFilter, regionFilter, sortField, sortDir])

  const toggleSort = (field: keyof Risk) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const maxRegional = Math.max(...regionalData.map(r => r.total))

  return (
    <AppShell title="Risk Register">
      <div className="space-y-6 max-w-[1600px]">
        {/* Header Band */}
        <header className="bg-card rounded-xl p-6 md:p-8 border border-border">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link 
                  href="/reports" 
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to Reports"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <h1 className="text-sm md:text-base font-bold text-foreground">Portfolio Risk Register</h1>
              </div>
              <p className="text-xs text-muted-foreground ml-10">
                Active risks across all regions and projects · <span className="text-foreground font-medium">47 active risks</span> · 
                <span className="text-[#C06060] dark:text-[#E08080] ml-1">9 P1</span> · 
                <span className="text-[#B89040] dark:text-[#D8B060] ml-1">18 P2</span> · 
                <span className="text-[#4A9080] dark:text-[#70B8A8] ml-1">20 P3</span>
              </p>
              <div className="ml-10">
                <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider bg-gold text-navy rounded-full">
                  PORTFOLIO RISK REGISTER · MAY 2026
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'risk-register-may-2026', title: 'Portfolio Risk Register' })}
                className="h-9 px-4 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span> PDF
              </button>
              <button 
                onClick={() => exportToXLSX({ filename: 'risk-register-may-2026', title: 'Portfolio Risk Register', data: [], headers: [] })}
                className="h-9 px-4 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground hover:bg-navy/20 dark:hover:bg-white/20 border border-navy/30 dark:border-white/30 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span> XLSX
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-9 px-4 text-xs font-medium bg-gold/20 text-navy dark:text-foreground border border-gold hover:bg-gold/30 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>
          </div>
        </header>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Active Risks', value: 47, border: 'border-l-[#7898A8]' },
            { label: 'P1 (Critical)', value: 9, border: 'border-l-[#D88080]' },
            { label: 'P2 (High)', value: 18, border: 'border-l-[#D4B070]' },
            { label: 'P3 (Medium)', value: 20, border: 'border-l-[#7FC0B0]' },
            { label: 'Closed This Month', value: 6, border: 'border-l-[#80B8A0]' },
          ].map((kpi, index) => (
            <motion.div 
              key={kpi.label} 
              className={cn('bg-card border border-line rounded-xl p-4 border-l-4', kpi.border)}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            >
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">{kpi.label}</div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={kpi.value} duration={1.2} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regional Distribution Chart */}
        <motion.div 
          className="bg-card border border-line rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Regional Distribution</h2>
          <div className="space-y-3">
            {regionalData.map((r, rowIndex) => (
              <motion.div 
                key={r.region} 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + rowIndex * 0.1 }}
              >
                <div className="w-16 text-xs font-medium text-muted-foreground">{r.region}</div>
                <div className="flex-1 h-8 bg-secondary/30 rounded-lg overflow-hidden flex">
                  <motion.div
                    className="h-full bg-[#D88080] dark:bg-[#C87070] flex items-center justify-center text-[10px] font-semibold text-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.p1 / maxRegional) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + rowIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {r.p1 > 0 && r.p1}
                  </motion.div>
                  <motion.div
                    className="h-full bg-[#D4B070] dark:bg-[#C4A060] flex items-center justify-center text-[10px] font-semibold text-[#4A3820]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.p2 / maxRegional) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.9 + rowIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {r.p2 > 0 && r.p2}
                  </motion.div>
                  <motion.div
                    className="h-full bg-[#7FC0B0] dark:bg-[#6FB0A0] flex items-center justify-center text-[10px] font-semibold text-[#1A3830]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.p3 / maxRegional) * 100}%` }}
                    transition={{ duration: 0.8, delay: 1.0 + rowIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {r.p3 > 0 && r.p3}
                  </motion.div>
                </div>
                <motion.div 
                  className="w-12 text-right text-sm font-semibold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.2 + rowIndex * 0.1 }}
                >
                  {r.total}
                </motion.div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="flex items-center gap-4 mt-4 pt-3 border-t border-line text-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D88080]" /> P1 Critical</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D4B070]" /> P2 High</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#7FC0B0]" /> P3 Medium</span>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Table */}
          <div className="xl:col-span-3 bg-card border border-line rounded-xl overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search risks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 text-sm bg-secondary/50 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
                  className="h-9 px-3 text-xs bg-secondary/50 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="All">All Priorities</option>
                  <option value="P1">P1 Critical</option>
                  <option value="P2">P2 High</option>
                  <option value="P3">P3 Medium</option>
                </select>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="h-9 px-3 text-xs bg-secondary/50 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="All">All Regions</option>
                  <option value="NA-W">NA-W</option>
                  <option value="NA-E">NA-E</option>
                  <option value="EMEA">EMEA</option>
                  <option value="APAC">APAC</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/30 border-b border-line">
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">
                      <button onClick={() => toggleSort('priority')} className="inline-flex items-center gap-1 hover:text-foreground">
                        Priority <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">
                      <button onClick={() => toggleSort('site')} className="inline-flex items-center gap-1 hover:text-foreground">
                        Site <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground hidden lg:table-cell">Identified Risk</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground hidden md:table-cell">Owner</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground hidden xl:table-cell">Support</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground hidden xl:table-cell">Mitigation</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Target</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((risk) => {
                    const cfg = priorityConfig[risk.priority]
                    return (
                      <tr 
                        key={risk.id}
                        onClick={() => setSelectedRisk(risk)}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-secondary/30',
                          risk.priority === 'P1' && 'bg-[#FDF5F5] dark:bg-[#2D2020]',
                          risk.priority === 'P2' && 'bg-[#FDFAF2] dark:bg-[#2D2818]'
                        )}
                      >
                        <td className="px-3 py-3">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', cfg.bg, cfg.color)}>
                            {risk.priority}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-foreground">{risk.site}</div>
                          <div className="text-[10px] text-muted-foreground lg:hidden mt-0.5 line-clamp-1">{risk.identifiedRisk}</div>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <div className="line-clamp-2 text-foreground max-w-xs">{risk.identifiedRisk}</div>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className="text-foreground">{risk.riskOwner}</span>
                        </td>
                        <td className="px-3 py-3 hidden xl:table-cell">
                          <span className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded',
                            risk.supportRequested === 'Yes' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            risk.supportRequested === 'N/A' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                            'bg-secondary text-muted-foreground'
                          )}>
                            {risk.supportRequested}
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden xl:table-cell">
                          <div className="line-clamp-2 text-muted-foreground max-w-xs">{risk.mitigation}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-foreground whitespace-nowrap">{risk.targetDate}</span>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {risk.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-line text-xs text-muted-foreground">
              Showing {filtered.length} of {risks.length} risks
            </div>
          </div>

          {/* Right Rail */}
          <div className="space-y-4">
            {/* Risk Type Breakdown */}
            <motion.div 
              className="bg-card border border-line rounded-xl p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" /> Risk Type Breakdown
              </h3>
              <div className="space-y-2">
                {riskTypeData.map((t, index) => (
                  <motion.div 
                    key={t.type} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <span className={cn('w-3 h-3 rounded-sm', t.color)} />
                    <span className="flex-1 text-[11px] text-muted-foreground truncate">{t.type}</span>
                    <span className="text-xs font-semibold text-foreground">
                      <AnimatedNumber value={t.count} duration={0.8} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ownership Breakdown */}
            <motion.div 
              className="bg-card border border-line rounded-xl p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" /> Ownership Breakdown
              </h3>
              <div className="space-y-2">
                {ownershipData.map((o, index) => (
                  <motion.div 
                    key={o.owner} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <span className={cn('w-3 h-3 rounded-sm', o.color)} />
                    <span className="flex-1 text-[11px] text-muted-foreground">{o.owner}</span>
                    <span className="text-xs font-semibold text-foreground">
                      <AnimatedNumber value={o.count} duration={0.8} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* P1 Trend */}
            <motion.div 
              className="bg-card border border-line rounded-xl p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-gold" /> P1 Trend (13 weeks)
              </h3>
              <div className="h-20 flex items-end justify-between gap-1 px-1">
                {trendData.map((d, i) => {
                  const maxP1 = 12
                  const barHeight = Math.max((d.p1 / maxP1) * 80, 6)
                  return (
                    <motion.div 
                      key={i} 
                      className="group relative flex-1 flex items-end justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.8 + i * 0.03 }}
                    >
                      <motion.div 
                        className={cn(
                          'w-full max-w-[12px] rounded-t-sm hover:opacity-80',
                          d.annotation ? 'bg-[#C87070]' : 'bg-[#D88080]'
                        )}
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.9 + i * 0.05,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      />
                      {d.annotation && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy text-white text-[9px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          {d.annotation}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
                <span>Feb 24</span>
                <span>May 19</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Closed Risks */}
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <button
            onClick={() => setShowClosed(!showClosed)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">Risks Closed This Month ({closedRisks.length})</span>
            {showClosed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showClosed && (
            <div className="border-t border-line">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Site</th>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground hidden sm:table-cell">Risk</th>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Closed</th>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground hidden md:table-cell">Reason</th>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground hidden lg:table-cell">Residual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {closedRisks.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/20">
                      <td className="px-4 py-2 font-medium text-foreground">{r.site}</td>
                      <td className="px-4 py-2 text-muted-foreground hidden sm:table-cell">{r.risk}</td>
                      <td className="px-4 py-2 text-foreground">{r.closedDate}</td>
                      <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">{r.reason}</td>
                      <td className="px-4 py-2 hidden lg:table-cell">
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded',
                          r.residualRisk === 'None' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        )}>
                          {r.residualRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-muted-foreground py-4">
          Source: Risk Register entries from PgM weekly reviews · Regional Summary slides · merged via odc_semantic.risk_register_v1
        </footer>
      </div>

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedRisk(null)}>
          <div 
            className="bg-card border border-line rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-line flex items-start justify-between">
              <div>
                <span className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold',
                  priorityConfig[selectedRisk.priority].bg,
                  priorityConfig[selectedRisk.priority].color
                )}>
                  {selectedRisk.priority}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2">{selectedRisk.site}</h3>
                <p className="text-xs text-muted-foreground">{selectedRisk.region}</p>
              </div>
              <button onClick={() => setSelectedRisk(null)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Identified Risk</div>
                <div className="text-sm text-foreground">{selectedRisk.identifiedRisk}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Risk Owner</div>
                  <div className="text-sm text-foreground">{selectedRisk.riskOwner}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Support Requested</div>
                  <div className="text-sm text-foreground">{selectedRisk.supportRequested}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Mitigation</div>
                <div className="text-sm text-foreground">{selectedRisk.mitigation}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Target Date</div>
                  <div className="text-sm text-foreground">{selectedRisk.targetDate}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Risk Type</div>
                  <div className="text-sm text-foreground">{selectedRisk.riskType}</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-line flex justify-end gap-2">
              <button 
                onClick={() => setSelectedRisk(null)}
                className="h-9 px-4 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="h-9 px-4 text-sm font-medium bg-gold hover:bg-gold-hover text-navy rounded-lg transition-colors">
                View Full History
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

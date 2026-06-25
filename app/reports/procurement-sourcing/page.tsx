'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { exportToPDF, exportToSlides } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ArrowLeft,
  Calendar,
} from 'lucide-react'

// ============================================================
// Types
// ============================================================

type Tab = 'GC' | 'AE'
type SubTab = 'rfp' | 'awarded'

interface RFPRow {
  id: string
  project: string
  region: string
  status: string
  daysInStatus: number
  targetAwardDate: string
  risk: 'On track' | 'Amber' | 'Red'
}

interface AwardedRow {
  id: string
  project: string
  region: string
  awardedVendor: string
  awardDate: string
  bidValue: number
  variancePercent: number
}

interface CostManager {
  name: string
  projectsCovered: number
  avgBidVariance: number
  activeRFPs: number
}

// ============================================================
// Mock Data
// ============================================================

const gcRFPs: RFPRow[] = [
  { id: 'R1', project: 'KNC-Hub2-1&3', region: 'NA-W', status: 'BAFO discussions', daysInStatus: 12, targetAwardDate: 'Jun 15, 2026', risk: 'On track' },
  { id: 'R2', project: 'STB-Hub1-1', region: 'EMEA', status: '(neg bid) Bid evaluation', daysInStatus: 8, targetAwardDate: 'Jun 8, 2026', risk: 'On track' },
  { id: 'R3', project: 'CHB-Hub1-2', region: 'APAC', status: 'Bid returns', daysInStatus: 3, targetAwardDate: 'Jun 22, 2026', risk: 'On track' },
  { id: 'R4', project: 'WEN-Hub2-1', region: 'NA-W', status: 'Waiting for leadership decision before Award Letter', daysInStatus: 21, targetAwardDate: 'Jun 2, 2026', risk: 'Amber' },
  { id: 'R5', project: 'GBL-Hub2-1', region: 'EMEA', status: 'Final cost assessment done', daysInStatus: 5, targetAwardDate: 'May 28, 2026', risk: 'On track' },
  { id: 'R6', project: 'CHW-Hub1-1', region: 'APAC', status: 'RFP on hold pending APAC CLC POR', daysInStatus: 34, targetAwardDate: 'TBD', risk: 'Red' },
  { id: 'R7', project: 'EWD-Hub1-1', region: 'NA-W', status: 'RFP prelim review with PMs & Estimating', daysInStatus: 14, targetAwardDate: 'Jul 1, 2026', risk: 'On track' },
  { id: 'R8', project: 'NCH-Hub1-1', region: 'NA-W', status: 'RFP being prepared for issue', daysInStatus: 4, targetAwardDate: 'Jul 15, 2026', risk: 'On track' },
  { id: 'R9', project: 'HRF-Hub2-1', region: 'NA-W', status: 'RFP sent to suppliers', daysInStatus: 11, targetAwardDate: 'Jun 30, 2026', risk: 'On track' },
  { id: 'R10', project: 'PCH-Hub1-1', region: 'NA-W', status: 'Just initiated', daysInStatus: 2, targetAwardDate: 'Aug 1, 2026', risk: 'On track' },
  { id: 'R11', project: 'MNT-Hub1-2', region: 'NA-E', status: 'Final RTA deck done awaiting next steps', daysInStatus: 6, targetAwardDate: 'Jun 25, 2026', risk: 'On track' },
  { id: 'R12', project: 'VLY-Hub2-1', region: 'EMEA', status: 'BAFO discussions', daysInStatus: 9, targetAwardDate: 'Jun 18, 2026', risk: 'On track' },
  { id: 'R13', project: 'PKW-Hub1-1', region: 'NA-W', status: 'Bid returns', daysInStatus: 5, targetAwardDate: 'Jul 8, 2026', risk: 'On track' },
  { id: 'R14', project: 'SFO-Hub1-3', region: 'NA-W', status: 'RFP sent to suppliers', daysInStatus: 7, targetAwardDate: 'Jul 22, 2026', risk: 'On track' },
]

const gcAwarded: AwardedRow[] = [
  { id: 'A1', project: 'UNO-Hub1-2', region: 'NA-W', awardedVendor: 'Turner/Meadowlark', awardDate: 'Feb 12, 2026', bidValue: 34.2, variancePercent: 3 },
  { id: 'A2', project: 'RED-Hub1-1&2', region: 'NA-W', awardedVendor: 'GCON', awardDate: 'Feb 20, 2026', bidValue: 48.1, variancePercent: -1 },
  { id: 'A3', project: 'NBF-Hub1-2', region: 'NA-W', awardedVendor: 'BOYD JONES', awardDate: 'Feb 28, 2026', bidValue: 29.7, variancePercent: 2 },
  { id: 'A4', project: 'ARA-Hub1-1&2', region: 'NA-E', awardedVendor: 'Trinity', awardDate: 'Mar 15, 2026', bidValue: 52.4, variancePercent: 5 },
  { id: 'A5', project: 'KNC-Hub1-1&2&3', region: 'NA-W', awardedVendor: 'JE Dunn', awardDate: 'Apr 3, 2026', bidValue: 61.8, variancePercent: -2 },
  { id: 'A6', project: 'EBP-Hub1-1', region: 'APAC', awardedVendor: 'Developer GC', awardDate: 'Apr 18, 2026', bidValue: 38.5, variancePercent: 8 },
  { id: 'A7', project: 'CLB-Hub1-3', region: 'NA-E', awardedVendor: '3C', awardDate: 'Apr 22, 2026', bidValue: 27.9, variancePercent: -3 },
  { id: 'A8', project: 'STY-Hub1-2&3', region: 'NA-W', awardedVendor: 'Devcon', awardDate: 'May 1, 2026', bidValue: 44.3, variancePercent: 1 },
  { id: 'A9', project: 'CHN-Hub1-1&2', region: 'APAC', awardedVendor: 'CNT', awardDate: 'May 4, 2026', bidValue: 33.6, variancePercent: -4 },
  { id: 'A10', project: 'ADC-Hub1-3', region: 'NA-E', awardedVendor: 'GCON', awardDate: 'May 10, 2026', bidValue: 51.2, variancePercent: 6 },
  { id: 'A11', project: 'GOR-Hub1-1&2', region: 'NA-W', awardedVendor: 'GCON', awardDate: 'May 12, 2026', bidValue: 39.8, variancePercent: 2 },
]

const aeRFPs: RFPRow[] = [
  { id: 'AR1', project: 'PNX-Hub1-2', region: 'NA-W', status: 'RFP sent to suppliers', daysInStatus: 8, targetAwardDate: 'Jun 10, 2026', risk: 'On track' },
  { id: 'AR2', project: 'BLR-Hub2-1', region: 'APAC', status: 'Bid returns', daysInStatus: 4, targetAwardDate: 'Jun 5, 2026', risk: 'On track' },
  { id: 'AR3', project: 'DUB-Hub1-1', region: 'EMEA', status: 'BAFO discussions', daysInStatus: 6, targetAwardDate: 'May 30, 2026', risk: 'On track' },
  { id: 'AR4', project: 'ATL-Hub1-3', region: 'NA-E', status: '(neg bid) Bid evaluation', daysInStatus: 11, targetAwardDate: 'Jun 15, 2026', risk: 'Amber' },
  { id: 'AR5', project: 'SYD-Hub2-1', region: 'APAC', status: 'RFP prelim review with PMs & Estimating', daysInStatus: 3, targetAwardDate: 'Jul 1, 2026', risk: 'On track' },
  { id: 'AR6', project: 'LAX-Hub1-2', region: 'NA-W', status: 'Just initiated', daysInStatus: 1, targetAwardDate: 'Aug 15, 2026', risk: 'On track' },
  { id: 'AR7', project: 'FRA-Hub1-1', region: 'EMEA', status: 'Final cost assessment done', daysInStatus: 2, targetAwardDate: 'May 25, 2026', risk: 'On track' },
  { id: 'AR8', project: 'ORD-Hub2-1', region: 'NA-E', status: 'RFP being prepared for issue', daysInStatus: 5, targetAwardDate: 'Jul 20, 2026', risk: 'On track' },
]

const aeAwarded: AwardedRow[] = [
  { id: 'AA1', project: 'MIA-Hub1-1', region: 'NA-E', awardedVendor: 'Arcadis', awardDate: 'Jan 15, 2026', bidValue: 4.2, variancePercent: -2 },
  { id: 'AA2', project: 'SEA-Hub1-2', region: 'NA-W', awardedVendor: 'DLR', awardDate: 'Feb 8, 2026', bidValue: 3.8, variancePercent: 1 },
  { id: 'AA3', project: 'LHR-Hub1-1', region: 'EMEA', awardedVendor: 'CTA', awardDate: 'Feb 22, 2026', bidValue: 5.1, variancePercent: 3 },
  { id: 'AA4', project: 'SIN-Hub2-1', region: 'APAC', awardedVendor: 'Planquadrat', awardDate: 'Mar 5, 2026', bidValue: 4.6, variancePercent: -1 },
  { id: 'AA5', project: 'MEL-Hub1-2', region: 'APAC', awardedVendor: 'Aurecon', awardDate: 'Mar 18, 2026', bidValue: 3.2, variancePercent: 0 },
  { id: 'AA6', project: 'DFW-Hub1-1', region: 'NA-W', awardedVendor: 'RKD', awardDate: 'Apr 2, 2026', bidValue: 4.9, variancePercent: 4 },
  { id: 'AA7', project: 'AMS-Hub1-3', region: 'EMEA', awardedVendor: 'ARUP', awardDate: 'Apr 15, 2026', bidValue: 6.2, variancePercent: -3 },
  { id: 'AA8', project: 'HKG-Hub1-1', region: 'APAC', awardedVendor: 'Mola', awardDate: 'Apr 28, 2026', bidValue: 3.5, variancePercent: 2 },
  { id: 'AA9', project: 'BOS-Hub2-1', region: 'NA-E', awardedVendor: 'WSP', awardDate: 'May 8, 2026', bidValue: 4.1, variancePercent: -2 },
]

const costManagers: CostManager[] = [
  { name: 'Ruairi', projectsCovered: 18, avgBidVariance: -1.2, activeRFPs: 4 },
  { name: 'Gabby', projectsCovered: 14, avgBidVariance: 0.8, activeRFPs: 3 },
  { name: 'Sean', projectsCovered: 22, avgBidVariance: 2.1, activeRFPs: 5 },
  { name: 'Otsigh', projectsCovered: 11, avgBidVariance: -0.5, activeRFPs: 2 },
]

const rfpStatusDistribution = [
  { status: 'BAFO discussions', count: 3, color: 'bg-green', strokeColor: '#22c55e' },
  { status: 'Bid returns', count: 2, color: 'bg-emerald-400', strokeColor: '#34d399' },
  { status: 'RFP sent to suppliers', count: 4, color: 'bg-gold', strokeColor: '#D4A04C' },
  { status: '(neg bid) Bid evaluation', count: 2, color: 'bg-amber-500', strokeColor: '#f59e0b' },
  { status: 'Final cost assessment done', count: 1, color: 'bg-teal-500', strokeColor: '#14b8a6' },
  { status: 'RFP prelim review', count: 3, color: 'bg-slate-400', strokeColor: '#94a3b8' },
  { status: 'Waiting for leadership decision', count: 2, color: 'bg-orange-500', strokeColor: '#f97316' },
  { status: 'Just initiated', count: 1, color: 'bg-slate-300', strokeColor: '#cbd5e1' },
  { status: 'RFP being prepared', count: 1, color: 'bg-indigo-400', strokeColor: '#818cf8' },
  { status: 'RFP on hold', count: 1, color: 'bg-red-500', strokeColor: '#ef4444' },
  { status: 'Final RTA deck done', count: 0, color: 'bg-green', strokeColor: '#22c55e' },
]

// ============================================================
// Helper Components
// ============================================================

function KPICard({ 
  label, 
  value, 
  subtitle,
  status = 'neutral',
  icon: Icon 
}: { 
  label: string
  value: string | number
  subtitle?: string
  status?: 'green' | 'amber' | 'red' | 'neutral'
  icon?: React.ElementType
}) {
  const borderColor = {
    green: 'border-l-emerald-500',
    amber: 'border-l-gold',
    red: 'border-l-red-500',
    neutral: 'border-l-slate-400 dark:border-l-slate-500',
  }[status]

  return (
    <div className={cn(
      'bg-card border border-line rounded-lg p-4 border-l-4',
      borderColor
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            status === 'green' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            status === 'amber' && 'bg-gold/10 text-gold',
            status === 'red' && 'bg-red-500/10 text-red-500',
            status === 'neutral' && 'bg-muted text-muted-foreground'
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  )
}

function RiskBadge({ risk }: { risk: 'On track' | 'Amber' | 'Red' }) {
  const config = {
    'On track': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    'Amber': 'bg-gold/10 text-gold border-gold/20',
    'Red': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  }[risk]
  
  return (
    <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full border', config)}>
      {risk}
    </span>
  )
}

function VarianceBadge({ variance }: { variance: number }) {
  const isPositive = variance > 0
  const isNeutral = variance === 0
  const isHigh = Math.abs(variance) >= 5
  
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-xs font-medium',
      isNeutral && 'text-muted-foreground',
      isPositive && (isHigh ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'),
      !isPositive && !isNeutral && 'text-emerald-600 dark:text-emerald-400'
    )}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{variance}% {isPositive ? 'over' : isNeutral ? '' : 'under'}
    </span>
  )
}

function RegionBadge({ region }: { region: string }) {
  return (
    <span className="px-2 py-0.5 text-[10px] font-mono bg-secondary text-muted-foreground rounded border border-line">
      {region}
    </span>
  )
}

// ============================================================
// Main Component
// ============================================================

export default function ProcurementSourcingReportPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('GC')
  const [activeSubTab, setActiveSubTab] = React.useState<SubTab>('rfp')
  const [search, setSearch] = React.useState('')
  const [showCostManagers, setShowCostManagers] = React.useState(true)

  // Get data based on active tabs
  const rfpData = activeTab === 'GC' ? gcRFPs : aeRFPs
  const awardedData = activeTab === 'GC' ? gcAwarded : aeAwarded

  // Filter by search
  const filteredRFPs = React.useMemo(() => {
    if (!search.trim()) return rfpData
    const q = search.toLowerCase()
    return rfpData.filter(r => 
      r.project.toLowerCase().includes(q) || 
      r.region.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    )
  }, [rfpData, search])

  const filteredAwarded = React.useMemo(() => {
    if (!search.trim()) return awardedData
    const q = search.toLowerCase()
    return awardedData.filter(r => 
      r.project.toLowerCase().includes(q) || 
      r.region.toLowerCase().includes(q) ||
      r.awardedVendor.toLowerCase().includes(q)
    )
  }, [awardedData, search])

  // Calculate totals for donut chart
  const totalRFPs = rfpStatusDistribution.reduce((sum, s) => sum + s.count, 0)

  return (
    <AppShell title="Procurement & Sourcing">
      <div className="space-y-6 max-w-[1600px]">
        
        {/* ─── Header Band ─── */}
        <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
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
                <h1 className="text-sm md:text-base font-bold text-foreground">Procurement & Sourcing Status</h1>
              </div>
              <p className="text-muted-foreground text-xs ml-10">GC and A/E procurement pipeline · presented by Sean Keegan</p>
              <div className="ml-10">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold text-navy rounded-full">
                  Procurement & Sourcing · May 2026
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'procurement-sourcing-may-2026', title: 'Procurement & Sourcing Status' })}
                className="h-9 px-4 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button 
                onClick={() => exportToSlides({ filename: 'procurement-sourcing-may-2026', title: 'Procurement & Sourcing Status' })}
                className="h-9 px-4 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground hover:bg-navy/20 dark:hover:bg-white/20 border border-navy/30 dark:border-white/30 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export to Slides
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-9 px-4 text-xs font-medium bg-gold/20 text-navy dark:text-foreground border border-gold hover:bg-gold/30 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>
          </div>
        </div>

        {/* ──����� KPI Strip ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard 
            label="RFPs in Process (GC)" 
            value={14} 
            status="neutral"
            icon={FileCheck}
          />
          <KPICard 
            label="RFPs in Process (A/E)" 
            value={8} 
            status="neutral"
            icon={FileCheck}
          />
          <KPICard 
            label="Awarded YTD (GC)" 
            value={11} 
            status="green"
            icon={CheckCircle2}
          />
          <KPICard 
            label="Awarded YTD (A/E)" 
            value={9} 
            status="green"
            icon={CheckCircle2}
          />
          <KPICard 
            label="Avg RFP Cycle" 
            value="47d"
            subtitle="Bid sent → Award"
            status="amber"
            icon={Clock}
          />
        </div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          
          {/* ─── Left Column: Tables ─── */}
          <div className="space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Main Tabs */}
                <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
                  {(['GC', 'AE'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'px-4 py-2 text-xs font-medium rounded-md transition-colors',
                        activeTab === tab 
                          ? 'bg-[#D4A04C] text-[#1B2B4B] shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                      )}
                    >
                      {tab === 'GC' ? 'General Contractors' : 'Architect / Engineer'}
                    </button>
                  ))}
                </div>
                
                {/* Sub Tabs */}
                <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
                  {(['rfp', 'awarded'] as SubTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubTab(tab)}
                      className={cn(
                        'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                        activeSubTab === tab 
                          ? 'bg-card text-foreground shadow-sm border border-line' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tab === 'rfp' ? 'RFPs in Process' : 'Awarded in 2026'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 h-9 pl-9 pr-4 text-sm bg-secondary/50 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            {/* RFPs Table */}
            {activeSubTab === 'rfp' && (
              <div className="bg-card border border-line rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50 border-b border-line">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Project</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Region</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">RFP Status</th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Days</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Target Award</th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredRFPs.map((row) => (
                        <tr 
                          key={row.id} 
                          className={cn(
                            'hover:bg-secondary/30 transition-colors',
                            row.risk === 'Red' && 'bg-red-500/5',
                            row.risk === 'Amber' && 'bg-gold/5'
                          )}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{row.project}</td>
                          <td className="px-4 py-3"><RegionBadge region={row.region} /></td>
                          <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate" title={row.status}>{row.status}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell">{row.daysInStatus}d</td>
                          <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{row.targetAwardDate}</td>
                          <td className="px-4 py-3 text-center"><RiskBadge risk={row.risk} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-line bg-secondary/30 text-xs text-muted-foreground">
                  Showing {filteredRFPs.length} of {rfpData.length} RFPs
                </div>
              </div>
            )}

            {/* Awarded Table */}
            {activeSubTab === 'awarded' && (
              <div className="bg-card border border-line rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50 border-b border-line">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Project</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Region</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Awarded {activeTab === 'GC' ? 'GC' : 'A/E'}</th>
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Award Date</th>
                        <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bid Value</th>
                        <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredAwarded.map((row) => (
                        <tr 
                          key={row.id} 
                          className={cn(
                            'hover:bg-secondary/30 transition-colors',
                            row.variancePercent >= 5 && 'bg-red-500/5'
                          )}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{row.project}</td>
                          <td className="px-4 py-3"><RegionBadge region={row.region} /></td>
                          <td className="px-4 py-3 text-muted-foreground">{row.awardedVendor}</td>
                          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.awardDate}</td>
                          <td className="px-4 py-3 text-right font-mono text-foreground">${row.bidValue}M</td>
                          <td className="px-4 py-3 text-right hidden lg:table-cell"><VarianceBadge variance={row.variancePercent} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-line bg-secondary/30 text-xs text-muted-foreground">
                  Showing {filteredAwarded.length} of {awardedData.length} awards
                </div>
              </div>
            )}

            {/* ─── Cost Manager Assignment Panel ─── */}
            <div className="bg-card border border-line rounded-xl overflow-hidden">
              <button
                onClick={() => setShowCostManagers(!showCostManagers)}
                className="w-full px-4 py-3 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Cost Manager Assignment</span>
                </div>
                {showCostManagers ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </button>
              
              {showCostManagers && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cost Manager</th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Projects</th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Avg Bid Variance</th>
                        <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active RFPs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {costManagers.map((cm) => (
                        <tr key={cm.name} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{cm.name}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{cm.projectsCovered} projects</td>
                          <td className="px-4 py-3 text-center"><VarianceBadge variance={cm.avgBidVariance} /></td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-gold/10 text-gold rounded-full">
                              {cm.activeRFPs}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right Rail: Status Distribution ─── */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-card border border-line rounded-xl p-4 overflow-hidden">
              <h3 className="text-sm font-semibold text-foreground mb-4">RFP Status Distribution</h3>
              
              {/* Animated Donut Chart */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let cumulative = 0
                      return rfpStatusDistribution.filter(s => s.count > 0).map((status, i) => {
                        const percentage = (status.count / totalRFPs) * 100
                        const circumference = 2 * Math.PI * 40
                        const strokeLength = (percentage / 100) * circumference
                        const rotation = cumulative
                        cumulative += percentage
                        
                        return (
                          <motion.circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            strokeWidth="18"
                            stroke={status.strokeColor}
                            strokeLinecap="round"
                            strokeDasharray={`${strokeLength} ${circumference}`}
                            strokeDashoffset={0}
                            style={{ 
                              transformOrigin: '50% 50%',
                              rotate: `${rotation * 3.6}deg`
                            }}
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray: `${strokeLength} ${circumference}` }}
                            transition={{ 
                              duration: 1, 
                              delay: 0.5 + i * 0.08,
                              ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={{ 
                              strokeWidth: 22,
                              filter: 'brightness(1.1)'
                            }}
                            className="cursor-pointer transition-all"
                          />
                        )
                      })
                    })()}
                    {/* Inner circle for donut hole */}
                    <circle cx="50" cy="50" r="28" className="fill-card" />
                  </svg>
                  
                  {/* Center content with animation */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        {totalRFPs}
                      </motion.div>
                      <div className="text-[10px] text-muted-foreground">Total</div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Animated Legend */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {rfpStatusDistribution.map((status, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center justify-between text-xs group cursor-pointer hover:bg-secondary/50 rounded-md px-2 py-1.5 -mx-2 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.strokeColor }}
                        whileHover={{ scale: 1.3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[160px]" title={status.status}>
                        {status.status}
                      </span>
                    </div>
                    <motion.span 
                      className="font-mono font-medium text-foreground bg-secondary/70 px-2 py-0.5 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      {status.count}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Annotation Card with animation */}
            <motion.div 
              className="bg-gold/5 border border-gold/20 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 2, repeat: 2 }}
                >
                  <AlertTriangle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                </motion.div>
                <div>
                  <p className="text-xs font-medium text-foreground">Internal Target</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average RFP cycle should be &lt;40 days. Current performance is 47 days, primarily due to extended leadership decision queues.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── Footer ─── */}
        <div className="border-t border-line pt-4">
          <p className="text-[10px] text-muted-foreground text-center">
            Source: Procurement tracker (Sean Keegan) and Sourcing milestones from eBuilder via odc_semantic.procurement_pipeline.
          </p>
        </div>
      </div>
    </AppShell>
  )
}

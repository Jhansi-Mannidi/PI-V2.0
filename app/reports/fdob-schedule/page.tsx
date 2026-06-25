'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { exportToPDF, exportToXLSX } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Target,
  Minus,
  BarChart3,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppShell } from '@/components/app-shell'
import { TrendChart } from '@/components/trend-chart'

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const regionalTargets = {
  'APAC': { designToCA: 11, caToFDOB: 13 },
  'EMEA': { designToCA: 15, caToFDOB: 16 },
  'NA-East': { designToCA: 13.5, caToFDOB: 15 },
  'NA-West': { designToCA: 13.5, caToFDOB: 15 },
}

const regionalData = [
  { region: 'APAC', withinTarget: 16, total: 26, performance: 62, trend: -2, outliers: [
    { project: 'CHB-Hub1-2', variance: '+1.8m' },
    { project: 'KAY-Hub1-1', variance: '+2.4m' },
    { project: 'MNK-Hub2-1', variance: '+3.1m' },
  ]},
  { region: 'EMEA', withinTarget: 20, total: 27, performance: 74, trend: +3, outliers: [
    { project: 'STB-Hub1-1', variance: '+5.1m' },
    { project: 'VLB-Hub2-1', variance: '+4.7m' },
    { project: 'WES-Hub1-2', variance: '+3.9m' },
  ]},
  { region: 'NA-East', withinTarget: 14, total: 18, performance: 78, trend: +2, outliers: [
    { project: 'SGR-Hub1-1', variance: '+2.6m' },
    { project: 'CLB-Hub1-3', variance: '+2.1m' },
    { project: 'EBP-Hub1-1', variance: '+1.9m' },
  ]},
  { region: 'NA-West', withinTarget: 11, total: 16, performance: 69, trend: -1, outliers: [
    { project: 'ARA-Hub1-1&2', variance: '+4.2m' },
    { project: 'KNC-Hub2-1&3', variance: '+3.8m' },
    { project: 'KAS-Hub1-1&2', variance: '+2.9m' },
  ]},
]

const outlierProjects = [
  { id: 'P001', project: 'ARA-Hub1-1&2', region: 'NA-West', pgm: 'Lisa McIntyre', gc: 'Turner/Meadowlark', designPlan: '13.5m', designActual: '17.7m', designVar: '+4.2m', caPlan: '15m', caActual: '16.1m', caVar: '+1.1m', withinTarget: false, narrative: 'Design stopped and redesigned' },
  { id: 'P002', project: 'KNC-Hub2-1&3', region: 'NA-West', pgm: 'Lisa McIntyre', gc: 'JE Dunn', designPlan: '13.5m', designActual: '17.3m', designVar: '+3.8m', caPlan: '15m', caActual: '15.4m', caVar: '+0.4m', withinTarget: false, narrative: 'AE PO Delay & RFP delay' },
  { id: 'P003', project: 'STB-Hub1-1', region: 'EMEA', pgm: 'Paul Cahill', gc: 'Stecon', designPlan: '15m', designActual: '20.1m', designVar: '+5.1m', caPlan: '16m', caActual: '16.8m', caVar: '+0.8m', withinTarget: false, narrative: 'Major Permitting Delays in Jurisdiction' },
  { id: 'P004', project: 'KAS-Hub1-1&2', region: 'NA-West', pgm: 'Loren Smith', gc: 'Caliente', designPlan: '13.5m', designActual: '16.4m', designVar: '+2.9m', caPlan: '15m', caActual: '15.6m', caVar: '+0.6m', withinTarget: false, narrative: 'Enlarger Kitchen Cut delay' },
  { id: 'P005', project: 'VLB-Hub2-1', region: 'EMEA', pgm: 'Sarah Connor', gc: 'BAM', designPlan: '15m', designActual: '19.7m', designVar: '+4.7m', caPlan: '16m', caActual: '16.2m', caVar: '+0.2m', withinTarget: false, narrative: 'Land acquisition delay' },
  { id: 'P006', project: 'WES-Hub1-2', region: 'EMEA', pgm: 'Paul Cahill', gc: 'Skanska', designPlan: '15m', designActual: '18.9m', designVar: '+3.9m', caPlan: '16m', caActual: '16.5m', caVar: '+0.5m', withinTarget: false, narrative: 'Environmental impact assessment extended' },
  { id: 'P007', project: 'MNK-Hub2-1', region: 'APAC', pgm: 'Wei Chen', gc: 'Obayashi', designPlan: '11m', designActual: '14.1m', designVar: '+3.1m', caPlan: '13m', caActual: '13.4m', caVar: '+0.4m', withinTarget: false, narrative: 'Typhoon season delay' },
  { id: 'P008', project: 'SGR-Hub1-1', region: 'NA-East', pgm: 'Mike Torres', gc: 'Whiting-Turner', designPlan: '13.5m', designActual: '16.1m', designVar: '+2.6m', caPlan: '15m', caActual: '15.3m', caVar: '+0.3m', withinTarget: false, narrative: 'Utility easement negotiation' },
  { id: 'P009', project: 'KAY-Hub1-1', region: 'APAC', pgm: 'Wei Chen', gc: 'Samsung C&T', designPlan: '11m', designActual: '13.4m', designVar: '+2.4m', caPlan: '13m', caActual: '13.6m', caVar: '+0.6m', withinTarget: false, narrative: 'Government approval backlog' },
  { id: 'P010', project: 'CLB-Hub1-3', region: 'NA-East', pgm: 'Jennifer Park', gc: 'Holder', designPlan: '13.5m', designActual: '15.6m', designVar: '+2.1m', caPlan: '15m', caActual: '15.2m', caVar: '+0.2m', withinTarget: false, narrative: 'Scope change from leadership' },
]

const excludedProjects = [
  { project: 'NEW-Hub1-1', region: 'NA-West', reason: 'Awaiting AE Award' },
  { project: 'PND-Hub2-1', region: 'EMEA', reason: 'Pending Leadership Decision' },
  { project: 'HLD-Hub1-2', region: 'APAC', reason: 'Site selection in progress' },
  { project: 'TBD-Hub3-1', region: 'NA-East', reason: 'Budget approval pending' },
  { project: 'FUT-Hub1-1', region: 'EMEA', reason: 'Early feasibility stage' },
  { project: 'PRE-Hub2-2', region: 'APAC', reason: 'Pre-design phase' },
]

const trendData = [
  { week: 'W1', portfolio: 68, apac: 58, emea: 71, naEast: 75, naWest: 65 },
  { week: 'W2', portfolio: 69, apac: 59, emea: 72, naEast: 76, naWest: 66 },
  { week: 'W3', portfolio: 68, apac: 58, emea: 71, naEast: 75, naWest: 65 },
  { week: 'W4', portfolio: 69, apac: 60, emea: 72, naEast: 76, naWest: 66 },
  { week: 'W5', portfolio: 70, apac: 61, emea: 73, naEast: 77, naWest: 67 },
  { week: 'W6', portfolio: 69, apac: 60, emea: 72, naEast: 76, naWest: 66 },
  { week: 'W7', portfolio: 70, apac: 61, emea: 73, naEast: 77, naWest: 68 },
  { week: 'W8', portfolio: 70, apac: 61, emea: 73, naEast: 77, naWest: 68 },
  { week: 'W9', portfolio: 71, apac: 62, emea: 74, naEast: 78, naWest: 69 },
  { week: 'W10', portfolio: 70, apac: 61, emea: 73, naEast: 77, naWest: 68 },
  { week: 'W11', portfolio: 71, apac: 62, emea: 74, naEast: 78, naWest: 69 },
  { week: 'W12', portfolio: 71, apac: 62, emea: 74, naEast: 78, naWest: 69 },
  { week: 'W13', portfolio: 71, apac: 62, emea: 74, naEast: 78, naWest: 69 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getVarianceColor(variance: string): string {
  const num = parseFloat(variance.replace('+', '').replace('m', ''))
  if (num <= 0) return 'text-green'
  if (num <= 2) return 'text-gold'
  return 'text-red'
}

function getPerformanceColor(perf: number): string {
  if (perf >= 80) return 'text-green'
  if (perf >= 70) return 'text-gold'
  return 'text-red'
}

// Animated number component
function AnimatedNumber({ value, delay = 0, suffix = '' }: { value: number; delay?: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = React.useState(0)
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1000
      const steps = 60
      const increment = value / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  
  return <>{displayValue}{suffix}</>
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FDOBScheduleReportPage() {
  const [excludedExpanded, setExcludedExpanded] = React.useState(false)
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null)

  return (
    <AppShell title="FDOB Schedule Performance" activeHref="/reports">
      <TooltipProvider>
        <div className="space-y-6">
          
          {/* ═══ HEADER ═══ */}
          <motion.header 
            className="bg-card border border-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link 
                  href="/reports" 
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h1 className="text-base font-semibold text-foreground">FDOB Schedule Performance</h1>
                  <p className="text-xs text-muted-foreground">87 active projects across 4 regions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono bg-green/10 text-green border-green/30">
                  Live
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => exportToPDF({ filename: 'fdob-schedule-may-2026', title: 'FDOB Schedule Performance Report' })}
                  className="h-8 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  PDF
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => exportToXLSX({ filename: 'fdob-schedule-may-2026', title: 'FDOB Schedule Performance', data: outlierProjects as unknown as Record<string, unknown>[], headers: ['project', 'region', 'pgm', 'gc', 'designPlan', 'designActual', 'designVar', 'caPlan', 'caActual', 'caVar', 'narrative'] })}
                  className="h-8 text-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                  XLSX
                </Button>
              </div>
            </div>
          </motion.header>

          {/* ═══ MAIN METRICS ROW ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Portfolio Performance - Large Card */}
            <motion.div 
              className="lg:col-span-4 bg-card border border-border rounded-xl p-5 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Target className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider font-medium">Portfolio Performance</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gold font-mono tabular-nums">
                    <AnimatedNumber value={71} delay={200} />
                  </span>
                  <span className="text-xl text-gold font-mono">%</span>
                  <div className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-green/10 text-green text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+3%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-mono text-foreground">62</span> of <span className="font-mono text-foreground">87</span> projects within target
                </p>
                
                {/* Mini progress bar */}
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '71%' }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Variance Cards */}
            <motion.div 
              className="lg:col-span-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Design-to-CA */}
              <div className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>Design-to-CA</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gold font-mono tabular-nums">+1.8</span>
                    <span className="text-sm text-gold font-mono">m</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">avg over target</p>
                </div>
              </div>
              
              {/* CA-to-FDOB */}
              <div className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    <TrendingDown className="w-3 h-3" />
                    <span>CA-to-FDOB</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-red font-mono tabular-nums">+2.3</span>
                    <span className="text-sm text-red font-mono">m</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">avg over target</p>
                </div>
              </div>
            </motion.div>

            {/* Projects Summary */}
            <motion.div 
              className="lg:col-span-4 bg-card border border-border rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-medium">Projects Overview</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold font-mono text-foreground">87</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Active</p>
                </div>
                <div className="text-center p-3 bg-green/10 rounded-lg">
                  <p className="text-2xl font-bold font-mono text-green">62</p>
                  <p className="text-[10px] text-green uppercase mt-0.5">On Track</p>
                </div>
                <div className="text-center p-3 bg-red/10 rounded-lg">
                  <p className="text-2xl font-bold font-mono text-red">25</p>
                  <p className="text-[10px] text-red uppercase mt-0.5">At Risk</p>
                </div>
              </div>
              <button 
                onClick={() => setExcludedExpanded(!excludedExpanded)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                <Minus className="w-3 h-3" />
                <span>6 projects excluded</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', excludedExpanded && 'rotate-180')} />
              </button>
            </motion.div>
          </div>

          {/* ═══ REGIONAL BREAKDOWN ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-teal" />
              <h2 className="text-sm font-semibold text-foreground">Regional Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {regionalData.map((region, index) => {
                const targets = regionalTargets[region.region as keyof typeof regionalTargets]
                const isSelected = selectedRegion === region.region
                
                return (
                  <motion.div
                    key={region.region}
                    className={cn(
                      'bg-card border rounded-xl p-4 cursor-pointer transition-all',
                      isSelected ? 'border-teal ring-1 ring-teal/30' : 'border-border hover:border-teal/50'
                    )}
                    onClick={() => setSelectedRegion(isSelected ? null : region.region)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-foreground">{region.region}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-lg font-bold font-mono tabular-nums', getPerformanceColor(region.performance))}>
                          {region.performance}%
                        </span>
                        <div className={cn(
                          'flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded',
                          region.trend > 0 ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                        )}>
                          {region.trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                          {Math.abs(region.trend)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                      <motion.div 
                        className={cn(
                          'h-full rounded-full',
                          region.performance >= 80 ? 'bg-green' : region.performance >= 70 ? 'bg-gold' : 'bg-red'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${region.performance}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    
                    {/* Stats */}
                    <div className="text-[10px] text-muted-foreground mb-3 flex items-center justify-between">
                      <span>Target: {targets.designToCA}m / {targets.caToFDOB}m</span>
                      <span className="font-mono">{region.withinTarget}/{region.total}</span>
                    </div>
                    
                    {/* Outliers */}
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Top Outliers</p>
                      {region.outliers.map((outlier) => (
                        <div key={outlier.project} className="flex items-center justify-between text-[11px]">
                          <span className="text-foreground font-mono truncate">{outlier.project}</span>
                          <span className={cn('font-medium font-mono', getVarianceColor(outlier.variance))}>
                            {outlier.variance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══ TREND CHART ═══ */}
          <TrendChart data={trendData} />

          {/* ═══ OUTLIER TABLE ═══ */}
          <motion.section
            className="bg-card border border-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Outlier Deep Dive</h2>
                <p className="text-[10px] text-muted-foreground">Projects exceeding variance thresholds</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider">PGM</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground uppercase tracking-wider">Design Var</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground uppercase tracking-wider">CA Var</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider">Narrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {outlierProjects.slice(0, 8).map((project, index) => (
                    <motion.tr 
                      key={project.id}
                      className="hover:bg-secondary/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.03 }}
                    >
                      <td className="px-4 py-3 font-mono font-medium text-foreground">{project.project}</td>
                      <td className="px-4 py-3 text-muted-foreground">{project.region}</td>
                      <td className="px-4 py-3 text-muted-foreground">{project.pgm}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('font-mono font-medium', getVarianceColor(project.designVar))}>{project.designVar}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('font-mono font-medium', getVarianceColor(project.caVar))}>{project.caVar}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{project.narrative}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing 8 of {outlierProjects.length} outliers</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.section>

          {/* ═══ EXCLUDED PROJECTS ═══ */}
          <AnimatePresence>
            {excludedExpanded && (
              <motion.section
                className="bg-card border border-border rounded-xl overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Excluded Projects</h2>
                  <Badge variant="outline" className="text-[10px]">{excludedProjects.length}</Badge>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {excludedProjects.map((project, index) => (
                    <motion.div
                      key={project.project}
                      className="bg-secondary/30 rounded-lg p-3 border border-border"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <p className="font-mono font-medium text-xs text-foreground">{project.project}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{project.region}</p>
                      <p className="text-[10px] text-gold mt-2">{project.reason}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </div>
      </TooltipProvider>
    </AppShell>
  )
}

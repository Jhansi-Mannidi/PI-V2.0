'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  FileText,
  Download,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Shield,
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  Bot,
  FileSpreadsheet,
  Presentation,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useActionModal } from '@/hooks/use-action-modal'
import Link from 'next/link'

// Animation ease
const ease = [0.25, 0.46, 0.45, 0.94] as const

// Report data structured by category
const reportSections = [
  {
    id: 'operational',
    title: 'Operational',
    chipColor: 'bg-teal/10 text-teal border-teal/20',
    icon: BarChart3,
    reports: [
      { id: 'R1', name: 'Monthly Portfolio Pulse', lastRun: 'May 1, 2026', nextRun: 'Jun 1', formats: ['PDF', 'Slides'], href: '/reports/monthly-pulse' },
      { id: 'R2', name: 'FDOB Schedule Performance', lastRun: 'May 12', nextRun: 'May 19', formats: ['PDF', 'XLSX'], href: '/reports/fdob-schedule' },
      { id: 'R3', name: 'Funding & PO Cycle Time', lastRun: 'May 15', nextRun: 'May 22', formats: ['XLSX', 'PDF'], href: '/reports/funding-po-cycle' },
      { id: 'R4', name: 'Termsheet Bundle Status', lastRun: 'May 14', nextRun: 'May 21', formats: ['PDF'], href: '/reports/termsheet-bundle' },
      { id: 'R5', name: 'Procurement & Sourcing Status', lastRun: 'May 8', nextRun: 'Jun 8', formats: ['PDF', 'Slides'], href: '/reports/procurement-sourcing' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial',
    chipColor: 'bg-gold/10 text-gold border-gold/20',
    icon: TrendingUp,
    reports: [
      { id: 'R6', name: 'Cashflow Variance & Confidence', lastRun: 'May 1, 2026', nextRun: 'Jun 1', formats: ['PDF', 'XLSX'], href: '/reports/cashflow-variance' },
      { id: 'R12', name: 'Annual Plan Reconciliation', lastRun: 'May 5', nextRun: 'Quarterly', formats: ['PDF', 'XLSX'], href: '/reports/annual-plan-reconciliation' },
    ],
  },
  {
    id: 'risk',
    title: 'Risk & Compliance',
    chipColor: 'bg-red/10 text-red border-red/20',
    icon: Shield,
    reports: [
      { id: 'R7', name: 'SLA Compliance Report', lastRun: 'May 15', nextRun: 'Weekly', formats: ['PDF', 'XLSX'], href: '/reports/sla-compliance' },
      { id: 'R8', name: 'Key-Person Continuity Report', lastRun: 'May 12', nextRun: 'Monthly', formats: ['PDF'], href: '/reports/key-person-continuity' },
      { id: 'R9', name: 'Portfolio Risk Register', lastRun: 'May 1', nextRun: 'Monthly', formats: ['PDF', 'XLSX'], href: '/reports/risk-register' },
    ],
  },
  {
    id: 'intelligence',
    title: 'Intelligence',
    chipColor: 'bg-navy/10 dark:bg-navy-soft/20 text-navy dark:text-slate border-navy/20 dark:border-navy-soft/30',
    icon: Sparkles,
    reports: [
      { id: 'R10', name: 'Variance Explainer Digest', lastRun: 'May 14', nextRun: 'Weekly', formats: ['PDF'], href: '/reports/variance-digest' },
      { id: 'R11', name: 'AI Agent Activity & ROI', lastRun: 'May 15', nextRun: 'Monthly', formats: ['PDF'], href: '/reports/agent-activity' },
    ],
  },
]

// Scheduled reports for next 7 days
const scheduledReports = [
  { date: 'May 19', day: 'Mon', name: 'FDOB Schedule Performance', recipients: 'PgM bench (14)' },
  { date: 'May 21', day: 'Wed', name: 'Termsheet Bundle Status', recipients: 'Brian Chen, Anu Reddy' },
  { date: 'May 22', day: 'Thu', name: 'Weekly SLA Compliance', recipients: 'Hasit Patel, Portfolio Controls' },
  { date: 'May 22', day: 'Thu', name: 'Funding & PO Cycle Time', recipients: 'LineSight (Sreya, Alice, Sam Sheahan)' },
]

// Recently distributed
const recentReports = [
  { date: 'May 15 04:00', name: 'Funding & PO Cycle Time', recipients: 11, opened: '2 opened in <1hr' },
  { date: 'May 15 04:00', name: 'SLA Compliance', recipients: 8, opened: '6 opened' },
  { date: 'May 14 17:30', name: 'Termsheet Bundle Status', recipients: 6, opened: null },
]

// Format icon mapping
const formatIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  Slides: Presentation,
}

export default function ReportsPage() {
  const action = useActionModal()
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reports-collapsed-sections')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })
  const [lastRefreshed, setLastRefreshed] = React.useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Toggle section collapse
  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('reports-collapsed-sections', JSON.stringify([...next]))
      }
      return next
    })
  }

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLastRefreshed(new Date())
    setIsRefreshing(false)
    toast.success('Reports refreshed', { description: 'All data is current' })
  }

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' PDT'
  }

  // Generate report action
  const openGenerateModal = () => {
    action.open({
      tone: 'primary',
      icon: Plus,
      title: 'Generate New Report',
      description: 'Create a new report from a template. Generation typically completes in 30-60 seconds.',
      fields: [
        {
          type: 'select',
          name: 'category',
          label: 'Category',
          required: true,
          options: [
            { value: 'operational', label: 'Operational' },
            { value: 'financial', label: 'Financial' },
            { value: 'risk', label: 'Risk & Compliance' },
            { value: 'intelligence', label: 'Intelligence' },
          ],
        },
        {
          type: 'select',
          name: 'template',
          label: 'Report Template',
          required: true,
          options: [
            { value: 'portfolio-pulse', label: 'Monthly Portfolio Pulse' },
            { value: 'fdob-schedule', label: 'FDOB Schedule Performance' },
            { value: 'funding-cycle', label: 'Funding & PO Cycle Time' },
            { value: 'sla-compliance', label: 'SLA Compliance' },
            { value: 'variance-explainer', label: 'Variance Explainer Digest' },
          ],
        },
        {
          type: 'select',
          name: 'format',
          label: 'Output Format',
          required: true,
          options: [
            { value: 'pdf', label: 'PDF Document' },
            { value: 'xlsx', label: 'Excel Spreadsheet' },
            { value: 'slides', label: 'Presentation Slides' },
          ],
        },
        {
          type: 'select',
          name: 'schedule',
          label: 'Schedule',
          options: [
            { value: 'now', label: 'Generate now' },
            { value: 'weekly', label: 'Weekly (every Monday)' },
            { value: 'monthly', label: 'Monthly (1st of month)' },
            { value: 'quarterly', label: 'Quarterly' },
          ],
        },
      ],
      confirmLabel: 'Generate Report',
      successToast: 'Report queued',
      successDescription: 'You will be notified when ready (~38 seconds)',
    })
  }

  return (
    <AppShell
      title="Reports"
      subtitle="Operational, financial, and intelligence artifacts. All reports are generated against the certified semantic layer (odc_semantic) and respect Dataplex row/column security."
      activeHref="/reports"
    >
      <motion.div 
        className="space-y-5 max-w-[1600px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
        }}
      >
        {/* Header actions */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } } }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3 h-3', isRefreshing && 'animate-spin')} />
              <span className="font-mono">Last refreshed {formatTimestamp(lastRefreshed)} · May 18, 2026</span>
            </button>
          </div>
          <Button
            onClick={openGenerateModal}
            className="h-8 text-xs bg-gold hover:bg-gold/90 text-navy font-medium"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Generate New Report
          </Button>
        </motion.div>

        {/* KPI Summary Strip */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { label: 'Reports Generated YTD', value: '142', sublabel: '+23 vs same period 2025', color: 'border-l-gold' },
            { label: 'Scheduled This Month', value: '28', sublabel: 'Next: Weekly SLA Compliance, May 22', color: 'border-l-teal' },
            { label: 'Distribution Recipients', value: '47', sublabel: 'Across 9 stakeholder groups', color: 'border-l-navy dark:border-l-slate' },
            { label: 'Avg Generation Time', value: '38s', sublabel: 'Down from 4 hrs (LineSight manual)', color: 'border-l-green' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease }}
              className={cn(
                'bg-card border border-line rounded-xl p-3 border-l-4 hover:shadow-md transition-all hover:scale-[1.02]',
                kpi.color
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                {kpi.label}
              </p>
              <p className="text-lg sm:text-xl font-bold font-mono tabular-nums text-foreground mt-1">
                {kpi.value}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">
                {kpi.sublabel}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          {/* Report Library */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
            className="space-y-3"
          >
            {reportSections.map((section, sectionIndex) => {
              const isCollapsed = collapsedSections.has(section.id)
              const SectionIcon = section.icon
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + sectionIndex * 0.04, ease }}
                  className="bg-card border border-line rounded-xl overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', section.chipColor)}>
                        <SectionIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xs font-semibold text-foreground">{section.title}</h3>
                        <p className="text-[10px] text-muted-foreground/60">{section.reports.length} reports</p>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                      isCollapsed && '-rotate-90'
                    )} />
                  </button>

                  {/* Section Content */}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line">
                          {/* Table Header - Desktop */}
                          <div className="hidden sm:grid grid-cols-[1fr_120px_100px_140px_auto] gap-4 px-4 py-2 bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            <span>Report Name</span>
                            <span>Last Run</span>
                            <span>Next</span>
                            <span>Formats</span>
                            <span className="text-right">Actions</span>
                          </div>
                          
                          {/* Report Rows */}
                          <div className="divide-y divide-line/50">
                            {section.reports.map((report, reportIndex) => (
                              <motion.div
                                key={report.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: reportIndex * 0.03, ease }}
                                className="group"
                              >
                                <Link
                                  href={report.href}
                                  className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_100px_140px_auto] gap-2 sm:gap-4 sm:items-center px-4 py-3 hover:bg-gold/5 dark:hover:bg-gold/10 transition-colors"
                                >
                                  {/* Report Name */}
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={cn('text-[9px] font-mono shrink-0', section.chipColor)}>
                                      {report.id}
                                    </Badge>
                                    <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                                      {report.name}
                                    </span>
                                  </div>
                                  
                                  {/* Mobile: Meta row */}
                                  <div className="flex sm:hidden items-center gap-3 text-[11px] text-muted-foreground pl-12">
                                    <span>Last: {report.lastRun}</span>
                                    <span className="text-muted-foreground/40">·</span>
                                    <span>Next: {report.nextRun}</span>
                                  </div>
                                  
                                  {/* Desktop: Last Run */}
                                  <span className="hidden sm:block text-xs text-muted-foreground font-mono">
                                    {report.lastRun}
                                  </span>
                                  
                                  {/* Desktop: Next Run */}
                                  <span className="hidden sm:block text-xs text-teal font-mono">
                                    {report.nextRun}
                                  </span>
                                  
                                  {/* Formats */}
                                  <div className="hidden sm:flex items-center gap-1.5">
                                    {report.formats.map(format => {
                                      const Icon = formatIcons[format] || FileText
                                      return (
                                        <Badge 
                                          key={format} 
                                          variant="secondary"
                                          className="text-[9px] px-1.5 py-0.5 bg-secondary/60 text-muted-foreground"
                                        >
                                          <Icon className="w-2.5 h-2.5 mr-1" />
                                          {format}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="hidden sm:flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        toast.info('Opening report preview...', { description: report.name })
                                      }}
                                    >
                                      <Eye className="w-3.5 h-3.5 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs text-muted-foreground hover:text-gold"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        toast.success('Generating report...', { description: `${report.name} will be ready in ~38 seconds` })
                                      }}
                                    >
                                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                      Generate
                                    </Button>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Rail */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
            className="space-y-3"
          >
            {/* Scheduled in next 7 days */}
            <div className="bg-card border border-line rounded-xl overflow-hidden">
              <div className="p-3 border-b border-line flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-teal" />
                <h3 className="text-xs font-semibold text-foreground">Scheduled in next 7 days</h3>
              </div>
              <div className="divide-y divide-line/50">
                {scheduledReports.map((report, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.3 + i * 0.04, ease }}
                    className="p-2.5 hover:bg-gold/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="text-center min-w-[36px]">
                        <p className="text-[9px] text-muted-foreground/60 uppercase">{report.day}</p>
                        <p className="text-xs font-mono font-semibold text-foreground">{report.date.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground truncate">{report.name}</p>
                        <p className="text-[9px] text-muted-foreground/60 mt-0.5 truncate">
                          <Users className="w-2.5 h-2.5 inline mr-1" />
                          {report.recipients}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recently Distributed */}
            <div className="bg-card border border-line rounded-xl overflow-hidden">
              <div className="p-3 border-b border-line flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-gold" />
                <h3 className="text-xs font-semibold text-foreground">Recently distributed</h3>
              </div>
              <div className="divide-y divide-line/50">
                {recentReports.map((report, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.4 + i * 0.04, ease }}
                    className="p-2.5 hover:bg-gold/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-foreground truncate">{report.name}</p>
                        <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">{report.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">{report.recipients} recipients</p>
                        {report.opened && (
                          <p className="text-[10px] text-green">{report.opened}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Report Builder */}
            <div className="bg-gradient-to-br from-navy/5 to-gold/5 dark:from-navy-soft/20 dark:to-gold/10 border border-line rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <h3 className="text-xs font-semibold text-foreground">Custom report builder</h3>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mb-3">
                Build a one-off report from any combination of dimensions, projects, and metrics.
              </p>
              <Button
                variant="outline"
                className="w-full h-8 text-xs border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                onClick={() => toast.info('Opening custom report builder...', { description: 'This feature is coming soon' })}
              >
                <Bot className="w-3.5 h-3.5 mr-1" />
                Open Builder
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Footer Strip */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3, ease } } }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-line text-[9px] text-muted-foreground/60"
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>All reports honor Dataplex row/column-level security via OAuth identity passthrough.</span>
          </div>
          <span className="text-muted-foreground/40">Need a new scheduled report? Contact Portfolio Controls.</span>
        </motion.div>
      </motion.div>
      {action.element}
    </AppShell>
  )
}

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileSpreadsheet, 
  Presentation, 
  Calendar, 
  RefreshCw,
  Clock,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Refresh cadences by report type
const REFRESH_CADENCES = {
  operational: { interval: 5, label: '5 min' },    // R1, R3, R4, R7
  analytical: { interval: 15, label: '15 min' },   // R2, R5, R6, R10
  strategic: { interval: 60, label: '1 hour' },    // R8, R9, R11, R12
} as const

type ReportType = keyof typeof REFRESH_CADENCES

interface ReportHeaderProps {
  reportId: string
  title: string
  subtitle: string
  badge: string
  reportType?: ReportType
  showSlides?: boolean
  onScheduleClick?: () => void
  onExportPdf?: () => void
  onExportXlsx?: () => void
  onExportSlides?: () => void
  children?: React.ReactNode // For headline metrics
}

export function ReportHeader({
  reportId,
  title,
  subtitle,
  badge,
  reportType = 'analytical',
  showSlides = false,
  onScheduleClick,
  onExportPdf,
  onExportXlsx,
  onExportSlides,
  children,
}: ReportHeaderProps) {
  const [lastRefreshed, setLastRefreshed] = React.useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const cadence = REFRESH_CADENCES[reportType]

  // Auto-refresh timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLastRefreshed(new Date())
    }, cadence.interval * 60 * 1000)
    return () => clearInterval(timer)
  }, [cadence.interval])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLastRefreshed(new Date())
    setIsRefreshing(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-navy-mid rounded-xl border border-navy-soft/30 p-4 sm:p-6 mb-4 sm:mb-6"
    >
      {/* Top row: Back link + Freshness indicator */}
      <div className="flex items-center justify-between mb-3">
        <Link 
          href="/reports" 
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">All Reports</span>
          <span className="sm:hidden">Back</span>
        </Link>
        
        {/* Data Freshness Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">Last refreshed:</span>
            <span>{formatTime(lastRefreshed)}</span>
            <span className="text-white/40">·</span>
            <span className="text-gold/80">{cadence.label} refresh</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Badge + Title */}
      <div className="mb-3">
        <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-gold text-navy rounded-full mb-2">
          {badge}
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-white/60 mt-1">{subtitle}</p>
      </div>

      {/* Headline metrics (optional children) */}
      {children && (
        <div className="mb-4 pt-3 border-t border-white/10">
          {children}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
        <button
          onClick={onExportPdf}
          className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span> PDF
        </button>
        <button
          onClick={onExportXlsx}
          className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span> XLSX
        </button>
        {showSlides && (
          <button
            onClick={onExportSlides}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export to</span> Slides
          </button>
        )}
        <button
          onClick={onScheduleClick}
          className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium bg-gold hover:bg-gold-hover text-navy rounded-lg transition-colors ml-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          Schedule
        </button>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { weeklyDigest, recommendations, hendersonRecommendations } from '@/lib/recommendation-data'
import {
  Mail,
  FileText,
  AlertCircle,
  Clock,
  CalendarDays,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Award,
  Lightbulb,
  BarChart3,
  Download,
  Share2,
  Check,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// Urgency group configs
const urgencyGroups = [
  {
    key: 'today',
    label: 'ACT TODAY',
    count: weeklyDigest.urgent,
    color: 'red',
    dotBg: 'bg-red',
    borderColor: 'border-red/30',
    headerBg: 'bg-red/8',
    items: weeklyDigest.actToday,
  },
  {
    key: 'week',
    label: 'THIS WEEK',
    count: weeklyDigest.thisWeek.length,
    color: 'amber',
    dotBg: 'bg-amber',
    borderColor: 'border-amber/30',
    headerBg: 'bg-amber/8',
    items: weeklyDigest.thisWeek,
  },
  {
    key: 'month',
    label: 'THIS MONTH',
    count: weeklyDigest.thisMonth.length,
    color: 'teal',
    dotBg: 'bg-teal',
    borderColor: 'border-teal/30',
    headerBg: 'bg-teal/8',
    items: weeklyDigest.thisMonth,
  },
] as const

export default function WeeklyDigestPage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('today')
  const [shared, setShared] = useState(false)
  const [exported, setExported] = useState(false)

  const handleShare = () => {
    setShared(true)
    setTimeout(() => setShared(false), 2500)
  }

  const handleExport = () => {
    const data = {
      digest: `Weekly Recommendation Digest - Week ${weeklyDigest.weekNumber}, ${weeklyDigest.year}`,
      generated: weeklyDigest.generatedAt,
      summary: weeklyDigest.executiveSummary,
      actToday: weeklyDigest.actToday,
      thisWeek: weeklyDigest.thisWeek,
      thisMonth: weeklyDigest.thisMonth,
      lastWeekScorecard: weeklyDigest.lastWeekScorecard,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weekly-digest-W${weeklyDigest.weekNumber}-${weeklyDigest.year}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  // Trend chart helpers
  const trendData = weeklyDigest.trendData
  const maxGen = Math.max(...trendData.map((d) => d.generated))
  const maxVal = Math.max(...trendData.filter((d) => d.valueDelivered > 0).map((d) => d.valueDelivered))

  return (
    <AppShell
      title="Weekly Recommendation Digest"
      subtitle={`Week ${weeklyDigest.weekNumber}, ${weeklyDigest.year} — Generated ${weeklyDigest.generatedAt}`}
      activeHref="/recommendations/digest"
    >
      <motion.div
        className="space-y-6 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header actions */}
        <motion.div variants={sectionVariants} className="flex flex-wrap items-center gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-line"
            onClick={handleShare}
          >
            {shared ? <Check className="w-3.5 h-3.5 text-green" /> : <Share2 className="w-3.5 h-3.5" />}
            {shared ? 'Shared' : 'Share Digest'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-line"
            onClick={handleExport}
          >
            {exported ? <Check className="w-3.5 h-3.5 text-green" /> : <Download className="w-3.5 h-3.5" />}
            {exported ? 'Exported' : 'Export PDF'}
          </Button>
        </motion.div>

        {/* ─── REGION 1: Week at a Glance ─── */}
        <motion.section variants={sectionVariants}>
          <div className="relative bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-teal/5 pointer-events-none" />

            <div className="relative p-5 sm:p-6">
              {/* AI badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20">
                  <Sparkles className="w-3 h-3 text-teal" />
                  <span className="text-[10px] font-semibold text-teal uppercase tracking-wider">Executive Briefing</span>
                </div>
                <span className="text-[10px] text-muted-foreground/50 font-mono">A-305 v2.1.4</span>
              </div>

              {/* Summary text */}
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mb-6 max-w-4xl">
                {weeklyDigest.executiveSummary}
              </p>

              {/* 3 metric callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCallout
                  label="Recommendations this week"
                  value={String(weeklyDigest.totalActive)}
                  icon={<Lightbulb className="w-4 h-4" />}
                  color="gold"
                  delay={0.2}
                />
                <MetricCallout
                  label="Urgent (act today)"
                  value={String(weeklyDigest.urgent)}
                  icon={<AlertCircle className="w-4 h-4" />}
                  color="red"
                  delay={0.35}
                />
                <MetricCallout
                  label="Estimated value at stake"
                  value={weeklyDigest.valueAtStake}
                  icon={<DollarSign className="w-4 h-4" />}
                  color="teal"
                  delay={0.5}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── REGION 2: Recommendations by Priority ─── */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red via-amber to-teal" />
            <h2 className="text-sm font-semibold text-foreground">Recommendations by Priority</h2>
          </div>

          <div className="space-y-4">
            {urgencyGroups.map((group, gi) => (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + gi * 0.1 }}
                className={cn(
                  'bg-card/80 dark:bg-card/60 backdrop-blur-sm border rounded-xl overflow-hidden shadow-sm',
                  group.borderColor
                )}
              >
                {/* Group header */}
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.key ? null : group.key)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 transition-colors',
                    group.headerBg
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2.5 h-2.5 rounded-full', group.dotBg)} />
                    <span className="text-sm font-semibold text-foreground">{group.label}</span>
                    <span className={cn(
                      'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold text-white',
                      group.key === 'today' ? 'bg-red' : group.key === 'week' ? 'bg-amber text-navy' : 'bg-teal'
                    )}>
                      {group.count}
                    </span>
                  </div>
                  {expandedGroup === group.key
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </button>

                {/* Items */}
                {expandedGroup === group.key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-line/30"
                  >
                    <div className="divide-y divide-line/20">
                      {group.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.04 }}
                          className="flex items-center gap-3 p-3.5 hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors cursor-pointer group"
                        >
                          <div className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0',
                            group.key === 'today' ? 'bg-red animate-pulse' : group.key === 'week' ? 'bg-amber' : 'bg-teal'
                          )} />
                          <span className="text-xs sm:text-sm text-foreground/80 flex-1">{item}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── REGION 3: Last Week's Scorecard ─── */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-gold to-gold/30" />
            <h2 className="text-sm font-semibold text-foreground">{"Last Week's Scorecard"}</h2>
          </div>

          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm">
            {/* Metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-line/30">
              {[
                { label: 'Generated', value: weeklyDigest.lastWeekScorecard.generated, suffix: '' },
                { label: 'Accepted', value: weeklyDigest.lastWeekScorecard.accepted, suffix: ` (${weeklyDigest.lastWeekScorecard.acceptedPct}%)` },
                { label: 'Implemented', value: weeklyDigest.lastWeekScorecard.implemented, suffix: ` (${weeklyDigest.lastWeekScorecard.implementedPct}%)` },
                { label: 'Value Delivered', value: weeklyDigest.lastWeekScorecard.valueDelivered, suffix: '', isString: true },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className="p-4 sm:p-5 text-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                >
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">{metric.label}</p>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {metric.isString ? metric.value : metric.value}
                    {!metric.isString && <span className="text-sm font-normal text-muted-foreground">{metric.suffix}</span>}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Highlight and Learning */}
            <div className="border-t border-line/30 p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green/5 dark:bg-green/8 border border-green/20">
                <Award className="w-4 h-4 text-green mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-green uppercase tracking-wider mb-0.5">Best Outcome</p>
                  <p className="text-xs text-foreground/80">{weeklyDigest.lastWeekScorecard.bestOutcome}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber/5 dark:bg-amber/8 border border-amber/20">
                <Lightbulb className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-amber uppercase tracking-wider mb-0.5">Engine Learning</p>
                  <p className="text-xs text-foreground/80">{weeklyDigest.lastWeekScorecard.learning}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── REGION 4: 4-Week Trend ─── */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-teal to-teal/30" />
            <h2 className="text-sm font-semibold text-foreground">4-Week Trailing Trend</h2>
          </div>

          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm p-5">
            {/* Chart */}
            <div className="flex items-end gap-1 sm:gap-2 h-[180px] sm:h-[220px]">
              {trendData.map((week, i) => {
                const barH = (week.generated / (maxGen + 4)) * 100
                const accRate = week.acceptanceRate
                const isCurrent = i === trendData.length - 1
                return (
                  <div key={week.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    {/* Acceptance rate dot + line */}
                    <div className="relative w-full flex justify-center" style={{ height: `${100 - barH}%` }}>
                      {accRate > 0 && (
                        <motion.div
                          className="absolute bottom-0 flex flex-col items-center"
                          style={{ bottom: `${(accRate / 100) * 100}%` }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.12 }}
                        >
                          <span className="text-[9px] font-mono font-bold text-teal mb-1">{accRate}%</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-teal ring-2 ring-teal/20" />
                        </motion.div>
                      )}
                    </div>

                    {/* Generated bar */}
                    <motion.div
                      className={cn(
                        'w-full rounded-t-lg relative overflow-hidden',
                        isCurrent ? 'bg-gradient-to-t from-gold/30 to-gold/60 border border-gold/40 border-b-0' : 'bg-gradient-to-t from-gold/15 to-gold/35'
                      )}
                      style={{ height: `${barH}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${barH}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-foreground/70">
                        {week.generated}
                      </span>
                    </motion.div>

                    {/* Week label */}
                    <div className="text-center">
                      <span className={cn(
                        'text-[10px] font-mono',
                        isCurrent ? 'text-gold font-bold' : 'text-muted-foreground/60'
                      )}>
                        {week.week}
                      </span>
                      {week.valueDelivered > 0 && (
                        <p className="text-[9px] font-mono text-green">
                          ${(week.valueDelivered / 1000).toFixed(0)}K
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-line/20">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gold/40" />
                <span className="text-[10px] text-muted-foreground/60">Recommendations Generated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal" />
                <span className="text-[10px] text-muted-foreground/60">Acceptance Rate %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-green font-mono">$</span>
                <span className="text-[10px] text-muted-foreground/60">Value Delivered</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          variants={sectionVariants}
          className="flex items-center justify-between py-3 text-[10px] text-muted-foreground/40"
        >
          <p className="font-mono">A-305 Portfolio Recommendation Agent v2.1.4</p>
          <p>Next digest: Monday, May 12 at 06:00</p>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}

/* ──────────── Metric Callout ──────────── */
function MetricCallout({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'gold' | 'red' | 'teal'
  delay: number
}) {
  const colorMap = {
    gold: { bg: 'bg-gold/10', border: 'border-gold/20', text: 'text-gold', iconBg: 'bg-gold/15' },
    red: { bg: 'bg-red/8', border: 'border-red/20', text: 'text-red', iconBg: 'bg-red/15' },
    teal: { bg: 'bg-teal/8', border: 'border-teal/20', text: 'text-teal', iconBg: 'bg-teal/15' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      className={cn('flex items-center gap-3 p-3.5 rounded-xl border', c.bg, c.border)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', c.iconBg)}>
        <div className={c.text}>{icon}</div>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{label}</p>
        <p className={cn('font-mono text-xl font-bold', c.text)}>{value}</p>
      </div>
    </motion.div>
  )
}

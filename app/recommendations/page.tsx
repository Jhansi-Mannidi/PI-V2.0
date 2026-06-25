'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import { recommendations, categoryMeta, engineStats, type Recommendation, type RecCategory, type Urgency } from '@/lib/recommendation-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  Zap,
  Shield,
  Cloud,
  HardHat,
  ThumbsUp,
  ThumbsDown,
  Ban,
  ChevronDown,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { RecommendationFeedbackModal } from '@/components/recommendation-feedback-modal'

const categoryIcons: Record<string, React.ElementType> = {
  Calendar, DollarSign, AlertTriangle, Users, Zap, Shield, Cloud, HardHat,
}

const urgencyColors: Record<Urgency, { bg: string; text: string }> = {
  Immediate: { bg: 'bg-red/10', text: 'text-red' },
  'This Week': { bg: 'bg-amber/10', text: 'text-amber' },
  'This Month': { bg: 'bg-teal/10', text: 'text-teal' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState(rec.feedbackGiven)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const meta = categoryMeta[rec.category]
  const IconComp = categoryIcons[meta.icon] || Sparkles

  const handleNegativeFeedback = (type: 'down' | 'irrelevant') => {
    setFeedback(type)
    setFeedbackModalOpen(true)
  }

  return (
    <motion.div
      variants={cardVariants}
      layout
      className={cn(
        'bg-card/80 dark:bg-card/60 backdrop-blur-sm border rounded-xl overflow-hidden transition-colors',
        meta.borderClass,
        'hover:shadow-md dark:hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ring-1', meta.bgClass, meta.borderClass)}>
            <IconComp className={cn('w-4.5 h-4.5', meta.textClass)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full', meta.bgClass, meta.textClass)}>
                {rec.category}
              </span>
              <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', urgencyColors[rec.urgency].bg, urgencyColors[rec.urgency].text)}>
                {rec.urgency}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/50">{rec.id}</span>
            </div>
            <Link href={`/recommendations/${rec.id}`}>
              <h3 className="text-sm font-semibold text-foreground leading-snug hover:text-teal transition-colors cursor-pointer">
                {rec.headline}
              </h3>
            </Link>
          </div>
        </div>

        {/* Impact & Confidence */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green" />
            <span className="text-xs font-medium text-foreground">{rec.impact}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Confidence:</span>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', rec.confidencePct >= 85 ? 'bg-green' : rec.confidencePct >= 70 ? 'bg-amber' : 'bg-red')}
                initial={{ width: 0 }}
                animate={{ width: `${rec.confidencePct}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{rec.confidencePct}%</span>
          </div>
        </div>

        {/* Affected projects */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {rec.affectedProjects.map(p => (
            <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>

      {/* Expandable section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-line/30 pt-3">
              {/* Evidence */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Evidence</p>
                <ul className="space-y-1">
                  {rec.evidence.map((e, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal mt-1.5 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Suggested actions */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Suggested Actions</p>
                <div className="space-y-1.5">
                  {rec.suggestedActions.map((a, i) => (
                    <button key={i} className="flex items-center gap-2 text-xs text-teal hover:text-teal/80 transition-colors group w-full text-left">
                      <ArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              {/* Reasoning */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Reasoning Trace</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{rec.reasoning}</p>
              </div>
              {/* Source */}
              <p className="text-[9px] font-mono text-muted-foreground/50">Source: {rec.source}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-line/20 flex items-center justify-between bg-muted/20 dark:bg-muted/10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
          {expanded ? 'Less detail' : 'More detail'}
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFeedback('up')}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              feedback === 'up' ? 'bg-green/15 text-green' : 'text-muted-foreground/40 hover:text-green hover:bg-green/10'
            )}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleNegativeFeedback('down')}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              feedback === 'down' ? 'bg-red/15 text-red' : 'text-muted-foreground/40 hover:text-red hover:bg-red/10'
            )}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleNegativeFeedback('irrelevant')}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              feedback === 'irrelevant' ? 'bg-slate/15 text-slate' : 'text-muted-foreground/40 hover:text-slate hover:bg-slate/10'
            )}
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <RecommendationFeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        context={{ id: rec.id, headline: rec.headline, category: rec.category }}
        onSubmit={(reason, details) => {
          setFeedback('down')
        }}
      />
    </motion.div>
  )
}

export default function RecommendationsPage() {
  const { aiEnabled } = useAI()
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterUrgency, setFilterUrgency] = useState<string>('all')

  const filtered = recommendations.filter(r => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false
    if (filterUrgency !== 'all' && r.urgency !== filterUrgency) return false
    return true
  })

  const categoryCounts = recommendations.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (!aiEnabled) {
    return (
      <AppShell title="Recommendation Hub" subtitle="AI-powered portfolio recommendations" activeHref="/recommendations">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-teal/20">
              <Sparkles className="w-7 h-7 text-teal" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">AI Recommendations Disabled</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enable AI mode from the header toggle to access AI-powered portfolio recommendations, impact analysis, and what-if scenarios.
            </p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Recommendation Hub" subtitle="AI-powered portfolio recommendations" activeHref="/recommendations">
      <motion.div
        className="space-y-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Engine Stats Strip */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {[
            { label: 'Active Recs', value: String(recommendations.filter(r => r.status === 'New').length), icon: Sparkles, color: 'teal' },
            { label: 'Est. Savings', value: engineStats.estimatedSavings, icon: DollarSign, color: 'gold' },
            { label: 'Days Prevented', value: String(engineStats.daysPreventedSlip), icon: Clock, color: 'green' },
            { label: 'Model Accuracy', value: `${engineStats.modelAccuracy}%`, icon: CheckCircle2, color: 'teal' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn('w-3.5 h-3.5', stat.color === 'teal' ? 'text-teal' : stat.color === 'gold' ? 'text-gold' : 'text-green')} />
                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Filter:</span>
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-8 w-[200px] text-xs border-line">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.keys(categoryMeta).map(cat => (
                <SelectItem key={cat} value={cat}>{cat} ({categoryCounts[cat] || 0})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="h-8 w-[160px] text-xs border-line">
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="Immediate">Immediate</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[10px] text-muted-foreground/50 font-mono ml-auto">
            {filtered.length} of {recommendations.length} recommendations
          </span>
        </motion.div>

        {/* Recommendation Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((rec, i) => (
            <RecCard key={rec.id} rec={rec} index={i} />
          ))}
        </motion.div>

        {/* Engine footer */}
        <motion.div
          className="flex items-center justify-between py-3 px-4 bg-card/50 dark:bg-card/30 rounded-xl border border-line/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-[10px] text-muted-foreground">{engineStats.agentVersion} - Last run: {engineStats.lastRun} - Next: {engineStats.nextRun}</span>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground/40">30-min cadence</span>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}

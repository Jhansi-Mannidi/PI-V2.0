'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  History, Check, X, Clock, ChevronRight, Download, Filter,
  TrendingUp, TrendingDown, ArrowRight, Sparkles, AlertTriangle
} from 'lucide-react'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } } }

type Status = 'all' | 'accepted' | 'rejected' | 'expired' | 'pending'

const historyItems = [
  { id: 'H-001', title: 'Reallocate 2 FTEs from Pryor Creek to Henderson', category: 'Resource', status: 'accepted' as const, decidedBy: 'Brian K.', decidedAt: '2025-05-28T14:30:00', confidence: 91, impact: '+0.04 SPI', impactType: 'positive' as const, agent: 'A-305' },
  { id: 'H-002', title: 'Escalate Henderson Substation milestone gate', category: 'Process', status: 'accepted' as const, decidedBy: 'Brian K.', decidedAt: '2025-05-27T09:15:00', confidence: 87, impact: '-2 days delay', impactType: 'positive' as const, agent: 'A-305' },
  { id: 'H-003', title: 'Pre-order long-lead switchgear for Mesa Power', category: 'Supply Chain', status: 'rejected' as const, decidedBy: 'Sarah M.', decidedAt: '2025-05-26T16:45:00', confidence: 78, impact: '-$1.2M cost', impactType: 'negative' as const, reason: 'Budget constraints in Q3', agent: 'A-305' },
  { id: 'H-004', title: 'Cross-train Cost Engineer for Central region', category: 'People', status: 'accepted' as const, decidedBy: 'Brian K.', decidedAt: '2025-05-25T11:00:00', confidence: 85, impact: '+12% coverage', impactType: 'positive' as const, agent: 'A-305' },
  { id: 'H-005', title: 'Consolidate monthly reports across Southeast', category: 'Process', status: 'expired' as const, decidedBy: null, decidedAt: '2025-05-24T23:59:00', confidence: 72, impact: '-4h/month effort', impactType: 'neutral' as const, agent: 'A-305' },
  { id: 'H-006', title: 'Reroute Atlanta DC-3 permits through fast-track', category: 'Regulatory', status: 'rejected' as const, decidedBy: 'David L.', decidedAt: '2025-05-23T08:30:00', confidence: 68, impact: '-3 weeks delay', impactType: 'positive' as const, reason: 'Regulatory risk too high', agent: 'A-305' },
  { id: 'H-007', title: 'Deploy weather delay contingency for Council Bluffs', category: 'Risk', status: 'accepted' as const, decidedBy: 'Brian K.', decidedAt: '2025-05-22T14:00:00', confidence: 94, impact: '-$800K exposure', impactType: 'positive' as const, agent: 'A-305' },
  { id: 'H-008', title: 'Increase QA frequency on Lenoir Fiber submittal', category: 'Quality', status: 'pending' as const, decidedBy: null, decidedAt: null, confidence: 83, impact: '-2 rework cycles', impactType: 'positive' as const, agent: 'A-305' },
]

const statusConfig = {
  accepted: { label: 'Accepted', icon: Check, bg: 'bg-green/10', text: 'text-green', ring: 'ring-green/20' },
  rejected: { label: 'Rejected', icon: X, bg: 'bg-red/10', text: 'text-red', ring: 'ring-red/20' },
  expired: { label: 'Expired', icon: Clock, bg: 'bg-muted/20', text: 'text-muted-foreground', ring: 'ring-muted/20' },
  pending: { label: 'Pending', icon: Clock, bg: 'bg-amber/10', text: 'text-amber', ring: 'ring-amber/20' },
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<Status>('all')

  const filtered = filter === 'all' ? historyItems : historyItems.filter(h => h.status === filter)

  const stats = {
    total: historyItems.length,
    accepted: historyItems.filter(h => h.status === 'accepted').length,
    rejected: historyItems.filter(h => h.status === 'rejected').length,
    acceptRate: Math.round((historyItems.filter(h => h.status === 'accepted').length / historyItems.filter(h => h.status !== 'pending').length) * 100),
  }

  const handleExport = () => {
    const data = JSON.stringify(filtered, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recommendation-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell title="Recommendation History" subtitle="Track decisions and outcomes from AI recommendations" activeHref="/recommendations/history">
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">

        {/* Stats Strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Recommendations', value: stats.total, color: 'teal' },
            { label: 'Accepted', value: stats.accepted, color: 'green' },
            { label: 'Rejected', value: stats.rejected, color: 'red' },
            { label: 'Accept Rate', value: `${stats.acceptRate}%`, color: 'gold' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4 text-center"
            >
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={cn('font-mono text-2xl font-bold', `text-${s.color}`)}>{s.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter + Export */}
        <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground/50" />
            {(['all', 'accepted', 'rejected', 'expired', 'pending'] as Status[]).map(s => (
              <Button
                key={s}
                variant={filter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(s)}
                className={cn(
                  'h-7 text-[10px] capitalize',
                  filter === s ? 'bg-teal hover:bg-teal/90 text-white border-0' : 'border-line text-muted-foreground'
                )}
              >
                {s}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="h-7 text-[10px] gap-1 border-line">
            <Download className="w-3 h-3" /> Export
          </Button>
        </motion.div>

        {/* History List */}
        <motion.div variants={itemVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
          <div className="divide-y divide-line/30">
            {filtered.map((item, i) => {
              const sc = statusConfig[item.status]
              const StatusIcon = sc.icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(43, 138, 138, 0.04)' }}
                  className="p-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-1', sc.bg, sc.ring)}>
                      <StatusIcon className={cn('w-4 h-4', sc.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/10 text-teal font-medium">{item.category}</span>
                            <span className="text-[10px] text-muted-foreground/50 font-mono">{item.agent}</span>
                            <span className="text-[10px] text-muted-foreground/50">{item.confidence}% confidence</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                            item.impactType === 'positive' ? 'bg-green/10 text-green' : item.impactType === 'negative' ? 'bg-red/10 text-red' : 'bg-muted/20 text-muted-foreground'
                          )}>
                            {item.impactType === 'positive' ? <TrendingUp className="w-3 h-3" /> : item.impactType === 'negative' ? <TrendingDown className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {item.impact}
                          </div>
                          <p className="text-[9px] text-muted-foreground/40 mt-1 font-mono">
                            {item.decidedAt ? new Date(item.decidedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending'}
                          </p>
                        </div>
                      </div>
                      {item.status === 'rejected' && item.reason && (
                        <p className="text-[10px] text-red/70 mt-1.5 italic">Reason: {item.reason}</p>
                      )}
                      {item.decidedBy && (
                        <p className="text-[10px] text-muted-foreground/40 mt-1">Decided by {item.decidedBy}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-teal transition-colors shrink-0 mt-1" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

      </motion.div>
    </AppShell>
  )
}

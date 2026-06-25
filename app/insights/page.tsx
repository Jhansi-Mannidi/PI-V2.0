'use client'

import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Clock, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const predictions = [
  { 
    title: 'Budget Overrun Risk',
    project: 'Pryor Creek New Build',
    probability: '78%',
    impact: 'High',
    timeframe: 'Next 30 days',
    trend: 'up',
    details: 'Current burn rate suggests $2.3M overrun by Q3'
  },
  { 
    title: 'Schedule Slip',
    project: 'Mesa Power Upgrade',
    probability: '65%',
    impact: 'Medium',
    timeframe: 'Next 2 weeks',
    trend: 'up',
    details: 'Critical path activities showing 12% delay pattern'
  },
  { 
    title: 'Resource Constraint',
    project: 'Henderson Substation',
    probability: '54%',
    impact: 'Medium',
    timeframe: 'Next 45 days',
    trend: 'down',
    details: 'Key electrical lead availability dropping'
  },
]

const opportunities = [
  { title: 'Cost Savings Opportunity', value: '$340K', project: 'Atlanta DC-3', action: 'Consolidate material orders' },
  { title: 'Schedule Acceleration', value: '8 days', project: 'Lenoir Fiber', action: 'Parallel foundation work' },
  { title: 'Resource Optimization', value: '15%', project: 'Portfolio-wide', action: 'Cross-train electrical crews' },
]

export default function InsightsPage() {
  return (
    <AppShell
      title="Predictive Insights"
      subtitle="ML-powered predictions and opportunities"
      activeHref="/insights"
    >
      <div className="space-y-6 w-full">
        {/* Summary Stats */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[
            { label: 'Active Predictions', value: '12', icon: Zap, color: 'text-amber' },
            { label: 'High Confidence', value: '5', icon: Target, color: 'text-green' },
            { label: 'Opportunities', value: '8', icon: TrendingUp, color: 'text-teal' },
            { label: 'Alerts', value: '3', icon: AlertTriangle, color: 'text-red' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
                <stat.icon className={cn('w-4 h-4', stat.color)} />
              </div>
              <p className={cn('text-2xl font-bold font-mono', stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Predictions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
          >
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-transparent" />
              <div className="relative flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber" />
                <h3 className="text-sm font-semibold text-foreground">Risk Predictions</h3>
              </div>
            </div>
            <div className="divide-y divide-line/30">
              {predictions.map((pred, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  className="p-4 hover:bg-gold/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pred.title}</p>
                      <p className="text-[10px] text-muted-foreground/70">{pred.project}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {pred.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-red" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-green" />
                      )}
                      <span className="text-lg font-bold font-mono text-amber">{pred.probability}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/80">{pred.details}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn(
                      'text-[9px] px-2 py-0.5 rounded-full font-medium',
                      pred.impact === 'High' ? 'bg-red/10 text-red' : 'bg-amber/10 text-amber'
                    )}>
                      {pred.impact} Impact
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pred.timeframe}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
          >
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-green/5 to-transparent" />
              <div className="relative flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green" />
                <h3 className="text-sm font-semibold text-foreground">Opportunities Detected</h3>
              </div>
            </div>
            <div className="divide-y divide-line/30">
              {opportunities.map((opp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  className="p-4 hover:bg-gold/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{opp.title}</p>
                      <p className="text-[10px] text-muted-foreground/70">{opp.project}</p>
                    </div>
                    <span className="text-lg font-bold font-mono text-green">{opp.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80">Recommended: {opp.action}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}

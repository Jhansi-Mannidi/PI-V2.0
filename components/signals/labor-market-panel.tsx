'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, ChevronDown, ExternalLink, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { laborMarketSignals } from '@/lib/signals-data'

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function LaborMarketPanel() {
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)

  const regionSummary = useMemo(() => {
    return laborMarketSignals.regionalWages.map(r => ({
      ...r,
      status: r.costHeadwind === 'High' ? 'alert' : r.costHeadwind === 'Moderate' ? 'warning' : 'stable'
    }))
  }, [])

  return (
    <motion.div variants={sectionVariants} className="space-y-4">
      {/* Skilled Trades Sub-Panel */}
      <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        <div className="relative p-4 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red/6 via-transparent to-transparent" />
          <h3 className="relative text-sm font-semibold text-foreground">Skilled Trades Availability</h3>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Current market capacity by trade</p>
        </div>

        <div className="divide-y divide-border/30">
          {laborMarketSignals.skilledTrades.map((trade) => {
            const isExpanded = expandedTrade === trade.trade
            const availColor = trade.availability === 'Low' ? 'text-red' : trade.availability === 'Medium' ? 'text-amber' : 'text-green'
            
            return (
              <motion.div
                key={trade.trade}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <button
                  onClick={() => setExpandedTrade(isExpanded ? null : trade.trade)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-foreground">{trade.trade}</p>
                      <span className={cn('text-[10px] font-bold flex items-center gap-0.5', availColor)}>
                        {trade.availability}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70">{trade.source}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn(
                      'text-xs font-bold font-mono flex items-center gap-1',
                      trade.trend === 'down' ? 'text-red' : trade.trend === 'up' ? 'text-green' : 'text-foreground'
                    )}>
                      {trade.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {trade.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {trade.trendPercent}
                    </span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-border/30">
                        <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/30 dark:bg-muted/20 rounded-lg p-3">{trade.detail}</p>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Affected Regions & Projects:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {trade.projects.map(p => (
                              <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-red/10 text-red border border-red/20 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Regional Wage Heatmap */}
      <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        <div className="relative p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold text-foreground">Regional Wage Inflation & Cost Headwinds</h3>
          <p className="text-[10px] text-muted-foreground/60 mt-1">YoY wage pressure by region</p>
        </div>

        <div className="divide-y divide-border/30">
          {regionSummary.map((region) => {
            const isExpanded = expandedRegion === region.region
            return (
              <motion.div
                key={region.region}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setExpandedRegion(isExpanded ? null : region.region)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors',
                    region.status === 'alert' && 'bg-red/5 dark:bg-red/5',
                    region.status === 'warning' && 'bg-amber/5 dark:bg-amber/5'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{region.region}</p>
                    <p className="text-[10px] text-muted-foreground/70">{region.source}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={cn(
                        'text-xs font-bold font-mono',
                        region.status === 'alert' ? 'text-red' : region.status === 'warning' ? 'text-amber' : 'text-green'
                      )}>
                        {region.wageInflation}% inflation
                      </div>
                      <div className="text-[10px] text-muted-foreground/50">{region.costHeadwind}</div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border/30">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-2">Active Projects:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {region.projects.map(p => (
                            <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-amber/10 text-amber border border-amber/20">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Active Signals */}
      <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold text-foreground">Active Signals</h3>
          <p className="text-[10px] text-muted-foreground/60 mt-1">{laborMarketSignals.activeSignals.length} labor market signals affecting portfolio</p>
        </div>

        <div className="divide-y divide-border/30">
          {laborMarketSignals.activeSignals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'p-4',
                signal.status === 'active' && 'bg-red/5 dark:bg-red/5 border-l-2 border-l-red',
                signal.status === 'watch' && 'bg-amber/5 dark:bg-amber/5 border-l-2 border-l-amber'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-bold text-foreground">{signal.type}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{signal.signal}</p>
                </div>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-1 rounded-md shrink-0',
                  signal.status === 'active' ? 'bg-red/20 text-red' : 'bg-amber/20 text-amber'
                )}>
                  {signal.status}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mb-2">{signal.source}</p>
              <div className="flex items-center gap-1 text-teal hover:text-teal/80 transition-colors">
                <ExternalLink className="w-3 h-3" />
                <a href="#" className="text-[10px] font-medium">{signal.recommendation}</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bibliography */}
      <div className="bg-muted/30 dark:bg-muted/20 border border-border/50 rounded-xl p-4">
        <h4 className="text-xs font-bold text-foreground mb-3">Sources & Attribution</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {laborMarketSignals.bibliography.map((bib) => (
            <a
              key={bib.source}
              href={bib.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-teal hover:text-teal/80 transition-colors flex items-center gap-1 group"
            >
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              {bib.source}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

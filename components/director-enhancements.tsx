'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  MessageSquare, 
  GitCompare,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

/* ════════════════════════════════════════════════════════════════════════════
   1. VARIANCE CONTEXT CARD - Data vs Human narrative
   ════════════════════════════════════════════════════════════════════════════ */

export function VarianceContextCard({ className }: { className?: string }) {
  const [captureModalOpen, setCaptureModalOpen] = React.useState(false)
  const [additionalContext, setAdditionalContext] = React.useState('')

  return (
    <>
      <motion.div 
        className={cn('bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm', className)}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-line/50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <GitCompare className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                What moved portfolio CPI this week — data and human context
              </h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-teal" />
                A-302 Variance Explainer
              </p>
            </div>
          </div>
        </div>

        {/* Two side-by-side cards */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DATA SAYS card - Navy left border */}
            <motion.div 
              className="relative bg-muted/30 dark:bg-navy-mid/30 rounded-lg p-4 border-l-4 border-navy dark:border-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy dark:text-primary">Data Says</span>
                <span className="text-[9px] text-muted-foreground/60 font-mono">(from A-302)</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Portfolio CPI declined <span className="font-mono font-bold text-navy dark:text-primary">0.02</span> this week, 
                <span className="font-mono font-bold text-navy dark:text-primary"> 0.96</span> to 
                <span className="font-mono font-bold text-navy dark:text-primary"> 0.94</span>. Primary driver: 
                <span className="font-semibold"> Henderson Substation</span> (60% of variance), 
                <span className="font-mono font-bold text-red"> $1.2M</span> unplanned electrical rework, 
                cost codes <span className="font-mono text-muted-foreground">26100-26400</span>.
              </p>
            </motion.div>

            {/* HUMAN SAYS card - Gold left border */}
            <motion.div 
              className="relative bg-muted/30 dark:bg-navy-mid/30 rounded-lg p-4 border-l-4 border-gold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Human Says</span>
                <span className="text-[9px] text-muted-foreground/60">(project team narrative)</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">
                &ldquo;Cold weather in Denver delayed exterior pours; rework on Pryor Creek was a contractor 
                scheduling issue, not a quality issue.&rdquo;
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">
                Source: Brian Steinberg (PM Central), captured 2 May 2026
              </p>
            </motion.div>
          </div>

          {/* Action row */}
          <motion.div 
            className="flex items-center gap-3 mt-4 pt-4 border-t border-line/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] px-3 gap-1.5"
              onClick={() => setCaptureModalOpen(true)}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Capture additional context
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[11px] px-3 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Reconcile
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Capture Context Modal */}
      <Dialog open={captureModalOpen} onOpenChange={setCaptureModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Capture Additional Context</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Add human narrative or context for this variance
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 text-sm bg-muted/50 border border-line rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Enter context from project team discussions, emails, or meetings..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCaptureModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setCaptureModalOpen(false)}>
              Save Context
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   2. SUPPLIER PERFORMANCE MODULE - Top of Mind
   ════════════════════════════════════════════════════════════════════════════ */

interface SupplierCard {
  name: string
  project?: string
  breachRate?: number
  breachRateDelta?: number
  cycleTime?: string
  cycleTarget?: string
  reliability: number
  driftIndicator: string
  accent: 'red' | 'green' | 'amber'
}

const supplierData: SupplierCard[] = [
  {
    name: 'Acme Electrical',
    project: 'Henderson Substation',
    breachRate: 18,
    breachRateDelta: 6,
    reliability: 0.88,
    driftIndicator: 'Behavior changed 4 weeks ago',
    accent: 'red',
  },
  {
    name: 'Pacific Electrical',
    project: 'Henderson sub-contractor',
    breachRate: 4,
    reliability: 0.96,
    driftIndicator: 'Stable',
    accent: 'green',
  },
  {
    name: 'LineSight',
    project: 'data stitching across portfolio',
    cycleTime: '2.1d',
    cycleTarget: '1.0d',
    reliability: 0.74,
    driftIndicator: 'Volume up 30% MoM',
    accent: 'amber',
  },
]

const accentColors = {
  red: {
    bg: 'bg-red/10 dark:bg-red/5',
    border: 'border-red/30',
    text: 'text-red',
    ring: 'ring-red/20',
    gradient: 'from-red/20 to-red/5',
  },
  green: {
    bg: 'bg-green/10 dark:bg-green/5',
    border: 'border-green/30',
    text: 'text-green',
    ring: 'ring-green/20',
    gradient: 'from-green/20 to-green/5',
  },
  amber: {
    bg: 'bg-amber/10 dark:bg-amber/5',
    border: 'border-amber/30',
    text: 'text-amber',
    ring: 'ring-amber/20',
    gradient: 'from-amber/20 to-amber/5',
  },
}

export function SupplierPerformanceModule({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn('bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm', className)}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-line/50">
        <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center ring-1 ring-teal/20">
            <AlertTriangle className="w-4.5 h-4.5 text-teal" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Supplier Performance — Top of Mind
            </h3>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-teal" />
              Powered by Party Feature Catalog · A-202 Bottleneck Detector
            </p>
          </div>
        </div>
      </div>

      {/* Three pill-cards */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supplierData.map((supplier, idx) => {
            const colors = accentColors[supplier.accent]
            return (
              <motion.div
                key={supplier.name}
                className={cn(
                  'relative rounded-lg p-4 border',
                  colors.bg,
                  colors.border
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Name and project */}
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-foreground">{supplier.name}</h4>
                  {supplier.project && (
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{supplier.project}</p>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-2 mb-3">
                  {supplier.breachRate !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">SLA miss rate:</span>
                      <span className={cn('text-xs font-mono font-bold', colors.text)}>
                        {supplier.breachRate}%
                        {supplier.breachRateDelta && (
                          <span className="text-[9px] text-red ml-1">(+{supplier.breachRateDelta}%)</span>
                        )}
                      </span>
                    </div>
                  )}
                  {supplier.cycleTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Cycle time:</span>
                      <span className={cn('text-xs font-mono font-bold', colors.text)}>
                        {supplier.cycleTime}
                        {supplier.cycleTarget && (
                          <span className="text-[9px] text-muted-foreground ml-1">(target: {supplier.cycleTarget})</span>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Reliability (p50):</span>
                    <span className="text-xs font-mono font-bold text-foreground">{supplier.reliability.toFixed(2)}</span>
                  </div>
                </div>

                {/* Drift indicator */}
                <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium', colors.bg)}>
                  {supplier.accent === 'red' ? (
                    <TrendingUp className="w-3 h-3 text-red" />
                  ) : supplier.accent === 'green' ? (
                    <Minus className="w-3 h-3 text-green" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-amber" />
                  )}
                  <span className={colors.text}>{supplier.driftIndicator}</span>
                </div>

                {/* View party link */}
                <button className="flex items-center gap-1 mt-3 text-[10px] font-medium text-primary hover:underline">
                  View party <ExternalLink className="w-3 h-3" />
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Footer link */}
        <motion.div 
          className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-line/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-muted-foreground">See all 47 active parties</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-primary hover:underline cursor-pointer">Party Intelligence</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

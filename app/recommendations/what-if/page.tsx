'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  FlaskConical, Play, RotateCcw, TrendingUp, TrendingDown,
  AlertTriangle, DollarSign, Clock, Users, ChevronRight, Sparkles,
  ArrowRight, Minus
} from 'lucide-react'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } } }

interface Lever {
  id: string
  label: string
  icon: typeof TrendingUp
  value: number
  min: number
  max: number
  step: number
  unit: string
  color: string
}

const defaultLevers: Lever[] = [
  { id: 'schedule_compression', label: 'Schedule Compression', icon: Clock, value: 0, min: -30, max: 30, step: 5, unit: '%', color: 'teal' },
  { id: 'budget_reallocation', label: 'Budget Reallocation', icon: DollarSign, value: 0, min: -20, max: 20, step: 2, unit: '%', color: 'gold' },
  { id: 'resource_augmentation', label: 'Resource Augmentation', icon: Users, value: 0, min: -5, max: 10, step: 1, unit: ' FTEs', color: 'amber' },
  { id: 'risk_mitigation', label: 'Risk Mitigation Spend', icon: AlertTriangle, value: 0, min: 0, max: 50, step: 5, unit: '%', color: 'red' },
]

interface SimResult {
  metric: string
  baseline: number
  projected: number
  change: number
  unit: string
}

const scenarios = [
  {
    name: 'Aggressive Recovery',
    description: 'Compress schedule by 15%, add 4 FTEs, increase risk spend by 30%',
    levers: { schedule_compression: -15, budget_reallocation: 5, resource_augmentation: 4, risk_mitigation: 30 },
  },
  {
    name: 'Cost Containment',
    description: 'Reduce budget by 10%, compress schedule by 5%',
    levers: { schedule_compression: -5, budget_reallocation: -10, resource_augmentation: 0, risk_mitigation: 0 },
  },
  {
    name: 'Balanced Approach',
    description: 'Moderate compression, add 2 FTEs, moderate risk spend',
    levers: { schedule_compression: -10, budget_reallocation: 0, resource_augmentation: 2, risk_mitigation: 15 },
  },
]

function simulateResults(levers: Record<string, number>): SimResult[] {
  const sc = levers.schedule_compression || 0
  const br = levers.budget_reallocation || 0
  const ra = levers.resource_augmentation || 0
  const rm = levers.risk_mitigation || 0

  return [
    { metric: 'Portfolio CPI', baseline: 0.94, projected: +(0.94 + (br * 0.003) + (ra * 0.008) - (sc * 0.001)).toFixed(2), change: 0, unit: '' },
    { metric: 'Portfolio SPI', baseline: 0.89, projected: +(0.89 + (sc * -0.004) + (ra * 0.012) + (rm * 0.001)).toFixed(2), change: 0, unit: '' },
    { metric: 'EAC Variance', baseline: 43, projected: +(43 + (br * -1.2) + (ra * 2.1) + (rm * 0.8) + (sc * -0.5)).toFixed(1), change: 0, unit: '$M' },
    { metric: 'P1 Risks', baseline: 9, projected: Math.max(0, Math.round(9 - (rm * 0.15) - (ra * 0.3) + (sc * 0.1))), change: 0, unit: '' },
    { metric: 'SLA Risk Probability', baseline: 72, projected: Math.max(5, Math.min(100, Math.round(72 - (rm * 0.8) - (ra * 2) + (sc * 0.3) + (br * 0.2)))), change: 0, unit: '%' },
  ].map(r => ({ ...r, change: +(r.projected - r.baseline).toFixed(2) }))
}

export default function WhatIfPage() {
  const [levers, setLevers] = useState<Lever[]>(defaultLevers)
  const [hasSimulated, setHasSimulated] = useState(false)
  const [results, setResults] = useState<SimResult[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const leverValues = levers.reduce((acc, l) => ({ ...acc, [l.id]: l.value }), {} as Record<string, number>)

  const updateLever = (id: string, value: number) => {
    setLevers(prev => prev.map(l => l.id === id ? { ...l, value } : l))
    setHasSimulated(false)
  }

  const runSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setResults(simulateResults(leverValues))
      setHasSimulated(true)
      setIsSimulating(false)
    }, 1200)
  }

  const resetLevers = () => {
    setLevers(defaultLevers)
    setHasSimulated(false)
    setResults([])
  }

  const applyScenario = (scenario: typeof scenarios[0]) => {
    setLevers(prev => prev.map(l => ({
      ...l,
      value: scenario.levers[l.id as keyof typeof scenario.levers] ?? l.value
    })))
    setHasSimulated(false)
  }

  return (
    <AppShell title="What-If Scenario Modeler" subtitle="Model portfolio outcomes by adjusting key levers" activeHref="/recommendations/what-if">
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">

        {/* Preset Scenarios */}
        <motion.div variants={itemVariants}>
          <p className="text-xs text-muted-foreground/60 mb-3 uppercase tracking-wider font-semibold">Preset Scenarios</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map((s, i) => (
              <motion.button
                key={s.name}
                onClick={() => applyScenario(s)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4 hover:border-teal/40 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FlaskConical className="w-4 h-4 text-teal" />
                  <h4 className="text-sm font-semibold text-foreground">{s.name}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{s.description}</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                  Apply scenario <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Levers */}
        <motion.div variants={itemVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
          <div className="relative p-4 border-b border-line/50">
            <div className="absolute inset-0 bg-gradient-to-r from-teal/8 via-teal/4 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center ring-1 ring-teal/20">
                  <Sparkles className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Adjustment Levers</h3>
                  <p className="text-[10px] text-muted-foreground/60">Drag sliders to model different scenarios</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetLevers} className="h-7 text-[10px] gap-1 border-line">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="h-7 text-[10px] gap-1 bg-teal hover:bg-teal/90 text-white"
                >
                  {isSimulating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Play className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  {isSimulating ? 'Running...' : 'Run Simulation'}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {levers.map((lever, i) => (
              <motion.div
                key={lever.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <lever.icon className={cn('w-4 h-4', `text-${lever.color}`)} />
                    <span className="text-xs font-medium text-foreground">{lever.label}</span>
                  </div>
                  <span className={cn(
                    'font-mono text-sm font-bold tabular-nums',
                    lever.value > 0 ? 'text-green' : lever.value < 0 ? 'text-red' : 'text-muted-foreground'
                  )}>
                    {lever.value > 0 ? '+' : ''}{lever.value}{lever.unit}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={lever.min}
                    max={lever.max}
                    step={lever.step}
                    value={lever.value}
                    onChange={(e) => updateLever(lever.id, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted/30
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-teal/20
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground/50 font-mono">{lever.min}{lever.unit}</span>
                    <span className="text-[9px] text-muted-foreground/50 font-mono">{lever.max}{lever.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {hasSimulated && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
            >
              <div className="relative p-4 border-b border-line/50">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/8 via-gold/4 to-transparent" />
                <div className="relative flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center ring-1 ring-gold/20">
                    <TrendingUp className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Simulation Results</h3>
                    <p className="text-[10px] text-muted-foreground/60">Projected impact on portfolio KPIs</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-line/30">
                {results.map((r, i) => {
                  const isPositive = r.metric === 'EAC Variance' || r.metric === 'P1 Risks' || r.metric === 'SLA Risk Probability'
                    ? r.change < 0
                    : r.change > 0
                  const isNeutral = r.change === 0

                  return (
                    <motion.div
                      key={r.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 text-center"
                    >
                      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">{r.metric}</p>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground/50 line-through">
                          {r.unit === '$M' ? `$${r.baseline}M` : r.baseline}{r.unit === '%' ? '%' : ''}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                        <span className={cn(
                          'font-mono text-lg font-bold',
                          isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green' : 'text-red'
                        )}>
                          {r.unit === '$M' ? `$${r.projected}M` : r.projected}{r.unit === '%' ? '%' : ''}
                        </span>
                      </div>
                      <div className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                        isNeutral ? 'bg-muted/20 text-muted-foreground' : isPositive ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                      )}>
                        {isNeutral ? <Minus className="w-3 h-3" /> : isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {r.change > 0 ? '+' : ''}{r.change}{r.unit}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AppShell>
  )
}

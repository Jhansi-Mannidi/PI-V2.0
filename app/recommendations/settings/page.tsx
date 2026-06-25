'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  SlidersHorizontal, Save, RotateCcw, Shield, Clock, Zap,
  Bell, Users, ChevronRight, Check, Sparkles, Eye, EyeOff
} from 'lucide-react'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } } }

interface ToggleSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  icon: typeof Shield
}

interface SliderSetting {
  id: string
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  icon: typeof Clock
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const [toggles, setToggles] = useState<ToggleSetting[]>([
    { id: 'auto_approve', label: 'Auto-Approve Low-Risk', description: 'Automatically approve recommendations below confidence threshold with minimal impact', enabled: false, icon: Zap },
    { id: 'notifications', label: 'Push Notifications', description: 'Receive real-time alerts for high-priority recommendations', enabled: true, icon: Bell },
    { id: 'team_sharing', label: 'Team Sharing', description: 'Share recommendation insights with project managers automatically', enabled: true, icon: Users },
    { id: 'audit_logging', label: 'Audit Logging', description: 'Log all recommendation decisions for compliance and review', enabled: true, icon: Shield },
    { id: 'show_confidence', label: 'Show Confidence Scores', description: 'Display ML confidence percentages on all recommendation cards', enabled: true, icon: Eye },
    { id: 'show_reasoning', label: 'Show AI Reasoning', description: 'Display detailed reasoning chain for each recommendation', enabled: false, icon: EyeOff },
  ])

  const [sliders, setSliders] = useState<SliderSetting[]>([
    { id: 'min_confidence', label: 'Minimum Confidence', description: 'Only show recommendations above this confidence threshold', value: 65, min: 0, max: 100, step: 5, unit: '%', icon: Shield },
    { id: 'refresh_interval', label: 'Refresh Interval', description: 'How often to poll for new recommendations', value: 30, min: 5, max: 120, step: 5, unit: ' min', icon: Clock },
    { id: 'max_recs', label: 'Max Visible Recommendations', description: 'Maximum number of recommendations to display at once', value: 20, min: 5, max: 50, step: 5, unit: '', icon: SlidersHorizontal },
  ])

  const [priorityWeights, setPriorityWeights] = useState([
    { id: 'cost', label: 'Cost Impact', value: 80 },
    { id: 'schedule', label: 'Schedule Impact', value: 90 },
    { id: 'risk', label: 'Risk Reduction', value: 70 },
    { id: 'resource', label: 'Resource Efficiency', value: 60 },
  ])

  const toggleSetting = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))
    setSaved(false)
  }

  const updateSlider = (id: string, value: number) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, value } : s))
    setSaved(false)
  }

  const updateWeight = (id: string, value: number) => {
    setPriorityWeights(prev => prev.map(w => w.id === id ? { ...w, value } : w))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setToggles(prev => prev.map(t => ({ ...t, enabled: ['notifications', 'team_sharing', 'audit_logging', 'show_confidence'].includes(t.id) })))
    setSliders(prev => prev.map(s => {
      const defaults: Record<string, number> = { min_confidence: 65, refresh_interval: 30, max_recs: 20 }
      return { ...s, value: defaults[s.id] ?? s.value }
    }))
    setPriorityWeights([
      { id: 'cost', label: 'Cost Impact', value: 80 },
      { id: 'schedule', label: 'Schedule Impact', value: 90 },
      { id: 'risk', label: 'Risk Reduction', value: 70 },
      { id: 'resource', label: 'Resource Efficiency', value: 60 },
    ])
    setSaved(false)
  }

  return (
    <AppShell title="Engine Settings" subtitle="Configure the Portfolio Recommendation Agent (A-305)" activeHref="/recommendations/settings">
      <motion.div className="space-y-6 max-w-[1000px]" variants={containerVariants} initial="hidden" animate="visible">

        {/* Header Actions */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal" />
            <p className="text-xs text-muted-foreground/60">Agent A-305 Configuration</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="h-7 text-[10px] gap-1 border-line">
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className={cn(
                'h-7 text-[10px] gap-1 transition-all duration-300',
                saved ? 'bg-green hover:bg-green/90 text-white' : 'bg-teal hover:bg-teal/90 text-white'
              )}
            >
              {saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
              {saved ? 'Saved' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        {/* Toggle Settings */}
        <motion.div variants={itemVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
          <div className="relative p-4 border-b border-line/50">
            <div className="absolute inset-0 bg-gradient-to-r from-teal/8 via-teal/4 to-transparent" />
            <h3 className="relative text-sm font-semibold text-foreground">Feature Toggles</h3>
          </div>
          <div className="divide-y divide-line/20">
            {toggles.map((toggle, i) => {
              const Icon = toggle.icon
              return (
                <motion.div
                  key={toggle.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 ring-1 ring-teal/15">
                      <Icon className="w-4 h-4 text-teal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{toggle.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(toggle.id)}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0',
                      toggle.enabled ? 'bg-teal' : 'bg-muted/30'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: toggle.enabled ? '24px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Slider Settings */}
        <motion.div variants={itemVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
          <div className="relative p-4 border-b border-line/50">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/8 via-gold/4 to-transparent" />
            <h3 className="relative text-sm font-semibold text-foreground">Thresholds</h3>
          </div>
          <div className="p-4 space-y-6">
            {sliders.map((slider, i) => {
              const Icon = slider.icon
              return (
                <motion.div
                  key={slider.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs font-medium text-foreground">{slider.label}</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-gold tabular-nums">
                      {slider.value}{slider.unit}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mb-2">{slider.description}</p>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={(e) => updateSlider(slider.id, Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted/30
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground/40 font-mono">{slider.min}{slider.unit}</span>
                    <span className="text-[9px] text-muted-foreground/40 font-mono">{slider.max}{slider.unit}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Priority Weights */}
        <motion.div variants={itemVariants} className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
          <div className="relative p-4 border-b border-line/50">
            <div className="absolute inset-0 bg-gradient-to-r from-amber/8 via-amber/4 to-transparent" />
            <div className="relative">
              <h3 className="text-sm font-semibold text-foreground">Priority Weights</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Adjust how the engine scores and ranks recommendations</p>
            </div>
          </div>
          <div className="p-4 space-y-5">
            {priorityWeights.map((weight, i) => (
              <motion.div
                key={weight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">{weight.label}</span>
                  <span className="font-mono text-sm font-bold text-amber tabular-nums">{weight.value}%</span>
                </div>
                <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber to-amber/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${weight.value}%` }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={weight.value}
                  onChange={(e) => updateWeight(weight.id, Number(e.target.value))}
                  className="w-full h-2 mt-1 rounded-full appearance-none cursor-pointer opacity-0 absolute
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={weight.value}
                  onChange={(e) => updateWeight(weight.id, Number(e.target.value))}
                  className="w-full h-4 -mt-3 rounded-full appearance-none cursor-pointer bg-transparent relative z-10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </AppShell>
  )
}

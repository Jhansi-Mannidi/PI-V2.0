'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  Cloud, CloudRain, Wind, Sun, Thermometer, Droplets, ArrowLeft,
  AlertTriangle, CheckCircle2, Clock, MapPin, Calendar, TrendingUp,
  Eye, ExternalLink, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// Weather data
const activeAlerts = [
  {
    id: 'WA-001',
    site: 'Pryor Creek',
    region: 'NA-W',
    state: 'OK',
    type: 'Rain Event',
    severity: 'amber',
    headline: '4-day rain event starting May 8',
    detail: '2.3" total precipitation expected. Ground saturation likely to delay foundation work.',
    forecast: '92% confidence from NWS ensemble model',
    impact: 'Potential 2-3 day delay on outdoor concrete pours',
    cashflowRisk: '$180K standby cost if no action',
    recommendation: 'REC-2026-0584',
    source: 'National Weather Service (NWS)',
    lastUpdated: '2h ago',
  },
  {
    id: 'WA-002',
    site: 'Mesa',
    region: 'NA-W',
    state: 'AZ',
    type: 'Wind Advisory',
    severity: 'amber',
    headline: 'High wind advisory May 10-11',
    detail: 'Sustained winds 35-45 mph with gusts to 55 mph expected.',
    forecast: '85% confidence',
    impact: 'Crane operations suspended; 1 day schedule slip possible',
    cashflowRisk: '$95K if critical lift delayed',
    recommendation: 'REC-2026-0586',
    source: 'National Weather Service (NWS)',
    lastUpdated: '4h ago',
  },
]

const siteForecasts = [
  { name: 'Pryor Creek', state: 'OK', region: 'NA-W', status: 'rain', temp: '72°F', humidity: '78%', wind: '12 mph',
    forecast: ['sun', 'sun', 'sun', 'rain', 'rain', 'rain', 'rain', 'cloud', 'sun', 'sun'] as const },
  { name: 'Mesa', state: 'AZ', region: 'NA-W', status: 'wind', temp: '98°F', humidity: '15%', wind: '42 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'wind', 'wind', 'sun', 'sun', 'sun', 'sun'] as const },
  { name: 'Henderson', state: 'NV', region: 'NA-W', status: 'clear', temp: '95°F', humidity: '18%', wind: '8 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] as const },
  { name: 'Atlanta DC-3', state: 'GA', region: 'NA-E', status: 'clear', temp: '82°F', humidity: '65%', wind: '6 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'sun'] as const },
  { name: 'Council Bluffs', state: 'IA', region: 'NA-W', status: 'clear', temp: '68°F', humidity: '55%', wind: '14 mph',
    forecast: ['sun', 'sun', 'cloud', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] as const },
  { name: 'Lenoir', state: 'NC', region: 'NA-E', status: 'clear', temp: '78°F', humidity: '58%', wind: '5 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'sun', 'sun', 'sun', 'sun'] as const },
  { name: 'Ashburn Pod 6', state: 'VA', region: 'NA-E', status: 'clear', temp: '75°F', humidity: '52%', wind: '7 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'cloud', 'sun'] as const },
  { name: 'Dallas Cooling', state: 'TX', region: 'NA-W', status: 'clear', temp: '88°F', humidity: '45%', wind: '10 mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] as const },
]

const historicalImpact = [
  { event: 'Q1 2026 Texas Ice Storm', sites: 3, daysLost: 12, cost: '$2.4M', mitigated: '$1.8M' },
  { event: 'Q4 2025 Hurricane Season', sites: 2, daysLost: 8, cost: '$1.6M', mitigated: '$1.2M' },
  { event: 'Q3 2025 Phoenix Heat Dome', sites: 2, daysLost: 6, cost: '$890K', mitigated: '$650K' },
]

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

function WeatherIcon({ type, size = 16 }: { type: 'sun' | 'rain' | 'wind' | 'cloud' | 'storm'; size?: number }) {
  switch (type) {
    case 'sun': return <Sun className="text-amber" style={{ width: size, height: size }} />
    case 'rain': return <CloudRain className="text-sky-500" style={{ width: size, height: size }} />
    case 'wind': return <Wind className="text-amber" style={{ width: size, height: size }} />
    case 'cloud': return <Cloud className="text-muted-foreground/60" style={{ width: size, height: size }} />
    case 'storm': return <CloudRain className="text-red" style={{ width: size, height: size }} />
  }
}

export default function WeatherSignalsPage() {
  const { aiEnabled } = useAI()
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  if (!aiEnabled) {
    return (
      <AppShell title="Weather Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto">
              <Cloud className="w-8 h-8 text-sky-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle in the header to access weather signal monitoring.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Weather Signals"
      subtitle="10-day site-level forecasts and active weather alerts affecting portfolio delivery"
      activeHref="/recommendations/signals"
    >
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">
        {/* Back Link */}
        <motion.div variants={sectionVariants}>
          <Link href="/recommendations/signals" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to External Signals
          </Link>
        </motion.div>

        {/* KPI Strip */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Alerts', value: '2', sublabel: 'Rain + Wind', color: 'amber', icon: AlertTriangle },
              { label: 'Sites Monitored', value: '8', sublabel: 'All regions', color: 'sky', icon: MapPin },
              { label: 'Forecast Accuracy', value: '94%', sublabel: '30-day rolling', color: 'green', icon: TrendingUp },
              { label: 'Last Updated', value: '2h', sublabel: 'Auto-refresh 6h', color: 'slate', icon: Clock },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'relative rounded-xl border p-4 bg-card/80 dark:bg-card/60 backdrop-blur-sm overflow-hidden',
                  `border-${kpi.color}/30`
                )}
              >
                <div className={cn('absolute inset-0 opacity-20', `bg-${kpi.color}/10`)} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sublabel}</p>
                  </div>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', `bg-${kpi.color}/10`)}>
                    <kpi.icon className={cn('w-4 h-4', `text-${kpi.color}`)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Active Alerts */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Active Weather Alerts</h3>
                  <p className="text-[10px] text-muted-foreground/60">Alerts requiring action or monitoring</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {activeAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          alert.severity === 'red' ? 'bg-red/10 text-red' : 'bg-amber/10 text-amber'
                        )}>
                          {alert.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">{alert.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{alert.site}, {alert.state} — {alert.headline}</h4>
                      <p className="text-xs text-muted-foreground/80 mb-2">{alert.detail}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground/60">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {alert.forecast}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {alert.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 lg:w-64 shrink-0">
                      <div className="p-2.5 rounded-lg bg-red/5 border border-red/20">
                        <p className="text-[10px] text-muted-foreground/60 mb-0.5">Impact</p>
                        <p className="text-xs font-medium text-foreground">{alert.impact}</p>
                        <p className="text-[10px] text-red font-mono mt-1">{alert.cashflowRisk}</p>
                      </div>
                      <Link
                        href={`/recommendations?rec=${alert.recommendation}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-teal/5 border border-teal/20 hover:bg-teal/10 transition-colors"
                      >
                        <span className="text-[10px] font-medium text-teal">{alert.recommendation}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-teal" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/20 flex items-center gap-2 text-[10px] text-muted-foreground/50">
                    <span>Source: {alert.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 10-Day Forecast Grid */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/6 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">10-Day Site Forecasts</h3>
                    <p className="text-[10px] text-muted-foreground/60">Click any site for detailed forecast</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60">
                  <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber" /> Clear</span>
                  <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-sky-500" /> Rain</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-amber" /> Wind</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Site</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Status</th>
                    <th className="text-center p-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Temp</th>
                    {dayLabels.map((day, i) => (
                      <th key={i} className="text-center p-2 text-[10px] font-medium text-muted-foreground/50">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {siteForecasts.map((site) => (
                    <tr
                      key={site.name}
                      className={cn(
                        'hover:bg-muted/30 transition-colors cursor-pointer',
                        selectedSite === site.name && 'bg-muted/50'
                      )}
                      onClick={() => setSelectedSite(selectedSite === site.name ? null : site.name)}
                    >
                      <td className="p-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{site.name}</p>
                          <p className="text-[10px] text-muted-foreground/60">{site.state} · {site.region}</p>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          site.status === 'clear' ? 'bg-green/10 text-green' :
                          site.status === 'rain' ? 'bg-sky-500/10 text-sky-500' :
                          'bg-amber/10 text-amber'
                        )}>
                          {site.status === 'clear' ? <CheckCircle2 className="w-3 h-3" /> :
                           site.status === 'rain' ? <CloudRain className="w-3 h-3" /> :
                           <Wind className="w-3 h-3" />}
                          {site.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs font-mono text-foreground">{site.temp}</span>
                      </td>
                      {site.forecast.map((day, i) => (
                        <td key={i} className="p-2 text-center">
                          <WeatherIcon type={day} size={18} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Historical Impact */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-slate" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Historical Weather Impact</h3>
                  <p className="text-[10px] text-muted-foreground/60">Past events and mitigation effectiveness</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {historicalImpact.map((event, i) => (
                  <motion.div
                    key={event.event}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <p className="text-xs font-semibold text-foreground mb-2">{event.event}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-muted-foreground/60">Sites Affected</p>
                        <p className="font-mono font-bold text-foreground">{event.sites}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/60">Days Lost</p>
                        <p className="font-mono font-bold text-foreground">{event.daysLost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/60">Total Cost</p>
                        <p className="font-mono font-bold text-red">{event.cost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/60">Mitigated</p>
                        <p className="font-mono font-bold text-green">{event.mitigated}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Source Attribution */}
        <motion.section variants={sectionVariants}>
          <div className="text-center py-4 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground/50">
              Source: National Weather Service (NWS) · NOAA Climate Prediction Center · Site-specific ensemble models
            </p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Weather data auto-refreshes every 6 hours. Critical alerts pushed within 15 minutes of NWS issuance.
            </p>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  )
}

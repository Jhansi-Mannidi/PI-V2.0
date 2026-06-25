'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import {
  Cloud, CloudRain, Wind, Sun, PackageSearch, Landmark, HardHat, Zap,
  ChevronDown, ChevronRight, ExternalLink, AlertTriangle, CheckCircle2,
  Clock, Eye, ArrowRight, RefreshCw, Thermometer, Droplets, MapPin,
  FileText, Shield, Radio, TrendingUp, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const signalSummary = [
  { label: 'Weather Alerts', count: 2, status: 'active', icon: Cloud, color: 'sky',
    detail: 'Pryor Creek rain event, Mesa wind advisory', bgClass: 'bg-sky-500/10', textClass: 'text-sky-600 dark:text-sky-400', borderClass: 'border-sky-500/30', href: '/recommendations/signals/weather' },
  { label: 'Supply Chain', count: 1, status: 'watch', icon: PackageSearch, color: 'amber',
    detail: 'Steel lead time +3 weeks', bgClass: 'bg-amber/10', textClass: 'text-amber', borderClass: 'border-amber/30', href: '/recommendations/signals/supply-chain' },
  { label: 'Regulatory', count: 3, status: 'upcoming', icon: Landmark, color: 'slate',
    detail: '3 permits/inspections in 30 days', bgClass: 'bg-slate/10', textClass: 'text-slate', borderClass: 'border-slate/30', href: '/recommendations/signals/regulatory' },
  { label: 'Labor Market', count: 0, status: 'clear', icon: HardHat, color: 'green',
    detail: 'All trades available in market', bgClass: 'bg-green/10', textClass: 'text-green', borderClass: 'border-green/30', href: '/recommendations/signals/labor' },
  { label: 'Utility', count: 1, status: 'pending', icon: Zap, color: 'gold',
    detail: 'Henderson power interconnect pending', bgClass: 'bg-gold/10', textClass: 'text-gold', borderClass: 'border-gold/30', href: '/recommendations/signals/utility' },
]

type WeatherIcon = 'sun' | 'rain' | 'wind' | 'cloud' | 'storm'

interface SiteWeather {
  name: string
  state: string
  lat: number
  lng: number
  status: 'clear' | 'rain' | 'wind' | 'storm'
  alert: string | null
  forecast: WeatherIcon[]
}

const sites: SiteWeather[] = [
  { name: 'Pryor Creek', state: 'OK', lat: 36.31, lng: -95.32, status: 'rain',
    alert: '4-day rain event starting May 8 — 2.3" total expected',
    forecast: ['sun', 'sun', 'sun', 'rain', 'rain', 'rain', 'rain', 'cloud', 'sun', 'sun'] },
  { name: 'Mesa', state: 'AZ', lat: 33.42, lng: -111.83, status: 'wind',
    alert: 'High wind advisory May 10-11 — gusts to 55mph',
    forecast: ['sun', 'sun', 'sun', 'sun', 'wind', 'wind', 'sun', 'sun', 'sun', 'sun'] },
  { name: 'Henderson', state: 'NV', lat: 36.04, lng: -114.98, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] },
  { name: 'Atlanta DC-3', state: 'GA', lat: 33.75, lng: -84.39, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'sun'] },
  { name: 'Council Bluffs', state: 'IA', lat: 41.26, lng: -95.86, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'cloud', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] },
  { name: 'Lenoir', state: 'NC', lat: 35.91, lng: -81.54, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'sun', 'sun', 'sun', 'sun'] },
  { name: 'Ashburn Pod 6', state: 'VA', lat: 39.04, lng: -77.49, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'cloud', 'cloud', 'sun'] },
  { name: 'Dallas Cooling', state: 'TX', lat: 32.78, lng: -96.80, status: 'clear',
    alert: null,
    forecast: ['sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun', 'sun'] },
]

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

const supplyChainSignals = [
  {
    commodity: 'Structural Steel',
    source: 'Steel Service Center Institute Q2 Report',
    current: '11 weeks',
    previous: '8 weeks',
    change: '+37.5%',
    direction: 'up' as const,
    detail: 'Regional lead time has increased from 8 weeks to 11 weeks due to tariff uncertainty and mill maintenance shutdowns in the Southeast.',
    affectedProjects: ['Henderson Substation (steel order pending)', 'Council Bluffs Phase 4 (steel in procurement)'],
    recLink: { id: 'REC-SC-01', text: 'Consider early procurement for Council Bluffs steel package' },
  },
  {
    commodity: 'Copper Wire (THHN)',
    source: 'COMEX Copper Futures + distributor survey',
    current: '4 weeks',
    previous: '3 weeks',
    change: '+33%',
    direction: 'up' as const,
    detail: 'Moderate increase in copper wire lead times driven by COMEX price increase. Within normal seasonal range.',
    affectedProjects: ['Mesa Power Upgrade (next month procurement)'],
    recLink: null,
  },
  {
    commodity: 'Transformer Units',
    source: 'ABB/Siemens regional allocation tracker',
    current: '16 weeks',
    previous: '16 weeks',
    change: '0%',
    direction: 'flat' as const,
    detail: 'Stable lead times. Henderson unit already on order and on schedule for June 12 delivery.',
    affectedProjects: ['Henderson Substation (on order)'],
    recLink: null,
  },
]

const regulatoryCalendar = [
  { date: 'May 23', project: 'Henderson Substation', item: 'Building permit renewal', status: 'not_started', daysLeft: 18, hasOrchestration: false },
  { date: 'Jun 7', project: 'Council Bluffs', item: 'Safety officer certification renewal', status: 'in_progress', daysLeft: 33, hasOrchestration: true },
  { date: 'Jun 15', project: 'Pryor Creek', item: 'Environmental compliance report', status: 'in_progress', daysLeft: 41, hasOrchestration: true },
  { date: 'Jun 20', project: 'Mesa', item: 'Fire safety inspection', status: 'scheduled', daysLeft: 46, hasOrchestration: true },
  { date: 'Jun 28', project: 'Atlanta DC-3', item: 'AHJ electrical inspection', status: 'planning', daysLeft: 54, hasOrchestration: true },
  { date: 'Jul 1', project: 'Ashburn Pod 6', item: 'Annual OSHA audit', status: 'planning', daysLeft: 57, hasOrchestration: false },
]

const signalRecMapping = [
  { signal: 'Pryor Creek 4-day rain event', type: 'Weather', recsGenerated: 1, recSummary: 'Reschedule outdoor work, pull indoor electrical forward', status: 'Pending action', recId: 'REC-001' },
  { signal: 'Henderson permit expiry (May 23)', type: 'Regulatory', recsGenerated: 1, recSummary: 'Initiate permit renewal orchestration', status: 'Pending action', recId: 'HEN-001' },
  { signal: 'Steel lead time +3 weeks', type: 'Supply Chain', recsGenerated: 1, recSummary: 'Early procurement for Council Bluffs steel', status: 'Under review', recId: 'REC-SC-01' },
  { signal: 'Mesa high wind advisory', type: 'Weather', recsGenerated: 0, recSummary: 'No critical-path impact identified', status: 'Monitoring', recId: null },
  { signal: 'Henderson power interconnect', type: 'Utility', recsGenerated: 0, recSummary: 'Utility confirms Q3 schedule, no conflict', status: 'Monitoring', recId: null },
  { signal: 'Copper wire lead time +33%', type: 'Supply Chain', recsGenerated: 0, recSummary: 'Within seasonal range, no action needed', status: 'Monitoring', recId: null },
  { signal: 'OSHA audit window (Jul 1)', type: 'Regulatory', recsGenerated: 0, recSummary: 'Planning phase, 57 days remaining', status: 'Monitoring', recId: null },
]

// ── HELPER COMPONENTS ─────────────────────────────────────────────────────────

function WeatherIconCell({ type, size = 16 }: { type: WeatherIcon; size?: number }) {
  switch (type) {
    case 'sun': return <Sun className="text-amber" style={{ width: size, height: size }} />
    case 'rain': return <CloudRain className="text-sky-500" style={{ width: size, height: size }} />
    case 'wind': return <Wind className="text-amber" style={{ width: size, height: size }} />
    case 'cloud': return <Cloud className="text-muted-foreground/60" style={{ width: size, height: size }} />
    case 'storm': return <CloudRain className="text-red" style={{ width: size, height: size }} />
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-red/10 text-red border-red/20',
    watch: 'bg-amber/10 text-amber border-amber/20',
    upcoming: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    clear: 'bg-green/10 text-green border-green/20',
    pending: 'bg-gold/10 text-gold border-gold/20',
  }
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', styles[status] || styles.clear)}>
      {status === 'active' ? `${signalSummary.find(s => s.status === 'active')?.count} active` : 
       status === 'watch' ? '1 watch' :
       status === 'upcoming' ? '3 upcoming' :
       status === 'clear' ? '0 issues' : '1 pending'}
    </span>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function ExternalSignalsPage() {
  const { aiEnabled } = useAI()
  const [expandedSupply, setExpandedSupply] = useState<number | null>(0)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  if (!aiEnabled) {
    return (
      <AppShell title="External Signals" subtitle="Enable AI to access this feature" activeHref="/recommendations/signals">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto">
              <Radio className="w-8 h-8 text-teal" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations Required</h2>
            <p className="text-sm text-muted-foreground">Enable the AI toggle in the header to access external signal monitoring and portfolio impact analysis.</p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="External Signals"
      subtitle="Monitoring weather, supply chain, regulatory, and labor signals across 8 project sites"
      activeHref="/recommendations/signals"
    >
      <motion.div className="space-y-6 w-full" variants={containerVariants} initial="hidden" animate="visible">

        {/* ── REGION 1: Signal Summary Strip ──────────────────────────── */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {signalSummary.map((signal, i) => {
              const Icon = signal.icon
              return (
                <Link key={signal.label} href={signal.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className={cn(
                      'relative rounded-xl border p-4 bg-card/80 dark:bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer group h-full',
                      signal.borderClass
                    )}
                  >
                    <div className={cn('absolute inset-0 opacity-30', signal.bgClass)} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', signal.bgClass)}>
                          <Icon className={cn('w-4 h-4', signal.textClass)} />
                        </div>
                        <StatusBadge status={signal.status} />
                      </div>
                      <p className="text-xs font-semibold text-foreground mb-1">{signal.label}</p>
                      <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{signal.detail}</p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.section>

        {/* ── REGION 2: Weather Impact Map & Timeline ─────────────────── */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/6 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center ring-1 ring-sky-500/20">
                    <Cloud className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Weather Impact Monitor</h3>
                    <p className="text-[10px] text-muted-foreground/60">10-day forecast across all 8 project sites</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground/60">Updated 2h ago</span>
                </div>
              </div>
            </div>

            {/* US Map with site markers */}
            <div className="p-4">
              <div className="relative bg-background/50 dark:bg-navy/30 rounded-xl border border-line/30 overflow-hidden">
                {/* Stylized US map background using SVG */}
                <div className="relative w-full" style={{ paddingBottom: '50%', minHeight: 280 }}>
                  <svg
                    viewBox="0 0 960 500"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Simplified US outline */}
                    <path
                      d="M 180 120 Q 200 100, 280 95 Q 360 90, 450 100 Q 500 105, 550 110 Q 600 100, 680 115 Q 750 100, 820 120 L 830 140 Q 835 160, 830 200 L 825 230 Q 820 260, 800 290 Q 780 310, 760 330 L 740 345 Q 720 355, 700 360 Q 680 370, 650 365 Q 630 360, 600 370 Q 580 380, 550 385 Q 520 390, 490 395 Q 460 398, 430 395 Q 400 390, 370 380 Q 340 370, 310 360 Q 280 355, 250 345 L 220 330 Q 200 315, 180 295 Q 165 275, 155 250 Q 148 230, 145 205 Q 143 180, 150 155 Q 158 135, 180 120 Z"
                      className="fill-muted/30 dark:fill-navy-mid/50 stroke-line/40 dark:stroke-line/20"
                      strokeWidth="1.5"
                    />
                    {/* Grid lines */}
                    {[150, 250, 350, 450].map(y => (
                      <line key={`h-${y}`} x1="100" y1={y} x2="880" y2={y} className="stroke-line/10" strokeWidth="0.5" strokeDasharray="4 4" />
                    ))}
                    {[200, 350, 500, 650, 800].map(x => (
                      <line key={`v-${x}`} x1={x} y1="60" x2={x} y2="450" className="stroke-line/10" strokeWidth="0.5" strokeDasharray="4 4" />
                    ))}
                  </svg>

                  {/* Site markers positioned over the map */}
                  {sites.map((site, i) => {
                    // Approximate x,y positions on the SVG viewBox
                    const positions: Record<string, { x: number; y: number }> = {
                      'Pryor Creek': { x: 48, y: 42 },
                      'Mesa': { x: 22, y: 54 },
                      'Henderson': { x: 18, y: 38 },
                      'Atlanta DC-3': { x: 68, y: 52 },
                      'Council Bluffs': { x: 48, y: 30 },
                      'Lenoir': { x: 72, y: 46 },
                      'Ashburn Pod 6': { x: 78, y: 36 },
                      'Dallas Cooling': { x: 44, y: 58 },
                    }
                    const pos = positions[site.name] || { x: 50, y: 50 }
                    const isSelected = selectedSite === site.name
                    const statusColor = site.status === 'rain' ? 'bg-sky-500' : site.status === 'wind' ? 'bg-amber' : 'bg-green'
                    const pulseColor = site.status === 'rain' ? 'bg-sky-500/40' : site.status === 'wind' ? 'bg-amber/40' : 'bg-green/40'
                    const StatusIcon = site.status === 'rain' ? CloudRain : site.status === 'wind' ? Wind : CheckCircle2
                    const iconColor = site.status === 'rain' ? 'text-sky-500' : site.status === 'wind' ? 'text-amber' : 'text-green'

                    return (
                      <motion.div
                        key={site.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                        className="absolute cursor-pointer group"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                        onClick={() => setSelectedSite(isSelected ? null : site.name)}
                      >
                        {/* Pulse ring for alerts */}
                        {site.alert && (
                          <div className={cn('absolute inset-0 rounded-full animate-ping', pulseColor)} style={{ width: 28, height: 28, margin: -4 }} />
                        )}
                        {/* Marker dot */}
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-all border-2 border-card',
                          statusColor,
                          isSelected && 'ring-2 ring-gold ring-offset-1 ring-offset-background scale-125'
                        )}>
                          <StatusIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                        {/* Label */}
                        <div className={cn(
                          'absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all',
                          isSelected ? 'top-7' : 'top-6 opacity-0 group-hover:opacity-100 group-hover:top-7'
                        )}>
                          <div className="bg-card/95 dark:bg-card/90 backdrop-blur-sm border border-line/50 rounded-md px-2 py-1 shadow-lg">
                            <p className="text-[10px] font-semibold text-foreground">{site.name}</p>
                            {site.alert && <p className="text-[9px] text-red max-w-[160px]">{site.alert}</p>}
                            {!site.alert && <p className="text-[9px] text-green">Clear 10-day forecast</p>}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 pb-3 px-4">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red" /><span className="text-[10px] text-muted-foreground">Storm</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-sky-500" /><span className="text-[10px] text-muted-foreground">Rain</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber" /><span className="text-[10px] text-muted-foreground">Wind</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green" /><span className="text-[10px] text-muted-foreground">Clear</span></div>
                </div>
              </div>

              {/* 10-Day Weather Timeline Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line/30">
                      <th className="text-left py-2 pr-3 font-semibold text-muted-foreground/70 w-[140px] min-w-[120px]">Site</th>
                      {dayLabels.map((d, i) => (
                        <th key={i} className="text-center py-2 px-1 font-medium text-muted-foreground/50 w-10 min-w-[36px]">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((site, si) => (
                      <motion.tr
                        key={site.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + si * 0.04 }}
                        className={cn(
                          'border-b border-line/15 transition-colors',
                          selectedSite === site.name && 'bg-gold/5'
                        )}
                        onClick={() => setSelectedSite(selectedSite === site.name ? null : site.name)}
                      >
                        <td className="py-2.5 pr-3 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-full shrink-0',
                              site.status === 'rain' ? 'bg-sky-500' : site.status === 'wind' ? 'bg-amber' : 'bg-green'
                            )} />
                            <span className="font-medium text-foreground truncate">{site.name}</span>
                            <span className="text-muted-foreground/40">{site.state}</span>
                          </div>
                        </td>
                        {site.forecast.map((w, di) => (
                          <td key={di} className="text-center py-2.5 px-1">
                            <div className={cn(
                              'w-7 h-7 mx-auto rounded-md flex items-center justify-center transition-colors',
                              w === 'rain' ? 'bg-sky-500/10' : w === 'wind' ? 'bg-amber/10' : w === 'cloud' ? 'bg-muted/40' : 'bg-transparent'
                            )}>
                              <WeatherIconCell type={w} size={14} />
                            </div>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── REGION 3: Supply Chain Watch ───────────────���────────────── */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center ring-1 ring-amber/20">
                  <PackageSearch className="w-4 h-4 text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Supply Chain Watch</h3>
                  <p className="text-[10px] text-muted-foreground/60">Commodity lead times and availability affecting portfolio</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-line/30">
              {supplyChainSignals.map((signal, i) => {
                const isExpanded = expandedSupply === i
                return (
                  <motion.div
                    key={signal.commodity}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    <button
                      onClick={() => setExpandedSupply(isExpanded ? null : i)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-foreground">{signal.commodity}</p>
                          {signal.direction === 'up' && (
                            <span className="text-[10px] font-bold text-red flex items-center gap-0.5">
                              <TrendingUp className="w-3 h-3" />{signal.change}
                            </span>
                          )}
                          {signal.direction === 'flat' && (
                            <span className="text-[10px] font-medium text-muted-foreground">Stable</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground/70">{signal.source}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground/50 line-through">{signal.previous}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                            <span className={cn(
                              'text-xs font-bold font-mono',
                              signal.direction === 'up' ? 'text-red' : 'text-foreground'
                            )}>{signal.current}</span>
                          </div>
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
                          <div className="px-4 pb-4 space-y-3">
                            <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/30 dark:bg-muted/20 rounded-lg p-3">{signal.detail}</p>
                            <div>
                              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Affected Projects:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {signal.affectedProjects.map(p => (
                                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-amber/8 dark:bg-amber/10 text-amber border border-amber/15">{p}</span>
                                ))}
                              </div>
                            </div>
                            {signal.recLink && (
                              <Link href={`/recommendations/${signal.recLink.id}`} className="flex items-center gap-2 text-[11px] font-medium text-teal hover:text-teal/80 transition-colors group">
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                {signal.recLink.text}
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* ── REGION 4: Regulatory Calendar ───────────────────────────── */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-slate/6 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate/10 flex items-center justify-center ring-1 ring-slate/20">
                    <Landmark className="w-4 h-4 text-slate" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Regulatory Calendar</h3>
                    <p className="text-[10px] text-muted-foreground/60">Permits, inspections, and compliance deadlines -- next 60 days</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50">{regulatoryCalendar.length} items</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[60px] sm:left-[72px] top-0 bottom-0 w-px bg-line/30" />

                <div className="space-y-1">
                  {regulatoryCalendar.map((item, i) => {
                    const isUrgent = item.daysLeft <= 20 && !item.hasOrchestration
                    const statusIcon = item.status === 'not_started' ? AlertTriangle
                      : item.status === 'in_progress' ? Activity
                      : item.status === 'scheduled' ? CheckCircle2
                      : Clock
                    const statusColor = item.status === 'not_started' ? 'text-amber bg-amber/10 ring-amber/20'
                      : item.status === 'in_progress' ? 'text-teal bg-teal/10 ring-teal/20'
                      : item.status === 'scheduled' ? 'text-green bg-green/10 ring-green/20'
                      : 'text-muted-foreground bg-muted/30 ring-line/30'
                    const StatusIconComp = statusIcon

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + i * 0.06 }}
                        className={cn(
                          'flex items-center gap-3 sm:gap-4 p-2.5 rounded-lg transition-colors group',
                          isUrgent ? 'bg-amber/5 dark:bg-amber/8 border border-dashed border-amber/30' : 'hover:bg-muted/20'
                        )}
                      >
                        {/* Date */}
                        <div className="w-[52px] sm:w-[60px] text-right shrink-0">
                          <span className="text-[11px] font-mono font-semibold text-foreground">{item.date}</span>
                        </div>

                        {/* Dot on timeline */}
                        <div className={cn('w-6 h-6 rounded-full flex items-center justify-center ring-1 shrink-0 z-10', statusColor)}>
                          <StatusIconComp className="w-3 h-3" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-semibold text-foreground">{item.item}</p>
                            {isUrgent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber/15 text-amber border border-amber/20 animate-pulse">
                                NOT STARTED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.project}</p>
                        </div>

                        {/* Days left */}
                        <div className="text-right shrink-0">
                          <span className={cn(
                            'text-xs font-bold font-mono tabular-nums',
                            item.daysLeft <= 20 ? 'text-amber' : item.daysLeft <= 40 ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {item.daysLeft}d
                          </span>
                          <p className="text-[9px] text-muted-foreground/40">remaining</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── REGION 5: Signal → Recommendation Mapping ──────────────── */}
        <motion.section variants={sectionVariants}>
          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden">
            <div className="relative p-4 border-b border-line/50">
              <div className="absolute inset-0 bg-gradient-to-r from-teal/6 via-transparent to-transparent" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center ring-1 ring-teal/20">
                  <Activity className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Signal-to-Recommendation Mapping</h3>
                  <p className="text-[10px] text-muted-foreground/60">Which external signals have generated actionable recommendations</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-line/30">
                    <th className="text-left p-3 font-semibold text-muted-foreground/70">Signal</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground/70 hidden sm:table-cell">Type</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground/70">Recs</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground/70 hidden md:table-cell">Summary</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground/70">Status</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground/70"></th>
                  </tr>
                </thead>
                <tbody>
                  {signalRecMapping.map((row, i) => {
                    const statusStyle = row.status === 'Pending action' ? 'bg-amber/10 text-amber border-amber/20'
                      : row.status === 'Under review' ? 'bg-teal/10 text-teal border-teal/20'
                      : 'bg-muted/30 text-muted-foreground border-line/30'
                    const typeStyle = row.type === 'Weather' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      : row.type === 'Regulatory' ? 'bg-slate/10 text-slate'
                      : row.type === 'Supply Chain' ? 'bg-amber/10 text-amber'
                      : 'bg-gold/10 text-gold'

                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + i * 0.05 }}
                        className="border-b border-line/15 hover:bg-muted/15 transition-colors"
                      >
                        <td className="p-3">
                          <span className="font-medium text-foreground">{row.signal}</span>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md', typeStyle)}>{row.type}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold',
                            row.recsGenerated > 0 ? 'bg-teal/10 text-teal' : 'bg-muted/30 text-muted-foreground/50'
                          )}>
                            {row.recsGenerated}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="text-muted-foreground/70">{row.recSummary}</span>
                        </td>
                        <td className="p-3">
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap', statusStyle)}>
                            {row.status === 'Monitoring' && <Eye className="w-3 h-3 inline mr-1 -mt-0.5" />}
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {row.recId ? (
                            <Link href={`/recommendations/${row.recId}`}>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-teal gap-1">
                                View <ExternalLink className="w-3 h-3" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/30 italic">--</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className="p-3 border-t border-line/20 bg-muted/10">
              <p className="text-[10px] text-muted-foreground/50 text-center">
                Signals with 0 recommendations are actively monitored. The engine generates recommendations only when a signal impacts the critical path, cost baseline, or compliance requirements.
              </p>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </AppShell>
  )
}

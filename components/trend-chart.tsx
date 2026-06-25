'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface TrendDataPoint {
  week: string
  portfolio: number
  apac: number
  emea: number
  naEast: number
  naWest: number
}

interface TrendChartProps {
  data: TrendDataPoint[]
}

// Region configuration
const regionConfig = [
  { key: 'portfolio', label: 'Portfolio', lightColor: '#374151', darkColor: '#e5e7eb' },
  { key: 'naEast', label: 'NA-East', lightColor: '#16a34a', darkColor: '#4ade80' },
  { key: 'emea', label: 'EMEA', lightColor: '#d97706', darkColor: '#fbbf24' },
  { key: 'naWest', label: 'NA-West', lightColor: '#dc2626', darkColor: '#f87171' },
  { key: 'apac', label: 'APAC', lightColor: '#0891b2', darkColor: '#22d3ee' },
]

// Performance categories
const categories = [
  { key: 'onTrack', label: 'On Track', lightColor: '#a7f3d0', darkColor: '#34d399', threshold: 75 },
  { key: 'atRisk', label: 'At Risk', lightColor: '#fde68a', darkColor: '#fbbf24', threshold: 65 },
  { key: 'critical', label: 'Critical', lightColor: '#fecaca', darkColor: '#f87171', threshold: 0 },
]

// Generate milestones from data
const getMilestones = (data: TrendDataPoint[]) => {
  const milestones: { week: string; event: string; type: 'positive' | 'negative' | 'neutral' }[] = []
  
  // Find significant changes
  data.forEach((d, i) => {
    if (i === 0) return
    const prev = data[i - 1]
    const portfolioChange = d.portfolio - prev.portfolio
    
    if (portfolioChange >= 3) {
      milestones.push({ week: d.week, event: `Portfolio improved by ${portfolioChange}% to ${d.portfolio}%`, type: 'positive' })
    } else if (portfolioChange <= -3) {
      milestones.push({ week: d.week, event: `Portfolio declined by ${Math.abs(portfolioChange)}% to ${d.portfolio}%`, type: 'negative' })
    }
  })
  
  // Find best performing week
  const bestWeek = data.reduce((best, current) => current.portfolio > best.portfolio ? current : best)
  if (!milestones.find(m => m.week === bestWeek.week)) {
    milestones.push({ week: bestWeek.week, event: `Peak performance: ${bestWeek.portfolio}% schedule adherence`, type: 'positive' })
  }
  
  return milestones.slice(0, 2) // Only show top 2 milestones
}

// Get category for a value
const getCategory = (value: number) => {
  if (value >= 75) return categories[0] // On Track
  if (value >= 65) return categories[1] // At Risk
  return categories[2] // Critical
}

export function TrendChart({ data }: TrendChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const isDark = mounted && resolvedTheme === 'dark'
  
  // Get color based on theme
  const getColor = (config: { lightColor: string; darkColor: string }) => {
    return isDark ? config.darkColor : config.lightColor
  }
  
  const milestones = getMilestones(data)
  const latestData = data[data.length - 1]
  
  // Calculate performance distribution for each week
  const getWeekDistribution = (week: TrendDataPoint) => {
    const regions = [week.portfolio, week.apac, week.emea, week.naEast, week.naWest]
    const onTrack = regions.filter(v => v >= 75).length
    const atRisk = regions.filter(v => v >= 65 && v < 75).length
    const critical = regions.filter(v => v < 65).length
    return { onTrack, atRisk, critical }
  }

  // Calculate chart position for value
  const getYPosition = (value: number) => {
    const minVal = 55
    const maxVal = 85
    const normalized = (value - minVal) / (maxVal - minVal)
    return 100 - (normalized * 100)
  }

  return (
    <motion.section
      className="bg-card border border-border rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">13-Week Performance Trend</h2>
          <p className="text-xs text-muted-foreground mt-0.5">On Track / At Risk / Critical distribution</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 sm:gap-5">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getColor(cat) }}
              />
              <span className="text-xs text-muted-foreground">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="px-5 pb-4">
        <div className="relative">
          {/* Chart container */}
          <div className="relative h-48 sm:h-56 mb-2">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[85, 75, 65, 55].map((val, i) => (
                <div key={val} className="relative w-full">
                  <div className={cn(
                    "absolute w-full border-t",
                    val === 75 ? "border-green/30 border-dashed" : 
                    val === 65 ? "border-gold/30 border-dashed" : 
                    "border-border/50"
                  )} />
                  <span className="absolute -left-1 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">
                    {val}%
                  </span>
                </div>
              ))}
            </div>
            
            {/* SVG Chart */}
            <svg className="absolute inset-0 w-full h-full" style={{ marginLeft: '24px', width: 'calc(100% - 24px)' }}>
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getColor(regionConfig[0])} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={getColor(regionConfig[0])} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <motion.path
                d={`
                  M 0 ${getYPosition(data[0].portfolio)}%
                  ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100}% ${getYPosition(d.portfolio)}%`).join(' ')}
                  L 100% 100%
                  L 0 100%
                  Z
                `}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              
              {/* Main trend line */}
              <motion.path
                d={`
                  M 0 ${getYPosition(data[0].portfolio)}%
                  ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100}% ${getYPosition(d.portfolio)}%`).join(' ')}
                `}
                fill="none"
                stroke={getColor(regionConfig[0])}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Data points with category colors */}
              {data.map((d, i) => {
                const category = getCategory(d.portfolio)
                const x = (i / (data.length - 1)) * 100
                const y = getYPosition(d.portfolio)
                const isHovered = hoveredWeek === i
                
                return (
                  <motion.g key={d.week}>
                    {/* Hover area */}
                    <rect
                      x={`${x - 4}%`}
                      y="0"
                      width="8%"
                      height="100%"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredWeek(i)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    />
                    
                    {/* Vertical line on hover */}
                    {isHovered && (
                      <line
                        x1={`${x}%`}
                        y1="0"
                        x2={`${x}%`}
                        y2="100%"
                        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                        strokeDasharray="4 4"
                      />
                    )}
                    
                    {/* Data point */}
                    <motion.circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={isHovered ? 8 : 5}
                      fill={getColor(category)}
                      stroke={isDark ? 'var(--card)' : 'white'}
                      strokeWidth={2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      style={{ filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none' }}
                    />
                    
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={`${Math.min(Math.max(x - 12, 0), 76)}%`}
                          y={`${Math.max(y - 22, 0)}%`}
                          width="24%"
                          height="18%"
                          rx="6"
                          fill={isDark ? '#1f2937' : 'white'}
                          stroke={isDark ? '#374151' : '#e5e7eb'}
                          strokeWidth="1"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={`${Math.min(Math.max(x, 12), 88)}%`}
                          y={`${Math.max(y - 14, 6)}%`}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-foreground"
                        >
                          {d.week}: {d.portfolio}%
                        </text>
                      </g>
                    )}
                  </motion.g>
                )
              })}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono ml-6">
            {data.map((d, i) => (
              <span 
                key={d.week}
                className={cn(
                  "transition-colors cursor-pointer hover:text-foreground",
                  hoveredWeek === i && "text-foreground font-semibold"
                )}
                onMouseEnter={() => setHoveredWeek(i)}
                onMouseLeave={() => setHoveredWeek(null)}
              >
                {d.week}
              </span>
            ))}
          </div>
        </div>
        
        {/* Milestones / Annotations */}
        {milestones.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {milestones.map((milestone, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <span 
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    milestone.type === 'positive' ? "bg-green" :
                    milestone.type === 'negative' ? "bg-red" : "bg-gold"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{milestone.week}:</span> {milestone.event}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Regional Summary Cards */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {regionConfig.map((region, i) => {
            const value = latestData[region.key as keyof TrendDataPoint] as number
            const prevValue = data[data.length - 2]?.[region.key as keyof TrendDataPoint] as number
            const trend = value - prevValue
            const category = getCategory(value)
            
            return (
              <motion.div
                key={region.key}
                className="p-3 rounded-lg border border-border bg-secondary/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColor(region) }}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {region.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span 
                    className="text-lg sm:text-xl font-bold font-mono"
                    style={{ color: getColor(region) }}
                  >
                    {value}%
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium flex items-center gap-0.5",
                    trend > 0 ? "text-green" : trend < 0 ? "text-red" : "text-muted-foreground"
                  )}>
                    {trend > 0 ? <TrendingUp className="w-3 h-3" /> : 
                     trend < 0 ? <TrendingDown className="w-3 h-3" /> : 
                     <Minus className="w-3 h-3" />}
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Context Card */}
      <div className="mx-5 mb-5 p-4 rounded-lg border border-border bg-secondary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Performance Context</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Schedule performance tracking across all regions. Target is 75% or higher for &quot;On Track&quot; status. 
              This report monitors FDOB schedule adherence and highlights areas requiring attention.
            </p>
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <div className="px-5 py-3 border-t border-border bg-secondary/20">
        <p className="text-[10px] text-muted-foreground text-center">
          Source: FDOB Schedule Performance Tracker (Weekly refresh) · odc_fdob_schedule_metrics. All data audit-logged.
        </p>
      </div>
    </motion.section>
  )
}

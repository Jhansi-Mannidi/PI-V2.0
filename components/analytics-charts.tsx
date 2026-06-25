'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS CHART COMPONENTS
   Professional, clean chart styling matching modern CRM/business dashboards
   ═══════════════════════════════════════════════════════════════════════════ */

// Custom tooltip with clean styling
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color?: string; dataKey?: string }>
  label?: string
  valueFormatter?: (value: number) => string
}

function ChartTooltipContent({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  
  return (
    <div className="bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="opacity-70">{entry.name}:</span>
          <span className="font-mono font-semibold">
            {valueFormatter ? valueFormatter(entry.value) : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Revenue Bar Chart ─── */
interface RevenueBarChartProps {
  data: Array<{ month: string; value: number }>
  className?: string
  height?: number
  showGrid?: boolean
  gradientId?: string
}

export function RevenueBarChart({ 
  data, 
  className, 
  height = 200,
  showGrid = false,
  gradientId = 'barGradient'
}: RevenueBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              vertical={false}
            />
          )}
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            dy={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${value}`}
            width={35}
          />
          <Tooltip 
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          />
          <Bar 
            dataKey="value" 
            fill={`url(#${gradientId})`}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((entry, index) => {
              // Create gradient effect based on value
              const intensity = 0.4 + (entry.value / maxValue) * 0.6
              return (
                <Cell 
                  key={`cell-${index}`}
                  fill={`url(#${gradientId})`}
                  fillOpacity={intensity}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Trend Line Chart ─── */
interface TrendLineChartProps {
  data: Array<{ name: string; value: number; [key: string]: string | number }>
  dataKey?: string
  className?: string
  height?: number
  showGrid?: boolean
  showDots?: boolean
  strokeWidth?: number
  areaFill?: boolean
  valueFormatter?: (value: number) => string
}

export function TrendLineChart({
  data,
  dataKey = 'value',
  className,
  height = 200,
  showGrid = true,
  showDots = true,
  strokeWidth = 2,
  areaFill = true,
  valueFormatter,
}: TrendLineChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        {areaFill ? (
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.2}
                vertical={false}
              />
            )}
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              dy={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => valueFormatter ? valueFormatter(value) : `${value}`}
              width={45}
            />
            <Tooltip 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />}
              cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(var(--primary))"
              strokeWidth={strokeWidth}
              fill="url(#areaGradient)"
              dot={showDots ? { r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 } : false}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.2}
                vertical={false}
              />
            )}
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              dy={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => valueFormatter ? valueFormatter(value) : `${value}`}
              width={45}
            />
            <Tooltip 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(var(--primary))"
              strokeWidth={strokeWidth}
              dot={showDots ? { r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 } : false}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Pipeline/Funnel Progress Bars ─── */
interface PipelineStage {
  name: string
  value: number
  percentage: number
  color?: string
}

interface PipelineChartProps {
  stages: PipelineStage[]
  className?: string
  showLabels?: boolean
  showPercentage?: boolean
  animated?: boolean
}

export function PipelineChart({
  stages,
  className,
  showLabels = true,
  showPercentage = true,
  animated = true,
}: PipelineChartProps) {
  const defaultColors = [
    'bg-primary',
    'bg-teal',
    'bg-gold',
    'bg-amber',
    'bg-purple-500',
    'bg-green',
  ]
  
  return (
    <div className={cn('space-y-3', className)}>
      {stages.map((stage, idx) => (
        <div key={stage.name} className="flex items-center gap-4">
          {showLabels && (
            <span className="text-sm font-medium text-foreground min-w-[100px] shrink-0">
              {stage.name}
            </span>
          )}
          <div className="flex-1 h-7 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'h-full rounded-full flex items-center justify-end pr-3',
                stage.color || defaultColors[idx % defaultColors.length]
              )}
              initial={animated ? { width: 0 } : false}
              animate={{ width: `${stage.percentage}%` }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              {showPercentage && stage.percentage >= 15 && (
                <span className="text-xs font-semibold text-white">
                  {stage.percentage}%
                </span>
              )}
            </motion.div>
          </div>
          {showPercentage && stage.percentage < 15 && (
            <span className="text-xs font-semibold text-muted-foreground min-w-[40px]">
              {stage.percentage}%
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── KPI Summary Card ─── */
interface KPISummaryProps {
  items: Array<{
    label: string
    value: string | number
    subtext?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
  }>
  className?: string
}

export function KPISummary({ items, className }: KPISummaryProps) {
  return (
    <div className={cn('flex items-center gap-8 pt-4 border-t border-border', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {item.label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground font-mono">
              {item.value}
            </span>
            {item.trendValue && (
              <span className={cn(
                'text-sm font-semibold',
                item.trend === 'up' ? 'text-green' : item.trend === 'down' ? 'text-red' : 'text-muted-foreground'
              )}>
                {item.trendValue}
              </span>
            )}
          </div>
          {item.subtext && (
            <span className="text-xs text-muted-foreground">{item.subtext}</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Stat Card with Mini Chart ─── */
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  sparklineData?: number[]
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  sparklineData,
  icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {title}
          </span>
        </div>
        {trendValue && (
          <span className={cn(
            'text-sm font-semibold px-2 py-0.5 rounded-full',
            trend === 'up' ? 'text-green bg-green/10' : 
            trend === 'down' ? 'text-red bg-red/10' : 
            'text-muted-foreground bg-muted'
          )}>
            {trendValue}
          </span>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v, i) => ({ value: v }))}>
                <defs>
                  <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                  fill="url(#sparkGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Pipeline Value Card ─── */
interface PipelineValueCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function PipelineValueCard({
  icon,
  label,
  value,
  actionLabel,
  onAction,
  className,
}: PipelineValueCardProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-sm)]',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-2xl font-bold text-foreground font-mono tracking-tight">
          {value}
        </span>
      </div>
      
      {actionLabel && (
        <button
          onClick={onAction}
          className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
        >
          {actionLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}

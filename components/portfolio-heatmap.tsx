'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { ChevronRight, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type HeatLevel = 'green' | 'amber' | 'red'

interface HeatmapProject {
  name: string
  program: string
  cpi: number
  spi: number
  eac: number
  bac: number
  p1Risks: number
  contractorStatus: 'OK' | 'Borderline' | 'At Risk'
  peopleStatus: 'OK' | 'Borderline' | 'At Risk'
  trend?: 'up' | 'down' | 'stable'
}

const projects: HeatmapProject[] = [
  { name: 'Atlanta DC-3 Expansion', program: 'Southeast', cpi: 0.94, spi: 0.88, eac: 142, bac: 135, p1Risks: 2, contractorStatus: 'OK', peopleStatus: 'OK', trend: 'up' },
  { name: 'Lenoir Fiber Build', program: 'Southeast', cpi: 0.98, spi: 0.93, eac: 54, bac: 55, p1Risks: 1, contractorStatus: 'OK', peopleStatus: 'OK', trend: 'stable' },
  { name: 'Dallas Cooling Retrofit', program: 'Central', cpi: 1.02, spi: 0.96, eac: 89, bac: 91, p1Risks: 1, contractorStatus: 'OK', peopleStatus: 'OK', trend: 'up' },
  { name: 'Pryor Creek New Build', program: 'Central', cpi: 0.87, spi: 0.79, eac: 210, bac: 195, p1Risks: 4, contractorStatus: 'Borderline', peopleStatus: 'At Risk', trend: 'down' },
  { name: 'Council Bluffs Phase 4', program: 'Central', cpi: 1.01, spi: 0.97, eac: 123, bac: 124, p1Risks: 1, contractorStatus: 'OK', peopleStatus: 'OK', trend: 'stable' },
  { name: 'Mesa Power Upgrade', program: 'West', cpi: 0.91, spi: 0.85, eac: 178, bac: 165, p1Risks: 3, contractorStatus: 'Borderline', peopleStatus: 'OK', trend: 'down' },
  { name: 'Henderson Substation', program: 'West', cpi: 0.83, spi: 0.76, eac: 96, bac: 82, p1Risks: 5, contractorStatus: 'At Risk', peopleStatus: 'At Risk', trend: 'down' },
  { name: 'Ashburn Pod 6', program: 'Northeast', cpi: 1.05, spi: 1.01, eac: 67, bac: 69, p1Risks: 0, contractorStatus: 'OK', peopleStatus: 'OK', trend: 'up' },
]

function getCPILevel(cpi: number): HeatLevel { return cpi >= 0.95 ? 'green' : cpi >= 0.90 ? 'amber' : 'red' }
function getSPILevel(spi: number): HeatLevel { return spi >= 0.95 ? 'green' : spi >= 0.85 ? 'amber' : 'red' }
function getRiskLevel(p1: number): HeatLevel { return p1 <= 1 ? 'green' : p1 <= 3 ? 'amber' : 'red' }
function getPartyLevel(status: string): HeatLevel { return status === 'OK' ? 'green' : status === 'Borderline' ? 'amber' : 'red' }

// Animated numeric value component for heatmap cells
function AnimatedCellValue({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  // Default to the real value so cells never show 0 if IO never fires.
  const [display, setDisplay] = React.useState(value)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    const num = parseFloat(value)
    if (isNaN(num)) { setDisplay(value); return }

    const decimals = value.includes('.') ? value.split('.')[1].length : 0
    const duration = 900
    let start: number | null = null
    let raf: number

    setDisplay((0).toFixed(decimals))

    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay((eased * num).toFixed(decimals))
        if (progress < 1) raf = requestAnimationFrame(animate)
        else setDisplay(value)
      }
      raf = requestAnimationFrame(animate)
    }, delay)

    return () => { clearTimeout(timeout); if (raf) cancelAnimationFrame(raf) }
  }, [isInView, value, delay])

  return <span ref={ref}>{display}</span>
}

// Clean heat cell - just colored text, no background fills
function HeatCell({ 
  level, 
  value, 
  tooltip, 
  animDelay = 0,
}: { 
  level: HeatLevel
  value: string
  tooltip: string
  animDelay?: number
  isNumeric?: boolean
}) {
  const textColor = {
    green: 'text-green',
    amber: 'text-gold',
    red: 'text-red',
  }[level]

  const numericValue = !isNaN(parseFloat(value))

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <td className="px-3 py-3 text-center">
            <motion.span
              className={cn('font-mono text-sm font-semibold', textColor)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: animDelay * 0.02 }}
            >
              {numericValue ? <AnimatedCellValue value={value} delay={animDelay * 25 + 100} /> : value}
            </motion.span>
          </td>
        </TooltipTrigger>
        <TooltipContent side="top" className="px-3 py-2">
          <p className="text-xs font-medium">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Trend indicator component
function TrendIndicator({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (!trend) return null
  
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const color = trend === 'up' 
    ? 'text-green' 
    : trend === 'down' 
    ? 'text-red' 
    : 'text-muted-foreground/50'
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <Icon className={cn('w-3 h-3', color)} />
    </motion.div>
  )
}

export function PortfolioHeatmap({ className }: { className?: string }) {
  const programs = ['Southeast', 'Central', 'West', 'Northeast']
  const [expandedPrograms, setExpandedPrograms] = React.useState<Set<string>>(new Set(programs))
  
  const toggleProgram = (program: string) => {
    setExpandedPrograms(prev => {
      const next = new Set(prev)
      if (next.has(program)) {
        next.delete(program)
      } else {
        next.add(program)
      }
      return next
    })
  }
  
  // Single consistent background color for all sections - muted in light, dark card in dark mode
  const sectionBg = 'bg-muted/50 dark:bg-card'
  const programColors: Record<string, { accent: string; text: string }> = {
    Southeast: { accent: 'from-gold to-amber-500', text: 'text-foreground' },
    Central: { accent: 'from-gold to-amber-500', text: 'text-foreground' },
    West: { accent: 'from-gold to-amber-500', text: 'text-foreground' },
    Northeast: { accent: 'from-gold to-amber-500', text: 'text-foreground' },
  }

  return (
    <motion.div 
      className={cn(
        'bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-sm)]',
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Header - Professional styling */}
      <div className="relative px-6 py-5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Portfolio Heatmap</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Projects x Dimensions - click any cell to drill into details</p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 sm:gap-5">
            {[
              { color: 'bg-green', label: 'On Track' },
              { color: 'bg-gold', label: 'Warning' },
              { color: 'bg-red', label: 'Critical' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', item.color)} />
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-6 py-4 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[240px] sm:w-[280px]">
                Project
              </th>
              {['Cost', 'Schedule', 'Risk', 'Contractor', 'People'].map((col, idx) => (
                <th key={col} className="px-3 py-4 text-center w-[100px]">
                  <motion.span 
                    className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    {col}
                  </motion.span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programs.map((program, programIdx) => {
              const programProjects = projects.filter((p) => p.program === program)
              const colors = programColors[program]
              
              return (
                <React.Fragment key={program}>
                  {/* Program Section Header - Clickable to collapse/expand */}
                  <motion.tr 
                    className={cn('border-t border-line/20 cursor-pointer select-none', sectionBg)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: programIdx * 0.1, duration: 0.3 }}
                    onClick={() => toggleProgram(program)}
                  >
                    <td colSpan={6} className="px-5 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        {/* Program badge with gradient */}
                        <div className={cn(
                          'flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br shadow-sm',
                          colors.accent
                        )}>
                          <span className="text-[11px] font-bold text-white">{programIdx + 1}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span 
                            className={cn(
                              'text-xs uppercase tracking-[2px] font-bold',
                              'drop-shadow-[1px_1px_2px_rgba(251,245,237,0.8)] dark:drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]',
                              colors.text
                            )}
                          >
                            {program}
                          </span>
                          <ChevronRight 
                            className={cn(
                              'w-3.5 h-3.5 opacity-50 transition-transform duration-200',
                              colors.text,
                              expandedPrograms.has(program) && 'rotate-90'
                            )} 
                          />
                        </div>
                        
                        <div className="flex-1 h-px bg-gradient-to-r from-line/30 to-transparent ml-2" />
                        
                        <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums">
                          {programProjects.length} project{programProjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                  
                  {/* Project Rows - Only show when program is expanded */}
                  {expandedPrograms.has(program) && programProjects.map((project, idx) => (
                    <motion.tr 
                      key={project.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.35, 
                        delay: (programIdx * 0.12) + (idx * 0.05),
                        ease: 'easeOut'
                      }}
                      className={cn(
                        'group cursor-pointer transition-colors duration-200',
                        'border-b border-line/10 last:border-b-0',
                        'hover:bg-gold/[0.03] dark:hover:bg-gold/[0.05]'
                      )}
                    >
                      {/* Project Name Cell */}
                      <td className="px-5 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Row number with subtle styling */}
                          <div className="w-7 h-7 rounded-lg bg-muted/50 dark:bg-navy-mid/50 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors duration-200">
                            <span className="text-[10px] font-bold text-muted-foreground/70 group-hover:text-gold transition-colors">{idx + 1}</span>
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold/90 transition-colors">
                                {project.name}
                              </p>
                              <TrendIndicator trend={project.trend} />
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-muted-foreground/80 font-mono font-medium">${project.eac}M</span>
                              <span className="text-[9px] text-muted-foreground/30">/</span>
                              <span className="text-[10px] text-muted-foreground/50 font-mono">${project.bac}M</span>
                              {project.eac > project.bac && (
                                <span className="text-[9px] text-rose-500/80 font-mono ml-1">
                                  (+{Math.round(((project.eac - project.bac) / project.bac) * 100)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Heat Cells - Cost / Schedule / Risk / Contractor / People */}
                      <HeatCell 
                        level={getCPILevel(project.cpi)} 
                        value={project.cpi.toFixed(2)} 
                        tooltip={`Cost: CPI ${project.cpi.toFixed(2)} — Cost Performance Index`} 
                        animDelay={programIdx * 6 + idx * 5} 
                        isNumeric 
                      />
                      <HeatCell 
                        level={getSPILevel(project.spi)} 
                        value={project.spi.toFixed(2)} 
                        tooltip={`Schedule: SPI ${project.spi.toFixed(2)} — Schedule Performance Index`} 
                        animDelay={programIdx * 6 + idx * 5 + 1}
                        isNumeric 
                      />
                      <HeatCell 
                        level={getRiskLevel(project.p1Risks)} 
                        value={String(project.p1Risks)} 
                        tooltip={`Risk: ${project.p1Risks} P1 Risk${project.p1Risks !== 1 ? 's' : ''} Open`} 
                        animDelay={programIdx * 6 + idx * 5 + 2}
                        isNumeric 
                      />
                      <HeatCell 
                        level={getPartyLevel(project.contractorStatus)} 
                        value={project.contractorStatus} 
                        tooltip={`Contractor: ${project.contractorStatus} — Party Intelligence`} 
                        animDelay={programIdx * 6 + idx * 5 + 3} 
                      />
                      <HeatCell 
                        level={getPartyLevel(project.peopleStatus)} 
                        value={project.peopleStatus} 
                        tooltip={`People: ${project.peopleStatus} — Key-person coverage`} 
                        animDelay={programIdx * 6 + idx * 5 + 4} 
                      />
                    </motion.tr>
                  ))}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <motion.div 
        className="px-5 sm:px-6 py-4 border-t border-line/20 bg-muted/20 dark:bg-navy-mid/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">{projects.length}</span> projects across <span className="font-semibold text-foreground">{programs.length}</span> programs
            </p>
            <div className="w-px h-3 bg-line/30" />
            <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live data
            </p>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/50">Updated 2 min ago</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

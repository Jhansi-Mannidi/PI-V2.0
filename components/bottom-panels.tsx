'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { Shield, Clock, ChevronRight, Bot, AlertTriangle, History, Play, Pause, RotateCcw } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  // Default to the real value so the panel never shows 0 if IO never fires.
  const [display, setDisplay] = React.useState(value)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    let start: number | null = null
    let raf: number
    setDisplay(0)
    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / 1200, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) raf = requestAnimationFrame(animate)
        else setDisplay(value)
      }
      raf = requestAnimationFrame(animate)
    }, delay)
    return () => { clearTimeout(timeout); if (raf) cancelAnimationFrame(raf) }
  }, [isInView, value, delay])

  return <span ref={ref}>{display}</span>
}

export function KeyPersonRiskPanel({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn('bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm', className)}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Header with subtle gradient */}
      <div className="relative p-4 border-b border-line/50">
        <div className="absolute inset-0 bg-gradient-to-r from-amber/5 via-transparent to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center ring-1 ring-amber/20">
            <Shield className="w-4.5 h-4.5 text-amber" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Key-Person Risk Summary
            </h3>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-teal" />
              A-203 Key-Person Risk Detector
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Coverage Score: large numeric '68' in Georgia + horizontal amber progress bar */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Coverage Score</p>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 text-amber">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Declining</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span
              className="font-serif font-bold text-navy dark:text-foreground tabular-nums"
              style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', lineHeight: 1 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <AnimatedNumber value={68} delay={400} />
            </motion.span>
            <span className="text-sm text-muted-foreground/70 font-medium">/ 100</span>
          </div>
          {/* Horizontal progress bar — 68% filled, amber */}
          <div className="mt-3 h-2 w-full rounded-full bg-muted/50 dark:bg-navy-mid/50 overflow-hidden">
            <motion.div
              className="h-full bg-amber rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Risk description */}
        <motion.div 
          className="bg-gradient-to-br from-muted/50 to-muted/20 dark:from-navy-mid/50 dark:to-navy-mid/20 rounded-lg p-3 border border-line/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold text-amber">3 roles at risk:</span>{' '}
            Contractor Compliance Reviewer, Cost Engineer — Central, Portfolio Controls Lead
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface AuditEvent {
  time: string
  action: string
  actor: string
  system: 'eB' | 'SAP' | 'P6' | 'QB' | 'BH' | 'BZ'
}

interface ApprovalItem {
  id: string
  type: string
  project: string
  stage: string
  status: string
  auditTrail: AuditEvent[]
}

const pendingApprovals: ApprovalItem[] = [
  {
    id: 'CO-0087',
    type: 'Change Order',
    project: 'Henderson Substation',
    stage: 'Director Approval',
    status: 'Pending',
    auditTrail: [
      { time: 'Tue 14:22', action: 'Sasi opened CO', actor: 'Sasi', system: 'eB' },
      { time: 'Tue 16:01', action: 'Don reviewed', actor: 'Don', system: 'eB' },
      { time: 'Wed 09:14', action: 'Ali approved', actor: 'Ali', system: 'SAP' },
      { time: 'Wed 11:42', action: 'Don revised', actor: 'Don', system: 'eB' },
      { time: 'Wed 13:02', action: 'Sasi updated', actor: 'Sasi', system: 'eB' },
      { time: 'Wed 14:15', action: 'Ready for Director', actor: 'System', system: 'BZ' },
      { time: 'Wed 14:30', action: 'Escalated to Brian', actor: 'System', system: 'BZ' },
      { time: 'Wed 15:00', action: 'Reminder sent', actor: 'System', system: 'BZ' },
      { time: 'Thu 08:45', action: 'Cost validation', actor: 'Austin', system: 'SAP' },
      { time: 'Thu 09:30', action: 'Schedule impact added', actor: 'PM', system: 'P6' },
      { time: 'Thu 10:15', action: 'Budget check', actor: 'Finance', system: 'QB' },
      { time: 'Thu 11:00', action: 'Final review pending', actor: 'Brian', system: 'BZ' },
    ],
  },
  {
    id: 'BR-0042',
    type: 'Budget Revision',
    project: 'Pryor Creek New Build',
    stage: 'Director Approval',
    status: 'Pending',
    auditTrail: [
      { time: 'Mon 10:00', action: 'Budget revision initiated', actor: 'Finance', system: 'SAP' },
      { time: 'Mon 14:30', action: 'PM review completed', actor: 'Brian Steinberg', system: 'eB' },
      { time: 'Tue 09:00', action: 'Controls validation', actor: 'Hasit Chetal', system: 'QB' },
      { time: 'Tue 11:30', action: 'Escalated to Director', actor: 'System', system: 'BZ' },
      { time: 'Tue 14:00', action: 'Awaiting approval', actor: 'Brian Smith', system: 'BZ' },
    ],
  },
]

const systemIcons: Record<string, { label: string; color: string }> = {
  'eB': { label: 'eBuilder', color: 'text-blue-500' },
  'SAP': { label: 'SAP', color: 'text-amber-500' },
  'P6': { label: 'Primavera P6', color: 'text-purple-500' },
  'QB': { label: 'QuickBase', color: 'text-green-500' },
  'BH': { label: 'BrightHub', color: 'text-teal-500' },
  'BZ': { label: 'PIP Orchestration', color: 'text-primary' },
}

export function AwaitingApprovalPanel({ className }: { className?: string }) {
  const [expandedTrail, setExpandedTrail] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleDirectorAction = (action: 'promote' | 'hold' | 'cue', itemId: string) => {
    const messages = {
      promote: 'Move forward in the queue / accelerate gate.',
      hold: 'Pause this item; require updated information.',
      cue: 'Send back to queue; allow another item to take its slot.',
    }
    toast({
      title: `Action queued: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `${itemId} — ${messages[action]} Visible in Orchestration View.`,
    })
  }

  return (
    <motion.div 
      className={cn('bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden shadow-sm', className)}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Header with subtle gradient */}
      <div className="relative p-4 border-b border-line/50">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center ring-1 ring-gold/20">
            <Clock className="w-4.5 h-4.5 text-gold" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Awaiting Your Approval
              </h3>
              <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-gradient-to-br from-gold to-gold/80 text-navy text-[10px] font-bold shadow-sm">
                {pendingApprovals.length}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Items requiring Brian&apos;s sign-off
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-line/30">
        {pendingApprovals.map((item, idx) => (
          <div key={item.id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
              className="p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center shrink-0 ring-1 ring-gold/10">
                  <span className="text-[9px] font-bold font-mono text-gold">{item.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{item.type}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 truncate">
                    {item.project} · {item.stage}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Audit Trail Toggle */}
                  <button
                    onClick={() => setExpandedTrail(expandedTrail === item.id ? null : item.id)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all',
                      expandedTrail === item.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <History className="w-3 h-3" />
                    Trail ({item.auditTrail.length})
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-3 border-gold/30 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold/50 transition-all"
                  >
                    Review
                  </Button>
                </div>
              </div>

              {/* Director Actions - Promote / Hold / Cue */}
              <div className="flex items-center gap-2 mt-3 ml-[52px]">
                <button
                  onClick={() => handleDirectorAction('promote', item.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-green/10 text-green text-[10px] font-medium hover:bg-green/20 transition-all"
                  title="Move forward in the queue / accelerate gate."
                >
                  <Play className="w-3 h-3" />
                  Promote
                </button>
                <button
                  onClick={() => handleDirectorAction('hold', item.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-amber/10 text-amber text-[10px] font-medium hover:bg-amber/20 transition-all"
                  title="Pause this item; require updated information."
                >
                  <Pause className="w-3 h-3" />
                  Hold
                </button>
                <button
                  onClick={() => handleDirectorAction('cue', item.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground text-[10px] font-medium hover:bg-muted/80 transition-all"
                  title="Send back to queue; allow another item to take its slot."
                >
                  <RotateCcw className="w-3 h-3" />
                  Cue
                </button>
              </div>
            </motion.div>

            {/* Audit Trail Drawer */}
            <AnimatePresence>
              {expandedTrail === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-muted/20 dark:bg-navy-mid/20 border-t border-line/30"
                >
                  <div className="p-4 pl-[52px]">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[3px] top-2 bottom-2 w-px bg-line/50" />
                      
                      {/* Last 5 events */}
                      <div className="space-y-3">
                        {item.auditTrail.slice(-5).map((event, eventIdx) => (
                          <div key={eventIdx} className="flex items-start gap-3 relative">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-1 ring-2 ring-card z-10',
                              systemIcons[event.system]?.color || 'bg-muted-foreground'
                            )} style={{ backgroundColor: 'currentColor' }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{event.time}</span>
                                <span className={cn(
                                  'text-[9px] font-bold px-1 py-0.5 rounded',
                                  'bg-muted/50 text-muted-foreground'
                                )}>
                                  {event.system}
                                </span>
                              </div>
                              <p className="text-[11px] text-foreground/80 mt-0.5">{event.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* View full trail link */}
                      <button className="flex items-center gap-1 mt-3 ml-5 text-[10px] font-medium text-primary hover:underline">
                        View full trail ({item.auditTrail.length})
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

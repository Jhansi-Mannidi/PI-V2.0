'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { MoreHorizontal, AlertCircle, Zap, Play, Pause, RotateCcw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { EscalationModal } from '@/components/escalation-modal'

interface PastSLAItem {
  process: string
  project: string
  stage: string
  owner: string
  elapsed: string
  severity: 'Red' | 'Severe' | 'Amber'
}

interface PredictedSLARiskItem {
  process: string
  project: string
  stage: string
  owner: string
  predicted: string
  confidence: string
  severity: 'Amber'
}

// Hook to read the active persona name from sessionStorage with live updates.
function useActivePersona() {
  const [persona, setPersona] = React.useState<string>('Brian Smith')
  React.useEffect(() => {
    const read = () => {
      const stored = window.sessionStorage.getItem('v0:currentPersona')
      if (stored) setPersona(stored)
    }
    read()
    window.addEventListener('storage', read)
    // Poll briefly so in-tab persona switches reflect without a full reload.
    const interval = setInterval(read, 800)
    return () => {
      window.removeEventListener('storage', read)
      clearInterval(interval)
    }
  }, [])
  return persona
}

// Director-only Promote / Hold / Cue group used on every Past-SLA-Now row.
function DirectorActionGroup({ itemId }: { itemId: string }) {
  const persona = useActivePersona()
  const { toast } = useToast()
  if (persona !== 'Brian Smith') return null

  const fire = (action: 'Promote' | 'Hold' | 'Cue', tooltip: string) => {
    toast({
      title: `Action queued: ${action}`,
      description: `${itemId} — ${tooltip} Visible in Orchestration View.`,
    })
  }

  return (
    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => fire('Promote', 'Move forward in the queue / accelerate gate.')}
        title="Move forward in the queue / accelerate gate."
        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green/10 text-green text-[10px] font-medium hover:bg-green/20 transition-all"
      >
        <Play className="w-3 h-3" />
        Promote
      </button>
      <button
        type="button"
        onClick={() => fire('Hold', 'Pause this item; require updated information.')}
        title="Pause this item; require updated information."
        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber/10 text-amber text-[10px] font-medium hover:bg-amber/20 transition-all"
      >
        <Pause className="w-3 h-3" />
        Hold
      </button>
      <button
        type="button"
        onClick={() => fire('Cue', 'Send back to queue; allow another item to take its slot.')}
        title="Send back to queue; allow another item to take its slot."
        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium hover:bg-muted/80 transition-all"
      >
        <RotateCcw className="w-3 h-3" />
        Cue
      </button>
    </div>
  )
}

const activePastSLA: PastSLAItem[] = [
  { process: 'Contractor Onboarding', project: 'Pryor Creek New Build', stage: 'Legal Review', owner: 'Legal Compliance', elapsed: '6h 22m', severity: 'Red' },
  { process: 'Invoice Reconciliation', project: 'Henderson Substation', stage: 'Three-Way Match', owner: 'Cost Engineer', elapsed: '2d 4h', severity: 'Severe' },
  { process: 'RFI Response', project: 'Mesa Power Upgrade', stage: 'Trade Lead Review', owner: 'Electrical Lead', elapsed: '3h 15m', severity: 'Red' },
  { process: 'Change Order Routing', project: 'Pryor Creek New Build', stage: 'Cost Review', owner: 'Cost Engineer', elapsed: '4h 10m', severity: 'Red' },
  { process: 'Milestone Gate Review', project: 'Henderson Substation', stage: 'Director Approval', owner: 'Brian', elapsed: '1d 2h', severity: 'Red' },
]

const predictedSLARisks: PredictedSLARiskItem[] = [
  { process: 'Monthly Report Assembly', project: 'Mesa Power', stage: 'Data Stitching', owner: 'LineSight', predicted: '~48h', confidence: '87%', severity: 'Amber' },
  { process: 'RFI Response', project: 'Pryor Creek', stage: 'Design Review', owner: 'Structural Lead', predicted: '~52h', confidence: '72%', severity: 'Amber' },
  { process: 'Contractor Onboarding', project: 'Council Bluffs', stage: 'Safety Cert', owner: 'Safety Officer', predicted: '~60h', confidence: '65%', severity: 'Amber' },
  { process: 'Submittal Approval', project: 'Lenoir Fiber', stage: 'Trade Review', owner: 'Mechanical Lead', predicted: '~68h', confidence: '54%', severity: 'Amber' },
  { process: 'Invoice Reconciliation', project: 'Atlanta DC-3', stage: 'PO Match', owner: 'Cost Engineer', predicted: '~71h', confidence: '51%', severity: 'Amber' },
]

function SeverityBar({ severity }: { severity: string }) {
  const colorMap: Record<string, string> = {
    Severe: 'bg-red-dark dark:bg-red',
    Red: 'bg-red',
    Amber: 'bg-amber',
  }
  return (
    <div className={cn('w-[6px] self-stretch rounded-full shrink-0', colorMap[severity] || 'bg-muted')} />
  )
}

function PastSLAActionMenu({ onEscalate }: { onEscalate: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md hover:bg-muted/60 dark:hover:bg-navy-mid/60 transition-colors focus:outline-none">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="cursor-pointer text-sm">Reassign</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-sm" onClick={onEscalate}>Escalate</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-sm">Request Update</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-sm text-muted-foreground">Dismiss</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SLAPanels({ className }: { className?: string }) {
  const [escalationOpen, setEscalationOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PastSLAItem | null>(null)

  const openEscalation = (item: PastSLAItem) => {
    setSelectedItem(item)
    setEscalationOpen(true)
  }

  return (
    <>
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {/* Past SLA Items */}
      <motion.div 
        className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-sm)]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <div className="relative p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center">
              <AlertCircle className="w-4.5 h-4.5 text-red" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Past SLA Now
                </h3>
                <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-2 rounded-full bg-red text-white text-[10px] font-bold">
                  {activePastSLA.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ranked by severity then elapsed time
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {activePastSLA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.06)' }}
              className="p-3 cursor-pointer group"
            >
              <div className="flex items-stretch gap-3">
                <SeverityBar severity={item.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {item.process}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                    {item.project} · {item.stage} · {item.owner}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-red tabular-nums">
                    {item.elapsed}
                  </span>
                  <PastSLAActionMenu onEscalate={() => openEscalation(item)} />
                </div>
              </div>
              {/* Director-only Promote / Hold / Cue */}
              <div className="mt-2 ml-[18px]">
                <DirectorActionGroup itemId={`${item.process.split(' ')[0].toUpperCase()}-${i + 1}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Predicted SLA Risks */}
      <motion.div 
        className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-sm)]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Predicted SLA Risk (48-72h)
                </h3>
                <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-2 rounded-full bg-gold text-white text-[10px] font-bold">
                  {predictedSLARisks.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ML-predicted with confidence scores
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {predictedSLARisks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.06)' }}
              className="flex items-stretch gap-3 p-3 cursor-pointer group"
            >
              <SeverityBar severity={item.severity} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">
                  {item.process}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  {item.project} · {item.stage} · {item.owner}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-amber tabular-nums block">
                    {item.predicted}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">
                    ({item.confidence})
                  </span>
                </div>
                <PastSLAActionMenu onEscalate={() => openEscalation({ ...item, elapsed: item.predicted, severity: 'Amber' as const })} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Escalation Modal */}
    <EscalationModal
      open={escalationOpen}
      onOpenChange={setEscalationOpen}
      context={selectedItem ? {
        process: selectedItem.process,
        project: selectedItem.project,
        orchestrationId: 'ORCH-2026-0447',
        currentStage: selectedItem.stage,
        elapsed: selectedItem.elapsed,
        currentFiller: selectedItem.owner,
        agentReasoning: 'A-201 SLA Sentinel has notified the filler twice with no response.',
        agentId: 'A-201',
      } : null}
    />
    </>
  )
}

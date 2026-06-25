'use client'

import * as React from 'react'
import {
  X,
  ExternalLink,
  Bot,
  MessageSquare,
  ArrowRight,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Orchestration, StageInfo, SLAStatus } from '@/lib/orchestration-data'

interface DetailDrawerProps {
  item: Orchestration | null
  onClose: () => void
}

export function DetailDrawer({ item, onClose }: DetailDrawerProps) {
  if (!item) return null

  return (
    <div className="w-[380px] shrink-0 border-l border-line bg-card flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
            <StatusDot status={item.status} />
          </div>
          <h3 className="font-sans text-base font-bold text-foreground leading-snug truncate">
            {item.process}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.project}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Events */}
        {item.recentEvents && item.recentEvents.length > 0 && (
          <div className="px-5 py-4 border-b border-line">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Recent Events
            </h4>
            <div className="relative pl-3">
              {/* Timeline line */}
              <div className="absolute left-[3px] top-1 bottom-1 w-px bg-line/50" />
              
              <div className="space-y-2.5">
                {item.recentEvents.slice(-5).map((event, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 relative">
                    <div className="w-2 h-2 rounded-full bg-primary/60 mt-1 ring-2 ring-card z-10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{event.time}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                          {event.source}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/80 font-mono mt-0.5 break-all">
                        {event.eventType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage Timeline */}
        {item.stages && (
          <div className="px-5 py-4 border-b border-line">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
              Stage Timeline
            </h4>
            <StageTimeline stages={item.stages} />
          </div>
        )}

        {/* Current Stage Detail */}
        <div className="px-5 py-4 border-b border-line">
          <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
            Current Stage
          </h4>
          <div className="rounded-lg bg-muted/40 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Stage</span>
              <span className="text-xs font-medium text-foreground">{item.stage}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Role</span>
              <span className="text-xs font-medium text-foreground">{item.ownerRole}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Filler</span>
              <span className="text-xs font-medium text-foreground">{item.currentFiller}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Elapsed</span>
              <span className={cn(
                'text-xs font-mono font-semibold tabular-nums',
                item.status === 'SEVERE' || item.status === 'BREACH' ? 'text-red' :
                item.status === 'PRE-BREACH' ? 'text-amber' :
                'text-green'
              )}>
                {item.elapsed}
              </span>
            </div>
            {item.slaCountdown && (
              <div className="flex items-center justify-between pt-1 border-t border-line/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  SLA
                </span>
                <span className={cn(
                  'text-xs font-mono font-bold tabular-nums',
                  item.slaCountdown.includes('Overdue') ? 'text-red' : 'text-green'
                )}>
                  {item.slaCountdown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Links */}
        {item.evidenceLinks && item.evidenceLinks.length > 0 && (
          <div className="px-5 py-4 border-b border-line">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
              Evidence
            </h4>
            <div className="space-y-1.5">
              {item.evidenceLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors truncate">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Agent Reasoning */}
        {item.agentReasoning && (
          <div className="px-5 py-4 border-b border-line">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-teal mb-3 flex items-center gap-1.5">
              <Bot className="w-3 h-3" />
              Agent Reasoning
            </h4>
            <div className="rounded-lg bg-teal/5 border border-teal/15 p-3">
              <p className="text-xs text-foreground/80 leading-relaxed">
                {item.agentReasoning}
              </p>
              <p className="text-[10px] text-teal/70 font-mono mt-2">
                Source: {item.agentId} via Orchestration Engine
              </p>
            </div>
          </div>
        )}

        {/* Contractor Intelligence */}
        {item.contractorIntel && (
          <div className="px-5 py-4 border-b border-line">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gold" />
              Contractor Intelligence
            </h4>
            <div className="rounded-lg bg-muted/40 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber" />
                  SLA miss rate (30d)
                </span>
                <span className="text-xs font-mono font-semibold text-amber tabular-nums">
                  {item.contractorIntel.breachRate30d}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-green" />
                  Completion reliability
                </span>
                <span className="text-xs font-mono font-semibold text-foreground tabular-nums">
                  {item.contractorIntel.completionReliability}
                </span>
              </div>
              {item.contractorIntel.driftDetected && (
                <div className="pt-2 border-t border-line/50">
                  <div className="flex items-start gap-2 px-2.5 py-2 rounded-md bg-amber/10 border border-amber/20">
                    <span className="text-amber text-xs mt-px shrink-0">&#9650;</span>
                    <span className="text-[11px] text-amber font-medium leading-relaxed">
                      Drift detected: {item.contractorIntel.driftDetail}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-[9px] text-muted-foreground/60 pt-1">
                Source: Party Feature Projector &middot; Scope: Operational (O)
              </p>
            </div>
          </div>
        )}

        {/* Comment Thread */}
        {item.comments && item.comments.length > 0 && (
          <div className="px-5 py-4">
            <h4 className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Comments ({item.comments.length})
            </h4>
            <div className="space-y-3">
              {item.comments.map((comment, idx) => (
                <div key={idx} className="relative pl-3 border-l-2 border-line">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-[11px] font-semibold',
                      comment.author.startsWith('Cortex') ? 'text-teal' : 'text-foreground'
                    )}>
                      {comment.author.startsWith('Cortex') && (
                        <Bot className="w-3 h-3 inline mr-1 -mt-px" />
                      )}
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-line bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs text-gold hover:text-gold hover:bg-gold/10 font-semibold gap-1.5 justify-center"
        >
          View full orchestration
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ── Sub-components ──

function StageTimeline({ stages }: { stages: StageInfo[] }) {
  return (
    <div className="flex items-center gap-0">
      {stages.map((stage, idx) => (
        <React.Fragment key={idx}>
          {/* Dot */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-all',
                stage.state === 'done'
                  ? 'bg-green border-green'
                  : stage.state === 'active'
                  ? 'bg-gold border-gold animate-pulse-dot'
                  : 'bg-transparent border-line'
              )}
            />
            <span className={cn(
              'text-[8px] leading-tight text-center max-w-[52px] truncate',
              stage.state === 'active' ? 'text-gold font-bold' :
              stage.state === 'done' ? 'text-green' :
              'text-muted-foreground/50'
            )}>
              {stage.name}
            </span>
          </div>
          {/* Line */}
          {idx < stages.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 min-w-[12px] mt-[-12px]',
                stage.state === 'done' ? 'bg-green' : 'bg-line'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function StatusDot({ status }: { status: SLAStatus }) {
  const color =
    status === 'SEVERE' ? 'bg-red-dark dark:bg-red' :
    status === 'BREACH' ? 'bg-red' :
    status === 'PRE-BREACH' ? 'bg-amber' :
    'bg-green'

  return <span className={cn('w-2 h-2 rounded-full shrink-0', color)} />
}

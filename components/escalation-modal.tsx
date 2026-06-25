'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Bot, Clock, User, AlertTriangle } from 'lucide-react'

interface EscalationContext {
  process: string
  project: string
  orchestrationId: string
  currentStage: string
  elapsed: string
  currentFiller: string
  agentReasoning?: string
  agentId?: string
}

interface EscalationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: EscalationContext | null
  onConfirm?: (target: string, note: string) => void
}

const escalationTargets = [
  { value: 'program-manager', label: 'Program Manager', name: 'Brian Steinberg' },
  { value: 'portfolio-director', label: 'Portfolio Director', name: 'Brian Smith' },
  { value: 'controls-lead', label: 'Controls Lead', name: 'Hasit Chetal' },
  { value: 'legal-director', label: 'Legal Director', name: 'James P.' },
]

export function EscalationModal({ open, onOpenChange, context, onConfirm }: EscalationModalProps) {
  const [target, setTarget] = React.useState('program-manager')
  const [note, setNote] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      onConfirm?.(target, note)
      setIsSubmitting(false)
      setNote('')
      onOpenChange(false)
    }, 800)
  }

  if (!context) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-background border-line shadow-2xl" showCloseButton={false}>
        {/* Navy header */}
        <div className="bg-navy dark:bg-navy-light px-6 py-4 flex items-center justify-between">
          <DialogHeader className="gap-0">
            <DialogTitle className="font-sans text-lg font-bold text-white">
              Escalate &mdash; {context.process}
            </DialogTitle>
            <p className="text-[11px] text-slate-300 mt-0.5">on {context.project}</p>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-5">
          {/* Pre-filled context card */}
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 border border-line space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-red" />
              <span className="font-semibold text-foreground">Escalation Context</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orchestration</p>
                <p className="text-sm font-mono text-foreground">{context.orchestrationId}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Stage</p>
                <p className="text-sm text-foreground">{context.currentStage}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Elapsed Past SLA</p>
                <p className="text-sm font-mono font-bold text-red">{context.elapsed}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Filler</p>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-foreground">{context.currentFiller}</p>
                </div>
              </div>
            </div>

            {context.agentReasoning && (
              <div className="pt-3 border-t border-line/50">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-teal" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-teal font-semibold uppercase tracking-wider mb-1">
                      Agent Reasoning {context.agentId && `(${context.agentId})`}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {context.agentReasoning}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Escalation target */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Escalation Target
            </label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select escalation target" />
              </SelectTrigger>
              <SelectContent>
                {escalationTargets.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{t.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({t.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              Next hop on escalation path: Program Manager → Portfolio Director
            </p>
          </div>

          {/* Note textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Additional Context (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional context or urgency notes..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Fine print */}
          <p className="text-[10px] text-muted-foreground text-center border-t border-line pt-4">
            This action is logged and will notify the escalation target immediately.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 bg-gold hover:bg-gold/90 text-navy font-semibold"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Escalating...
              </>
            ) : (
              'Confirm Escalation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, AlertTriangle, ArrowUp, RefreshCcw, XCircle, Clock } from 'lucide-react'
import type { Orchestration, SLAStatus } from '@/lib/orchestration-data'

type BulkAction = 'reassign' | 'escalate' | 'dismiss'

interface BulkActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: Orchestration[]
  onConfirm?: (action: BulkAction, data: { reason?: string; note?: string }) => void
}

const dismissReasons = [
  { value: 'resolved', label: 'Resolved externally' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'not-applicable', label: 'Not applicable' },
  { value: 'other', label: 'Other' },
]

const statusConfig: Record<SLAStatus, { bg: string; text: string; dot: string }> = {
  'SEVERE': {
    bg: 'bg-red-dark/15 dark:bg-red/20',
    text: 'text-red-dark dark:text-red',
    dot: 'bg-red-dark dark:bg-red',
  },
  'BREACH': {
    bg: 'bg-red/10',
    text: 'text-red',
    dot: 'bg-red',
  },
  'PRE-BREACH': {
    bg: 'bg-amber/10',
    text: 'text-amber',
    dot: 'bg-amber',
  },
  'ON TRACK': {
    bg: 'bg-green/10',
    text: 'text-green',
    dot: 'bg-green',
  },
}

export function BulkActionModal({ open, onOpenChange, selectedItems, onConfirm }: BulkActionModalProps) {
  const [action, setAction] = React.useState<BulkAction | null>(null)
  const [dismissReason, setDismissReason] = React.useState('')
  const [note, setNote] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = () => {
    if (!action) return
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      onConfirm?.(action, { reason: dismissReason, note })
      setIsSubmitting(false)
      setAction(null)
      setDismissReason('')
      setNote('')
      onOpenChange(false)
    }, 800)
  }

  const canSubmit = action !== null && (action !== 'dismiss' || dismissReason !== '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden bg-background border-line shadow-2xl max-h-[90vh] flex flex-col" showCloseButton={false}>
        {/* Navy header */}
        <div className="bg-navy dark:bg-navy-light px-6 py-4 flex items-center justify-between shrink-0">
          <DialogHeader className="gap-0">
            <DialogTitle className="font-sans text-lg font-bold text-white">
              Bulk Action &mdash; {selectedItems.length} items selected
            </DialogTitle>
            <p className="text-[11px] text-slate-300 mt-0.5">Apply action to all selected orchestrations</p>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action selector */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Action
            </Label>
            <RadioGroup value={action ?? ''} onValueChange={(v) => setAction(v as BulkAction)} className="grid grid-cols-3 gap-3">
              <Label
                htmlFor="action-reassign"
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  action === 'reassign'
                    ? 'border-gold bg-gold/10'
                    : 'border-line hover:border-foreground/20 hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value="reassign" id="action-reassign" className="sr-only" />
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  action === 'reassign' ? 'bg-gold/20' : 'bg-muted'
                )}>
                  <RefreshCcw className={cn('w-5 h-5', action === 'reassign' ? 'text-gold' : 'text-muted-foreground')} />
                </div>
                <span className={cn('text-sm font-medium', action === 'reassign' ? 'text-gold' : 'text-foreground')}>
                  Reassign all
                </span>
              </Label>

              <Label
                htmlFor="action-escalate"
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  action === 'escalate'
                    ? 'border-gold bg-gold/10'
                    : 'border-line hover:border-foreground/20 hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value="escalate" id="action-escalate" className="sr-only" />
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  action === 'escalate' ? 'bg-gold/20' : 'bg-muted'
                )}>
                  <ArrowUp className={cn('w-5 h-5', action === 'escalate' ? 'text-gold' : 'text-muted-foreground')} />
                </div>
                <span className={cn('text-sm font-medium', action === 'escalate' ? 'text-gold' : 'text-foreground')}>
                  Escalate all
                </span>
              </Label>

              <Label
                htmlFor="action-dismiss"
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  action === 'dismiss'
                    ? 'border-red bg-red/10'
                    : 'border-line hover:border-foreground/20 hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value="dismiss" id="action-dismiss" className="sr-only" />
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  action === 'dismiss' ? 'bg-red/20' : 'bg-muted'
                )}>
                  <XCircle className={cn('w-5 h-5', action === 'dismiss' ? 'text-red' : 'text-muted-foreground')} />
                </div>
                <span className={cn('text-sm font-medium', action === 'dismiss' ? 'text-red' : 'text-foreground')}>
                  Dismiss all
                </span>
              </Label>
            </RadioGroup>
          </div>

          {/* Preview table */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Affected Items
            </Label>
            <div className="rounded-lg border border-line overflow-hidden">
              <div className="max-h-[200px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                    <tr className="border-b border-line">
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Process</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Project</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Stage</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Owner</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item) => {
                      const cfg = statusConfig[item.status]
                      return (
                        <tr key={item.id} className="border-b border-line/50 last:border-b-0">
                          <td className="px-3 py-2 text-[13px] font-medium text-foreground">{item.process}</td>
                          <td className="px-3 py-2 text-[13px] text-foreground/80">{item.project}</td>
                          <td className="px-3 py-2 text-[13px] text-muted-foreground">{item.stage}</td>
                          <td className="px-3 py-2 text-[13px] text-muted-foreground">{item.currentFiller}</td>
                          <td className="px-3 py-2">
                            <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide', cfg.bg, cfg.text)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dismiss reason (conditional) */}
          {action === 'dismiss' && (
            <div className="space-y-3 p-4 rounded-lg bg-red/5 border border-red/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-red">
                <AlertTriangle className="w-4 h-4" />
                Dismiss requires a reason
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Reason Code
                </Label>
                <Select value={dismissReason} onValueChange={setDismissReason}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dismissReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Additional Notes
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Explain why these items are being dismissed..."
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber/10 border border-amber/20">
            <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-dark dark:text-amber">
                This will affect {selectedItems.length} orchestration instances.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All actions are logged and reversible within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-line bg-muted/20 flex items-center justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || isSubmitting}
            className={cn(
              'px-5 font-semibold',
              action === 'dismiss'
                ? 'bg-red hover:bg-red/90 text-white'
                : 'bg-gold hover:bg-gold/90 text-navy'
            )}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Execute Bulk Action'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, User, Users, AlertTriangle, Check, Calendar } from 'lucide-react'

interface RoleContext {
  role: string
  program: string
  primary: string
  backup: string | null
  openItems: number
}

interface Candidate {
  name: string
  currentLoad: number
  availability: 'Available' | 'Partially available' | 'Busy'
  fitScore: number
}

interface RoleReassignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: RoleContext | null
  onConfirm?: (candidate: string, isTemporary: boolean, startDate?: string, endDate?: string) => void
}

const candidates: Candidate[] = [
  { name: 'Jordan M.', currentLoad: 6, availability: 'Available', fitScore: 0.92 },
  { name: 'Tom W.', currentLoad: 4, availability: 'Available', fitScore: 0.87 },
  { name: 'Alex T.', currentLoad: 8, availability: 'Partially available', fitScore: 0.78 },
  { name: 'Brian Steinberg', currentLoad: 5, availability: 'Available', fitScore: 0.84 },
  { name: 'David K.', currentLoad: 3, availability: 'Available', fitScore: 0.81 },
]

const availabilityColors = {
  'Available': 'text-green',
  'Partially available': 'text-amber',
  'Busy': 'text-red',
}

export function RoleReassignmentModal({ open, onOpenChange, context, onConfirm }: RoleReassignmentModalProps) {
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(null)
  const [isTemporary, setIsTemporary] = React.useState(false)
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = () => {
    if (!selectedCandidate) return
    setIsSubmitting(true)
    setTimeout(() => {
      onConfirm?.(selectedCandidate, isTemporary, startDate, endDate)
      setIsSubmitting(false)
      setSelectedCandidate(null)
      setIsTemporary(false)
      setStartDate('')
      setEndDate('')
      onOpenChange(false)
    }, 800)
  }

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedCandidate(null)
      setIsTemporary(false)
      setStartDate('')
      setEndDate('')
    }
  }, [open])

  if (!context) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-background border-line shadow-2xl" showCloseButton={false}>
        {/* Navy header */}
        <div className="bg-navy dark:bg-navy-light px-6 py-4 flex items-center justify-between">
          <DialogHeader className="gap-0">
            <DialogTitle className="font-sans text-lg font-bold text-white">
              Assign Backup &mdash; {context.role}
            </DialogTitle>
            <p className="text-[11px] text-slate-300 mt-0.5">{context.program}</p>
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
          {/* Current state card */}
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 border border-line">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <span className="text-xs font-semibold text-foreground">Current State</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Primary Filler</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-foreground" />
                  <p className="text-sm font-medium text-foreground">{context.primary}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Backup</p>
                <p className={cn('text-sm font-medium mt-1', context.backup ? 'text-foreground' : 'text-red font-semibold')}>
                  {context.backup || 'None'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Open Items</p>
                <p className="text-sm font-mono font-bold text-foreground mt-1">{context.openItems}</p>
              </div>
            </div>
          </div>

          {/* Candidate list */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Eligible Candidates
              </label>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              Fit score derived from Party Intelligence: workload (inverse) + reliability (direct)
            </p>

            <div className="border border-line rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_100px_70px] gap-2 px-4 py-2 bg-muted/30 border-b border-line text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Name</span>
                <span className="text-center">Load</span>
                <span className="text-center">Availability</span>
                <span className="text-right">Fit Score</span>
              </div>

              {/* Candidate rows */}
              <div className="divide-y divide-line">
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidate === candidate.name
                  return (
                    <button
                      key={candidate.name}
                      onClick={() => setSelectedCandidate(candidate.name)}
                      className={cn(
                        'w-full grid grid-cols-[1fr_80px_100px_70px] gap-2 px-4 py-3 text-left transition-colors',
                        isSelected
                          ? 'bg-gold/10 border-l-2 border-l-gold'
                          : 'hover:bg-secondary/30 border-l-2 border-l-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                          isSelected ? 'border-gold bg-gold' : 'border-line'
                        )}>
                          {isSelected && <Check className="w-3 h-3 text-navy" />}
                        </div>
                        <span className="text-sm font-medium text-foreground">{candidate.name}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-mono text-foreground">{candidate.currentLoad}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">tasks</span>
                      </div>
                      <div className="text-center">
                        <span className={cn('text-xs font-medium', availabilityColors[candidate.availability])}>
                          {candidate.availability}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          'text-sm font-mono font-bold',
                          candidate.fitScore >= 0.9 ? 'text-green' : candidate.fitScore >= 0.8 ? 'text-foreground' : 'text-amber'
                        )}>
                          {candidate.fitScore.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Temporary assignment option */}
          <div className="space-y-3 pt-2 border-t border-line">
            <div className="flex items-center gap-3">
              <Checkbox
                id="temporary"
                checked={isTemporary}
                onCheckedChange={(checked) => setIsTemporary(checked === true)}
              />
              <Label htmlFor="temporary" className="text-sm text-foreground cursor-pointer flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Temporary assignment
              </Label>
            </div>

            {isTemporary && (
              <div className="grid grid-cols-2 gap-4 ml-7">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">From</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">To</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>
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
            disabled={!selectedCandidate || isSubmitting}
            className="px-5 bg-gold hover:bg-gold/90 text-navy font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Assigning...' : 'Assign Backup'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

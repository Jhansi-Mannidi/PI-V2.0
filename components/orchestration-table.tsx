'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpDown,
  ArrowUp,
  RefreshCcw,
  Bot,
  ChevronUp,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Users,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BulkActionModal } from '@/components/bulk-action-modal'
import type { Orchestration, SLAStatus, SLAInfo } from '@/lib/orchestration-data'

// Team members for reassignment
const teamMembers = [
  { id: 'brian-steinberg', name: 'Brian Steinberg', role: 'Cost Engineer', available: true },
  { id: 'mike-r', name: 'Mike R.', role: 'Cost Engineer', available: true },
  { id: 'david-m', name: 'David M.', role: 'HR / Compliance', available: false },
  { id: 'marcus-t', name: 'Marcus T.', role: 'Electrical Lead', available: true },
  { id: 'lin-s', name: 'Lin S.', role: 'AP Analyst', available: true },
  { id: 'anita-k', name: 'Anita K.', role: 'Project Controls', available: true },
  { id: 'alice-cox', name: 'Alice Cox', role: 'LineSight', available: true },
  { id: 'jordan-m', name: 'Jordan M.', role: 'Mechanical Lead', available: true },
  { id: 'james-p', name: 'James P.', role: 'Structural Lead', available: true },
]

// Escalation levels
const escalationLevels = [
  { id: 'manager', label: 'Manager', description: 'Escalate to direct manager' },
  { id: 'director', label: 'Director', description: 'Escalate to department director' },
  { id: 'executive', label: 'Executive', description: 'Escalate to executive team' },
]

type SortField = 'process' | 'project' | 'stage' | 'ownerRole' | 'status' | 'elapsedMinutes'
type SortDir = 'asc' | 'desc'

const statusOrder: Record<SLAStatus, number> = {
  'SEVERE': 0,
  'BREACH': 1,
  'PRE-BREACH': 2,
  'ON TRACK': 3,
}

interface OrchestrationTableProps {
  data: Orchestration[]
  onSelectRow: (item: Orchestration) => void
  selectedId: string | null
}

export function OrchestrationTable({ data, onSelectRow, selectedId }: OrchestrationTableProps) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [sortField, setSortField] = React.useState<SortField>('status')
  const [sortDir, setSortDir] = React.useState<SortDir>('asc')
  const [bulkModalOpen, setBulkModalOpen] = React.useState(false)
  
  // Individual action modals
  const [escalateModalOpen, setEscalateModalOpen] = React.useState(false)
  const [reassignModalOpen, setReassignModalOpen] = React.useState(false)
  const [actionItem, setActionItem] = React.useState<Orchestration | null>(null)
  const [escalationLevel, setEscalationLevel] = React.useState('')
  const [reassignTo, setReassignTo] = React.useState('')
  const [actionNote, setActionNote] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [actionSuccess, setActionSuccess] = React.useState(false)

  const handleEscalate = (item: Orchestration) => {
    setActionItem(item)
    setEscalationLevel('')
    setActionNote('')
    setActionSuccess(false)
    setEscalateModalOpen(true)
  }

  const handleReassign = (item: Orchestration) => {
    setActionItem(item)
    setReassignTo('')
    setActionNote('')
    setActionSuccess(false)
    setReassignModalOpen(true)
  }

  const submitEscalation = async () => {
    if (!escalationLevel) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setActionSuccess(true)
    setTimeout(() => {
      setEscalateModalOpen(false)
      setActionSuccess(false)
    }, 1500)
  }

  const submitReassign = async () => {
    if (!reassignTo) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setActionSuccess(true)
    setTimeout(() => {
      setReassignModalOpen(false)
      setActionSuccess(false)
    }, 1500)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = React.useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0
      if (sortField === 'status') {
        cmp = statusOrder[a.status] - statusOrder[b.status]
        if (cmp === 0) cmp = b.elapsedMinutes - a.elapsedMinutes
      } else if (sortField === 'elapsedMinutes') {
        cmp = a.elapsedMinutes - b.elapsedMinutes
      } else {
        cmp = a[sortField].localeCompare(b[sortField])
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
  }, [data, sortField, sortDir])

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(data.map(d => d.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const allChecked = data.length > 0 && selected.size === data.length
  const someChecked = selected.size > 0 && selected.size < data.length

  const SortHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        'flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group',
        className
      )}
    >
      {children}
      {sortField === field ? (
        sortDir === 'asc' ? (
          <ChevronUp className="w-3 h-3 text-gold" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gold" />
        )
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </button>
  )

  // Get selected items for the modal
  const selectedItems = React.useMemo(() => {
    return data.filter(item => selected.has(item.id))
  }, [data, selected])

  const handleBulkActionConfirm = () => {
    setSelected(new Set())
  }

  return (
    <>
    <div className="w-full">
      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-lg bg-gold/10 border border-gold/20">
          <span className="text-xs font-semibold text-gold tabular-nums">
            {selected.size} selected
          </span>
          <div className="h-4 w-px bg-gold/20" />
          <Button 
            size="sm" 
            className="h-7 text-xs gap-1.5 bg-gold hover:bg-gold/90 text-navy font-semibold"
            onClick={() => setBulkModalOpen(true)}
          >
            <ArrowUp className="w-3 h-3" />
            Bulk Action
          </Button>
          <div className="flex-1" />
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-line overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-muted/30">
                <th className="w-10 px-3 py-3">
                  <Checkbox
                    checked={allChecked}
                    ref={(el) => {
                      if (el) {
                        (el as unknown as HTMLInputElement).indeterminate = someChecked
                      }
                    }}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-3 text-left">
                  <SortHeader field="process">Process</SortHeader>
                </th>
                <th className="px-3 py-3 text-left">
                  <SortHeader field="project">Project</SortHeader>
                </th>
                <th className="px-3 py-3 text-left">
                  <SortHeader field="stage">Stage</SortHeader>
                </th>
                <th className="px-3 py-3 text-left">
                  <SortHeader field="ownerRole">Owner (Role)</SortHeader>
                </th>
                <th className="px-3 py-3 text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    Current Filler
                  </span>
                </th>
                <th className="px-3 py-3 text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    Status
                  </span>
                </th>
                <th className="px-3 py-3 text-left">
                  <SortHeader field="elapsedMinutes">Elapsed</SortHeader>
                </th>
                <th className="px-3 py-3 text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    Agent
                  </span>
                </th>
                <th className="px-3 py-3 text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const isSelected = selectedId === item.id
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectRow(item)}
                    className={cn(
                      'border-b border-line/50 transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-gold/10 dark:bg-gold/5'
                        : 'hover:bg-gold-pale'
                    )}
                  >
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.process}`}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] font-medium text-foreground">
                        {item.process}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] text-foreground/80">
                        {item.project}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] text-muted-foreground">
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] text-muted-foreground">
                        {item.ownerRole}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[13px] text-foreground/80">
                        {item.currentFiller}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusChip status={item.status} slaInfo={item.slaInfo} />
                    </td>
                    <td className="px-3 py-2.5">
                      <ElapsedDisplay elapsed={item.elapsed} status={item.status} />
                    </td>
                    <td className="px-3 py-2.5">
                      {item.agent ? (
                        <AgentBadge agentId={item.agentId!} />
                      ) : (
                        <span className="text-muted-foreground/40">&mdash;</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      {(item.status === 'BREACH' || item.status === 'SEVERE' || item.status === 'PRE-BREACH') ? (
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleEscalate(item)}
                                className="p-1.5 rounded-md hover:bg-red/10 transition-colors text-muted-foreground hover:text-red"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Escalate</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleReassign(item)}
                                className="p-1.5 rounded-md hover:bg-amber/10 transition-colors text-muted-foreground hover:text-amber"
                              >
                                <RefreshCcw className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Reassign</TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">&mdash;</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-2.5 border-t border-line bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Showing {sorted.length} of {sorted.length} orchestrations
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60">
            Sorted by {sortField} ({sortDir})
          </span>
        </div>
      </div>
    </div>

    {/* Bulk Action Modal */}
    <BulkActionModal
      open={bulkModalOpen}
      onOpenChange={setBulkModalOpen}
      selectedItems={selectedItems}
      onConfirm={handleBulkActionConfirm}
    />

    {/* Escalate Modal - Professional UI */}
    <Dialog open={escalateModalOpen} onOpenChange={setEscalateModalOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-card border-line [&>button]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ring-4 bg-red/15 ring-red/20">
                <AlertTriangle className="w-5 h-5 text-red" />
              </div>
              <div className="flex-1 pt-0.5">
                <DialogHeader className="gap-0 space-y-1">
                  <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                    Escalate Issue
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    {actionItem?.process} — {actionItem?.project}
                  </p>
                </DialogHeader>
              </div>
              <button
                onClick={() => setEscalateModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="px-6 pb-5 space-y-4">
            {actionSuccess ? (
              <motion.div 
                className="py-8 flex flex-col items-center gap-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#E7F5EC] dark:bg-emerald-900/40 flex items-center justify-center ring-4 ring-emerald-200/50 dark:ring-emerald-800/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Escalation Submitted</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Escalated to {escalationLevels.find(l => l.id === escalationLevel)?.label}
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Current Status Context */}
                <div className="rounded-lg border border-line bg-secondary/50 dark:bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#FBE9E9] dark:bg-rose-900/40 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                      {actionItem?.status ? statusLabel(actionItem.status) : ''}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Elapsed</dt>
                      <dd className="text-xs text-foreground font-mono mt-0.5">{actionItem?.elapsed}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Owner</dt>
                      <dd className="text-xs text-foreground font-mono mt-0.5">{actionItem?.currentFiller}</dd>
                    </div>
                  </dl>
                </div>

                {/* Escalation Level */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Escalation Level <span className="text-red">*</span>
                  </Label>
                  <Select value={escalationLevel} onValueChange={setEscalationLevel}>
                    <SelectTrigger className="h-10 text-sm bg-background border-line">
                      <SelectValue placeholder="Select escalation level" />
                    </SelectTrigger>
                    <SelectContent>
                      {escalationLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          <div>
                            <div className="text-sm font-medium">{level.label}</div>
                            <div className="text-[10px] text-muted-foreground">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Note (Optional)
                  </Label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Add context for the escalation..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-line focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!actionSuccess && (
            <div className="px-6 py-4 bg-secondary/30 dark:bg-secondary/20 border-t border-line flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-9" onClick={() => setEscalateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={submitEscalation}
                disabled={!escalationLevel || isSubmitting}
                className="h-9 min-w-[110px] bg-red hover:bg-red/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Escalating...
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 mr-1.5" />
                    Escalate
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>

    {/* Reassign Modal - Professional UI */}
    <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-card border-line [&>button]:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ring-4 bg-amber/15 ring-amber/20">
                <Users className="w-5 h-5 text-amber" />
              </div>
              <div className="flex-1 pt-0.5">
                <DialogHeader className="gap-0 space-y-1">
                  <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                    Reassign Task
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    {actionItem?.process} — {actionItem?.project}
                  </p>
                </DialogHeader>
              </div>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="px-6 pb-5 space-y-4">
            {actionSuccess ? (
              <motion.div 
                className="py-8 flex flex-col items-center gap-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#E7F5EC] dark:bg-emerald-900/40 flex items-center justify-center ring-4 ring-emerald-200/50 dark:ring-emerald-800/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Task Reassigned</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assigned to {teamMembers.find(m => m.id === reassignTo)?.name}
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Current Assignment Context */}
                <div className="rounded-lg border border-line bg-secondary/50 dark:bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#FBF1E6] dark:bg-amber-900/40 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">Currently Assigned</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Person</dt>
                      <dd className="text-xs text-foreground font-mono mt-0.5">{actionItem?.currentFiller}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Role</dt>
                      <dd className="text-xs text-foreground font-mono mt-0.5">{actionItem?.ownerRole}</dd>
                    </div>
                  </dl>
                </div>

                {/* Reassign To */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Reassign To <span className="text-red">*</span>
                  </Label>
                  <Select value={reassignTo} onValueChange={setReassignTo}>
                    <SelectTrigger className="h-10 text-sm bg-background border-line">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.filter(m => m.name !== actionItem?.currentFiller).map((member) => (
                        <SelectItem key={member.id} value={member.id} disabled={!member.available}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              member.available ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                            )} />
                            <div>
                              <span className="text-sm font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{member.role}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Handoff Note */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Handoff Note (Optional)
                  </Label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Add context for the new assignee..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-line focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!actionSuccess && (
            <div className="px-6 py-4 bg-secondary/30 dark:bg-secondary/20 border-t border-line flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-9" onClick={() => setReassignModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={submitReassign}
                disabled={!reassignTo || isSubmitting}
                className="h-9 min-w-[110px] bg-amber hover:bg-amber/90 text-navy"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Reassigning...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                    Reassign
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
    </>
  )
}

// ── Sub-components ──

// Map internal SLA status enum -> user-facing label
function statusLabel(status: SLAStatus): string {
  switch (status) {
    case 'SEVERE': return 'Significantly past SLA'
    case 'BREACH': return 'Past SLA'
    case 'PRE-BREACH': return 'Approaching SLA'
    case 'ON TRACK': return 'On Track'
    default: return status
  }
}

function StatusChip({ status, slaInfo }: { status: SLAStatus; slaInfo?: SLAInfo }) {
  const config: Record<SLAStatus, { bg: string; text: string; dot: string; label: string }> = {
    'SEVERE': {
      bg: 'bg-red-dark/15 dark:bg-red/20',
      text: 'text-red-dark dark:text-red',
      dot: 'bg-red-dark dark:bg-red animate-pulse-dot',
      label: 'Significantly past SLA',
    },
    'BREACH': {
      bg: 'bg-red/10',
      text: 'text-red',
      dot: 'bg-red',
      label: 'Past SLA',
    },
    'PRE-BREACH': {
      bg: 'bg-amber/10',
      text: 'text-amber',
      dot: 'bg-amber',
      label: 'Approaching SLA',
    },
    'ON TRACK': {
      bg: 'bg-green/10',
      text: 'text-green',
      dot: 'bg-green',
      label: 'On Track',
    },
  }

  const c = config[status]

  const chip = (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide cursor-default', c.bg, c.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', c.dot)} />
      {c.label}
    </span>
  )

  if (!slaInfo) return chip

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {chip}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] p-0 overflow-hidden">
        <div className="bg-navy dark:bg-navy-light px-3 py-2 border-b border-white/10">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">SLA Details</span>
        </div>
        <div className="px-3 py-2.5 space-y-1.5 bg-popover">
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-muted-foreground shrink-0 w-12">SLA:</span>
            <span className="text-[10px] font-mono text-foreground break-all">
              {slaInfo.eventStart} → {slaInfo.eventEnd}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground shrink-0 w-12">Target:</span>
            <span className="text-[10px] font-mono font-semibold text-foreground">{slaInfo.target}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground shrink-0 w-12">Elapsed:</span>
            <span className={cn(
              'text-[10px] font-mono font-bold',
              status === 'SEVERE' || status === 'BREACH' ? 'text-red' :
              status === 'PRE-BREACH' ? 'text-amber' : 'text-green'
            )}>
              {slaInfo.elapsedFormatted}
              {slaInfo.variance && (
                <span className="ml-1 opacity-80">({slaInfo.variance})</span>
              )}
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function ElapsedDisplay({ elapsed, status }: { elapsed: string; status: SLAStatus }) {
  const colorClass =
    status === 'SEVERE' ? 'text-red-dark dark:text-red font-bold' :
    status === 'BREACH' ? 'text-red font-semibold' :
    status === 'PRE-BREACH' ? 'text-amber font-semibold' :
    'text-muted-foreground'

  return (
    <span className={cn('font-mono text-[12px] tabular-nums', colorClass)}>
      {elapsed}
    </span>
  )
}

function AgentBadge({ agentId }: { agentId: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal/10 border border-teal/20 text-[10px] font-mono font-semibold text-teal hover:bg-teal/20 transition-colors">
          <Bot className="w-3 h-3" />
          {agentId}
        </button>
      </TooltipTrigger>
      <TooltipContent>View Agent Invocation Log</TooltipContent>
    </Tooltip>
  )
}

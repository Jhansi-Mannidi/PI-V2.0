'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Database, GitBranch, Clock, User, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProvenanceData {
  value: string | number
  label: string
  sourceEvent: string
  semanticLayerQuery: string
  lastChangedBy: string
  lastChangedAt: string
  eventBusOrigin: string
  additionalContext?: string
}

interface ProvenanceModalProps {
  isOpen: boolean
  onClose: () => void
  data: ProvenanceData | null
}

export function ProvenanceModal({ isOpen, onClose, data }: ProvenanceModalProps) {
  if (!data) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-card border border-line rounded-xl shadow-2xl z-50 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Data Provenance</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Audit trail for this value</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Value Display */}
            <div className="p-4 bg-secondary/30 border-b border-line">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{data.label}</div>
              <div className="text-2xl font-bold text-foreground">{data.value}</div>
            </div>

            {/* Provenance Details */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Source Event */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Source Event</div>
                  <div className="text-xs text-foreground font-medium mt-0.5">{data.sourceEvent}</div>
                </div>
              </div>

              {/* Semantic Layer Query */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Semantic Layer Query</div>
                  <code className="text-[10px] text-foreground/80 font-mono bg-secondary/50 px-2 py-1 rounded mt-1 block break-all">
                    {data.semanticLayerQuery}
                  </code>
                </div>
              </div>

              {/* Last Changed By */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Changed By</div>
                  <div className="text-xs text-foreground font-medium mt-0.5">{data.lastChangedBy}</div>
                </div>
              </div>

              {/* Last Changed At */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Changed At</div>
                  <div className="text-xs text-foreground font-medium mt-0.5">{data.lastChangedAt}</div>
                </div>
              </div>

              {/* Event Bus Origin */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Event Bus Origin</div>
                  <div className="text-xs text-foreground font-medium mt-0.5">{data.eventBusOrigin}</div>
                </div>
              </div>

              {/* Additional Context */}
              {data.additionalContext && (
                <div className="p-3 bg-secondary/30 rounded-lg border border-line">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Additional Context</div>
                  <p className="text-xs text-foreground/80">{data.additionalContext}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-line shrink-0 bg-secondary/20">
              <button
                onClick={onClose}
                className="h-8 px-4 text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook to manage provenance state
export function useProvenance() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [data, setData] = React.useState<ProvenanceData | null>(null)

  const showProvenance = React.useCallback((provenanceData: ProvenanceData) => {
    setData(provenanceData)
    setIsOpen(true)
  }, [])

  const hideProvenance = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    data,
    showProvenance,
    hideProvenance,
  }
}

// Clickable value component with provenance
interface TraceableValueProps {
  value: string | number
  label: string
  provenance: Omit<ProvenanceData, 'value' | 'label'>
  className?: string
  onClick: (data: ProvenanceData) => void
}

export function TraceableValue({ value, label, provenance, className, onClick }: TraceableValueProps) {
  return (
    <button
      onClick={() => onClick({ value, label, ...provenance })}
      className={cn(
        'text-left hover:bg-gold/10 rounded px-1 -mx-1 transition-colors cursor-pointer underline decoration-dotted decoration-muted-foreground/30 underline-offset-2',
        className
      )}
      title="Click to view data provenance"
    >
      {value}
    </button>
  )
}

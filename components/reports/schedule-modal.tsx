'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, Zap, Mail, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

type Cadence = 'one-off' | 'daily' | 'weekly' | 'monthly' | 'quarterly'
type Format = 'pdf' | 'xlsx' | 'slides'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  reportName: string
  availableFormats?: Format[]
  onSchedule?: (config: ScheduleConfig) => void
}

interface ScheduleConfig {
  cadence: Cadence
  recipients: string[]
  format: Format
  conditionalTrigger?: string
  nextRun?: Date
}

const cadenceOptions: { value: Cadence; label: string; description: string }[] = [
  { value: 'one-off', label: 'One-off', description: 'Send once at scheduled time' },
  { value: 'daily', label: 'Daily', description: 'Every day at specified time' },
  { value: 'weekly', label: 'Weekly', description: 'Every week on specified day' },
  { value: 'monthly', label: 'Monthly', description: 'First of each month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Start of each quarter' },
]

const distributionLists = [
  { id: 'exec', name: 'Executive Team', members: 5 },
  { id: 'pgm', name: 'PgM Team', members: 12 },
  { id: 'finance', name: 'Finance & EAC', members: 8 },
  { id: 'ops', name: 'Operations', members: 15 },
]

const conditionalTriggers = [
  { id: 'none', label: 'No conditions (always send)' },
  { id: 'p1_risk', label: 'Only if any P1 risk added' },
  { id: 'variance', label: 'Only if material variance (>$1M)' },
  { id: 'sla_breach', label: 'Only if SLA breach detected' },
  { id: 'approval_pending', label: 'Only if approvals pending >48h' },
]

export function ScheduleModal({
  isOpen,
  onClose,
  reportName,
  availableFormats = ['pdf', 'xlsx'],
  onSchedule,
}: ScheduleModalProps) {
  const [cadence, setCadence] = React.useState<Cadence>('weekly')
  const [selectedLists, setSelectedLists] = React.useState<string[]>(['exec'])
  const [customEmails, setCustomEmails] = React.useState('')
  const [format, setFormat] = React.useState<Format>('pdf')
  const [trigger, setTrigger] = React.useState('none')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const config: ScheduleConfig = {
      cadence,
      recipients: [
        ...selectedLists,
        ...customEmails.split(',').map(e => e.trim()).filter(Boolean)
      ],
      format,
      conditionalTrigger: trigger !== 'none' ? trigger : undefined,
    }
    
    onSchedule?.(config)
    setIsSubmitting(false)
    onClose()
  }

  const toggleList = (id: string) => {
    setSelectedLists(prev => 
      prev.includes(id) 
        ? prev.filter(l => l !== id)
        : [...prev, id]
    )
  }

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
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-card border border-line rounded-xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Schedule Report</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{reportName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
              {/* Cadence */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  Delivery Cadence
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {cadenceOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setCadence(opt.value)}
                      className={cn(
                        'p-2.5 rounded-lg border text-left transition-all',
                        cadence === opt.value
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-line bg-secondary/30 text-muted-foreground hover:border-gold/50 hover:bg-secondary/50'
                      )}
                    >
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  Recipients
                </label>
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {distributionLists.map(list => (
                      <button
                        key={list.id}
                        onClick={() => toggleList(list.id)}
                        className={cn(
                          'p-2.5 rounded-lg border text-left transition-all',
                          selectedLists.includes(list.id)
                            ? 'border-gold bg-gold/10 text-foreground'
                            : 'border-line bg-secondary/30 text-muted-foreground hover:border-gold/50'
                        )}
                      >
                        <div className="text-xs font-medium">{list.name}</div>
                        <div className="text-[10px] opacity-70">{list.members} members</div>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Add emails (comma-separated)"
                      value={customEmails}
                      onChange={(e) => setCustomEmails(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-secondary/30 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                  Output Format
                </label>
                <div className="flex gap-2 mt-2">
                  {availableFormats.map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        'h-8 px-4 rounded-lg border text-xs font-medium transition-all uppercase',
                        format === f
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-line bg-secondary/30 text-muted-foreground hover:border-gold/50'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Triggers */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                  Conditional Trigger (Optional)
                </label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-secondary/30 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-foreground"
                >
                  {conditionalTriggers.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Schedules respect Dataplex security at recipient level.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-line shrink-0 bg-secondary/20">
              <button
                onClick={onClose}
                className="h-9 px-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedLists.length === 0}
                className="h-9 px-5 text-xs font-medium bg-gold hover:bg-gold-hover text-navy rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Report'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

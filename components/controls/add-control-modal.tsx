'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  X, ShieldCheck, Target, Layers, Code2, UserCheck,
  AlertCircle, CheckCircle2, Lock, Calendar, MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PagePanel } from '@/components/page-panel'

interface AddControlModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (control: any) => void
}

export function AddControlModal({ open, onClose, onCreate }: AddControlModalProps) {
  const [step, setStep] = React.useState<'details' | 'scope' | 'testing' | 'review'> ('details')
  const [formData, setFormData] = React.useState({
    name: '',
    objective: '',
    category: 'Financial',
    framework: 'COSO',
    controlType: 'Preventive',
    nature: 'Manual',
    owner: 'Leave unassigned',
    status: 'Draft',
    frequency: 'Quarterly',
    nextDue: '',
    projects: [] as string[],
  })

  const steps = ['details', 'scope', 'testing', 'review'] as const
  const stepIndex = steps.indexOf(step)
  const isLastStep = step === 'review'
  const isComplete = formData.name && formData.objective

  const handleNext = () => {
    const nextStep = steps[stepIndex + 1]
    if (nextStep) setStep(nextStep)
  }

  const handlePrev = () => {
    const prevStep = steps[stepIndex - 1]
    if (prevStep) setStep(prevStep)
  }

  const handleCreate = () => {
    if (isComplete) {
      onCreate?.(formData)
      onClose()
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
      <Icon className="w-3 h-3" />
      {children}
    </label>
  )

  const stepContent: Record<typeof step, React.ReactNode> = {
    details: (
      <div className="space-y-6 py-6 px-6">
        <div>
          <FieldLabel icon={ShieldCheck}>Control Name</FieldLabel>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g., Contractor COI Verification Before Mobilisation"
            className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          />
        </div>

        <div>
          <FieldLabel icon={Target}>Objective</FieldLabel>
          <textarea
            value={formData.objective}
            onChange={(e) => handleFieldChange('objective', e.target.value)}
            placeholder="Explain what this control prevents, detects, or corrects..."
            rows={3}
            className="w-full mt-2 px-3 py-2.5 text-[12px] border border-line rounded-xl bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel icon={Layers}>Category</FieldLabel>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
            >
              {['Financial', 'Operational', 'Safety', 'Cyber/IT', 'Schedule', 'Procurement', 'Environmental', 'Compliance'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel icon={Code2}>Framework</FieldLabel>
            <select
              value={formData.framework}
              onChange={(e) => handleFieldChange('framework', e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
            >
              {['COSO', 'SOX', 'OSHA', 'ISO 27001', 'FCA'].map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel icon={ShieldCheck}>Control Type</FieldLabel>
            <select
              value={formData.controlType}
              onChange={(e) => handleFieldChange('controlType', e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
            >
              {['Preventive', 'Detective', 'Corrective'].map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel icon={UserCheck}>Nature</FieldLabel>
            <select
              value={formData.nature}
              onChange={(e) => handleFieldChange('nature', e.target.value)}
              className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
            >
              {['Manual', 'Automated', 'Hybrid'].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ),

    scope: (
      <div className="space-y-6 py-6 px-6">
        <div>
          <FieldLabel icon={UserCheck}>Accountable Owner</FieldLabel>
          <select
            value={formData.owner}
            onChange={(e) => handleFieldChange('owner', e.target.value)}
            className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          >
            <option value="Leave unassigned">Leave unassigned</option>
            <option value="Hasit Chetal">Hasit Chetal</option>
            <option value="Priya Nair">Priya Nair</option>
            <option value="Sophia Lam">Sophia Lam</option>
            <option value="Alice Cox">Alice Cox</option>
          </select>
        </div>

        <div>
          <FieldLabel icon={AlertCircle}>Status</FieldLabel>
          <select
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          >
            {['Draft', 'Active', 'Inactive', 'Under Review'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel icon={Layers}>Applicable Projects</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {['Henderson Substation', 'Pryor Creek', 'VoltusWave', 'STB', 'Aurora'].map(proj => (
              <label key={proj} className="flex items-center gap-2 p-2.5 rounded-lg border border-line bg-secondary/30 cursor-pointer hover:border-gold/40 transition-all">
                <input
                  type="checkbox"
                  checked={formData.projects.includes(proj)}
                  onChange={(e) => {
                    handleFieldChange('projects', e.target.checked
                      ? [...formData.projects, proj]
                      : formData.projects.filter(p => p !== proj)
                    )
                  }}
                  className="w-3.5 h-3.5 cursor-pointer accent-gold"
                />
                <span className="text-[11px] font-medium text-foreground">{proj}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    ),

    testing: (
      <div className="space-y-6 py-6 px-6">
        <div>
          <FieldLabel icon={Calendar}>Test Frequency</FieldLabel>
          <select
            value={formData.frequency}
            onChange={(e) => handleFieldChange('frequency', e.target.value)}
            className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          >
            {['Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Event-based'].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel icon={Calendar}>Next Due Date</FieldLabel>
          <input
            type="date"
            value={formData.nextDue}
            onChange={(e) => handleFieldChange('nextDue', e.target.value)}
            className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          />
        </div>

        <div className="rounded-2xl border border-teal/25 bg-teal/6 p-4">
          <div className="flex gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-teal uppercase tracking-[0.14em]">Testing cadence set</p>
              <p className="text-[12px] text-foreground mt-1">This control will be tested {formData.frequency.toLowerCase()} and due on {formData.nextDue || 'the selected date'}.</p>
            </div>
          </div>
        </div>
      </div>
    ),

    review: (
      <div className="space-y-6 py-6 px-6">
        <div className="rounded-2xl border border-gold/25 bg-gold/6 p-4">
          <div className="flex gap-2.5">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
            <div>
              <p className="text-[12px] font-bold text-gold uppercase tracking-[0.14em]">Ready to create</p>
              <p className="text-[13px] font-semibold text-foreground mt-1">{formData.name}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{formData.objective}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-line">
            <span className="text-[11px] font-semibold text-muted-foreground">Category</span>
            <span className="text-[12px] font-semibold text-foreground">{formData.category}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-line">
            <span className="text-[11px] font-semibold text-muted-foreground">Framework</span>
            <span className="text-[12px] font-semibold text-foreground">{formData.framework}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-line">
            <span className="text-[11px] font-semibold text-muted-foreground">Owner</span>
            <span className="text-[12px] font-semibold text-foreground">{formData.owner}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-line">
            <span className="text-[11px] font-semibold text-muted-foreground">Test Frequency</span>
            <span className="text-[12px] font-semibold text-foreground">{formData.frequency}</span>
          </div>
        </div>
      </div>
    ),
  }

  const footer = (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-line">
      <p className="text-[11px] text-muted-foreground">
        Step {stepIndex + 1} of {steps.length}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-5 border-line text-[12px]"
          onClick={handlePrev}
          disabled={stepIndex === 0}
        >
          Back
        </Button>
        {!isLastStep ? (
          <Button
            size="sm"
            className="h-9 px-6 bg-gold text-navy font-semibold gap-1.5 text-[12px]"
            onClick={handleNext}
            disabled={!formData.name || !formData.objective}
          >
            Next
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-9 px-6 bg-gold text-navy font-semibold gap-1.5 text-[12px]"
            onClick={handleCreate}
            disabled={!isComplete}
          >
            Create Control
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <PagePanel
      open={open}
      onClose={onClose}
      title="Add Control"
      description="Define ownership, scope, framework, and testing cadence for the control register."
      footer={footer}
    >
      <div className="flex flex-col h-full">
        {/* Step indicators */}
        <div className="flex items-center gap-1 px-6 py-4 border-b border-line">
          {steps.map((s, i) => {
            const isActive = s === step
            const isComplete = steps.indexOf(step) > i
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className={cn('h-0.5 flex-1', isComplete ? 'bg-gold' : 'bg-line')} />}
                <motion.button
                  onClick={() => {
                    if (i < stepIndex) setStep(s)
                  }}
                  disabled={i > stepIndex}
                  className={cn(
                    'h-8 px-3 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all',
                    isActive ? 'bg-gold text-navy' : isComplete ? 'bg-green/15 text-green' : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {isComplete ? '✓' : i + 1} {s === 'details' ? 'Details' : s === 'scope' ? 'Scope' : s === 'testing' ? 'Testing' : 'Review'}
                </motion.button>
              </React.Fragment>
            )
          })}
        </div>

        {/* Content area */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          {stepContent[step]}
        </motion.div>
      </div>
    </PagePanel>
  )
}

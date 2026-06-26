'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  UserCog,
  Flag,
  Mail,
  FileText,
  Loader2,
  Sparkles,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  BookOpen,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { PagePanel } from '@/components/page-panel'

export type ActionTone = 'success' | 'warning' | 'destructive' | 'info' | 'primary'

export type ActionField =
  | {
      type: 'select'
      name: string
      label: string
      placeholder?: string
      defaultValue?: string
      options: Array<{ value: string; label: string; description?: string }>
      required?: boolean
    }
  | {
      type: 'textarea'
      name: string
      label: string
      placeholder?: string
      defaultValue?: string
      required?: boolean
      rows?: number
    }
  | {
      type: 'input'
      name: string
      label: string
      placeholder?: string
      defaultValue?: string
      required?: boolean
      inputType?: 'text' | 'email' | 'number' | 'date'
    }

export interface ActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tone?: ActionTone
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  context?: Array<{ label: string; value: React.ReactNode }>
  fields?: ActionField[]
  confirmLabel?: string
  cancelLabel?: string
  successToast?: string
  successDescription?: string
  onConfirm?: (values: Record<string, string>) => void | Promise<void>
  widthClass?: string
}

/* ── Per-tone design tokens ── */
const toneConfig: Record<ActionTone, {
  bg: string; border: string; icon: string; badge: string
  button: string; pillBg: string; pillText: string
  glow: string; accent: string; barBg: string; stepColor: string
  heroGradient: string
}> = {
  primary: {
    bg: 'bg-navy/5 dark:bg-gold/8',
    border: 'border-navy/12 dark:border-gold/20',
    icon: 'text-navy dark:text-gold',
    badge: 'bg-navy/10 dark:bg-gold/15',
    button: 'bg-navy hover:bg-navy/90 text-white dark:bg-gold dark:hover:bg-gold/90 dark:text-navy',
    pillBg: 'bg-navy/6 dark:bg-gold/10',
    pillText: 'text-navy dark:text-gold',
    glow: 'ring-2 ring-navy/10 dark:ring-gold/15',
    accent: 'bg-navy dark:bg-gold',
    barBg: 'bg-navy/8 dark:bg-gold/10',
    stepColor: 'text-navy dark:text-gold',
    heroGradient: 'from-navy/4 via-navy/2 to-transparent dark:from-gold/6 dark:via-gold/3',
  },
  success: {
    bg: 'bg-green/5',
    border: 'border-green/18',
    icon: 'text-green',
    badge: 'bg-green/10',
    button: 'bg-green hover:bg-green/90 text-white',
    pillBg: 'bg-green/7',
    pillText: 'text-green',
    glow: 'ring-2 ring-green/12',
    accent: 'bg-green',
    barBg: 'bg-green/8',
    stepColor: 'text-green',
    heroGradient: 'from-green/5 via-green/2 to-transparent',
  },
  warning: {
    bg: 'bg-amber/5',
    border: 'border-amber/18',
    icon: 'text-amber',
    badge: 'bg-amber/10',
    button: 'bg-amber hover:bg-amber/90 text-navy',
    pillBg: 'bg-amber/7',
    pillText: 'text-amber',
    glow: 'ring-2 ring-amber/12',
    accent: 'bg-amber',
    barBg: 'bg-amber/8',
    stepColor: 'text-amber',
    heroGradient: 'from-amber/5 via-amber/2 to-transparent',
  },
  destructive: {
    bg: 'bg-red/5',
    border: 'border-red/18',
    icon: 'text-red',
    badge: 'bg-red/10',
    button: 'bg-red hover:bg-red/90 text-white',
    pillBg: 'bg-red/7',
    pillText: 'text-red',
    glow: 'ring-2 ring-red/12',
    accent: 'bg-red',
    barBg: 'bg-red/8',
    stepColor: 'text-red',
    heroGradient: 'from-red/5 via-red/2 to-transparent',
  },
  info: {
    bg: 'bg-teal/5',
    border: 'border-teal/18',
    icon: 'text-teal',
    badge: 'bg-teal/10',
    button: 'bg-teal hover:bg-teal/90 text-white',
    pillBg: 'bg-teal/7',
    pillText: 'text-teal',
    glow: 'ring-2 ring-teal/12',
    accent: 'bg-teal',
    barBg: 'bg-teal/8',
    stepColor: 'text-teal',
    heroGradient: 'from-teal/5 via-teal/2 to-transparent',
  },
}

const TONE_LABELS: Record<ActionTone, string> = {
  primary: 'Primary Action',
  success: 'Approval',
  warning: 'Escalation',
  destructive: 'Critical Action',
  info: 'Information',
}

const toneToastIcon: Record<ActionTone, React.ComponentType<{ className?: string }>> = {
  primary: CheckCircle2,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Sparkles,
}

/* ── Field icon map ── */
function fieldIcon(f: ActionField) {
  if (f.type === 'textarea') return FileText
  if (f.type === 'input') {
    if ('inputType' in f && f.inputType === 'date') return Clock
    if ('inputType' in f && f.inputType === 'email') return Mail
    return BookOpen
  }
  return Shield
}

export function ActionModal({
  open,
  onOpenChange,
  tone = 'primary',
  icon: Icon = Flag,
  title,
  description,
  context,
  fields = [],
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  successToast,
  successDescription,
  onConfirm,
}: ActionModalProps) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [activeField, setActiveField] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {}
      for (const f of fields) {
        if ('defaultValue' in f && f.defaultValue !== undefined) initial[f.name] = f.defaultValue
        else if (f.type === 'select' && f.options.length > 0) initial[f.name] = f.options[0].value
        else initial[f.name] = ''
      }
      setValues(initial)
      setErrors({})
      setIsSubmitting(false)
      setActiveField(null)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const tc = toneConfig[tone]
  const ToastIcon = toneToastIcon[tone]

  // Progress: how many required fields are filled
  const requiredFields = fields.filter((f) => f.required)
  const filledRequired = requiredFields.filter((f) => values[f.name]?.trim()).length
  const progress = requiredFields.length > 0
    ? Math.round((filledRequired / requiredFields.length) * 100)
    : 100

  const handleConfirm = async () => {
    const newErrors: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        newErrors[f.name] = `${f.label} is required`
      }
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setIsSubmitting(true)
    try {
      await Promise.resolve(onConfirm?.(values) ?? new Promise((r) => setTimeout(r, 700)))
      toast.success(successToast ?? `${confirmLabel} completed`, {
        description: successDescription ?? title,
        icon: <ToastIcon className="w-4 h-4" />,
      })
      onOpenChange(false)
    } catch (err) {
      toast.error('Action failed', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const footer = (
    <div className="flex items-center justify-between gap-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 min-w-0">
        {requiredFields.length > 0 && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-1.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', tc.accent)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                {filledRequired}/{requiredFields.length} required
              </span>
            </div>
            {progress === 100 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-green"
              >
                <CheckCircle2 className="w-3 h-3" /> Ready
              </motion.span>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="h-9 px-5 border-line text-[12px] hover:bg-secondary"
        >
          {cancelLabel}
        </Button>
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={isSubmitting || progress < 100}
          className={cn(
            'h-9 min-w-[160px] text-[12px] font-semibold shadow-sm gap-2 transition-all',
            tc.button,
            progress < 100 && 'opacity-60',
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Processing&hellip;
            </>
          ) : (
            <>
              {confirmLabel}
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <PagePanel
      open={open}
      onClose={() => !isSubmitting && onOpenChange(false)}
      title={title}
      description={description}
      footer={footer}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] h-full divide-y xl:divide-y-0 xl:divide-x divide-line">

        {/* ════════════════════════════════════════
            LEFT COLUMN — Identity + Context
        ════════════════════════════════════════ */}
        <div className="flex flex-col gap-5 px-6 py-7 overflow-y-auto">

          {/* Hero identity card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className={cn(
              'relative overflow-hidden rounded-2xl border p-5',
              tc.bg, tc.border,
            )}
          >
            {/* Subtle gradient wash */}
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60 pointer-events-none', tc.heroGradient)} />

            <div className="relative flex items-start gap-4">
              <div className={cn(
                'shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border',
                tc.badge, tc.border, tc.glow,
              )}>
                <Icon className={cn('w-5 h-5', tc.icon)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border',
                    tc.pillBg, tc.border, tc.pillText,
                  )}>
                    <Zap className="w-2.5 h-2.5" />
                    {TONE_LABELS[tone]}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-foreground leading-tight mt-2">
                  {title}
                </h3>
                {description && (
                  <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* "Acting On" context block */}
          {context && context.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.06 }}
              className="rounded-2xl border border-line bg-card overflow-hidden shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary/50">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Acting on
                </p>
              </div>

              {/* Context rows */}
              <dl className="divide-y divide-line">
                {context.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.08 + i * 0.05 }}
                    className="grid grid-cols-2 gap-x-4 px-4 py-3"
                  >
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold self-start pt-0.5">
                      {row.label}
                    </dt>
                    <dd className="text-[13px] text-foreground font-semibold text-right">
                      {row.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          )}

          {/* Workflow steps indicator */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.12 }}
            className="rounded-2xl border border-line bg-card overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-secondary/50">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Workflow
              </p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Fill in action details', done: filledRequired === requiredFields.length && requiredFields.length > 0 },
                { label: 'Review context above', done: true },
                { label: 'Submit for audit trail', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300',
                    step.done
                      ? cn(tc.badge, tc.border)
                      : 'bg-secondary border-line',
                  )}>
                    {step.done
                      ? <CheckCircle2 className={cn('w-3 h-3', tc.icon)} />
                      : <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                    }
                  </div>
                  <span className={cn(
                    'text-[12px] font-medium transition-colors',
                    step.done ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                    {step.label}
                  </span>
                  {i < 2 && <ArrowRight className="w-3 h-3 text-muted-foreground/30 ml-auto" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Audit trail notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-line bg-secondary/30"
          >
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This action is logged to the immutable audit trail with timestamp, actor, and all field values.
            </p>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT COLUMN — Action Details Form
        ════════════════════════════════════════ */}
        <div className="flex flex-col px-6 py-7 overflow-y-auto">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                Action details
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {fields.length > 0
                  ? `Complete ${fields.length} field${fields.length > 1 ? 's' : ''} to proceed`
                  : 'No additional fields required'}
              </p>
            </div>
            {/* Completion ring */}
            <div className="shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="var(--line)" strokeWidth="3" />
                <motion.circle
                  cx="20" cy="20" r="15"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke={tone === 'destructive' ? 'var(--red)' : tone === 'success' ? 'var(--green)' : tone === 'warning' ? 'var(--amber)' : tone === 'info' ? 'var(--teal)' : 'var(--gold)'}
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - progress / 100) }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  transform="rotate(-90 20 20)"
                />
                <text x="20" y="24" textAnchor="middle" fontSize="10" fontWeight="700"
                  fill={tone === 'destructive' ? 'var(--red)' : tone === 'success' ? 'var(--green)' : tone === 'warning' ? 'var(--amber)' : tone === 'info' ? 'var(--teal)' : 'var(--gold)'}>
                  {progress}%
                </text>
              </svg>
            </div>
          </div>

          {fields.length === 0 ? (
            /* ── No-fields empty state ── */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(
                'flex-1 flex flex-col items-center justify-center text-center py-16 rounded-2xl border',
                tc.bg, tc.border,
              )}
            >
              <div className={cn(
                'w-20 h-20 rounded-3xl flex items-center justify-center border mb-5',
                tc.badge, tc.border, tc.glow,
              )}>
                <Icon className={cn('w-9 h-9', tc.icon)} />
              </div>
              <h4 className="text-[16px] font-bold text-foreground mb-2">Ready to confirm</h4>
              <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed mb-6">
                {description ?? 'This action will be recorded in the audit trail and cannot be undone.'}
              </p>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={cn('h-10 px-8 gap-2 font-semibold text-[13px]', tc.button)}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {confirmLabel}
              </Button>
            </motion.div>
          ) : (
            /* ── Form fields ── */
            <div className="flex flex-col gap-5 flex-1">
              {fields.map((f, fi) => {
                const FIcon = fieldIcon(f)
                const isActive = activeField === f.name
                const hasError = !!errors[f.name]
                const isFilled = !!values[f.name]?.trim()

                return (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: fi * 0.07 }}
                    className={cn(
                      'rounded-2xl border transition-all duration-200',
                      isActive
                        ? cn('bg-card', tc.border, tc.glow)
                        : hasError
                          ? 'bg-card border-red/30'
                          : isFilled
                            ? 'bg-card border-green/25'
                            : 'bg-card border-line',
                    )}
                  >
                    {/* Field header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                      <Label
                        htmlFor={f.name}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground cursor-pointer"
                      >
                        <FIcon className={cn('w-3 h-3', isActive ? tc.icon : 'text-muted-foreground')} />
                        {f.label}
                        {f.required && <span className="text-red ml-0.5">*</span>}
                      </Label>
                      <AnimatePresence mode="wait">
                        {isFilled && !hasError && (
                          <motion.div
                            key="filled"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            className="w-4 h-4 rounded-full bg-green/15 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-green" />
                          </motion.div>
                        )}
                        {hasError && (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            className="w-4 h-4 rounded-full bg-red/15 flex items-center justify-center"
                          >
                            <AlertTriangle className="w-2.5 h-2.5 text-red" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Field input */}
                    <div className="px-4 pb-4">
                      {f.type === 'select' && (
                        <Select
                          value={values[f.name] ?? ''}
                          onValueChange={(v) => {
                            setValues((prev) => ({ ...prev, [f.name]: v }))
                            setErrors((prev) => { const n = { ...prev }; delete n[f.name]; return n })
                          }}
                        >
                          <SelectTrigger
                            id={f.name}
                            className="h-10 text-[12px] rounded-xl border-0 bg-secondary/50 focus:ring-0 focus:ring-offset-0"
                            onFocus={() => setActiveField(f.name)}
                            onBlur={() => setActiveField(null)}
                          >
                            <SelectValue placeholder={f.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {f.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div>
                                  <div className="text-[12px] font-medium">{opt.label}</div>
                                  {opt.description && (
                                    <div className="text-[10px] text-muted-foreground">{opt.description}</div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {f.type === 'textarea' && (
                        <Textarea
                          id={f.name}
                          placeholder={f.placeholder}
                          rows={f.rows ?? 4}
                          value={values[f.name] ?? ''}
                          onChange={(e) => {
                            setValues((prev) => ({ ...prev, [f.name]: e.target.value }))
                            setErrors((prev) => { const n = { ...prev }; delete n[f.name]; return n })
                          }}
                          onFocus={() => setActiveField(f.name)}
                          onBlur={() => setActiveField(null)}
                          className="text-[12px] resize-none rounded-xl border-0 bg-secondary/50 leading-relaxed focus-visible:ring-0"
                        />
                      )}

                      {f.type === 'input' && (
                        <Input
                          id={f.name}
                          type={f.inputType ?? 'text'}
                          placeholder={f.placeholder}
                          value={values[f.name] ?? ''}
                          onChange={(e) => {
                            setValues((prev) => ({ ...prev, [f.name]: e.target.value }))
                            setErrors((prev) => { const n = { ...prev }; delete n[f.name]; return n })
                          }}
                          onFocus={() => setActiveField(f.name)}
                          onBlur={() => setActiveField(null)}
                          className="h-10 text-[12px] rounded-xl border-0 bg-secondary/50 focus-visible:ring-0"
                        />
                      )}

                      {hasError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] text-red font-semibold flex items-center gap-1 mt-2"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {errors[f.name]}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Bottom hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-line mt-auto"
              >
                <Send className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  All responses are immediately committed to the immutable event log on submit.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PagePanel>
  )
}

// Convenience icon re-exports
export const ActionIcons = {
  Escalate: Flag,
  Approve: CheckCircle2,
  Reject: XCircle,
  Reassign: UserCog,
  Send,
  Email: Mail,
  Note: FileText,
  Sparkles,
}

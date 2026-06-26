'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
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
  /** unused — kept for API compat */
  widthClass?: string
}

/* ── Per-tone design tokens ── */
const toneConfig: Record<ActionTone, {
  bg: string; border: string; icon: string; badge: string
  button: string; pillBg: string; pillText: string
  glow: string
}> = {
  primary: {
    bg: 'bg-navy/6 dark:bg-gold/8',
    border: 'border-navy/15 dark:border-gold/20',
    icon: 'text-navy dark:text-gold',
    badge: 'bg-navy/10 dark:bg-gold/15',
    button: 'bg-navy hover:bg-navy/90 text-white dark:bg-gold dark:hover:bg-gold/90 dark:text-navy',
    pillBg: 'bg-navy/8 dark:bg-gold/10',
    pillText: 'text-navy dark:text-gold',
    glow: 'shadow-[0_0_0_4px_rgba(11,31,58,0.08)] dark:shadow-[0_0_0_4px_rgba(212,160,76,0.12)]',
  },
  success: {
    bg: 'bg-green/6',
    border: 'border-green/20',
    icon: 'text-green',
    badge: 'bg-green/10',
    button: 'bg-green hover:bg-green/90 text-white',
    pillBg: 'bg-green/8',
    pillText: 'text-green',
    glow: 'shadow-[0_0_0_4px_rgba(22,163,74,0.1)]',
  },
  warning: {
    bg: 'bg-amber/6',
    border: 'border-amber/20',
    icon: 'text-amber',
    badge: 'bg-amber/10',
    button: 'bg-amber hover:bg-amber/90 text-navy',
    pillBg: 'bg-amber/8',
    pillText: 'text-amber',
    glow: 'shadow-[0_0_0_4px_rgba(217,119,6,0.1)]',
  },
  destructive: {
    bg: 'bg-red/6',
    border: 'border-red/20',
    icon: 'text-red',
    badge: 'bg-red/10',
    button: 'bg-red hover:bg-red/90 text-white',
    pillBg: 'bg-red/8',
    pillText: 'text-red',
    glow: 'shadow-[0_0_0_4px_rgba(220,38,38,0.1)]',
  },
  info: {
    bg: 'bg-teal/6',
    border: 'border-teal/20',
    icon: 'text-teal',
    badge: 'bg-teal/10',
    button: 'bg-teal hover:bg-teal/90 text-white',
    pillBg: 'bg-teal/8',
    pillText: 'text-teal',
    glow: 'shadow-[0_0_0_4px_rgba(43,138,138,0.1)]',
  },
}

const toneToastIcon: Record<ActionTone, React.ComponentType<{ className?: string }>> = {
  primary: CheckCircle2,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Sparkles,
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
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const tc = toneConfig[tone]
  const ToastIcon = toneToastIcon[tone]

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
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
        className="h-9 px-5 border-line text-[12px]"
      >
        {cancelLabel}
      </Button>
      <Button
        size="sm"
        onClick={handleConfirm}
        disabled={isSubmitting}
        className={cn('h-9 min-w-[140px] text-[12px] font-semibold shadow-sm', tc.button)}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            {confirmLabel}
            <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
          </>
        )}
      </Button>
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
      {/* ── Full-body layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] divide-y xl:divide-y-0 xl:divide-x divide-line h-full">

        {/* LEFT — Identity + context ── */}
        <div className="px-6 py-6 space-y-5">

          {/* Tone identity card */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'flex items-start gap-4 p-5 rounded-2xl border',
              tc.bg, tc.border,
            )}
          >
            <div className={cn(
              'shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border',
              tc.badge, tc.border, tc.glow,
            )}>
              <Icon className={cn('w-5 h-5', tc.icon)} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14px] font-semibold text-foreground leading-tight">{title}</h3>
              {description && (
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          </motion.div>

          {/* Context block */}
          {context && context.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="rounded-2xl border border-line bg-secondary/40 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-line bg-secondary/60">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Acting on
                </p>
              </div>
              <div className="p-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {context.map((row, i) => (
                    <div key={i} className={cn(context.length === 1 && 'col-span-2')}>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        {row.label}
                      </dt>
                      <dd className="text-[13px] text-foreground font-semibold">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          )}

          {/* Tone classification pill */}
          <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border', tc.pillBg, tc.border, tc.pillText)}>
            <Icon className="w-3 h-3" />
            {tone.charAt(0).toUpperCase() + tone.slice(1)} action
          </div>
        </div>

        {/* RIGHT — Form fields ── */}
        <div className="px-6 py-6">
          {fields.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3"
            >
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center border', tc.badge, tc.border)}>
                <Icon className={cn('w-7 h-7', tc.icon)} />
              </div>
              <p className="text-[15px] font-semibold text-foreground">Ready to confirm</p>
              <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed">
                {description ?? `This action will be recorded in the audit trail and cannot be undone.`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-4">
                Action details
              </p>
              {fields.map((f, fi) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: fi * 0.06 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor={f.name}
                    className="text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground flex items-center gap-1"
                  >
                    {f.label}
                    {f.required && <span className="text-red">*</span>}
                  </Label>

                  {f.type === 'select' && (
                    <Select
                      value={values[f.name] ?? ''}
                      onValueChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                    >
                      <SelectTrigger id={f.name} className="h-10 text-[12px] rounded-xl">
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
                      onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                      className="text-[12px] resize-none rounded-xl leading-relaxed"
                    />
                  )}

                  {f.type === 'input' && (
                    <Input
                      id={f.name}
                      type={f.inputType ?? 'text'}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                      className="h-10 text-[12px] rounded-xl"
                    />
                  )}

                  {errors[f.name] && (
                    <p className="text-[11px] text-red font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors[f.name]}
                    </p>
                  )}
                </motion.div>
              ))}
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
  Send: Send,
  Email: Mail,
  Note: FileText,
  Sparkles,
}

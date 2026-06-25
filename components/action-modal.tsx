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
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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

/**
 * ActionModal — single primitive used across the app for any high-impact
 * action that needs confirmation: Escalate, Approve, Reject, Reassign,
 * Send Nudge, Acknowledge, Request Update, Mark Complete, Reopen, etc.
 *
 * Pattern is consistent: contextual header (severity-tinted icon + title),
 * read-only context block (so the user sees what they're acting on),
 * editable form fields (recipient/severity/message — only those provided),
 * async confirm with spinner, success toast via sonner.
 */

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
  /** Read-only context rows shown above the form — "you are acting on …" */
  context?: Array<{ label: string; value: React.ReactNode }>
  fields?: ActionField[]
  confirmLabel?: string
  cancelLabel?: string
  /** Toast string shown after a successful confirm */
  successToast?: string
  successDescription?: string
  /** Async handler — receives { [field.name]: value }. Resolves when done. */
  onConfirm?: (values: Record<string, string>) => void | Promise<void>
}

const toneStyles: Record<ActionTone, { ring: string; bg: string; icon: string; button: string }> = {
  primary: {
    ring: 'ring-navy/20 dark:ring-gold/30',
    bg: 'bg-navy/10 dark:bg-gold/15',
    icon: 'text-navy dark:text-gold',
    button: 'bg-navy hover:bg-navy/90 text-white dark:bg-gold dark:hover:bg-gold/90 dark:text-navy',
  },
  success: {
    ring: 'ring-green/20',
    bg: 'bg-green/15',
    icon: 'text-green',
    button: 'bg-green hover:bg-green/90 text-white',
  },
  warning: {
    ring: 'ring-amber/20',
    bg: 'bg-amber/15',
    icon: 'text-amber',
    button: 'bg-amber hover:bg-amber/90 text-navy',
  },
  destructive: {
    ring: 'ring-red/20',
    bg: 'bg-red/15',
    icon: 'text-red',
    button: 'bg-red hover:bg-red/90 text-white',
  },
  info: {
    ring: 'ring-teal/20',
    bg: 'bg-teal/15',
    icon: 'text-teal',
    button: 'bg-teal hover:bg-teal/90 text-white',
  },
}

const toneToToastIcon: Record<ActionTone, React.ComponentType<{ className?: string }>> = {
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

  // Reset state whenever the dialog opens with new props
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
  }, [open, fields])

  const styles = toneStyles[tone]
  const ToastIcon = toneToToastIcon[tone]

  const handleConfirm = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        newErrors[f.name] = `${f.label} is required`
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setIsSubmitting(true)
    try {
      // Simulate realistic round-trip if no handler provided
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

  return (
    <Dialog open={open} onOpenChange={(o) => !isSubmitting && onOpenChange(o)}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-card border-line">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ring-4',
                      styles.bg,
                      styles.ring,
                    )}
                  >
                    <Icon className={cn('w-5 h-5', styles.icon)} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                      {title}
                    </DialogTitle>
                    {description && (
                      <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {description}
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 pb-5 space-y-4">
                {/* Read-only context block */}
                {context && context.length > 0 && (
                  <div className="rounded-lg border border-line bg-secondary/50 dark:bg-secondary/30 p-3">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {context.map((row, i) => (
                        <div key={i} className={cn(context.length === 1 && 'col-span-2')}>
                          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            {row.label}
                          </dt>
                          <dd className="text-xs text-foreground font-mono mt-0.5 truncate">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Editable form fields */}
                {fields.length > 0 && (
                  <div className="space-y-3.5">
                    {fields.map((f) => (
                      <div key={f.name} className="space-y-1.5">
                        <Label htmlFor={f.name} className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                          {f.label}
                          {f.required && <span className="text-red ml-1">*</span>}
                        </Label>
                        {f.type === 'select' && (
                          <Select
                            value={values[f.name] ?? ''}
                            onValueChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                          >
                            <SelectTrigger id={f.name} className="h-10 text-sm">
                              <SelectValue placeholder={f.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {f.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div>
                                    <div className="text-sm">{opt.label}</div>
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
                            rows={f.rows ?? 3}
                            value={values[f.name] ?? ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                            className="text-sm resize-none"
                          />
                        )}
                        {f.type === 'input' && (
                          <Input
                            id={f.name}
                            type={f.inputType ?? 'text'}
                            placeholder={f.placeholder}
                            value={values[f.name] ?? ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                            className="h-10 text-sm"
                          />
                        )}
                        {errors[f.name] && (
                          <p className="text-[11px] text-red font-medium">{errors[f.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-secondary/30 dark:bg-secondary/20 border-t border-line flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="h-9"
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={cn('h-9 min-w-[110px]', styles.button)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    confirmLabel
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// Convenience icon re-exports so pages don't need to import lucide separately
// when using the modal as a quick stub.
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

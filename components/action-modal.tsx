'use client'

import * as React from 'react'
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

/**
 * ActionModal — rewritten to use PagePanel so the sidebar and header
 * remain visible. The form slides in as a right-side panel within the
 * main content area instead of opening as an overlay Dialog.
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
  context?: Array<{ label: string; value: React.ReactNode }>
  fields?: ActionField[]
  confirmLabel?: string
  cancelLabel?: string
  successToast?: string
  successDescription?: string
  onConfirm?: (values: Record<string, string>) => void | Promise<void>
}

const toneStyles: Record<ActionTone, { ring: string; bg: string; icon: string; button: string; accent: string }> = {
  primary: {
    ring: 'ring-2 ring-navy/15 dark:ring-gold/25',
    bg: 'bg-navy/8 dark:bg-gold/10',
    icon: 'text-navy dark:text-gold',
    button: 'bg-navy hover:bg-navy/90 text-white dark:bg-gold dark:hover:bg-gold/90 dark:text-navy',
    accent: 'border-l-navy dark:border-l-gold',
  },
  success: {
    ring: 'ring-2 ring-green/15',
    bg: 'bg-green/8',
    icon: 'text-green',
    button: 'bg-green hover:bg-green/90 text-white',
    accent: 'border-l-green',
  },
  warning: {
    ring: 'ring-2 ring-amber/15',
    bg: 'bg-amber/8',
    icon: 'text-amber',
    button: 'bg-amber hover:bg-amber/90 text-navy',
    accent: 'border-l-amber',
  },
  destructive: {
    ring: 'ring-2 ring-red/15',
    bg: 'bg-red/8',
    icon: 'text-red',
    button: 'bg-red hover:bg-red/90 text-white',
    accent: 'border-l-red',
  },
  info: {
    ring: 'ring-2 ring-teal/15',
    bg: 'bg-teal/8',
    icon: 'text-teal',
    button: 'bg-teal hover:bg-teal/90 text-white',
    accent: 'border-l-teal',
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

  const styles = toneStyles[tone]
  const ToastIcon = toneToToastIcon[tone]

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
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
        className="h-9 px-5 border-line"
      >
        {cancelLabel}
      </Button>
      <Button
        size="sm"
        onClick={handleConfirm}
        disabled={isSubmitting}
        className={cn('h-9 min-w-[120px]', styles.button)}
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
  )

  return (
    <PagePanel
      open={open}
      onClose={() => !isSubmitting && onOpenChange(false)}
      title={title}
      description={description}
      footer={footer}
      widthClass="max-w-[500px]"
    >
      <div className="px-5 sm:px-6 py-5 space-y-5">
        {/* Tone-accented identity row */}
        <div className={cn('flex items-center gap-3 p-3.5 rounded-xl border border-line', styles.bg)}>
          <div className={cn('shrink-0 w-9 h-9 rounded-lg flex items-center justify-center', styles.ring, styles.bg)}>
            <Icon className={cn('w-4.5 h-4.5', styles.icon)} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-foreground leading-snug">{title}</p>
            {description && (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        {/* Read-only context block */}
        {context && context.length > 0 && (
          <div className="rounded-xl border border-line bg-secondary/40 p-4">
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground mb-2.5">
              Acting on
            </p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {context.map((row, i) => (
                <div key={i} className={cn(context.length === 1 && 'col-span-2')}>
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
                    {row.label}
                  </dt>
                  <dd className="text-[12px] text-foreground font-medium truncate">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Editable form fields */}
        {fields.length > 0 && (
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label
                  htmlFor={f.name}
                  className="text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground"
                >
                  {f.label}
                  {f.required && <span className="text-red ml-1">*</span>}
                </Label>

                {f.type === 'select' && (
                  <Select
                    value={values[f.name] ?? ''}
                    onValueChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                  >
                    <SelectTrigger id={f.name} className="h-9 text-[12px]">
                      <SelectValue placeholder={f.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div>
                            <div className="text-[12px]">{opt.label}</div>
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
                    className="text-[12px] resize-none"
                  />
                )}

                {f.type === 'input' && (
                  <Input
                    id={f.name}
                    type={f.inputType ?? 'text'}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    className="h-9 text-[12px]"
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

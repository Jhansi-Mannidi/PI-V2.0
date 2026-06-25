'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, MessageSquareWarning, CheckCircle2, Sparkles } from 'lucide-react'

interface FeedbackContext {
  id: string
  headline: string
  category: string
}

interface RecommendationFeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: FeedbackContext | null
  onSubmit?: (reason: string, details: string) => void
}

const feedbackReasons = [
  {
    value: 'inaccurate',
    label: 'Inaccurate data',
    description: 'The evidence cited was wrong or outdated',
  },
  {
    value: 'wrong-timing',
    label: 'Wrong timing',
    description: 'Correct insight but too early or too late to act on',
  },
  {
    value: 'already-handled',
    label: 'Already handled',
    description: 'We are already doing this or have completed it',
  },
  {
    value: 'not-feasible',
    label: 'Not feasible',
    description: 'Correct insight but cannot execute (cost, resources, contractual)',
  },
  {
    value: 'not-relevant',
    label: 'Not relevant',
    description: 'Does not apply to my role or scope',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'A reason not listed above',
  },
]

export function RecommendationFeedbackModal({
  open,
  onOpenChange,
  context,
  onSubmit,
}: RecommendationFeedbackModalProps) {
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null)
  const [details, setDetails] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedReason(null)
      setDetails('')
      setIsSubmitting(false)
      setSubmitted(false)
    }
  }, [open])

  const handleSubmit = () => {
    if (!selectedReason) return
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit?.(selectedReason, details)
      setIsSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)
    }, 600)
  }

  if (!context) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-line shadow-2xl"
        showCloseButton={false}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 px-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center mb-4 ring-1 ring-green/20"
              >
                <CheckCircle2 className="w-7 h-7 text-green" />
              </motion.div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Feedback submitted
              </h3>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Thank you. The recommendation engine will incorporate your feedback in the next model update.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="bg-navy dark:bg-navy-light px-6 py-4 flex items-center justify-between">
                <DialogHeader className="gap-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                      <MessageSquareWarning className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <DialogTitle className="text-sm font-bold text-white">
                        Feedback &mdash; Help the engine learn
                      </DialogTitle>
                    </div>
                  </div>
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

              {/* Recommendation reference */}
              <div className="px-6 pt-4 pb-2">
                <div className="bg-muted/30 dark:bg-muted/20 rounded-lg p-3 border border-line/50">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-muted-foreground/60 mb-0.5">{context.id} &middot; {context.category}</p>
                      <p className="text-xs font-medium text-foreground leading-snug truncate">{context.headline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-3 space-y-4">
                <p className="text-sm font-medium text-foreground">
                  {"Why wasn't this recommendation helpful?"}
                </p>

                {/* Radio buttons */}
                <div className="space-y-2">
                  {feedbackReasons.map((reason) => (
                    <motion.button
                      key={reason.value}
                      onClick={() => setSelectedReason(reason.value)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all',
                        selectedReason === reason.value
                          ? 'border-gold bg-gold/5 dark:bg-gold/10'
                          : 'border-line/50 hover:border-line hover:bg-muted/20'
                      )}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Custom radio circle */}
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors',
                        selectedReason === reason.value
                          ? 'border-gold'
                          : 'border-muted-foreground/30'
                      )}>
                        <AnimatePresence>
                          {selectedReason === reason.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                              className="w-2 h-2 rounded-full bg-gold"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          'text-xs font-medium transition-colors',
                          selectedReason === reason.value ? 'text-foreground' : 'text-foreground/80'
                        )}>
                          {reason.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Optional text area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Tell us more (optional)
                  </label>
                  <Textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Any additional context that would help improve future recommendations..."
                    className="min-h-[72px] resize-none text-xs"
                  />
                </div>

                {/* Fine print */}
                <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                  Your feedback is used to improve the recommendation model. It is not shared with other users.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-line/30 flex items-center justify-end gap-3 bg-muted/10 dark:bg-muted/5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="px-5 h-9"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  className={cn(
                    'px-5 h-9 font-semibold transition-all',
                    selectedReason
                      ? 'bg-gold hover:bg-gold/90 text-navy'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full"
                    />
                  ) : (
                    'Submit Feedback'
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

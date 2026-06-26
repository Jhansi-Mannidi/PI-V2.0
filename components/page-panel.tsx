'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PagePanel — a full-height slide-over panel that mounts inside the
 * main content column (NOT as a Dialog/portal overlay). This keeps the
 * sidebar and topbar fully visible at all times, exactly matching the
 * design shown in the mockup.
 *
 * Usage:
 *   <PagePanel open={open} onClose={() => setOpen(false)} title="New Risk Entry" description="…">
 *     {children}
 *   </PagePanel>
 */
export interface PagePanelProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  /** Footer content (action buttons). Rendered in the sticky footer bar. */
  footer?: React.ReactNode
  /** Width class, default 'max-w-[560px]' */
  widthClass?: string
}

export function PagePanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  widthClass = 'max-w-[560px]',
}: PagePanelProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  React.useEffect(() => {
    if (!open) return
    // Find the main scroll container and lock it
    const main = document.querySelector('main')
    if (main) {
      main.style.overflow = 'hidden'
      return () => { main.style.overflow = '' }
    }
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  // Mount inside the main content element so the sidebar/header stay visible
  const container = document.querySelector('main') ?? document.body

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim — only covers the main content area */}
          <motion.div
            key="scrim"
            className="absolute inset-0 z-40 bg-background/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute inset-y-0 right-0 z-50 flex flex-col w-full bg-card border-l border-line shadow-2xl overflow-hidden',
              widthClass,
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 px-5 sm:px-6 py-4 sm:py-5 border-b border-line bg-card shrink-0">
              <button
                onClick={onClose}
                className="mt-0.5 shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
                aria-label="Close panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground leading-snug tracking-[-0.01em]">
                  {title}
                </h2>
                {description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="shrink-0 border-t border-line bg-card px-5 sm:px-6 py-3.5">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    container,
  )
}

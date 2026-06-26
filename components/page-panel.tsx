'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PagePanel — slides in from the right edge of the viewport, below the
 * topbar. The sidebar and header remain fully visible at all times.
 *
 * Layout:
 *  - Scrim covers: left-0 lg:left-[264px], top-12 sm:top-14, bottom-0
 *  - Panel: fixed right-0, top-12 sm:top-14, bottom-0, w-[520px] max
 *  - Portals to document.body so it's above the page scroll container
 */
export interface PagePanelProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** Width — defaults to 520px on desktop, full width on mobile */
  width?: number
}

export function PagePanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 520,
}: PagePanelProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  // Prevent body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim — only covers the content area (not sidebar, not topbar) */}
          <motion.div
            key="scrim"
            aria-hidden="true"
            className={cn(
              'fixed z-40',
              // Top: below topbar
              'top-12 sm:top-14',
              // Bottom: full
              'bottom-0',
              // Left: starts after sidebar on desktop, full on mobile
              'left-0 lg:left-[264px]',
              'right-0',
              'bg-foreground/20 backdrop-blur-[2px]',
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="page-panel-title"
            style={{ width: `min(${width}px, 100vw)` }}
            className={cn(
              'fixed z-50 flex flex-col',
              // Positioned below topbar, flush to right and bottom
              'top-12 sm:top-14 right-0 bottom-0',
              'bg-card border-l border-line shadow-2xl',
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.8 }}
          >
            {/* Panel header */}
            <div className="flex items-start gap-3 px-5 sm:px-6 py-4 border-b border-line bg-card shrink-0">
              <button
                onClick={onClose}
                className="mt-0.5 shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-secondary hover:bg-line text-muted-foreground transition-colors"
                aria-label="Close panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2
                  id="page-panel-title"
                  className="text-sm font-semibold text-foreground leading-snug tracking-[-0.01em]"
                >
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
    document.body,
  )
}

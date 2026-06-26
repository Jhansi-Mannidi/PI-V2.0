'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PagePanel — full-body inline panel that replaces the main content area.
 *
 * Renders as an absolute-positioned layer over <main> (which carries
 * position:relative overflow:hidden). The sidebar and topbar are never
 * touched — only the content area slides.  No portal, no fixed positioning,
 * no backdrop that covers the shell chrome.
 */
export interface PagePanelProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** unused — kept for API compat */
  widthClass?: string
  width?: number
}

export function PagePanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: PagePanelProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="page-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pp-title"
          className={cn(
            // Covers only the content area (right of sidebar, below topbar)
            // using fixed positioning anchored via CSS env vars / known dimensions
            'fixed z-30',
            'top-12 sm:top-14',       // below topbar
            'bottom-0',
            'left-0 lg:left-[264px]', // right of sidebar on desktop
            'right-0',
            'flex flex-col',
            'bg-background',
          )}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.7 }}
        >
          {/* ── Topbar ── */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-line bg-card">
            <button
              onClick={onClose}
              className="shrink-0 flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[11px] font-medium">Back</span>
            </button>
            <div className="w-px h-4 bg-line" />
            <div className="flex-1 min-w-0">
              <h2 id="pp-title" className="text-[13px] font-semibold text-foreground leading-tight">
                {title}
              </h2>
              {description && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-secondary hover:bg-line text-muted-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* ── Footer ── */}
          {footer && (
            <div className="shrink-0 border-t border-line bg-card px-6 py-4">
              {footer}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

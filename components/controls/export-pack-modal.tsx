'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { PagePanel } from '@/components/page-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Download, FileText, Users, CheckCircle2, Package,
  FileJson, Zap, Lock, Calendar, FileStack,
} from 'lucide-react'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const PACK_OPTIONS = [
  {
    id: 'leadership',
    title: 'Leadership Summary',
    description: 'Executive overview with key metrics and compliance posture',
    icon: Users,
    tone: 'gold' as const,
    features: ['Compliance score', 'Open gaps', 'Key risks', 'Timeline'],
  },
  {
    id: 'audit',
    title: 'Audit-Ready Evidence',
    description: 'Complete control documentation with test results and evidence',
    icon: FileText,
    tone: 'green' as const,
    features: ['All controls', 'Test evidence', 'Certifications', 'Audit trail'],
  },
  {
    id: 'controls',
    title: 'Controls Team Worklist',
    description: 'Prioritized action items for the controls team to remediate',
    icon: CheckCircle2,
    tone: 'teal' as const,
    features: ['Gaps & findings', 'Owners & dates', 'Risk ranking', 'Actions'],
  },
]

const FORMAT_OPTIONS = [
  { value: 'markdown', label: 'Markdown (.md)', icon: FileJson, desc: 'GitHub-flavored, formatted nicely' },
  { value: 'pdf', label: 'PDF', icon: FileStack, desc: 'Print-ready compliance document' },
  { value: 'excel', label: 'Excel (.xlsx)', icon: Package, desc: 'Spreadsheet with live data links' },
]

interface ExportPackModalProps {
  open: boolean
  onClose: () => void
  onExport?: (packType: string, format: string) => void
}

export function ExportPackModal({ open, onClose, onExport }: ExportPackModalProps) {
  const [selected, setSelected] = React.useState<string>('leadership')
  const [format, setFormat] = React.useState<string>('markdown')
  const [exporting, setExporting] = React.useState(false)

  const selectedPack = PACK_OPTIONS.find((p) => p.id === selected)!
  const toneMap: Record<string, { bg: string; text: string; border: string }> = {
    gold: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/25' },
    green: { bg: 'bg-green/8', text: 'text-green', border: 'border-green/25' },
    teal: { bg: 'bg-teal/10', text: 'text-teal', border: 'border-teal/25' },
  }
  const tone = toneMap[selectedPack.tone]

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      onExport?.(selected, format)
      setExporting(false)
      onClose()
    }, 1200)
  }

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-gold" />
        Data is encrypted and generated locally. Not stored on servers.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="h-9 px-5 border-line text-[12px]" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={exporting}
          className="h-9 px-6 bg-gold text-navy font-semibold gap-1.5 text-[12px]"
          onClick={handleExport}
        >
          {exporting ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                <Download className="w-3.5 h-3.5" />
              </motion.div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export Pack
            </>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <PagePanel open={open} onClose={onClose} title="Export Compliance Pack" description="Download controls data, test evidence, and compliance documentation." footer={footer}>
      <div className="space-y-6 px-6 py-6">
        {/* Pack Type Selection */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">
            <Package className="w-3 h-3 inline mr-1.5" />
            Choose Export Type
          </label>
          <div className="grid grid-cols-1 gap-2">
            {PACK_OPTIONS.map((pack, idx) => {
              const isSelected = selected === pack.id
              const pkgTone = toneMap[pack.tone]
              return (
                <motion.button
                  key={pack.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => setSelected(pack.id)}
                  className={cn(
                    'p-4 rounded-2xl border-2 transition-all text-left',
                    isSelected ? `${pkgTone.bg} ${pkgTone.border}` : 'bg-secondary border-line hover:border-gold/40',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0 flex-none', pkgTone.bg)}>
                      <pack.icon className={cn('w-5 h-5', pkgTone.text)} />
                    </div>
                    <div>
                      <p className={cn('text-sm font-bold', isSelected ? pkgTone.text : 'text-foreground')}>{pack.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pack.description}</p>
                      {isSelected && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1 mt-2">
                          {pack.features.map((f) => (
                            <span key={f} className={cn('inline-block px-2 py-1 rounded-md text-[9px] font-semibold', pkgTone.bg, pkgTone.text)}>
                              {f}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">
            <Zap className="w-3 h-3 inline mr-1.5" />
            File Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FORMAT_OPTIONS.map((fmt, idx) => (
              <motion.button
                key={fmt.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + PACK_OPTIONS.length) * 0.06 }}
                onClick={() => setFormat(fmt.value)}
                className={cn(
                  'p-3 rounded-xl border transition-all text-center',
                  format === fmt.value
                    ? 'bg-gold/15 border-gold/40 shadow-sm'
                    : 'bg-secondary border-line hover:border-gold/40',
                )}
              >
                <fmt.icon className={cn('w-5 h-5 mx-auto mb-1', format === fmt.value ? 'text-gold' : 'text-muted-foreground')} />
                <p className={cn('text-[10px] font-bold', format === fmt.value ? 'text-gold' : 'text-foreground')}>{fmt.label}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{fmt.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn('rounded-2xl border p-4', tone.bg, tone.border)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">What's Included</p>
          <ul className="text-[12px] text-foreground space-y-1">
            {selectedPack.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className={cn('w-3.5 h-3.5 shrink-0', tone.text)} />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-line bg-secondary p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Data as of
          </p>
          <p className="text-[13px] font-mono text-foreground">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>
      </div>
    </PagePanel>
  )
}

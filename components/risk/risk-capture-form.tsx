'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Zap } from 'lucide-react'
import {
  PI_MATRIX, BAND_META, CATEGORIES_ALL, OWNER_ROLES, PROGRAMS,
  type Tier,
} from '@/lib/risk-data'

const PROB_ANCHORS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const IMPACT_ANCHORS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']

// M-RISK-01 Quick-capture form (§3.1)
export function RiskCaptureForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast()
  const [tier, setTier] = React.useState<Tier>('Project')
  const [title, setTitle] = React.useState('')
  const [program, setProgram] = React.useState<string>('NA-West')
  const [category, setCategory] = React.useState<string>('Cost')
  const [prob, setProb] = React.useState(3)
  const [impact, setImpact] = React.useState(3)
  const [cost, setCost] = React.useState('')
  const [days, setDays] = React.useState('')
  const [owner, setOwner] = React.useState<string>(OWNER_ROLES[0])

  const band = PI_MATRIX[prob - 1][impact - 1]

  const submit = () => {
    toast({
      title: 'Risk captured',
      description: `Now visible on the ${program} heatmap and rolled into program & portfolio exposure. A single RAISED event was written to the log.`,
    })
    // reset
    setTitle(''); setCost(''); setDays(''); setProb(3); setImpact(3)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-5 pt-5 pb-3.5 border-b border-line">
          <DialogTitle className="text-[14px] font-semibold tracking-[-0.015em]">New Risk Entry</DialogTitle>
          <DialogDescription className="text-[10.5px] leading-relaxed text-muted-foreground">
            Capture a portfolio risk with scope, scoring, impact, and owner details for register tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          {/* Tier */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Scope level</label>
            <div className="flex gap-1.5 mt-1.5">
              {(['Project', 'Program', 'Portfolio'] as Tier[]).map((t) => (
                <button key={t} onClick={() => setTier(t)} className={cn('flex-1 h-7 rounded-lg text-[10.5px] font-semibold transition-all', tier === t ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground')}>{t}</button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Risk summary</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: GC tender pricing exceeds approved guardrail" className="w-full mt-1.5 h-8 px-3 text-[11.5px] border border-line rounded-lg bg-secondary/40 placeholder:text-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-gold" />
          </div>

          {/* Program + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Program</label>
              <select value={program} onChange={(e) => setProgram(e.target.value)} className="w-full mt-1.5 h-8 px-2.5 text-[11.5px] border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-gold">
                {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1.5 h-8 px-2.5 text-[11.5px] border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-gold">
                {CATEGORIES_ALL.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Probability chips */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Probability rating · {PROB_ANCHORS[prob - 1]}</label>
            <div className="flex gap-1.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setProb(n)} title={PROB_ANCHORS[n - 1]} className={cn('flex-1 h-[30px] rounded-lg text-[11.5px] font-mono font-bold transition-all', prob === n ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground')}>{n}</button>
              ))}
            </div>
          </div>

          {/* Impact chips */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Impact rating · {IMPACT_ANCHORS[impact - 1]}</label>
            <div className="flex gap-1.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setImpact(n)} title={IMPACT_ANCHORS[n - 1]} className={cn('flex-1 h-[30px] rounded-lg text-[11.5px] font-mono font-bold transition-all', impact === n ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground')}>{n}</button>
              ))}
            </div>
          </div>

          {/* Live band preview */}
          <div className={cn('flex items-center justify-between rounded-lg border px-3 py-2', BAND_META[band].ring, BAND_META[band].bg)}>
            <span className="text-[10px] text-muted-foreground">Score basis: P{prob} x I{impact}</span>
            <span className={cn('text-[11.5px] font-bold', BAND_META[band].text)}>{band}</span>
          </div>

          {/* Quantified impact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Exposure ($M)</label>
              <input value={cost} onChange={(e) => setCost(e.target.value)} type="number" placeholder="0.0" className="w-full mt-1.5 h-8 px-3 text-[11.5px] border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Schedule impact</label>
              <input value={days} onChange={(e) => setDays(e.target.value)} type="number" placeholder="0" className="w-full mt-1.5 h-8 px-3 text-[11.5px] border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
          </div>

          {/* Owner role */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.16em]">Risk owner</label>
            <select value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full mt-1.5 h-8 px-2.5 text-[11.5px] border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-gold">
              {OWNER_ROLES.map((o) => <option key={o}>{o}</option>)}
            </select>
            <p className="text-[9px] text-muted-foreground mt-1">Use a service role so ownership remains clear across staffing changes.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3.5 border-t border-line bg-muted/20">
          <Button variant="outline" onClick={onClose} className="flex-1 h-8 text-[11px] border-line">Cancel</Button>
          <Button onClick={submit} disabled={!title.trim()} className="flex-1 h-8 text-[11px] gap-1.5 bg-gold text-navy font-semibold disabled:opacity-50">
            <Zap className="w-3 h-3" /> Create risk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { PagePanel } from '@/components/page-panel'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Zap } from 'lucide-react'
import {
  PI_MATRIX, BAND_META, CATEGORIES_ALL, OWNER_ROLES, PROGRAMS,
  type Tier,
} from '@/lib/risk-data'

const PROB_ANCHORS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const IMPACT_ANCHORS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']

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
      description: `Now visible on the ${program} heatmap and rolled into program & portfolio exposure.`,
    })
    setTitle(''); setCost(''); setDays(''); setProb(3); setImpact(3)
    onClose()
  }

  const footer = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={onClose} className="flex-1 h-9 text-[12px] border-line">
        Cancel
      </Button>
      <Button
        onClick={submit}
        disabled={!title.trim()}
        className="flex-1 h-9 text-[12px] gap-1.5 bg-gold text-navy font-semibold disabled:opacity-50"
      >
        <Zap className="w-3.5 h-3.5" />
        Create risk
      </Button>
    </div>
  )

  return (
    <PagePanel
      open={open}
      onClose={onClose}
      title="New Risk Entry"
      description="Capture a portfolio risk with scope, scoring, impact, and owner details for register tracking."
      footer={footer}
    >
      <div className="space-y-5 px-5 sm:px-6 py-5">
        {/* Scope level */}
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Scope level
          </label>
          <div className="flex gap-2 mt-2">
            {(['Project', 'Program', 'Portfolio'] as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  'flex-1 h-8 rounded-lg text-[11.5px] font-semibold transition-all border',
                  tier === t
                    ? 'bg-gold text-navy border-gold shadow-sm'
                    : 'bg-secondary text-muted-foreground border-line hover:border-gold/40',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Risk summary */}
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Risk summary
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: GC tender pricing exceeds approved guardrail"
            className="w-full mt-2 h-9 px-3 text-[12px] border border-line rounded-lg bg-background placeholder:text-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
          />
        </div>

        {/* Program + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
              Program
            </label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full mt-2 h-9 px-2.5 text-[12px] border border-line rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            >
              {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-2 h-9 px-2.5 text-[12px] border border-line rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            >
              {CATEGORIES_ALL.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Probability */}
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Probability rating · <span className="text-foreground">{PROB_ANCHORS[prob - 1]}</span>
          </label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setProb(n)}
                title={PROB_ANCHORS[n - 1]}
                className={cn(
                  'flex-1 h-9 rounded-lg text-[13px] font-mono font-bold transition-all border',
                  prob === n
                    ? 'bg-gold text-navy border-gold shadow-sm'
                    : 'bg-secondary text-muted-foreground border-line hover:border-gold/40',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Impact rating · <span className="text-foreground">{IMPACT_ANCHORS[impact - 1]}</span>
          </label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setImpact(n)}
                title={IMPACT_ANCHORS[n - 1]}
                className={cn(
                  'flex-1 h-9 rounded-lg text-[13px] font-mono font-bold transition-all border',
                  impact === n
                    ? 'bg-gold text-navy border-gold shadow-sm'
                    : 'bg-secondary text-muted-foreground border-line hover:border-gold/40',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Live band */}
        <div
          className={cn(
            'flex items-center justify-between rounded-lg border px-3 py-2.5',
            BAND_META[band].ring,
            BAND_META[band].bg,
          )}
        >
          <span className="text-[11px] text-muted-foreground">
            Score basis: P{prob} x I{impact}
          </span>
          <span className={cn('text-[12px] font-bold', BAND_META[band].text)}>{band}</span>
        </div>

        {/* Quantified impact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
              Exposure ($M)
            </label>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              placeholder="0.0"
              className="w-full mt-2 h-9 px-3 text-[12px] border border-line rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
              Schedule impact
            </label>
            <input
              value={days}
              onChange={(e) => setDays(e.target.value)}
              type="number"
              placeholder="0"
              className="w-full mt-2 h-9 px-3 text-[12px] border border-line rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
        </div>

        {/* Owner */}
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
            Risk owner
          </label>
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full mt-2 h-9 px-2.5 text-[12px] border border-line rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
          >
            {OWNER_ROLES.map((o) => <option key={o}>{o}</option>)}
          </select>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
            Use a service role so ownership remains clear across staffing changes.
          </p>
        </div>
      </div>
    </PagePanel>
  )
}

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Zap } from 'lucide-react'
import {
  PI_MATRIX, BAND_META, CATEGORIES_ALL, OWNER_ROLES, PROGRAMS,
  type Tier,
} from '@/lib/risk-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const PROB_ANCHORS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const IMPACT_ANCHORS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']

export default function RiskCapturePage() {
  const router = useRouter()
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

  const handleSubmit = () => {
    toast({
      title: 'Risk captured',
      description: `Now visible on the ${program} heatmap and rolled into program & portfolio exposure. A single RAISED event was written to the log.`,
    })
    // Redirect back to risk page after success
    router.push('/risk')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/risk">
                <button className="h-9 w-9 rounded-lg border border-line flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-foreground">New Risk Entry</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Capture a portfolio risk with scope, scoring, impact, and owner details for register tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="space-y-6">
          {/* Tier */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Scope level</label>
            <div className="flex gap-2">
              {(['Project', 'Program', 'Portfolio'] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={cn(
                    'flex-1 h-9 rounded-lg text-sm font-semibold transition-all',
                    tier === t ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Risk summary</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: GC tender pricing exceeds approved guardrail"
              className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
          </div>

          {/* Program + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Program</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              >
                {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              >
                {CATEGORIES_ALL.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Probability chips */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">
              Probability rating · {PROB_ANCHORS[prob - 1]}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setProb(n)}
                  title={PROB_ANCHORS[n - 1]}
                  className={cn(
                    'flex-1 h-10 rounded-lg text-sm font-mono font-bold transition-all',
                    prob === n ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Impact chips */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">
              Impact rating · {IMPACT_ANCHORS[impact - 1]}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setImpact(n)}
                  title={IMPACT_ANCHORS[n - 1]}
                  className={cn(
                    'flex-1 h-10 rounded-lg text-sm font-mono font-bold transition-all',
                    impact === n ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Live band preview */}
          <div className={cn('flex items-center justify-between rounded-lg border px-4 py-3', BAND_META[band].ring, BAND_META[band].bg)}>
            <span className="text-xs text-muted-foreground">Score basis: P{prob} x I{impact}</span>
            <span className={cn('text-sm font-bold', BAND_META[band].text)}>{band}</span>
          </div>

          {/* Quantified impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Exposure ($M)</label>
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                type="number"
                placeholder="0.0"
                className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Schedule impact</label>
              <input
                value={days}
                onChange={(e) => setDays(e.target.value)}
                type="number"
                placeholder="0"
                className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>

          {/* Owner role */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.16em]">Risk owner</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-line rounded-lg bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            >
              {OWNER_ROLES.map((o) => <option key={o}>{o}</option>)}
            </select>
            <p className="text-xs text-muted-foreground mt-1.5">Use a service role so ownership remains clear across staffing changes.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-line">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-10 text-sm border-line"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 h-10 text-sm gap-2 bg-gold text-navy font-semibold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              Create risk
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PagePanel } from '@/components/page-panel'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Zap,
  AlertTriangle,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  ShieldCheck,
  Info,
} from 'lucide-react'
import {
  PI_MATRIX, BAND_META, CATEGORIES_ALL, OWNER_ROLES, PROGRAMS,
  type Tier,
} from '@/lib/risk-data'

const PROB_ANCHORS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const IMPACT_ANCHORS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']

const PROB_DESCRIPTIONS = [
  'Extremely unlikely — no precedent',
  'Low probability — historical outlier',
  'Could occur — some conditions present',
  'Likely to occur — conditions exist',
  'Expected to occur — near certainty',
]
const IMPACT_DESCRIPTIONS = [
  'Negligible cost / schedule effect',
  'Minor deviation, manageable locally',
  'Moderate — PM-level response needed',
  'Significant — escalation required',
  'Severe — portfolio-level impact',
]

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
  const [description, setDescription] = React.useState('')
  const [targetDate, setTargetDate] = React.useState('')

  const band = PI_MATRIX[prob - 1][impact - 1]
  const meta = BAND_META[band]
  const score = prob * impact

  const reset = () => {
    setTitle(''); setDescription(''); setCost(''); setDays('')
    setProb(3); setImpact(3); setTargetDate('')
  }

  const submit = () => {
    toast({
      title: 'Risk captured',
      description: `Now visible on the ${program} heatmap and rolled into program & portfolio exposure.`,
    })
    reset()
    onClose()
  }

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-gold" />
        <span>Risk will be scored automatically and appear on the heatmap immediately.</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" onClick={() => { reset(); onClose() }} className="h-9 px-5 border-line text-[12px]">
          Cancel
        </Button>
        <Button
          onClick={submit}
          disabled={!title.trim()}
          className="h-9 px-6 text-[12px] gap-1.5 bg-gold text-navy font-semibold disabled:opacity-40 shadow-sm hover:bg-gold/90"
        >
          <Zap className="w-3.5 h-3.5" />
          Create risk
        </Button>
      </div>
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
      <div className="h-full">
        {/* Hero band — colour-coded by current risk score */}
        <motion.div
          key={band}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'px-6 py-4 border-b border-line flex items-center justify-between gap-6',
            meta.bg,
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', meta.ring, meta.bg)}>
              <AlertTriangle className={cn('w-5 h-5', meta.text)} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Live Score Preview</p>
              <p className={cn('text-[22px] font-bold leading-none', meta.text)}>
                {score} <span className="text-[13px] font-semibold">/ 25</span>
              </p>
            </div>
          </div>
          <div className={cn('px-4 py-2 rounded-xl border text-center', meta.ring, meta.bg)}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">Rating band</p>
            <p className={cn('text-[15px] font-bold', meta.text)}>{band}</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="text-center">
              <p className="font-semibold text-foreground">{PROB_ANCHORS[prob - 1]}</p>
              <p>Probability P{prob}</p>
            </div>
            <div className="w-px h-8 bg-line" />
            <div className="text-center">
              <p className="font-semibold text-foreground">{IMPACT_ANCHORS[impact - 1]}</p>
              <p>Impact I{impact}</p>
            </div>
          </div>
        </motion.div>

        {/* 2-column body */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 divide-y xl:divide-y-0 xl:divide-x divide-line">

          {/* ── LEFT column — Identity + Scoring ── */}
          <div className="px-6 py-6 space-y-6">

            {/* Scope level */}
            <section>
              <FieldLabel icon={BarChart3}>Scope level</FieldLabel>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['Project', 'Program', 'Portfolio'] as Tier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={cn(
                      'py-2.5 rounded-xl text-[12px] font-semibold transition-all border',
                      tier === t
                        ? 'bg-navy text-white border-navy shadow-md dark:bg-gold dark:text-navy dark:border-gold'
                        : 'bg-secondary text-muted-foreground border-line hover:border-gold/50 hover:text-foreground',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* Risk summary */}
            <section>
              <FieldLabel icon={AlertTriangle} required>Risk summary</FieldLabel>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GC tender pricing exceeds approved guardrail"
                className="w-full mt-2 h-10 px-3.5 text-[13px] border border-line rounded-xl bg-background placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
              />
            </section>

            {/* Description */}
            <section>
              <FieldLabel icon={Info}>Description <span className="text-muted-foreground font-normal normal-case text-[10px]">(optional)</span></FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide context, triggers, and dependencies…"
                className="w-full mt-2 px-3.5 py-2.5 text-[12px] border border-line rounded-xl bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all resize-none leading-relaxed"
              />
            </section>

            {/* Program + Category */}
            <section>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel icon={BarChart3}>Program</FieldLabel>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                  >
                    {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel icon={BarChart3}>Category</FieldLabel>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                  >
                    {CATEGORIES_ALL.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Owner + Target date */}
            <section>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel icon={Users}>Risk owner</FieldLabel>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                  >
                    {OWNER_ROLES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">Use a service role so ownership is clear across staffing changes.</p>
                </div>
                <div>
                  <FieldLabel icon={Calendar}>Target date</FieldLabel>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full mt-2 h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT column — Scoring matrix + Quantified impact ── */}
          <div className="px-6 py-6 space-y-6">

            {/* Probability */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel icon={BarChart3}>Probability rating</FieldLabel>
                <span className="text-[11px] font-semibold text-gold">{PROB_ANCHORS[prob - 1]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setProb(n)}
                    title={PROB_ANCHORS[n - 1]}
                    className={cn(
                      'flex flex-col items-center py-2.5 rounded-xl text-[13px] font-bold transition-all border',
                      prob === n
                        ? 'bg-gold text-navy border-gold shadow-md scale-105'
                        : 'bg-secondary text-muted-foreground border-line hover:border-gold/50',
                    )}
                  >
                    {n}
                    <span className="text-[8px] font-normal mt-0.5 leading-none opacity-70">P{n}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{PROB_DESCRIPTIONS[prob - 1]}</p>
            </section>

            {/* Impact */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel icon={BarChart3}>Impact rating</FieldLabel>
                <span className="text-[11px] font-semibold text-gold">{IMPACT_ANCHORS[impact - 1]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setImpact(n)}
                    title={IMPACT_ANCHORS[n - 1]}
                    className={cn(
                      'flex flex-col items-center py-2.5 rounded-xl text-[13px] font-bold transition-all border',
                      impact === n
                        ? 'bg-gold text-navy border-gold shadow-md scale-105'
                        : 'bg-secondary text-muted-foreground border-line hover:border-gold/50',
                    )}
                  >
                    {n}
                    <span className="text-[8px] font-normal mt-0.5 leading-none opacity-70">I{n}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{IMPACT_DESCRIPTIONS[impact - 1]}</p>
            </section>

            {/* Live score card */}
            <motion.section
              key={`${prob}-${impact}`}
              initial={{ scale: 0.98, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn('rounded-2xl border p-4', meta.ring, meta.bg)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Score basis</p>
                  <p className="text-[13px] font-semibold text-foreground mt-0.5">P{prob} × I{impact} = <span className={cn('font-bold', meta.text)}>{score}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Classification</p>
                  <p className={cn('text-[15px] font-bold mt-0.5', meta.text)}>{band}</p>
                </div>
              </div>
              {/* Mini P×I grid preview */}
              <div className="mt-3 grid grid-cols-5 gap-0.5">
                {[5,4,3,2,1].map((p) => (
                  [1,2,3,4,5].map((i) => {
                    const cellBand = PI_MATRIX[p - 1][i - 1]
                    const isActive = p === prob && i === impact
                    return (
                      <div
                        key={`${p}-${i}`}
                        className={cn(
                          'h-4 rounded-sm transition-all',
                          BAND_META[cellBand].bg,
                          isActive && 'ring-2 ring-foreground ring-offset-1 scale-125 z-10',
                        )}
                      />
                    )
                  })
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5">Score recomputes from new events — worsening risk climbs the heatmap automatically.</p>
            </motion.section>

            {/* Quantified impact */}
            <section>
              <FieldLabel icon={DollarSign}>Quantified impact</FieldLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Exposure ($M)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground font-medium">$</span>
                    <input
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      className="w-full h-10 pl-7 pr-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Schedule impact (days)</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">d</span>
                    <input
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full h-10 px-3 text-[12px] border border-line rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </PagePanel>
  )
}

/* ── Shared label helper ── */
function FieldLabel({
  icon: Icon,
  children,
  required,
}: {
  icon: React.ElementType
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">
      <Icon className="w-3 h-3" />
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  )
}

'use client'

import * as React from 'react'
import { use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import { recommendations, hendersonRecommendations, categoryMeta } from '@/lib/recommendation-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Sparkles,
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  Zap,
  Shield,
  Cloud,
  HardHat,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Ban,
  CheckCircle2,
  TrendingUp,
  Clock,
  ChevronRight,
  ExternalLink,
  Send,
  FileText,
  CloudRain,
  Activity,
  GitBranch,
  History,
  MessageSquare,
  X,
} from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  Calendar, DollarSign, AlertTriangle, Users, Zap, Shield, Cloud, HardHat,
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

// Weather-driven detail data for REC-001 (default recommendation)
const weatherSignals = [
  {
    id: 1,
    title: 'Weather',
    borderColor: 'border-l-sky-500',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600 dark:text-sky-400',
    Icon: CloudRain,
    headline: '4-day rain event (85mm cumulative) forecast for Pryor Creek, OK starting May 8',
    source: 'National Weather Service ensemble forecast',
    confidence: 92,
    details: [
      { label: 'Thu May 8', value: '28mm', bar: 70, color: 'bg-sky-500' },
      { label: 'Fri May 9', value: '32mm', bar: 80, color: 'bg-sky-500' },
      { label: 'Sat May 10', value: '18mm', bar: 45, color: 'bg-sky-400' },
      { label: 'Sun May 11', value: '7mm', bar: 18, color: 'bg-sky-300' },
      { label: 'Mon May 12', value: '0mm', bar: 0, color: 'bg-green' },
    ],
  },
  {
    id: 2,
    title: 'Schedule Impact',
    borderColor: 'border-l-teal',
    iconBg: 'bg-teal/10',
    iconColor: 'text-teal',
    Icon: Calendar,
    headline: '2 outdoor critical-path activities scheduled during rain window',
    source: 'Primavera P6, last extract Apr 28 · Schedule version: BL-03',
    confidence: null,
    activities: [
      { id: 'PCR-1140', name: 'Foundation pour', duration: '3 days', type: 'Outdoor', status: 'Cannot proceed in rain', critical: true },
      { id: 'PCR-1142', name: 'Site grading', duration: '2 days', type: 'Outdoor', status: 'Cannot proceed in rain', critical: true },
    ],
  },
  {
    id: 3,
    title: 'Indoor Alternative',
    borderColor: 'border-l-green',
    iconBg: 'bg-green/10',
    iconColor: 'text-green',
    Icon: Activity,
    headline: '2 indoor activities with sufficient float can be pulled forward',
    source: 'P6 float analysis',
    confidence: null,
    activities: [
      { id: 'PCR-1160', name: 'Electrical rough-in', duration: '4 days', type: 'Indoor', status: '6 days of float', critical: false },
      { id: 'PCR-1162', name: 'Conduit installation', duration: '3 days', type: 'Indoor', status: '8 days of float', critical: false },
    ],
  },
  {
    id: 4,
    title: 'Resource Availability',
    borderColor: 'border-l-purple-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500 dark:text-purple-400',
    Icon: Users,
    headline: 'Electrical contractor has crew available for early start',
    source: 'Service Role query + Party Intelligence (workload.concurrent_tasks)',
    confidence: null,
    party: {
      name: 'Acme Electrical',
      crewAvailable: 4,
      currentAssignment: 'Completes Wednesday',
      reliability: 0.88,
      breachRate: '18%',
      breachFlag: 'amber',
    },
  },
  {
    id: 5,
    title: 'Historical Precedent',
    borderColor: 'border-l-navy dark:border-l-blue-400',
    iconBg: 'bg-navy/10 dark:bg-blue-500/10',
    iconColor: 'text-navy dark:text-blue-400',
    Icon: History,
    headline: 'Similar weather reschedule on Atlanta DC-3 saved 4 days and $210K',
    source: 'Orchestration archive, project ODC-ATL-247, instance ORCH-2026-0112',
    confidence: null,
    precedent: {
      date: 'February 2026',
      project: 'Atlanta DC-3',
      event: '3-day ice event',
      action: 'Indoor HVAC work pulled forward',
      result: 'No critical path impact, $210K standby avoided, no quality issues',
    },
  },
]

const suggestedActions = [
  {
    title: 'Reschedule in P6',
    description: 'Creates a schedule change request with pre-filled activity IDs, new dates, and justification. Requires PM approval.',
    buttonLabel: 'Execute',
    icon: Calendar,
    primary: true,
  },
  {
    title: 'Notify Site Team',
    description: 'Drafts a notification to the site superintendent and Acme Electrical foreman with the weather forecast and revised schedule.',
    buttonLabel: 'Send Draft',
    icon: Send,
    primary: false,
  },
  {
    title: 'Create Weather Hold',
    description: 'Creates a Weather Hold orchestration instance that tracks the rain event, monitors for changes, and auto-closes when weather clears.',
    buttonLabel: 'Create',
    icon: FileText,
    primary: false,
  },
]

const reasoningSteps = [
  'STEP 1: External signal scan detected NWS forecast update for Pryor Creek, OK.',
  'STEP 2: Cross-referenced forecast against active project sites in portfolio. Match: ODC-PRD-305.',
  'STEP 3: Retrieved P6 activities scheduled during forecast window (May 8\u201312).',
  'STEP 4: Classified activities by weather sensitivity: 2 outdoor (critical path), 2 indoor (float).',
  'STEP 5: Computed schedule impact: 3-day CP slip if outdoor activities proceed as planned.',
  'STEP 6: Computed cost impact: $180K estimated standby (3 days \u00d7 $60K/day site overhead).',
  'STEP 7: Checked indoor activity resource availability via Service Role query.',
  'STEP 8: Retrieved historical precedent from portfolio archive (1 matching case).',
  'STEP 9: Generated recommendation with 87% confidence.',
  'STEP 10: Confidence factors: weather forecast accuracy (92%), resource availability (confirmed), historical success rate (100% on 1 case \u2014 small sample).',
]

const declineReasons = ['Not feasible', 'Wrong timing', 'Inaccurate data', 'Already handled', 'Other']

export default function RecDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { aiEnabled } = useAI()
  const [feedback, setFeedback] = React.useState<string | undefined>()
  const [actionTaken, setActionTaken] = React.useState<Set<number>>(new Set())
  const [showDecline, setShowDecline] = React.useState(false)
  const [declineReason, setDeclineReason] = React.useState<string | undefined>()
  const [comment, setComment] = React.useState('')
  const [showReasoningFull, setShowReasoningFull] = React.useState(false)

  const allRecs = [...recommendations, ...hendersonRecommendations]
  const rec = allRecs.find(r => r.id === id)

  // Default to REC-001 for the full weather detail view
  const isDefaultWeatherRec = id === 'REC-001'

  if (!aiEnabled || !rec) {
    return (
      <AppShell title="Recommendation Detail" activeHref="/recommendations">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-teal/20">
              <Sparkles className="w-7 h-7 text-teal" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {!aiEnabled ? 'AI Recommendations Disabled' : 'Recommendation Not Found'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {!aiEnabled ? 'Enable AI mode from the header toggle.' : 'The requested recommendation could not be found.'}
            </p>
            <Link href="/recommendations">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
              </Button>
            </Link>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  const meta = categoryMeta[rec.category]
  const IconComp = categoryIcons[meta.icon] || Sparkles

  return (
    <AppShell title={rec.id} subtitle="Recommendation Detail" activeHref="/recommendations">
      <motion.div
        className="space-y-6 max-w-[1000px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Back button + breadcrumb */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="flex items-center gap-2">
          <Link href="/recommendations">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground -ml-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-[11px] text-muted-foreground">{rec.id}</span>
        </motion.div>

        {/* HEADER — Category, Urgency, Confidence, Generated */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1', meta.bgClass, meta.textClass)}>
            <IconComp className="w-3 h-3" />
            {rec.category}
          </span>
          <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full',
            rec.urgency === 'Immediate' ? 'bg-red/15 text-red' : rec.urgency === 'This Week' ? 'bg-amber/15 text-amber' : 'bg-teal/15 text-teal'
          )}>
            {rec.urgency === 'Immediate' ? 'ACT TODAY' : rec.urgency.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50">
            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', rec.confidencePct >= 85 ? 'bg-green' : rec.confidencePct >= 70 ? 'bg-amber' : 'bg-red')}
                initial={{ width: 0 }}
                animate={{ width: `${rec.confidencePct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-foreground">{rec.confidencePct}%</span>
          </div>
          <span className="text-[10px] text-muted-foreground/60 font-mono ml-auto">
            {(() => {
              const mins = Math.floor((Date.now() - new Date(rec.createdAt).getTime()) / 60000)
              const display = mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)}h ago`
              return `${display} \u00b7 A-305 v1.2`
            })()}
          </span>
        </motion.div>

        {/* REGION 1 — Headline & Impact */}
        <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-lg sm:text-xl font-sans font-semibold text-foreground leading-snug mb-4 text-balance">
            {isDefaultWeatherRec
              ? 'Move indoor electrical rough-in forward on Pryor Creek \u2014 4-day rain event starting Thursday will block outdoor foundation work'
              : rec.headline}
          </h1>
          <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isDefaultWeatherRec
                    ? 'Prevents 3-day critical path slip \u00b7 Saves ~$180K in standby costs \u00b7 No additional cost to implement'
                    : rec.impact}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  {rec.affectedProjects.map(p => (
                    <span key={p} className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* REGION 2 — Evidence Panel */}
        <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-teal" />
            Evidence & Signals
            <span className="text-[9px] text-muted-foreground/40 font-mono ml-auto">{isDefaultWeatherRec ? '5 signals' : `${rec.evidence.length} signals`}</span>
          </h2>

          {isDefaultWeatherRec ? (
            <div className="space-y-4">
              {weatherSignals.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={cn('border-l-[3px] rounded-xl bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/40 p-4', signal.borderColor)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', signal.iconBg)}>
                      <signal.Icon className={cn('w-4 h-4', signal.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{`SIGNAL ${signal.id} \u2014 ${signal.title}`}</span>
                        {signal.confidence !== null && (
                          <span className="text-[9px] font-mono text-green px-1.5 py-0.5 rounded bg-green/10">Confidence: {signal.confidence}%</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">{signal.headline}</p>
                    </div>
                  </div>

                  {/* Signal-specific content */}
                  {signal.details && (
                    <div className="ml-11 space-y-1.5 mb-3">
                      {signal.details.map((d, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground w-16 shrink-0 font-mono">{d.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                            <motion.div
                              className={cn('h-full rounded-full', d.color)}
                              initial={{ width: 0 }}
                              animate={{ width: `${d.bar}%` }}
                              transition={{ duration: 0.6, delay: 0.8 + j * 0.1 }}
                            />
                          </div>
                          <span className={cn('text-[10px] font-mono w-10 text-right', d.bar > 0 ? 'text-sky-600 dark:text-sky-400' : 'text-green')}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {signal.activities && (
                    <div className="ml-11 space-y-2 mb-3">
                      {signal.activities.map((act, j) => (
                        <div key={j} className={cn('flex items-center gap-3 p-2.5 rounded-lg',
                          act.critical ? 'bg-red/5 border border-red/10' : 'bg-green/5 border border-green/10'
                        )}>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-16">{act.id}</span>
                          <span className="text-xs font-medium text-foreground flex-1">{act.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{act.duration}</span>
                          <span className={cn('text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0',
                            act.critical ? 'bg-red/10 text-red' : 'bg-green/10 text-green'
                          )}>
                            {act.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {signal.party && (
                    <div className="ml-11 mb-3">
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 border border-line/20 flex-wrap">
                        <div>
                          <span className="text-[9px] text-muted-foreground uppercase block">Contractor</span>
                          <span className="text-xs font-semibold text-foreground">{signal.party.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted-foreground uppercase block">Crew Available</span>
                          <span className="text-xs font-semibold text-foreground">{signal.party.crewAvailable} members</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted-foreground uppercase block">Assignment</span>
                          <span className="text-xs font-semibold text-foreground">{signal.party.currentAssignment}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase block">Reliability</span>
                            <span className="text-xs font-bold text-green">{signal.party.reliability}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase block">SLA Miss Rate</span>
                            <span className="text-xs font-bold text-amber">{signal.party.breachRate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {signal.precedent && (
                    <div className="ml-11 mb-3">
                      <div className="p-3 rounded-lg bg-muted/20 border border-line/20">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold text-foreground">{signal.precedent.project} - {signal.precedent.date}</span>
                        </div>
                        <p className="text-xs text-foreground/80 mb-1">
                          <span className="text-muted-foreground">Event:</span> {signal.precedent.event}
                        </p>
                        <p className="text-xs text-foreground/80 mb-1">
                          <span className="text-muted-foreground">Action:</span> {signal.precedent.action}
                        </p>
                        <p className="text-xs text-green font-medium">
                          <span className="text-muted-foreground font-normal">Result:</span> {signal.precedent.result}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="ml-11 flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40" />
                    <span className="text-[9px] text-muted-foreground/60 font-mono">{signal.source}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback generic evidence for non-default recs */
            <div className="space-y-3">
              {rec.evidence.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="border-l-[3px] border-l-teal rounded-xl bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/40 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0 text-[10px] font-bold">{i + 1}</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{e}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* REGION 3 — Suggested Actions */}
        <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gold" />
            Suggested Actions
          </h2>

          {isDefaultWeatherRec ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={cn(
                    'rounded-xl border p-4 transition-all',
                    actionTaken.has(i)
                      ? 'bg-green/5 border-green/20'
                      : action.primary
                        ? 'bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/30 hover:border-gold/50'
                        : 'bg-card/80 dark:bg-card/60 border-line/40 hover:border-teal/30'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center',
                      actionTaken.has(i) ? 'bg-green/15' : action.primary ? 'bg-gold/15' : 'bg-muted/40'
                    )}>
                      {actionTaken.has(i) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                      ) : (
                        <action.icon className={cn('w-3.5 h-3.5', action.primary ? 'text-gold' : 'text-muted-foreground')} />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-foreground">{action.title}</h4>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{action.description}</p>
                  {!actionTaken.has(i) && (
                    <Button
                      size="sm"
                      onClick={() => setActionTaken(prev => new Set(prev).add(i))}
                      className={cn('w-full h-8 text-[11px] gap-1.5 border',
                        action.primary
                          ? 'border-gold/40 hover:border-gold font-semibold'
                          : 'bg-card border-line/50 text-foreground hover:bg-muted/50'
                      )}
                      style={action.primary ? { backgroundColor: '#FAF6EB', color: '#0B1F3A' } : undefined}
                      variant={action.primary ? 'default' : 'outline'}
                    >
                      {action.buttonLabel}
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                  {actionTaken.has(i) && (
                    <p className="text-[10px] text-green font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Executed successfully
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {rec.suggestedActions.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-all',
                    actionTaken.has(i)
                      ? 'bg-green/5 border-green/20'
                      : 'bg-card/80 dark:bg-card/60 border-line/30 hover:border-teal/30'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {actionTaken.has(i) ? (
                      <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-teal shrink-0" />
                    )}
                    <span className="text-xs text-foreground/80">{a}</span>
                  </div>
                  {!actionTaken.has(i) && (
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-teal/30 text-teal" onClick={() => setActionTaken(prev => new Set(prev).add(i))}>
                      Execute <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* REGION 4 — Full Reasoning Trace */}
        <motion.div custom={5} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/40 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setShowReasoningFull(!showReasoningFull)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-muted-foreground/30" />
              Full Reasoning Trace
              <span className="text-[9px] font-mono text-muted-foreground/40">
                {isDefaultWeatherRec ? '10 steps' : 'agent reasoning'}
              </span>
            </h2>
            <motion.div
              animate={{ rotate: showReasoningFull ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </motion.div>
          </button>
          <AnimatePresence>
            {showReasoningFull && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  {isDefaultWeatherRec ? (
                    <div className="bg-muted/30 dark:bg-secondary/50 rounded-lg p-4 font-mono text-[11px] leading-[1.8] space-y-1 overflow-x-auto">
                      {reasoningSteps.map((step, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            'text-foreground/70',
                            step.includes('confidence') && 'text-teal font-medium',
                            step.includes('cost impact') && 'text-gold font-medium',
                            step.includes('critical path') && 'text-red font-medium',
                          )}
                        >
                          {step}
                        </motion.p>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 dark:bg-secondary/50 rounded-lg p-4 font-mono text-[11px] leading-[1.8]">
                      <p className="text-foreground/70">{rec.reasoning}</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[9px] font-mono text-muted-foreground/50">Source: {rec.source}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* REGION 5 — Feedback & Discussion */}
        <motion.div custom={6} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/40 rounded-xl p-4 space-y-4"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-amber" />
            Feedback & Discussion
          </h2>

          {/* Feedback buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'up', icon: ThumbsUp, label: 'Helpful', activeClass: 'bg-green/15 text-green border-green/30' },
              { key: 'down', icon: ThumbsDown, label: 'Not helpful', activeClass: 'bg-red/15 text-red border-red/30' },
              { key: 'irrelevant', icon: Ban, label: 'Not relevant', activeClass: 'bg-muted text-muted-foreground border-muted' },
              { key: 'comment', icon: MessageSquare, label: 'Add comment', activeClass: 'bg-teal/15 text-teal border-teal/30' },
            ].map(btn => (
              <Button
                key={btn.key}
                variant="outline"
                size="sm"
                onClick={() => setFeedback(feedback === btn.key ? undefined : btn.key)}
                className={cn(
                  'h-8 text-[11px] gap-1.5 transition-all',
                  feedback === btn.key ? btn.activeClass : 'border-line/40 text-muted-foreground hover:text-foreground'
                )}
              >
                <btn.icon className="w-3.5 h-3.5" />
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Decline section */}
          <AnimatePresence>
            {feedback === 'down' && !showDecline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-[11px] text-muted-foreground mb-2">
                  If you decline this recommendation, please tell us why — it helps the engine learn.
                </p>
                <div className="flex flex-wrap gap-2">
                  {declineReasons.map(reason => (
                    <Button
                      key={reason}
                      variant="outline"
                      size="sm"
                      onClick={() => { setDeclineReason(reason); setShowDecline(true) }}
                      className={cn(
                        'h-7 text-[10px] border-line/30',
                        declineReason === reason ? 'bg-red/10 text-red border-red/30' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDecline && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red/5 border border-red/20 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-red">Declined: {declineReason}</span>
                  <button onClick={() => { setShowDecline(false); setDeclineReason(undefined); setFeedback(undefined) }}>
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">Feedback recorded. The engine will incorporate this into future recommendations.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comment thread */}
          <AnimatePresence>
            {feedback === 'comment' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment or note..."
                    className="flex-1 h-9 px-3 text-xs rounded-lg bg-muted/30 border border-line/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-teal/50"
                  />
                  <Button
                    size="sm"
                    className="h-9 text-[11px] bg-teal hover:bg-teal/90 text-white"
                    disabled={!comment.trim()}
                    onClick={() => {
                      if (!comment.trim()) return
                      toast.success('Comment posted', { description: 'Visible to all reviewers' })
                      setComment('')
                    }}
                  >
                    <Send className="w-3 h-3 mr-1" /> Post
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}

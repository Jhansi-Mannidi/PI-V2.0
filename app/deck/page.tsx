'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/app-shell'
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  Database,
  Bot,
  Shield,
  TrendingUp,
  Users,
  Brain,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Network,
} from 'lucide-react'
import { FadeUp, AnimNum } from '@/components/animated-primitives'

/* ── Slide Data ── 7 slides in A10 order */
const slides = [
  { id: 'problem', title: 'Problem' },
  { id: 'discovery', title: 'Discovery' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'capabilities', title: 'Capabilities' },
  { id: 'outcomes', title: 'Outcomes' },
  { id: 'phasing', title: 'Phasing' },
  { id: 'track-record', title: 'Track Record' },
]

/* ── Source System Icons ── */
const sourceSystemLogos = [
  { name: 'e-Builder', abbr: 'eB', color: 'bg-blue-600' },
  { name: 'SAP', abbr: 'SAP', color: 'bg-amber-500' },
  { name: 'Primavera P6', abbr: 'P6', color: 'bg-purple-600' },
  { name: 'Quickbase', abbr: 'QB', color: 'bg-teal-500' },
  { name: 'Buying Hub', abbr: 'BH', color: 'bg-rose-500' },
  { name: 'Buganizer', abbr: 'BZ', color: 'bg-green-600' },
]

/* ── Stakeholders Interviewed ── */
const stakeholders = [
  { name: 'Hasit', initials: 'HP' },
  { name: 'Brian', initials: 'BC' },
  { name: 'Dave', initials: 'DM' },
  { name: 'Sreya', initials: 'SR' },
  { name: 'Alice', initials: 'AK' },
  { name: 'Sarah', initials: 'SK' },
  { name: 'Mike', initials: 'MR' },
  { name: 'Jennifer', initials: 'JM' },
  { name: 'Austin', initials: 'AT' },
  { name: 'Anita', initials: 'AK' },
  { name: 'Marcus', initials: 'MT' },
  { name: 'Jordan', initials: 'JH' },
]

/* ── Capability Domains (A10 exact descriptions) ── */
const capabilityDomains = [
  { title: 'Operational Control', description: 'Orchestration · SLA runtime · task inbox · audit trail', icon: Layers },
  { title: 'Portfolio Intelligence', description: 'Certified KPIs · semantic layer · variance attribution', icon: TrendingUp },
  { title: 'Risk and SLA Horizon', description: 'Predictive ML · quantified $ and schedule impact', icon: Zap },
  { title: 'Party and Supplier Intelligence', description: 'Feature catalog · scorecards · drift indicators', icon: Users },
  { title: 'AI Agent Workforce', description: 'Tier 1/2/3 agents · observability · governance', icon: Bot },
  { title: 'Decision Trace and Context Graph', description: 'Capture-the-why · replay · institutional memory', icon: FileText },
  { title: 'Recommendation Engine', description: 'Weather · supply chain · regulatory · behavioral signals', icon: Brain },
  { title: 'Security, Governance, and Audit', description: 'Dataplex · OAuth passthrough · full audit trail', icon: Shield },
]

/* ── Outcome Metrics (A10 exact labels) ── */
const outcomeMetrics = [
  { metric: 'Hours/month on data stitching', today: '320', phase1: '80', phase2: '20' },
  { metric: 'Days from event to insight', today: '14-30', phase1: '<1', phase2: 'real-time' },
  { metric: 'Variance explained at exec review', today: '~40%', phase1: '90%+', phase2: '95%+' },
  { metric: 'Two-week absence (continuity) test', today: 'fails', phase1: 'passes', phase2: 'passes', todayStatus: 'fail', phase1Status: 'pass', phase2Status: 'pass' },
  { metric: 'Predicted SLA risk with $/days', today: '0', phase1: 'yes', phase2: 'yes' },
  { metric: 'Audit trail reconstruction time', today: '45-90 min', phase1: '<30 sec', phase2: '<30 sec' },
]

/* ── Phasing Data ── */
const phases = [
  {
    id: 'phase1',
    title: 'Phase 1',
    subtitle: 'Core Operating View',
    duration: 'Day 1 – Day 90',
    pricing: 'Fixed scope, fixed price',
    color: 'bg-blue-600',
    items: [
      'Lead Operational View',
      'Task Inbox',
      'Orchestration View',
      'Director Command View',
      'Key-Person Risk',
      'Four agents',
      'Audit trail',
      'Decision-context capture',
    ],
    acceptance: 'Acceptance: two-week absence (continuity) test passes.',
    outcome: 'Operations run without spreadsheets.',
  },
  {
    id: 'phase2',
    title: 'Phase 2',
    subtitle: 'Intelligence Layer',
    duration: 'Day 90 – Day 180',
    pricing: 'Scope-flexible menu',
    color: 'bg-teal',
    items: [
      'Risk Horizon',
      'Variance Explainer',
      'Throughput',
      'Project Health',
      'Program Scorecard',
      'Party Intelligence',
      'Portfolio Chat',
      'Cost Benchmarks',
    ],
    acceptance: 'Customer chooses items.',
    outcome: 'Predictive insights at exec fingertips.',
  },
  {
    id: 'phase3',
    title: 'Phase 3',
    subtitle: 'Recommendations & Planning',
    duration: 'Day 180 – Day 300',
    pricing: 'Scope-flexible menu',
    color: 'bg-gold',
    items: [
      'Recommendation Hub',
      'Project Recommendations',
      'Weekly Digest',
      'External Signals',
      'Annual Planning module',
    ],
    acceptance: 'Retrofit portfolio planning enabled.',
    outcome: 'AI-driven portfolio optimization.',
  },
  {
    id: 'ongoing',
    title: 'Managed Service',
    subtitle: 'Run + Tune + Govern',
    duration: 'Ongoing',
    pricing: 'Subscription',
    color: 'bg-slate-600',
    items: [
      'Platform run',
      'Monitoring',
      'Agent tuning',
      'Semantic-layer governance',
      'Quarterly portfolio review',
    ],
    acceptance: 'SLA-backed uptime and support.',
    outcome: 'Continuous improvement.',
  },
]

/* ── Track Record Logo Pills ── */
const trackRecordLogos = [
  'WORLDZONE',
  'BLUELINE',
  'GLOBAL BANK (anon)',
  'SUPPLY-CHAIN (anon)',
  'PwC',
  'AI/DC (anon)',
]

const industries = [
  {
    title: 'Freight & Logistics',
    description: 'End-to-end Enquiry-to-Cash, Procure-to-Pay, and Order-to-Fulfilment run by AI Agents. Live in WorldZone and Blueline Logistics.',
  },
  {
    title: 'Financial Services',
    description: 'Compliance and reconciliation orchestration with full audit trace. Used by a global bank for cross-border remittance workflows.',
  },
  {
    title: 'Capital Programs',
    description: 'Portfolio Intelligence Platform for Google ODC — this engagement. Live target: 90-day Phase 1.',
  },
]

export default function ExecutiveDeckPage() {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0))

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AppShell title="Executive Deck" subtitle="Brian Review — 20/21 May 2026" activeHref="/deck">
      <div className="space-y-3 sm:space-y-4 w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-bold text-foreground">PIP Executive Deck</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Slide {currentSlide + 1} of {slides.length}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all border',
                currentSlide === idx
                  ? 'bg-blue-600 dark:bg-blue-700 text-white font-semibold border-blue-400'
                  : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground border-line'
              )}
            >
              {slide.title}
            </button>
          ))}
        </div>

        {/* Slide Container */}
        <div className="flex items-center justify-center">
        <div className="w-full max-w-[1200px] aspect-[16/9] sm:aspect-[16/9] bg-card rounded-xl border border-line shadow-md overflow-hidden relative overflow-y-auto">

          {/* ============================================ */}
          {/* Slide 1: THE PROBLEM (NEW)                    */}
          {/* ============================================ */}
          {currentSlide === 0 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">The portfolio has no single source of truth</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">And the workaround is human plumbing</p>
              </div>

              <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col gap-4 sm:gap-5">
                {/* Top stat strip */}
                <div className="bg-gradient-to-r from-blue-600/10 to-gold/10 dark:from-blue-700/20 dark:to-gold/20 rounded-xl border border-blue-600/30 dark:border-gold/30 p-4 sm:p-5">
                  <p className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    $700M+ capital portfolio, growing to $1B+
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    Run today on a manually-stitched dashboard, shared spreadsheets, and individual tribal knowledge — with no system-level awareness of where work is stuck, who owes what, or what is about to fall past SLA.
                  </p>
                </div>

                {/* Two problem cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1">
                  {/* Card A — navy border */}
                  <div className="bg-card rounded-xl border-2 border-navy dark:border-blue-500 p-4 sm:p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-navy/10 dark:bg-blue-500/20 flex items-center justify-center">
                        <Network className="w-4 h-4 text-navy dark:text-blue-400" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                        No Single Source of Truth
                      </h3>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-foreground leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-navy dark:text-blue-400 mt-0.5">•</span>
                        <span>Different audiences see different views; the team spends most of its time tailoring updates per audience.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-navy dark:text-blue-400 mt-0.5">•</span>
                        <span>No centralized view that informs the business of status, risk, or opportunities.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-navy dark:text-blue-400 mt-0.5">•</span>
                        <span>Data is present but not analyzed — items age in queues without anyone making an informed decision about them.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-navy dark:text-blue-400 mt-0.5">•</span>
                        <span>DCStat is stitched weekly by contract staff; master trackers are hand-updated; nothing alerts, nothing drills.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card B — gold border */}
                  <div className="bg-card rounded-xl border-2 border-gold p-4 sm:p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-gold" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                        Resource-Constrained Variables
                      </h3>
                    </div>
                    <ul className="space-y-2 text-[11px] sm:text-xs text-foreground leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Labor scales 1:1 with portfolio size — every new project adds people, not leverage.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Knowledge lives in inboxes, chat threads, WhatsApp, personal spreadsheets, local folders.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Training gaps drive rubber-stamping — eBuilder proxy requests are approved for speed, not for accuracy.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>When one person goes on leave, visibility goes with them.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom positioning callout */}
                <div className="bg-gold/10 dark:bg-gold/15 border border-gold/40 rounded-xl px-4 sm:px-5 py-3 sm:py-4">
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    <span className="font-bold text-gold">Enterprise engineering teams are building toward a single platform — that effort takes YEARS.</span>{' '}
                    PIP provides immediate relief, behind your firewall, on your existing systems, in 90 days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 2: DISCOVERY                            */}
          {/* ============================================ */}
          {currentSlide === 1 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">How we got here</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Study analysis and industry recommendations</p>
              </div>

              <div className="flex-1 p-4 sm:p-10 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  {/* Column 1: Stakeholders */}
                  <div className="bg-card rounded-xl p-4 sm:p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                        <Users className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl sm:text-5xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>12</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Stakeholders interviewed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-4">
                      {stakeholders.map((person, i) => (
                        <div
                          key={`${person.name}-${i}`}
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-navy/10 dark:bg-navy-soft/50 flex items-center justify-center text-[10px] sm:text-xs font-bold text-foreground"
                          title={person.name}
                        >
                          {person.initials}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                      Portfolio Director, Controls Lead, PMs, project leads, developers, finance, external contractors.
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-foreground mt-2 font-medium">
                      Hasit, Brian, Dave, Sreya, Alice, plus 7 others.
                    </p>
                  </div>

                  {/* Column 2: Source Systems */}
                  <div className="bg-card rounded-xl p-4 sm:p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                        <Database className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl sm:text-5xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>6</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Source systems reviewed</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {sourceSystemLogos.map((system) => (
                        <div key={system.name} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary border border-line">
                          <div className={cn('w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold shrink-0', system.color)}>
                            {system.abbr}
                          </div>
                          <span className="text-[10px] sm:text-xs text-foreground">{system.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Process Catalog */}
                  <div className="bg-card rounded-xl p-4 sm:p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                        <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl sm:text-5xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>47</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Process catalog entries reviewed</p>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-green" />
                        <span className="text-xs sm:text-sm text-foreground">32 active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber" />
                        <span className="text-xs sm:text-sm text-foreground">15 candidate-for-orchestration</span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-4 leading-relaxed">
                      Full process catalog available in appendix.
                    </p>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="mt-4 sm:mt-6 bg-green-bg border border-green/30 rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-green shrink-0" />
                  <p className="text-xs sm:text-sm text-foreground">
                    <span className="font-semibold">Feasibility study complete.</span> Recommended approach is operational. 90-day Phase 1 delivery is achievable on the Customer&apos;s existing GCP tenant, behind the firewall, with source systems unchanged.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 3: ARCHITECTURE                         */}
          {/* ============================================ */}
          {currentSlide === 2 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400 flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Platform Architecture</h1>
                  <p className="text-xs sm:text-sm text-white/70 mt-1">PIP as orchestration layer — source systems unchanged</p>
                </div>
                {/* A10: top-right gold positioning pill */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-navy text-[10px] sm:text-xs font-semibold shrink-0 shadow-sm">
                  <Shield className="w-3 h-3" />
                  Behind your firewall · Inside your GCP tenant · No data egress
                </span>
              </div>

              {/* Mobile-only version of pill */}
              <div className="sm:hidden px-4 pt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold text-navy text-[10px] font-semibold">
                  <Shield className="w-3 h-3" />
                  Behind your firewall · No data egress
                </span>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-10 gap-4 sm:gap-8 overflow-y-auto">
                <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                  {/* TOP: PIP Layer */}
                  <div className="bg-blue-700 dark:bg-blue-800 rounded-xl p-4 sm:p-6 shadow-md border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-blue-400/20 flex items-center justify-center">
                        <Layers className="w-4 sm:w-5 h-4 sm:h-5 text-blue-300" />
                      </div>
                      <h2 className="text-base sm:text-xl font-bold text-white">Portfolio Intelligence Platform</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {['Orchestration', 'SLA Runtime', 'AI Agents', 'Party Intelligence', 'Decision Trace'].map((item) => (
                        <span key={item} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-white/90 text-[10px] sm:text-xs font-medium border border-white/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* MIDDLE: Semantic Layer */}
                  <div className="bg-secondary rounded-xl p-4 sm:p-6 border border-line">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                        <Database className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-teal" />
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-foreground">Certified Semantic Layer (BigQuery)</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Cortex Framework KPIs · Dataplex governance · Row/column-level security via OAuth identity passthrough
                    </p>
                  </div>

                  {/* BOTTOM: Source Systems */}
                  <div className="bg-card rounded-xl p-4 sm:p-6 border border-line">
                    <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">Source Systems (unchanged)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {sourceSystemLogos.map((system) => (
                        <div key={system.name} className="flex flex-col items-center gap-1.5 sm:gap-2">
                          <div className={cn('w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-bold', system.color)}>
                            {system.abbr}
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-muted-foreground text-center leading-tight">{system.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side: Spreadsheet absorption */}
                <div className="hidden lg:flex w-[220px] flex-col items-center justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-secondary to-transparent rounded-lg p-4 opacity-60">
                      <p className="text-xs font-medium text-muted-foreground text-center">Spreadsheets &</p>
                      <p className="text-xs font-medium text-muted-foreground text-center">Tribal Knowledge</p>
                    </div>
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center">
                      <ArrowRight className="w-6 h-6 text-gold" />
                    </div>
                  </div>
                  {/* A10: corrected caption */}
                  <p className="text-[10px] text-foreground mt-3 text-center font-medium">
                    Replaced by PIP — no migration required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 4: CAPABILITIES                         */}
          {/* ============================================ */}
          {currentSlide === 3 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Eight capabilities — what the platform must do</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Comprehensive platform coverage</p>
              </div>

              <div className="flex-1 p-4 sm:p-10 overflow-y-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                  {capabilityDomains.map((domain) => {
                    const Icon = domain.icon
                    return (
                      <div
                        key={domain.title}
                        className="bg-card rounded-xl p-3 sm:p-5 border border-line flex flex-col relative overflow-hidden group hover:border-navy/30 dark:hover:border-gold/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-gold/10 dark:bg-gold/20 flex items-center justify-center group-hover:bg-gold/20 dark:group-hover:bg-gold/30 transition-colors">
                          <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gold" />
                        </div>
                        <h3 className="text-xs sm:text-base font-bold text-foreground pr-10 sm:pr-12 mb-1 sm:mb-2">{domain.title}</h3>
                        <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed">{domain.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 5: OUTCOMES                             */}
          {/* ============================================ */}
          {currentSlide === 4 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">What changes — measurable outcomes</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Every row in this table is an SOW acceptance criterion.</p>
              </div>

              <div className="flex-1 p-4 sm:p-10 flex flex-col overflow-hidden">
                <div className="flex-1 bg-card rounded-xl border border-line overflow-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(120px,1fr)_80px_100px_100px] sm:grid-cols-[1fr_120px_160px_160px] bg-navy dark:bg-secondary sticky top-0">
                    <div className="px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-white dark:text-foreground uppercase tracking-wider">Metric</div>
                    <div className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-white/80 dark:text-muted-foreground uppercase tracking-wider text-center">Today</div>
                    <div className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-white dark:text-foreground uppercase tracking-wider text-center">Phase 1</div>
                    <div className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gold uppercase tracking-wider text-center">Phase 2</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-line">
                    {outcomeMetrics.map((row, i) => (
                      <div
                        key={row.metric}
                        className={cn(
                          'grid grid-cols-[minmax(120px,1fr)_80px_100px_100px] sm:grid-cols-[1fr_120px_160px_160px] hover:bg-accent transition-colors',
                          i % 2 === 1 && 'bg-secondary/40'
                        )}
                      >
                        <div className="px-3 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-sm text-foreground">{row.metric}</div>
                        <div className="px-2 sm:px-5 py-3 sm:py-4 text-center">
                          {row.todayStatus === 'fail' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-red-bg text-red text-[10px] sm:text-xs font-bold font-mono">
                              {row.today}
                            </span>
                          ) : (
                            <span className="text-[11px] sm:text-sm font-mono text-muted-foreground">{row.today}</span>
                          )}
                        </div>
                        <div className="px-2 sm:px-5 py-3 sm:py-4 text-center">
                          {row.phase1Status === 'pass' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-green-bg text-green text-[10px] sm:text-xs font-bold font-mono">
                              <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                              {row.phase1}
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-sm font-mono font-semibold text-foreground">{row.phase1}</span>
                          )}
                        </div>
                        <div className="px-2 sm:px-5 py-3 sm:py-4 text-center">
                          {row.phase2Status === 'pass' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-green-bg text-green text-[10px] sm:text-xs font-bold font-mono">
                              <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                              {row.phase2}
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-sm font-mono font-semibold text-gold">{row.phase2}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-line">
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center italic">
                    These are commitments, not aspirations. Each row maps to a binary acceptance test in the Statement of Work.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 6: PHASING                              */}
          {/* ============================================ */}
          {currentSlide === 5 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Phasing — Phase 1 is fixed; Phases 2 and 3 are menu</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Modular engagement structure</p>
              </div>

              <div className="flex-1 p-4 sm:p-10 flex flex-col overflow-y-auto">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {phases.map((phase) => (
                    <div key={phase.id} className="flex-1 flex flex-col">
                      <div className={cn('rounded-t-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between', phase.color)}>
                        <div>
                          <p className="text-white font-bold text-xs sm:text-sm">{phase.title}</p>
                          <p className="text-white/70 text-[10px] sm:text-xs">{phase.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1 text-white/80">
                          <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                          <span className="text-[10px] sm:text-xs font-medium font-mono">{phase.duration}</span>
                        </div>
                      </div>

                      <div className="flex-1 bg-card rounded-b-lg border border-t-0 border-line p-3 sm:p-4">
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2 font-semibold">{phase.pricing}</p>
                        <ul className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                          {phase.items.map((item) => (
                            <li key={item} className="text-[10px] sm:text-[11px] text-foreground flex items-start gap-1.5">
                              <span className="text-gold mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-1.5 sm:pt-2 border-t border-line">
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground italic">{phase.acceptance}</p>
                        </div>
                      </div>

                      <div className="mt-1.5 sm:mt-2 text-center">
                        <p className="text-[10px] sm:text-xs font-semibold text-foreground">{phase.outcome}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Model Footer */}
                <div className="bg-secondary rounded-xl p-3 sm:p-4 border border-line">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 sm:w-8 h-2.5 sm:h-3 rounded-sm bg-gradient-to-r from-primary to-primary/50" />
                      <span className="text-[10px] sm:text-xs text-foreground">Development (peaks)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 sm:w-8 h-2.5 sm:h-3 rounded-sm bg-gradient-to-r from-teal to-teal/30" />
                      <span className="text-[10px] sm:text-xs text-foreground">Maintenance (drops)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 sm:w-8 h-2.5 sm:h-3 rounded-sm bg-muted" />
                      <span className="text-[10px] sm:text-xs text-foreground">Subscription (steady)</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground text-center mt-2 sm:mt-3 italic">
                    Pricing model: development cost peaks during build, drops to a maintenance fee, then steady subscription. Detailed commercial proposal under separate cover.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Slide 7: TRACK RECORD                         */}
          {/* ============================================ */}
          {currentSlide === 6 && (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-blue-600 dark:bg-blue-700 px-4 sm:px-10 py-4 sm:py-6 border-b-2 border-blue-400">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Track record — same platform, different industries</h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Proven delivery across sectors</p>
              </div>

              <div className="flex-1 flex flex-col p-4 sm:p-10 overflow-y-auto">
                {/* Logo Strip — gold monospace pills */}
                <div className="bg-card rounded-xl p-4 sm:p-6 border border-line mb-4 sm:mb-6">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {trackRecordLogos.map((label) => (
                      <span
                        key={label}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 dark:bg-gold/15 border border-gold/40 text-gold font-mono text-[10px] sm:text-xs font-bold tracking-wide"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Industry Columns */}
                <div className="bg-secondary rounded-xl p-4 sm:p-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {industries.map((industry, idx) => (
                      <div
                        key={industry.title}
                        className={cn(
                          'flex flex-col',
                          idx < 2 && 'sm:border-r border-line sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0'
                        )}
                      >
                        <h3 className="text-sm sm:text-lg font-bold text-foreground mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                          {industry.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{industry.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-line">
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    Sycontec Ventures LLP delivers PIP on the Sycontec Platform. 30 years of enterprise systems experience. Founder-led engagement, PwC and Accenture-grade delivery.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </AppShell>
  )
}

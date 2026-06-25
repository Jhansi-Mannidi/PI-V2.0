'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  AlertTriangle,
  Clock,
  Bot,
  ArrowUpRight,
  ChevronRight,
  User,
  FileText,
  Shield,
  Mail,
  TrendingUp,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { useActionModal } from '@/hooks/use-action-modal'
import { toast } from 'sonner'
import { AnimNum, FadeUp } from '@/components/animated-primitives'

// ── Types ──

interface Stage {
  id: number
  name: string
  state: 'done' | 'breach' | 'active' | 'pending'
  duration: string
  owner: string
  isAgent: boolean
  sla?: string
}

interface AuditEntry {
  date: string
  time: string
  text: string
  severity: 'normal' | 'amber' | 'red'
  isAgent: boolean
  hasEvidence?: boolean
  agentId?: string
}

// ── Mock Data ──

const stages: Stage[] = [
  {
    id: 1,
    name: 'Insurance (COI)',
    state: 'done',
    duration: '0.8d',
    owner: 'A-101 Agent',
    isAgent: true,
  },
  {
    id: 2,
    name: 'Safety Certification',
    state: 'done',
    duration: '1.2d',
    owner: 'Safety Officer',
    isAgent: false,
  },
  {
    id: 3,
    name: 'Legal Review',
    state: 'breach',
    duration: '6h 22m past SLA',
    owner: 'Jennifer M.',
    isAgent: false,
    sla: '3 business days',
  },
  {
    id: 4,
    name: 'Background Check',
    state: 'pending',
    duration: 'Est. 1.5d',
    owner: 'HR Compliance',
    isAgent: false,
  },
  {
    id: 5,
    name: 'Badge/Site Access',
    state: 'pending',
    duration: 'Est. 0.5d',
    owner: 'Facilities',
    isAgent: false,
  },
  {
    id: 6,
    name: 'System Access',
    state: 'pending',
    duration: 'Est. 0.3d',
    owner: 'IT Admin',
    isAgent: false,
  },
]

const auditLog: AuditEntry[] = [
  {
    date: 'Apr 14',
    time: '08:30',
    text: 'e-Builder webhook received -- orchestration instantiated (22 tasks)',
    severity: 'normal',
    isAgent: false,
  },
  {
    date: 'Apr 14',
    time: '08:31',
    text: 'Stage 1 (Insurance) assigned to A-101 Document Intake Agent',
    severity: 'normal',
    isAgent: true,
    agentId: 'A-101',
  },
  {
    date: 'Apr 14',
    time: '09:12',
    text: 'A-101 parsed COI: all fields valid, confidence 0.97. Advanced.',
    severity: 'normal',
    isAgent: true,
    agentId: 'A-101',
    hasEvidence: true,
  },
  {
    date: 'Apr 14',
    time: '09:12',
    text: 'Stage 2 (Safety Cert) assigned to Safety Officer',
    severity: 'normal',
    isAgent: false,
  },
  {
    date: 'Apr 15',
    time: '14:30',
    text: 'Safety Officer completed review. Evidence attached. Advanced.',
    severity: 'normal',
    isAgent: false,
    hasEvidence: true,
  },
  {
    date: 'Apr 15',
    time: '14:31',
    text: 'Stage 3 (Legal Review) assigned to Jennifer M.',
    severity: 'normal',
    isAgent: false,
  },
  {
    date: 'Apr 17',
    time: '14:31',
    text: 'PRE-BREACH -- T-1d notification sent to Jennifer M.',
    severity: 'amber',
    isAgent: false,
  },
  {
    date: 'Apr 18',
    time: '14:31',
    text: 'BREACH -- 3 business day SLA exceeded',
    severity: 'red',
    isAgent: false,
  },
  {
    date: 'Apr 18',
    time: '14:32',
    text: 'A-201 SLA Sentinel notified Jennifer M. via email + Chat',
    severity: 'normal',
    isAgent: true,
    agentId: 'A-201',
  },
  {
    date: 'Apr 18',
    time: '20:53',
    text: 'ESCALATION -- dwell exceeded, Program Manager notified',
    severity: 'red',
    isAgent: false,
  },
]

// ── Page Component ──

export default function OrchestrationView() {
  return (
    <AppShell
      title="Orchestration View"
      subtitle="Instance drill-down — Full orchestration state visibility"
      activeHref="/orchestration"
    >
      <motion.div 
        className="w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
          }
        }}
      >
        {/* ── HEADER ── */}
        <FadeUp delay={0}>
          <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-sans text-xl font-bold text-foreground">
                Contractor Onboarding &mdash; Acme Electrical
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/15 border border-red/30 text-red text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot" />
                Stage 3 of 6 &mdash; BREACH
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Instance: ORCH-2026-0447 &middot; Project: Pryor Creek New Build
            </p>
          </div>
          {/* Party Intelligence Badge */}
          <div className="shrink-0">
            <button className="group flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-amber/10 border border-amber/25 hover:border-amber/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">Acme Electrical</p>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-amber font-mono font-bold">SLA miss rate 18%</span>
                  <TrendingUp className="w-3 h-3 text-red" />
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            </div>
          </header>
        </FadeUp>

        {/* ── REGION 1: Stage Timeline ── */}
        <FadeUp delay={0.1}>
          <section className="rounded-xl border border-line bg-card p-6 overflow-x-auto">
            <h3 className="text-[10px] font-bold tracking-[2px] text-gold uppercase mb-6">
              Stage Timeline
            </h3>
            <StageTimeline stages={stages} />
          </section>
        </FadeUp>

        {/* ── REGION 2: Two-column ── */}
        <FadeUp delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Current Stage Detail (3 cols) */}
          <section className="lg:col-span-3">
            <CurrentStageDetail />
          </section>

          {/* RIGHT: Audit Log (2 cols) */}
          <section className="lg:col-span-2">
            <AuditLogPanel entries={auditLog} />
          </section>
        </div>
        </FadeUp>
      </motion.div>
    </AppShell>
  )
}

// ── Stage Timeline Component ──

function StageTimeline({ stages }: { stages: Stage[] }) {
  return (
    <div className="flex items-start min-w-[720px]">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1
        return (
          <div key={stage.id} className="flex items-start flex-1 min-w-0">
            {/* Stage node + content */}
            <div className="flex flex-col items-center text-center min-w-[100px]">
              {/* Dot */}
              <StageDot state={stage.state} />
              {/* Label below */}
              <div className="mt-3 px-1 max-w-[120px]">
                <p className="text-xs font-semibold text-foreground leading-tight mb-1">
                  {stage.name}
                </p>
                <p className={cn(
                  'text-[11px] font-mono tabular-nums mb-0.5',
                  stage.state === 'breach' ? 'text-red font-bold' :
                  stage.state === 'done' ? 'text-green' :
                  'text-muted-foreground'
                )}>
                  {stage.duration}
                </p>
                <div className="flex items-center justify-center gap-1">
                  {stage.isAgent ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal/15 text-teal">
                      <Bot className="w-3 h-3" />
                      <span className="text-[10px] font-medium">{stage.owner}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{stage.owner}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 flex items-center pt-[18px]">
                <div className={cn(
                  'h-[2px] w-full',
                  stage.state === 'done'
                    ? 'bg-green/50'
                    : stage.state === 'breach'
                    ? 'bg-red/40 bg-[length:8px_2px] bg-repeat-x'
                    : 'border-t-2 border-dashed border-muted-foreground/20'
                )}
                style={stage.state === 'breach' ? {
                  backgroundImage: 'repeating-linear-gradient(90deg, var(--color-red) 0, var(--color-red) 6px, transparent 6px, transparent 12px)',
                  height: '2px',
                  border: 'none',
                } : stage.state !== 'done' ? {
                  height: 0,
                } : undefined}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StageDot({ state }: { state: Stage['state'] }) {
  const base = 'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all'

  if (state === 'done') {
    return (
      <div className={cn(base, 'bg-green/20 border-2 border-green')}>
        <Check className="w-4 h-4 text-green" strokeWidth={3} />
      </div>
    )
  }

  if (state === 'breach') {
    return (
      <div className={cn(base, 'bg-red/20 border-2 border-red animate-pulse-dot')}>
        <AlertTriangle className="w-4 h-4 text-red" strokeWidth={2.5} />
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div className={cn(base, 'bg-gold/20 border-2 border-gold animate-glow')}>
        <Clock className="w-4 h-4 text-gold" strokeWidth={2.5} />
      </div>
    )
  }

  // pending
  return (
    <div className={cn(base, 'bg-muted border-2 border-muted-foreground/20')}>
      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
    </div>
  )
}

// ── Current Stage Detail ──

function CurrentStageDetail() {
  const [showEscalateModal, setShowEscalateModal] = React.useState(false)
  const [nudgeSent, setNudgeSent] = React.useState(false)
  const action = useActionModal()

  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-red/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Current Stage &mdash; Legal Review
            </h3>
            <p className="text-xs text-muted-foreground">Stage 3 of 6</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/15 border border-red/30 text-red text-xs font-bold font-mono tabular-nums">
          6h 22m past SLA
          <span className="text-muted-foreground font-normal">(SLA: 3 business days)</span>
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Role & Filler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailField
            label="Role"
            value="Legal Compliance Reviewer"
            icon={<User className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Current filler"
            icon={<User className="w-3.5 h-3.5" />}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Jennifer M.</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red/15 text-red border border-red/20">
                sole filler &mdash; no backup
              </span>
            </div>
          </DetailField>
        </div>

        {/* Pending Action */}
        <DetailField
          label="Pending action"
          value="Review and approve contractor legal documents"
          icon={<FileText className="w-3.5 h-3.5" />}
        />

        {/* Evidence */}
        <DetailField
          label="Evidence required"
          icon={<FileText className="w-3.5 h-3.5" />}
        >
          <div className="flex flex-wrap gap-2">
            <EvidenceChip label="Signed legal compliance checklist" />
            <EvidenceChip label="Approved contractor agreement" />
          </div>
        </DetailField>

        {/* Separator */}
        <div className="border-t border-line" />

        {/* Party Context */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-amber" />
            <h4 className="text-xs font-bold tracking-wider uppercase text-gold">
              Party Context &mdash; Acme Electrical
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <PartyMetric
              label="SLA miss rate"
              value="18%"
              indicator="amber"
              trend={<span className="flex items-center gap-0.5 text-red text-[10px] font-bold"><TrendingUp className="w-3 h-3" /> +6%</span>}
            />
            <PartyMetric
              label="Reliability (P50)"
              value="0.88"
              indicator="amber"
              subtext="below avg"
            />
            <PartyMetric
              label="Drift"
              value="+6%"
              indicator="red"
              subtext="vs 90d baseline"
              trend={<span className="flex items-center gap-0.5 text-red text-[10px] font-bold"><TrendingUp className="w-3 h-3" /></span>}
            />
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-line" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowEscalateModal(!showEscalateModal)}
            className="font-semibold gap-1.5 border border-gold/40 hover:border-gold"
            style={{ backgroundColor: '#FAF6EB', color: '#0B1F3A' }}
            size="sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Escalate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              action.open({
                tone: 'warning',
                icon: ArrowUpRight,
                title: 'Reassign Orchestration',
                description: 'Transfers this orchestration ownership. The new owner will be notified and given full context.',
                fields: [
                  {
                    type: 'select',
                    name: 'newOwner',
                    label: 'New Owner',
                    required: true,
                    options: [
                      { value: 'sl', label: 'Sophia Lamb — Sr PM' },
                      { value: 'me', label: 'Michael Ellis — Construction Mgr' },
                      { value: 'jc', label: 'Jenna Carter — Cost Controls' },
                      { value: 'hc', label: 'Hasit Chetal — Controls Lead' },
                    ],
                  },
                  { type: 'textarea', name: 'reason', label: 'Reason', required: true, rows: 3 },
                ],
                confirmLabel: 'Reassign',
                successToast: 'Orchestration reassigned',
                successDescription: 'New owner notified with full context',
              })
            }
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Reassign
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={nudgeSent}
            onClick={() => setNudgeSent(true)}
          >
            <Mail className="w-3.5 h-3.5" />
            {nudgeSent ? 'Nudge sent' : 'Nudge owner'}
          </Button>
        </div>

        {/* Escalate Modal Placeholder */}
        {showEscalateModal && (
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold" />
                Escalation &mdash; M-02
              </h4>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Escalate to</p>
                  <p className="text-sm font-medium text-foreground">Hasit Chetal (Portfolio Controls Lead)</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reason</p>
                  <p className="text-sm text-foreground">Past SLA on Legal Review &mdash; sole filler unresponsive</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  className="font-semibold text-xs border border-gold/40 hover:border-gold"
                  style={{ backgroundColor: '#FAF6EB', color: '#0B1F3A' }}
                  onClick={() => {
                    setShowEscalateModal(false)
                    toast.success('Escalation confirmed', {
                      description: 'Brian Smith notified · BDP review queue updated',
                    })
                  }}
                >
                  Confirm Escalation
                </Button>
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowEscalateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {action.element}
    </div>
  )
}

function DetailField({
  label,
  value,
  icon,
  children,
}: {
  label: string
  value?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
          {label}
        </p>
      </div>
      {value ? (
        <p className="text-sm text-foreground">{value}</p>
      ) : (
        children
      )}
    </div>
  )
}

function EvidenceChip({ label }: { label: string }) {
  return (
    <button className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-muted/50 hover:border-gold/40 hover:bg-gold/5 transition-colors">
      <FileText className="w-3 h-3 text-muted-foreground group-hover:text-gold transition-colors" />
      <span className="text-xs text-foreground">{label}</span>
      <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-gold transition-colors" />
    </button>
  )
}

function PartyMetric({
  label,
  value,
  indicator,
  subtext,
  trend,
}: {
  label: string
  value: string
  indicator: 'green' | 'amber' | 'red'
  subtext?: string
  trend?: React.ReactNode
}) {
  const indicatorColors = {
    green: 'bg-green/15 border-green/30 text-green',
    amber: 'bg-amber/15 border-amber/30 text-amber',
    red: 'bg-red/15 border-red/30 text-red',
  }

  return (
    <div className={cn('rounded-lg border p-3', indicatorColors[indicator])}>
      <p className="text-[10px] font-bold tracking-wider uppercase opacity-70 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold font-mono tabular-nums">{value}</span>
        {trend}
      </div>
      {subtext && (
        <p className="text-[10px] opacity-70 mt-0.5">{subtext}</p>
      )}
    </div>
  )
}

// ── Audit Log Panel ──

function AuditLogPanel({ entries }: { entries: AuditEntry[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold" />
          <h3 className="font-sans text-base font-bold text-foreground">
            Audit Log
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
          {entries.length} entries
        </span>
      </div>

      {/* Scrollable Log */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[560px]">
        <div className="p-4 space-y-0">
          {entries.map((entry, i) => (
            <AuditRow key={i} entry={entry} isLast={i === entries.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditRow({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const dotColor =
    entry.severity === 'red' ? 'bg-red' :
    entry.severity === 'amber' ? 'bg-amber' :
    entry.isAgent ? 'bg-teal' :
    'bg-muted-foreground/30'

  return (
    <div className="flex gap-3 group">
      {/* Timeline rail */}
      <div className="flex flex-col items-center shrink-0 w-5">
        <div className={cn(
          'w-2.5 h-2.5 rounded-full mt-1.5 shrink-0',
          dotColor,
          entry.severity === 'red' && 'animate-pulse-dot'
        )} />
        {!isLast && (
          <div className="w-px flex-1 bg-line my-1" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 pb-4 min-w-0',
        isLast && 'pb-0'
      )}>
        {/* Timestamp */}
        <p className="text-[10px] font-mono tabular-nums text-muted-foreground mb-0.5">
          {entry.date}, {entry.time}
        </p>
        {/* Text */}
        <p className={cn(
          'text-xs leading-relaxed',
          entry.severity === 'red' ? 'text-red font-bold' :
          entry.severity === 'amber' ? 'text-amber font-semibold' :
          'text-foreground/80'
        )}>
          {entry.isAgent && entry.agentId && (
            <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal/15 text-teal font-medium mr-1.5 hover:bg-teal/25 transition-colors">
              <Bot className="w-3 h-3" />
              <span className="text-[10px]">{entry.agentId}</span>
              <ChevronRight className="w-2.5 h-2.5 opacity-50" />
            </button>
          )}
          {entry.text}
        </p>
        {/* Evidence link */}
        {entry.hasEvidence && (
          <button className="mt-1 inline-flex items-center gap-1 text-[10px] text-gold hover:text-gold-soft transition-colors font-medium">
            <FileText className="w-3 h-3" />
            View evidence
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  )
}

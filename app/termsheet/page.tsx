'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useActionModal } from '@/hooks/use-action-modal'
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  FileCheck,
  ExternalLink,
  Info,
  Lock,
  Save,
  Send,
} from 'lucide-react'
import { FadeUp, AnimNum } from '@/components/animated-primitives'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const workflowStages = [
  { id: 'draft', label: 'Drafting', responsible: 'Alice Cox · LineSight', sla: 'Same cycle' },
  { id: 'internal', label: 'Internal Review', responsible: 'Brian Smith · Portfolio Director', sla: '2 business days' },
  { id: 'qa', label: 'QA/QC', responsible: 'Alisha · Portfolio QA', sla: '1 business day' },
  { id: 'anu', label: 'Anu Final Approval', responsible: 'Anu Reddi · Senior Director', sla: '50d target post-submission' },
  { id: 'submitted', label: 'Submitted for Funding', responsible: 'Treasury / Finance', sla: '—' },
] as const

type StageId = typeof workflowStages[number]['id']

const validatedProjects = [
  { id: 'KAY-Hub1-1&2&3', region: 'APAC', mwTrig: 480, mwDayEnd: 1120, shc: 187, por: '3.0R5.0', sctDate: 'Apr 14' },
  { id: 'MOR-Hub1-1&2&3', region: 'EMEA', mwTrig: 360, mwDayEnd: 720, shc: 142, por: '3.0R5.0', sctDate: 'Apr 18' },
  { id: 'NRD-Hub2-1&2', region: 'NA-E', mwTrig: 240, mwDayEnd: 480, shc: 95, por: '3.0R5.0', sctDate: 'Apr 22' },
  { id: 'UWD-Hub1-1&2&3', region: 'NA-W', mwTrig: 360, mwDayEnd: 720, shc: 142, por: '3.0R5.0', sctDate: 'Apr 22' },
  { id: 'VMY-Hub1-1&2&3', region: 'NA-W', mwTrig: 360, mwDayEnd: 720, shc: 142, por: '3.0R5.0', sctDate: 'May 02' },
  // Additional validated projects available to add
  { id: 'BLK-Hub2-1&2', region: 'NA-E', mwTrig: 280, mwDayEnd: 560, shc: 108, por: '3.0R5.0', sctDate: 'May 05' },
  { id: 'CRK-Hub1-1&2&3', region: 'EMEA', mwTrig: 420, mwDayEnd: 840, shc: 165, por: '3.0R5.0', sctDate: 'May 08' },
  { id: 'DLT-Hub3-1&2', region: 'APAC', mwTrig: 320, mwDayEnd: 640, shc: 124, por: '3.0R5.0', sctDate: 'May 10' },
  { id: 'EKV-Hub1-1&2&3', region: 'NA-W', mwTrig: 400, mwDayEnd: 800, shc: 156, por: '3.0R5.0', sctDate: 'May 12' },
] as const

type SelectedProject = {
  id: string
  region: string
  triggers: string[]
  status: 'Drafting' | 'Locked'
  mwTrig: number
  mwDayEnd: number
  shc: number
  fsaOffset: number
  por: string
  concurrent: boolean
  fundingType: 'Seed' | 'Construction'
  localAmount: string
  localCurrency: string
  fxRate: number
  usdEquivalent: number
}

const initialSelected: SelectedProject[] = [
  {
    id: 'KAY-Hub1-1&2&3',
    region: 'APAC',
    triggers: ['KAY1-A1', 'KAY1-A2', 'KAY1-A3'],
    status: 'Drafting',
    mwTrig: 480,
    mwDayEnd: 1120,
    shc: 187,
    fsaOffset: 12,
    por: '3.0R5.0',
    concurrent: true,
    fundingType: 'Seed',
    localAmount: '1,170,000,000',
    localCurrency: 'THB',
    fxRate: 0.0286,
    usdEquivalent: 33.4,
  },
  {
    id: 'MOR-Hub1-1&2&3',
    region: 'EMEA',
    triggers: ['MOR1-A1', 'MOR1-A2', 'MOR1-A3'],
    status: 'Drafting',
    mwTrig: 360,
    mwDayEnd: 720,
    shc: 142,
    fsaOffset: 8,
    por: '3.0R5.0',
    concurrent: true,
    fundingType: 'Seed',
    localAmount: '52,800,000',
    localCurrency: 'EUR',
    fxRate: 1.08,
    usdEquivalent: 57.0,
  },
  {
    id: 'NRD-Hub2-1&2',
    region: 'NA-E',
    triggers: ['NRD2-A1', 'NRD2-A2'],
    status: 'Drafting',
    mwTrig: 240,
    mwDayEnd: 480,
    shc: 95,
    fsaOffset: 6,
    por: '3.0R5.0',
    concurrent: false,
    fundingType: 'Construction',
    localAmount: '70,300,000',
    localCurrency: 'USD',
    fxRate: 1.0,
    usdEquivalent: 70.3,
  },
  {
    id: 'UWD-Hub1-1&2&3',
    region: 'NA-W',
    triggers: ['UWD1-A1', 'UWD1-A2', 'UWD1-A3'],
    status: 'Drafting',
    mwTrig: 360,
    mwDayEnd: 720,
    shc: 142,
    fsaOffset: 10,
    por: '3.0R5.0',
    concurrent: true,
    fundingType: 'Seed',
    localAmount: '38,500,000',
    localCurrency: 'USD',
    fxRate: 1.0,
    usdEquivalent: 38.5,
  },
  {
    id: 'VMY-Hub1-1&2&3',
    region: 'NA-W',
    triggers: ['VMY1-A1', 'VMY1-A2', 'VMY1-A3'],
    status: 'Drafting',
    mwTrig: 360,
    mwDayEnd: 720,
    shc: 142,
    fsaOffset: 9,
    por: '3.0R5.0',
    concurrent: false,
    fundingType: 'Seed',
    localAmount: '35,400,000',
    localCurrency: 'USD',
    fxRate: 1.0,
    usdEquivalent: 35.4,
  },
]

const evidence = {
  bdp: { record: 'KAY-2026-04', last_updated: '2026-04-12', author: 'Sreya Mukherjee' },
  sct: { validation_date: '2026-04-14', validator: 'ODC SCT v3.2' },
  seated_calc: { output_date: '2026-04-22', author: 'Brian Steinberg' },
  por: { version: '3.0R5.0', registry_id: 'POR-2026-Q2' },
  fx: { rate: 0.0286, snapshot_at: '2026-04-22T08:00:00Z' },
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TermsheetPage() {
  const [currentStage] = React.useState<StageId>('draft')
  const [stageHover, setStageHover] = React.useState<StageId | null>(null)
  const [pickerSelected, setPickerSelected] = React.useState<Set<string>>(new Set())
  const [selected, setSelected] = React.useState<SelectedProject[]>(initialSelected)
  const [expandedEvidence, setExpandedEvidence] = React.useState<Set<string>>(new Set())
  const [evidencePopover, setEvidencePopover] = React.useState<string | null>(null)
  const [editLocked, setEditLocked] = React.useState<{ project: string; field: string } | null>(null)
  const [lastSavedAt, setLastSavedAt] = React.useState<Date>(() => new Date(Date.now() - 32_000))
  const [isSaving, setIsSaving] = React.useState(false)
  const action = useActionModal()

  const selectedIds = React.useMemo(() => new Set(selected.map((p) => p.id)), [selected])
  const availableForPicker = validatedProjects.filter((p) => !selectedIds.has(p.id))

  const togglePicker = (id: string) => {
    setPickerSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addToTermsheet = () => {
    const toAdd = validatedProjects.filter((p) => pickerSelected.has(p.id))
    const newRows: SelectedProject[] = toAdd.map((p) => ({
      id: p.id,
      region: p.region,
      triggers: [`${p.id.split('-')[0]}1-A1`, `${p.id.split('-')[0]}1-A2`],
      status: 'Drafting',
      mwTrig: p.mwTrig,
      mwDayEnd: p.mwDayEnd,
      shc: p.shc,
      fsaOffset: 8,
      por: p.por,
      concurrent: false,
      fundingType: 'Seed',
      localAmount: '0',
      localCurrency: 'USD',
      fxRate: 1,
      usdEquivalent: 0,
    }))
    setSelected((s) => [...s, ...newRows])
    setPickerSelected(new Set())
    toast.success(`${toAdd.length} project${toAdd.length > 1 ? 's' : ''} added`, {
      description: `Added to May 2026 cycle termsheet`,
    })
  }

  const toggleConcurrent = (id: string) => {
    setSelected((s) =>
      s.map((p) =>
        p.id === id
          ? {
              ...p,
              concurrent: !p.concurrent,
              usdEquivalent: !p.concurrent ? p.usdEquivalent * 0.93 : p.usdEquivalent / 0.93,
            }
          : p,
      ),
    )
  }

  const toggleEvidence = (id: string) => {
    setExpandedEvidence((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Footer aggregates
  const totalProjects = selected.length
  const totalFunding = selected.reduce((s, p) => s + p.usdEquivalent, 0)
  const seedTotal = selected.filter((p) => p.fundingType === 'Seed').reduce((s, p) => s + p.usdEquivalent, 0)
  const constrTotal = selected.filter((p) => p.fundingType === 'Construction').reduce((s, p) => s + p.usdEquivalent, 0)
  const concurrentCount = selected.filter((p) => p.concurrent).length
  const cycleSavings = +(concurrentCount * 4.7).toFixed(1) // illustrative

  return (
    <AppShell title="Termsheet Authoring" subtitle="May 2026 Cycle · Draft" activeHref="/termsheet">
      <div className="space-y-5">
        {/* HEADER STRIP */}
        <div className="bg-card border border-line rounded-xl p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Cycle</span>
            <select className="h-8 text-xs px-2 border border-line rounded-md bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold">
              <option>May 2026 (Current)</option>
              <option>Jun 2026 (Next)</option>
              <option>Apr 2026</option>
              <option>Mar 2026</option>
              <option>Feb 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30 font-semibold">
              Status: Drafting
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Owner:</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary/60 border border-line">Alice Cox · LineSight</span>
            <span className="text-muted-foreground/60">·</span>
            <span>Last saved: {Math.max(1, Math.floor((Date.now() - lastSavedAt.getTime()) / 1000))} seconds ago</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs gap-1.5"
              disabled={isSaving}
              onClick={() => {
                setIsSaving(true)
                window.setTimeout(() => {
                  setLastSavedAt(new Date())
                  setIsSaving(false)
                  toast.success('Draft saved', { description: `${selected.length} projects · auto-locked` })
                }, 600)
              }}
            >
              <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving…' : 'Save Draft'}
            </Button>
            <Button
              className="h-8 text-xs gap-1.5 bg-gold text-navy hover:bg-gold/90"
              onClick={() =>
                action.open({
                  tone: 'primary',
                  icon: Send,
                  title: 'Submit Termsheet for Review',
                  description: 'Locks the draft and routes it through the canonical approval pipeline. Reviewers will be notified immediately.',
                  context: [
                    { label: 'Projects', value: `${selected.length}` },
                    { label: 'Author', value: 'Alice Cox · LineSight' },
                  ],
                  fields: [
                    {
                      type: 'select',
                      name: 'reviewer',
                      label: 'Primary Reviewer',
                      required: true,
                      options: [
                        { value: 'sl', label: 'Sophia Lamb — Sr PM' },
                        { value: 'hc', label: 'Hasit Chetal — Controls Lead' },
                        { value: 'bs', label: 'Brian Steinberg — Program Manager' },
                      ],
                    },
                    {
                      type: 'select',
                      name: 'urgency',
                      label: 'Review SLA',
                      required: true,
                      options: [
                        { value: 'standard', label: 'Standard — 5 business days' },
                        { value: 'expedite', label: 'Expedite — 2 business days' },
                        { value: 'urgent', label: 'Urgent — same-day' },
                      ],
                    },
                    { type: 'textarea', name: 'notes', label: 'Notes for Reviewer', rows: 3 },
                  ],
                  confirmLabel: 'Submit',
                  successToast: 'Termsheet submitted',
                  successDescription: 'Reviewer notified · entered Stage 1 of approval pipeline',
                })
              }
            >
              <Send className="w-3.5 h-3.5" /> Submit for Review
            </Button>
          </div>
        </div>

        {/* REGION 1 — Workflow status strip */}
        <div className="bg-card border border-line rounded-xl p-4">
          <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Workflow Status</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {workflowStages.map((stage, i) => {
              const isCurrent = stage.id === currentStage
              const isPast =
                workflowStages.findIndex((s) => s.id === currentStage) > i
              const isFuture = !isCurrent && !isPast
              return (
                <React.Fragment key={stage.id}>
                  <div
                    className="relative flex items-center gap-2 cursor-pointer"
                    onMouseEnter={() => isFuture && setStageHover(stage.id)}
                    onMouseLeave={() => setStageHover(null)}
                  >
                    {isCurrent ? (
                      <div className="w-3 h-3 rounded-full bg-gold ring-2 ring-gold/30" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-green" />
                    ) : (
                      <Circle className="w-3 h-3 text-muted-foreground/50" />
                    )}
                    <span
                      className={
                        isCurrent
                          ? 'text-xs font-bold text-navy'
                          : isPast
                            ? 'text-xs text-foreground'
                            : 'text-xs text-muted-foreground'
                      }
                    >
                      {stage.label}
                    </span>

                    {stageHover === stage.id && (
                      <div className="absolute top-6 left-0 z-20 bg-navy dark:bg-card text-white dark:text-foreground text-[11px] rounded-lg p-3 w-[220px] shadow-lg border border-gold/30 dark:border-line">
                        <div className="font-semibold mb-1">{stage.responsible}</div>
                        <div className="text-white/70 dark:text-muted-foreground">SLA: {stage.sla}</div>
                      </div>
                    )}
                  </div>
                  {i < workflowStages.length - 1 && (
                    <div className="flex-1 max-w-[60px] h-px bg-line" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* REGION 2 — Project picker */}
        <div className="bg-card border border-line rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-line">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Validated Projects Awaiting Termsheet</h3>
              <p className="text-[11px] text-muted-foreground">From SCT tool · Not yet in active termsheet</p>
            </div>
            <Button
              onClick={addToTermsheet}
              disabled={pickerSelected.size === 0}
              className="h-8 text-xs gap-1.5 bg-gold text-navy hover:bg-gold/90 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" /> Add to Termsheet ({pickerSelected.size})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 border-b border-line">
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium w-8"></th>
                  <th className="px-4 py-2 text-left font-medium">Project</th>
                  <th className="px-4 py-2 text-left font-medium">Region</th>
                  <th className="px-4 py-2 text-right font-medium">MW (Trig)</th>
                  <th className="px-4 py-2 text-right font-medium">MW (Day-End)</th>
                  <th className="px-4 py-2 text-right font-medium">SHC</th>
                  <th className="px-4 py-2 text-left font-medium">POR</th>
                  <th className="px-4 py-2 text-left font-medium">SCT Validated</th>
                </tr>
              </thead>
              <tbody>
                {availableForPicker.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      All validated projects are already in this cycle.
                    </td>
                  </tr>
                ) : (
                  availableForPicker.map((p) => (
                    <tr key={p.id} className="border-b border-line/50 hover:bg-secondary/30">
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={pickerSelected.has(p.id)}
                          onChange={() => togglePicker(p.id)}
                          className="w-3.5 h-3.5 accent-gold cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-mono font-medium text-foreground">{p.id}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{p.region}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{p.mwTrig}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{p.mwDayEnd.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{p.shc}</td>
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{p.por}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-green">
                          <CheckCircle2 className="w-3 h-3" /> {p.sctDate}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* REGION 3 — Per-project worksheet */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Selected Projects · May 2026 Cycle
              <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                ({selected.length} of 12 max)
              </span>
            </h3>
          </div>

          {selected.map((p) => {
            const evOpen = expandedEvidence.has(p.id)
            const netHubSeats = p.shc - p.fsaOffset
            return (
              <div key={p.id} className="bg-card border border-line rounded-xl">
                {/* Project header */}
                <div className="p-4 border-b border-line flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold font-mono text-foreground">{p.id}</h4>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">{p.region}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Triggering DCs:{' '}
                      <span className="font-mono text-foreground">{p.triggers.join(', ')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/15 text-gold-dark border border-gold/30">
                    {p.status}
                  </span>
                </div>

                {/* Metadata row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-line">
                  <NonEditableField
                    label="MW (triggering)"
                    value={`${p.mwTrig} MW`}
                    evidenceKey={`${p.id}-mwTrig`}
                    evidenceText={`BDP record ${evidence.bdp.record}`}
                    onClickEvidence={() => setEvidencePopover(`${p.id}-mwTrig`)}
                    onClickField={() => setEditLocked({ project: p.id, field: 'MW (triggering)' })}
                    showPopover={evidencePopover === `${p.id}-mwTrig`}
                    closePopover={() => setEvidencePopover(null)}
                  />
                  <NonEditableField
                    label="MW (day-end)"
                    value={`${p.mwDayEnd.toLocaleString()} MW`}
                    evidenceKey={`${p.id}-mwDay`}
                    evidenceText="BDP campus plan"
                    onClickEvidence={() => setEvidencePopover(`${p.id}-mwDay`)}
                    onClickField={() => setEditLocked({ project: p.id, field: 'MW (day-end)' })}
                    showPopover={evidencePopover === `${p.id}-mwDay`}
                    closePopover={() => setEvidencePopover(null)}
                  />
                  <NonEditableField
                    label="SHC required"
                    value={String(p.shc)}
                    evidenceKey={`${p.id}-shc`}
                    evidenceText={`Seated Calculator (${evidence.seated_calc.author}, ${evidence.seated_calc.output_date})`}
                    onClickEvidence={() => setEvidencePopover(`${p.id}-shc`)}
                    onClickField={() => setEditLocked({ project: p.id, field: 'SHC required' })}
                    showPopover={evidencePopover === `${p.id}-shc`}
                    closePopover={() => setEvidencePopover(null)}
                  />
                  <NonEditableField
                    label="FSA offset"
                    value={`${p.fsaOffset} seats`}
                    evidenceKey={`${p.id}-fsa`}
                    evidenceText={`DC metadata ${p.id.split('-')[0]}-DC-1`}
                    onClickEvidence={() => setEvidencePopover(`${p.id}-fsa`)}
                    onClickField={() => setEditLocked({ project: p.id, field: 'FSA offset' })}
                    showPopover={evidencePopover === `${p.id}-fsa`}
                    closePopover={() => setEvidencePopover(null)}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Net hub seats
                    </div>
                    <div className="text-sm font-mono font-semibold text-foreground">{netHubSeats}</div>
                    <div className="text-[10px] text-muted-foreground/70">(computed)</div>
                  </div>
                </div>

                {/* Configuration row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-line">
                  <NonEditableField
                    label="POR version"
                    value={p.por}
                    evidenceKey={`${p.id}-por`}
                    evidenceText={`Architecture POR registry · ${evidence.por.registry_id}`}
                    onClickEvidence={() => setEvidencePopover(`${p.id}-por`)}
                    onClickField={() => setEditLocked({ project: p.id, field: 'POR version' })}
                    showPopover={evidencePopover === `${p.id}-por`}
                    closePopover={() => setEvidencePopover(null)}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Hub configuration
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => p.concurrent && toggleConcurrent(p.id)}
                        className={`h-7 px-3 text-xs rounded-md border transition-colors ${
                          !p.concurrent
                            ? 'bg-gold/15 text-gold-dark border-gold/40 font-semibold'
                            : 'bg-secondary/30 text-muted-foreground border-line hover:bg-secondary/50'
                        }`}
                      >
                        Single (Phase 1)
                      </button>
                      <button
                        onClick={() => !p.concurrent && toggleConcurrent(p.id)}
                        className={`h-7 px-3 text-xs rounded-md border transition-colors ${
                          p.concurrent
                            ? 'bg-gold/15 text-gold-dark border-gold/40 font-semibold'
                            : 'bg-secondary/30 text-muted-foreground border-line hover:bg-secondary/50'
                        }`}
                      >
                        Concurrent (Day-end)
                      </button>
                    </div>
                    {p.concurrent && (
                      <p className="text-[11px] text-green mt-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Concurrent Hub Build flag — applies $40M-tier saving
                      </p>
                    )}
                  </div>
                </div>

                {/* Funding ask */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-line">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Local currency
                    </div>
                    <div className="text-sm font-mono font-semibold text-foreground">
                      {p.localCurrency} {p.localAmount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      USD equivalent
                    </div>
                    <div className="text-sm font-mono font-semibold text-foreground">
                      ${p.usdEquivalent.toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 font-mono">
                      FX {p.fxRate} · snapshot {evidence.fx.snapshot_at.slice(0, 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Funding type
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`ft-${p.id}`}
                          checked={p.fundingType === 'Seed'}
                          onChange={() =>
                            setSelected((s) =>
                              s.map((x) => (x.id === p.id ? { ...x, fundingType: 'Seed' } : x)),
                            )
                          }
                          className="accent-gold"
                        />
                        Seed
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`ft-${p.id}`}
                          checked={p.fundingType === 'Construction'}
                          onChange={() =>
                            setSelected((s) =>
                              s.map((x) => (x.id === p.id ? { ...x, fundingType: 'Construction' } : x)),
                            )
                          }
                          className="accent-gold"
                        />
                        Construction
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Cost basis
                    </div>
                    <a
                      href="#"
                      className="text-xs font-mono text-gold-dark hover:underline inline-flex items-center gap-1"
                    >
                      SCT validation log <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Evidence pane */}
                <div>
                  <button
                    onClick={() => toggleEvidence(p.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs hover:bg-secondary/30"
                  >
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      {evOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      Show evidence for all values
                    </span>
                    <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  {evOpen && (
                    <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] animate-in fade-in slide-in-from-top-1 duration-200">
                      <EvidenceRow
                        label="BDP record"
                        value={`${evidence.bdp.record} · last updated ${evidence.bdp.last_updated} by ${evidence.bdp.author}`}
                      />
                      <EvidenceRow
                        label="SCT validation log"
                        value={`${evidence.sct.validator} · validated ${evidence.sct.validation_date}`}
                      />
                      <EvidenceRow
                        label="Seated Calculator output"
                        value={`${evidence.seated_calc.output_date} · ${evidence.seated_calc.author}`}
                      />
                      <EvidenceRow
                        label="POR registry"
                        value={`${evidence.por.version} · ${evidence.por.registry_id}`}
                      />
                      <EvidenceRow
                        label="FX rate snapshot"
                        value={`${evidence.fx.rate} · ${evidence.fx.snapshot_at}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* REGION 4 — Cycle summary footer */}
        <div className="bg-navy dark:bg-card text-white dark:text-foreground rounded-xl p-5 border border-gold/20 dark:border-gold/30">
          <h3 className="text-[11px] uppercase tracking-wider text-white/60 dark:text-muted-foreground mb-3">Cycle Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <SummaryStat label="Total projects" value={String(totalProjects)} />
            <SummaryStat label="Total funding ask" value={`$${totalFunding.toFixed(1)}M`} accent />
            <SummaryStat label="Seed asks" value={`$${seedTotal.toFixed(1)}M`} subtitle={`${selected.filter((p) => p.fundingType === 'Seed').length} projects`} />
            <SummaryStat label="Construction asks" value={`$${constrTotal.toFixed(1)}M`} subtitle={`${selected.filter((p) => p.fundingType === 'Construction').length} projects`} />
            <SummaryStat label="Concurrent flag set" value={`${concurrentCount} projects`} />
            <SummaryStat label="Estimated savings" value={`$${cycleSavings.toFixed(1)}M`} subtitle="vs phased" green />
          </div>
        </div>
      </div>

      {/* Edit-locked toast */}
      {editLocked && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-navy dark:bg-card text-white dark:text-foreground rounded-xl shadow-lg border border-gold/30 p-4 max-w-sm animate-in slide-in-from-bottom-2 duration-200"
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1">{editLocked.field} is non-editable</p>
              <p className="text-[11px] text-white/70 mb-2">
                To change, edit the source record. Termsheet pulls live values.
              </p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="text-[11px] font-medium text-gold inline-flex items-center gap-1 hover:underline"
                >
                  Open source record <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setEditLocked(null)}
                  className="text-[11px] text-white/60 hover:text-white ml-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {action.element}
    </AppShell>
  )
}
// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NonEditableField({
  label,
  value,
  evidenceText,
  onClickEvidence,
  onClickField,
  showPopover,
  closePopover,
}: {
  label: string
  value: string
  evidenceKey: string
  evidenceText: string
  onClickEvidence: () => void
  onClickField: () => void
  showPopover: boolean
  closePopover: () => void
}) {
  return (
    <div className="relative">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
        {label}
        <button
          onClick={onClickEvidence}
          className="text-muted-foreground/60 hover:text-gold-dark"
          aria-label={`Evidence for ${label}`}
        >
          <HelpCircle className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={onClickField}
        className="text-sm font-mono font-semibold text-foreground text-left hover:text-gold-dark transition-colors"
      >
        {value}
      </button>
      {showPopover && (
        <div
          className="absolute z-30 top-full left-0 mt-1 bg-navy dark:bg-card text-white dark:text-foreground text-[11px] rounded-lg p-3 w-[260px] shadow-lg border border-gold/30 dark:border-line"
          onMouseLeave={closePopover}
        >
          <div className="font-semibold text-gold mb-1">Evidence</div>
          <div className="text-white/80 dark:text-muted-foreground">{evidenceText}</div>
          <a
            href="#"
            className="mt-2 text-[11px] font-medium text-gold inline-flex items-center gap-1 hover:underline"
          >
            Open canonical record <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

function EvidenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/40 border border-line rounded-md px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-foreground font-mono text-[11px] mt-0.5">{value}</div>
    </div>
  )
}

function SummaryStat({
  label,
  value,
  subtitle,
  accent,
  green,
}: {
  label: string
  value: string
  subtitle?: string
  accent?: boolean
  green?: boolean
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/60 dark:text-muted-foreground mb-1">{label}</div>
      <div
        className={`font-mono font-bold ${
          accent ? 'text-2xl text-gold' : green ? 'text-xl text-green' : 'text-xl text-white dark:text-foreground'
        }`}
      >
        {value}
      </div>
      {subtitle && <div className="text-[10px] text-white/50 dark:text-muted-foreground mt-0.5">{subtitle}</div>}
    </div>
  )
}

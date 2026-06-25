'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import {
  Search,
  Download,
  RefreshCcw,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ExternalLink,
  FileUp,
  Send,
  XCircle,
  Eye,
  Pencil,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import { FadeUp, AnimNum } from '@/components/animated-primitives'

type MismatchType = 'Not on BDP' | 'BDP Stale' | 'MW Mismatch' | 'Phase Mismatch'
type ConflictStatus = 'Open' | 'In Discussion' | 'Awaiting BDP Update' | 'Awaiting Leadership' | 'Resolved'

type Conflict = {
  id: string
  project: string
  region: 'NA-E' | 'NA-W' | 'EMEA'
  mismatchType: MismatchType
  directiveAttached: boolean
  directiveAuthor?: string
  directiveDate?: string
  bdpLastUpdated: string
  bdpDaysAgo: number
  bdpStale: boolean
  daysPending: number
  owner: string
  status: ConflictStatus
  bdp: {
    project: string | null
    mwTriggering: number | null
    phase: string | null
    lastUpdated: string | null
  }
  termsheet: {
    project: string
    mwTriggering: number
    phase: string
    sourceCycle: string
    sourceOwner: string
  }
}

const conflicts: Conflict[] = [
  {
    id: 'C-001',
    project: 'HRF-Hub1-1&2&3',
    region: 'NA-W',
    mismatchType: 'Not on BDP',
    directiveAttached: true,
    directiveAuthor: 'Brian Smith',
    directiveDate: '2026-04-30',
    bdpLastUpdated: '2026-01-12',
    bdpDaysAgo: 95,
    bdpStale: true,
    daysPending: 12,
    owner: 'Hasit Chetal',
    status: 'Awaiting BDP Update',
    bdp: { project: null, mwTriggering: null, phase: null, lastUpdated: '2026-01-12' },
    termsheet: {
      project: 'HRF-Hub1-1&2&3',
      mwTriggering: 480,
      phase: 'Concurrent (Day-end 1,120)',
      sourceCycle: 'Termsheet 2026-05 cycle',
      sourceOwner: 'Alice Cox',
    },
  },
  {
    id: 'C-002',
    project: 'PYB-Hub1-1&2&3',
    region: 'NA-E',
    mismatchType: 'MW Mismatch',
    directiveAttached: false,
    bdpLastUpdated: '2026-04-10',
    bdpDaysAgo: 8,
    bdpStale: false,
    daysPending: 5,
    owner: 'Hasit Chetal',
    status: 'In Discussion',
    bdp: { project: 'PYB-Hub1-1&2&3', mwTriggering: 320, phase: 'Single', lastUpdated: '2026-04-10' },
    termsheet: {
      project: 'PYB-Hub1-1&2&3',
      mwTriggering: 480,
      phase: 'Single',
      sourceCycle: 'Termsheet 2026-05 cycle',
      sourceOwner: 'Alice Cox',
    },
  },
  {
    id: 'C-003',
    project: 'LCT-Hub1-3',
    region: 'NA-E',
    mismatchType: 'BDP Stale',
    directiveAttached: false,
    bdpLastUpdated: '2025-11-22',
    bdpDaysAgo: 178,
    bdpStale: true,
    daysPending: 18,
    owner: 'Hasit Chetal',
    status: 'Awaiting Leadership',
    bdp: { project: 'LCT-Hub1-3', mwTriggering: 240, phase: 'Single', lastUpdated: '2025-11-22' },
    termsheet: {
      project: 'LCT-Hub1-3',
      mwTriggering: 360,
      phase: 'Concurrent (Day-end 720)',
      sourceCycle: 'Termsheet 2026-05 cycle',
      sourceOwner: 'Alice Cox',
    },
  },
  {
    id: 'C-004',
    project: 'VLB-Hub1-1&2',
    region: 'EMEA',
    mismatchType: 'Phase Mismatch',
    directiveAttached: false,
    bdpLastUpdated: '2026-03-15',
    bdpDaysAgo: 33,
    bdpStale: false,
    daysPending: 3,
    owner: 'Paul Cahill',
    status: 'Open',
    bdp: { project: 'VLB-Hub1-1&2', mwTriggering: 240, phase: 'Single', lastUpdated: '2026-03-15' },
    termsheet: {
      project: 'VLB-Hub1-1&2',
      mwTriggering: 240,
      phase: 'Concurrent (Day-end 480)',
      sourceCycle: 'Termsheet 2026-05 cycle',
      sourceOwner: 'Alice Cox',
    },
  },
]

const mismatchFilters = ['All', 'Not on BDP', 'BDP Stale', 'MW Mismatch', 'Phase Mismatch'] as const
type MismatchFilter = (typeof mismatchFilters)[number]

const cycleOptions = ['Current', 'Trailing 90d'] as const
type CycleOption = (typeof cycleOptions)[number]

function statusChipClasses(status: ConflictStatus) {
  switch (status) {
    case 'Resolved':
      return 'bg-green/15 text-green border border-green/30'
    case 'In Discussion':
      return 'bg-gold/15 text-gold border border-gold/30'
    case 'Awaiting BDP Update':
    case 'Awaiting Leadership':
      return 'bg-amber/15 text-amber border border-amber/30'
    default:
      return 'bg-red/15 text-red border border-red/30'
  }
}

function mismatchChipClasses(type: MismatchType) {
  switch (type) {
    case 'Not on BDP':
      return 'bg-red/15 text-red border border-red/30'
    case 'BDP Stale':
      return 'bg-amber/15 text-amber border border-amber/30'
    case 'MW Mismatch':
      return 'bg-gold/15 text-gold border border-gold/30'
    case 'Phase Mismatch':
      return 'bg-teal/15 text-teal border border-teal/30'
  }
}

function regionChipClasses(region: Conflict['region']) {
  return 'bg-secondary text-muted-foreground border border-line'
}

export default function BDPFactCheckPage() {
  const [mismatchFilter, setMismatchFilter] = React.useState<MismatchFilter>('All')
  const [cycle, setCycle] = React.useState<CycleOption>('Current')
  const [editMode, setEditMode] = React.useState<'edit' | 'readonly'>('edit')
  const [search, setSearch] = React.useState('')
  const [expandedId, setExpandedId] = React.useState<string | null>('C-001')
  const [directiveModalOpen, setDirectiveModalOpen] = React.useState(false)
  const [directiveText, setDirectiveText] = React.useState('')
  const [directiveAttested, setDirectiveAttested] = React.useState(false)
  const [resolvedIds, setResolvedIds] = React.useState<Set<string>>(new Set())
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastRefreshed, setLastRefreshed] = React.useState<Date>(new Date())

  const isReadOnly = editMode === 'readonly'

  const filtered = React.useMemo(() => {
    return conflicts.filter((c) => {
      if (mismatchFilter !== 'All' && c.mismatchType !== mismatchFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !c.project.toLowerCase().includes(q) &&
          !c.owner.toLowerCase().includes(q) &&
          !c.mismatchType.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [mismatchFilter, search])

  const expanded = filtered.find((c) => c.id === expandedId) ?? null

  const handleAttachDirective = () => {
    if (!expanded) return
    if (!directiveAttested) return
    setResolvedIds((prev) => new Set(prev).add(expanded.id))
    setDirectiveModalOpen(false)
    setDirectiveText('')
    setDirectiveAttested(false)
  }

  // Export functionality - generates CSV and downloads it
  const handleExport = () => {
    const headers = ['Project', 'Region', 'Mismatch Type', 'Leadership Directive', 'BDP Last Updated', 'Days Pending', 'Owner', 'Status']
    const rows = filtered.map(c => [
      c.project,
      c.region,
      c.mismatchType,
      c.directiveAttached ? `Yes (${c.directiveAuthor} - ${c.directiveDate})` : 'No',
      c.bdpLastUpdated,
      `${c.daysPending}d`,
      c.owner,
      resolvedIds.has(c.id) ? 'Resolved' : c.status
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bdp-conflicts-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Refresh functionality - simulates data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastRefreshed(new Date())
    setIsRefreshing(false)
  }

  const formatLastRefreshed = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }) + ' UTC'
  }

  return (
    <AppShell title="BDP Fact-Check Console" subtitle="Reconcile funding asks with the Building Development Plan before submission" activeHref="/bdp-factcheck">
      <div className="space-y-5">
        {/* Header strip */}
        <div className="bg-card rounded-xl border border-line p-4 flex flex-wrap items-center gap-3">
          {/* Mismatch type filter */}
          <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
            {mismatchFilters.map((f) => (
              <button
                key={f}
                onClick={() => setMismatchFilter(f)}
                className={`px-3 h-7 text-[11px] font-medium rounded-md transition-colors ${
                  mismatchFilter === f
                    ? 'bg-gold text-navy shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Cycle filter */}
          <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
            {cycleOptions.map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`px-3 h-7 text-[11px] font-medium rounded-md transition-colors ${
                  cycle === c ? 'bg-gold text-navy' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Persona toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line ml-auto">
            <button
              onClick={() => setEditMode('edit')}
              className={`flex items-center gap-1.5 px-3 h-7 text-[11px] font-medium rounded-md transition-colors ${
                editMode === 'edit' ? 'bg-gold text-navy' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Pencil className="w-3 h-3" />
              Edit (Hasit)
            </button>
            <button
              onClick={() => setEditMode('readonly')}
              className={`flex items-center gap-1.5 px-3 h-7 text-[11px] font-medium rounded-md transition-colors ${
                editMode === 'readonly' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3 h-3" />
              Read-only (Sophia)
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conflicts..."
              className="h-8 w-[180px] pl-8 pr-3 text-xs border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <button 
            onClick={handleExport}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs border border-line rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs border border-line rounded-lg bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* REGION 1 — KPI strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Pending BDP issues" value="3" delta="▲ 1" tone="red" icon={AlertTriangle} />
          <KpiCard label="Resolved this cycle" value="7" delta="—" tone="green" icon={CheckCircle2} />
          <KpiCard label="Median time-to-resolve" value="4d" delta="▼ 2" tone="green" target="Target: 3d" icon={Clock} />
          <KpiCard label="Blocked >7 days" value="1" delta="—" tone="amber" icon={ShieldAlert} />
        </div>

        {/* REGION 2 — Conflict list */}
        <section className="bg-card rounded-xl border border-line overflow-hidden">
          <header className="flex items-center justify-between px-5 py-3 border-b border-line">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Active BDP Conflicts</h2>
              <p className="text-[11px] text-muted-foreground">
                {filtered.length} of {conflicts.length} • A-205 BDP Reconciler agent monitors continuously
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              Last refreshed: {formatLastRefreshed(lastRefreshed)}
            </span>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/40 border-b border-line text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left px-4 py-2.5 font-medium">Project</th>
                  <th className="text-left px-3 py-2.5 font-medium">Region</th>
                  <th className="text-left px-3 py-2.5 font-medium">Mismatch Type</th>
                  <th className="text-left px-3 py-2.5 font-medium">Leadership Directive</th>
                  <th className="text-left px-3 py-2.5 font-medium">BDP Last Updated</th>
                  <th className="text-left px-3 py-2.5 font-medium">Days Pending</th>
                  <th className="text-left px-3 py-2.5 font-medium">Owner</th>
                  <th className="text-left px-3 py-2.5 font-medium">Status</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const isResolved = resolvedIds.has(c.id) || c.status === 'Resolved'
                  const effectiveStatus: ConflictStatus = isResolved ? 'Resolved' : c.status
                  const isExpanded = expandedId === c.id
                  return (
                    <React.Fragment key={c.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        className={`border-b border-line cursor-pointer transition-colors ${
                          isExpanded ? 'bg-gold/5' : 'hover:bg-secondary/30'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-medium text-foreground">{c.project}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 h-5 text-[10px] font-medium rounded ${regionChipClasses(c.region)}`}>
                            {c.region}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 h-5 text-[10px] font-medium rounded ${mismatchChipClasses(c.mismatchType)}`}>
                            {c.mismatchType}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {c.directiveAttached ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-green">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-muted-foreground">
                                Yes ({c.directiveAuthor} · {c.directiveDate})
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <XCircle className="w-3.5 h-3.5 text-red/70" />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-foreground">
                          {c.bdpLastUpdated}
                          {c.bdpStale && (
                            <span className="ml-2 inline-flex items-center px-1.5 h-4 text-[9px] font-semibold rounded bg-amber/15 text-amber border border-amber/30">
                              stale · {c.bdpDaysAgo}d ago
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-foreground">{c.daysPending}d</td>
                        <td className="px-3 py-3 text-foreground">{c.owner}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 h-5 text-[10px] font-medium rounded ${statusChipClasses(effectiveStatus)}`}>
                            {effectiveStatus}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </td>
                      </tr>

                      {/* REGION 3 — Resolution panel inline */}
                      {isExpanded && (
                        <tr className="bg-secondary/20 border-b border-line">
                          <td colSpan={9} className="p-0">
                            <ResolutionPanel
                              conflict={c}
                              isReadOnly={isReadOnly}
                              isResolved={isResolved}
                              onAttachDirective={() => setDirectiveModalOpen(true)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Attach Directive Modal */}
      {directiveModalOpen && expanded && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-150">
          <div className="bg-card rounded-xl border border-line shadow-xl max-w-lg w-full p-6 animate-in slide-in-from-bottom-2">
            <header className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-gold" />
                  Attach Leadership Directive
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {expanded.project} · Authorize proceeding without BDP update
                </p>
              </div>
              <button
                onClick={() => setDirectiveModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1.5">
                  Directive document
                </label>
                <button className="w-full h-20 border border-dashed border-line rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-secondary/30 transition-colors">
                  <FileUp className="w-4 h-4" />
                  <span className="text-[11px]">Upload PDF or email export</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1.5">
                  Context / decision summary
                </label>
                <textarea
                  value={directiveText}
                  onChange={(e) => setDirectiveText(e.target.value)}
                  rows={3}
                  placeholder="e.g., Brian Smith approved 2026-04-30 standup; HRF needed for NA-W demand pull-in. BDP refresh expected in May cycle."
                  className="w-full text-xs p-2.5 border border-line rounded-lg bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                />
              </div>

              <label className="flex items-start gap-2 p-3 rounded-lg border border-amber/30 bg-amber/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={directiveAttested}
                  onChange={(e) => setDirectiveAttested(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-[11px] text-foreground leading-relaxed">
                  I attest that <span className="font-semibold">Brian Smith / Anu Reddi</span> has
                  authorized proceeding without BDP update. This attestation is logged to the
                  audit trail.
                </span>
              </label>
            </div>

            <footer className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setDirectiveModalOpen(false)}
                className="h-8 px-3 text-xs border border-line rounded-lg bg-secondary/40 hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachDirective}
                disabled={!directiveAttested}
                className="h-8 px-3 text-xs font-semibold rounded-lg bg-gold text-navy hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Attach & Mark Resolved
              </button>
            </footer>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function KpiCard({
  label,
  value,
  delta,
  tone,
  target,
  icon: Icon,
}: {
  label: string
  value: string
  delta: string
  tone: 'red' | 'green' | 'amber' | 'gold'
  target?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const toneMap: Record<string, { bar: string; text: string; bg: string }> = {
    red: { bar: 'bg-red', text: 'text-red', bg: 'bg-red/10' },
    green: { bar: 'bg-green', text: 'text-green', bg: 'bg-green/10' },
    amber: { bar: 'bg-amber', text: 'text-amber', bg: 'bg-amber/10' },
    gold: { bar: 'bg-gold', text: 'text-gold', bg: 'bg-gold/10' },
  }
  const t = toneMap[tone]
  return (
    <div className="bg-card rounded-xl border border-line p-4 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </p>
          <p className="text-2xl font-mono font-bold text-foreground mt-1.5">{value}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-[11px] font-mono font-medium ${t.text}`}>{delta}</span>
            {target && <span className="text-[10px] text-muted-foreground">{target}</span>}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${t.text}`} />
        </div>
      </div>
    </div>
  )
}

function ResolutionPanel({
  conflict,
  isReadOnly,
  isResolved,
  onAttachDirective,
}: {
  conflict: Conflict
  isReadOnly: boolean
  isResolved: boolean
  onAttachDirective: () => void
}) {
  const fields = [
    { key: 'project', label: 'Project' },
    { key: 'mwTriggering', label: 'MW Triggering' },
    { key: 'phase', label: 'Phase' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ] as const

  const bdpVal = (k: string) => {
    if (k === 'project') return conflict.bdp.project ?? '—'
    if (k === 'mwTriggering') return conflict.bdp.mwTriggering?.toString() ?? '—'
    if (k === 'phase') return conflict.bdp.phase ?? '—'
    if (k === 'lastUpdated') return conflict.bdp.lastUpdated ?? '—'
    return '—'
  }
  const tsVal = (k: string) => {
    if (k === 'project') return conflict.termsheet.project
    if (k === 'mwTriggering') return conflict.termsheet.mwTriggering.toString()
    if (k === 'phase') return conflict.termsheet.phase
    if (k === 'lastUpdated') return '—'
    return '—'
  }
  const isDiff = (k: string) => {
    if (k === 'lastUpdated') return false
    return bdpVal(k) !== tsVal(k)
  }

  return (
    <div className="px-5 py-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Resolve · <span className="font-mono text-gold">{conflict.project}</span>
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">Conflict ID: {conflict.id}</span>
      </div>

      {/* Side-by-side diff */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        {/* BDP Record */}
        <div className="bg-card rounded-lg border border-line p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              BDP Record
            </h4>
            {conflict.bdpStale && (
              <span className="inline-flex items-center px-1.5 h-4 text-[9px] font-semibold rounded bg-amber/15 text-amber border border-amber/30">
                STALE · {conflict.bdpDaysAgo}d ago
              </span>
            )}
          </div>
          <dl className="space-y-2.5">
            {fields.map((f) => (
              <div
                key={f.key}
                className={`grid grid-cols-[110px_1fr] gap-2 text-xs ${
                  isDiff(f.key) ? 'bg-red/5 -mx-2 px-2 py-1 rounded' : ''
                }`}
              >
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className={`font-mono ${isDiff(f.key) ? 'text-red' : 'text-foreground'}`}>
                  {bdpVal(f.key)}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-[110px_1fr] gap-2 text-xs pt-1">
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-foreground">BDP system</dd>
            </div>
          </dl>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-1 text-[11px] text-gold hover:underline"
          >
            Open in BDP <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex flex-col items-center justify-center px-2">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1 font-mono">
            diff
          </span>
        </div>

        {/* Termsheet Record */}
        <div className="bg-card rounded-lg border border-line p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Termsheet Record
            </h4>
            <span className="inline-flex items-center px-1.5 h-4 text-[9px] font-semibold rounded bg-gold/15 text-gold border border-gold/30">
              ACTIVE
            </span>
          </div>
          <dl className="space-y-2.5">
            {fields.map((f) => (
              <div
                key={f.key}
                className={`grid grid-cols-[110px_1fr] gap-2 text-xs ${
                  isDiff(f.key) ? 'bg-red/5 -mx-2 px-2 py-1 rounded' : ''
                }`}
              >
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className={`font-mono ${isDiff(f.key) ? 'text-red' : 'text-foreground'}`}>
                  {f.key === 'lastUpdated' ? '—' : tsVal(f.key)}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-[110px_1fr] gap-2 text-xs pt-1">
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-foreground">
                {conflict.termsheet.sourceCycle}
                <span className="text-muted-foreground"> ({conflict.termsheet.sourceOwner})</span>
              </dd>
            </div>
          </dl>
          <a
            href="/termsheet"
            className="mt-4 inline-flex items-center gap-1 text-[11px] text-gold hover:underline"
          >
            Open in Termsheet <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Resolution Actions */}
      <div className="bg-card rounded-lg border border-line p-4">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Resolution Actions
          </h4>
          {isReadOnly && (
            <span className="inline-flex items-center gap-1 px-2 h-5 text-[10px] font-medium rounded bg-secondary text-muted-foreground border border-line">
              <Eye className="w-3 h-3" /> Read-only — Sophia Lamb (Finance Partner)
            </span>
          )}
          {isResolved && (
            <span className="inline-flex items-center gap-1 px-2 h-5 text-[10px] font-medium rounded bg-green/15 text-green border border-green/30">
              <CheckCircle2 className="w-3 h-3" /> Resolved · Eligible for FP&amp;A submission
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <ActionButton
            icon={ExternalLink}
            label="Update BDP record"
            description="Open BDP system in new tab"
            disabled={isReadOnly || isResolved}
            tone="primary"
          />
          <ActionButton
            icon={FileUp}
            label="Attach leadership directive"
            description="Upload + attestation"
            disabled={isReadOnly || isResolved}
            onClick={onAttachDirective}
            tone="gold"
          />
          <ActionButton
            icon={Send}
            label="Escalate to Sophia Lamb"
            description="Finance pre-approval"
            disabled={isReadOnly || isResolved}
          />
          <ActionButton
            icon={XCircle}
            label="Withdraw from cycle"
            description="Remove funding ask"
            disabled={isReadOnly || isResolved}
            tone="danger"
          />
        </div>

        {!isResolved && !isReadOnly && (
          <p className="text-[11px] text-muted-foreground mt-3 inline-flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3" />
            Submission to FP&amp;A is blocked until BDP is updated, or a leadership directive is
            attached and attested.
          </p>
        )}
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  description,
  disabled,
  onClick,
  tone = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  disabled?: boolean
  onClick?: () => void
  tone?: 'default' | 'primary' | 'gold' | 'danger'
}) {
  const toneMap: Record<string, string> = {
    default: 'border-line hover:border-foreground/30 hover:bg-secondary/40',
    primary: 'border-line hover:border-foreground/30 hover:bg-secondary/40',
    gold: 'border-gold/30 hover:border-gold hover:bg-gold/5',
    danger: 'border-red/20 hover:border-red/40 hover:bg-red/5',
  }
  const iconColor: Record<string, string> = {
    default: 'text-muted-foreground',
    primary: 'text-foreground',
    gold: 'text-gold',
    danger: 'text-red',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left p-3 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${toneMap[tone]}`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`w-3.5 h-3.5 mt-0.5 ${iconColor[tone]}`} />
        <div>
          <p className="text-[11px] font-semibold text-foreground leading-tight">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  )
}

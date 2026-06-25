'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { OrchestrationTable } from '@/components/orchestration-table'
import { DetailDrawer } from '@/components/detail-drawer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  allOrchestrations,
  getStatusCounts,
  type Orchestration,
  type SLAStatus,
} from '@/lib/orchestration-data'
import { FadeUp, AnimNum } from '@/components/animated-primitives'

type FilterState = 'all' | 'BREACH' | 'SEVERE' | 'PRE-BREACH' | 'ON TRACK' | 'agent'

// Export data to CSV
function exportToCSV(data: Orchestration[], filename: string) {
  const headers = ['Process', 'Project', 'Stage', 'Owner Role', 'Current Filler', 'Status', 'Elapsed', 'Agent']
  const rows = data.map(item => [
    item.process,
    item.project,
    item.stage,
    item.ownerRole,
    item.currentFiller,
    item.status,
    item.elapsed,
    item.agent || ''
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Process types available in the data
const processTypes = [
  { value: 'all-processes', label: 'All processes' },
  { value: 'RFI Response', label: 'RFI Response' },
  { value: 'Change Order Routing', label: 'Change Order' },
  { value: 'Invoice Reconciliation', label: 'Invoice Recon' },
  { value: 'Contractor Onboarding', label: 'Onboarding' },
  { value: 'Monthly Report', label: 'Monthly Report' },
  { value: 'Submittal Approval', label: 'Submittal' },
  { value: 'Milestone Gate Review', label: 'Gate Review' },
]

// Programs (derived from project names)
const programs = [
  { value: 'all-programs', label: 'All programs' },
  { value: 'Henderson', label: 'Henderson' },
  { value: 'Council Bluffs', label: 'Council Bluffs' },
  { value: 'Ashburn', label: 'Ashburn' },
  { value: 'Dallas', label: 'Dallas' },
  { value: 'Lenoir', label: 'Lenoir' },
  { value: 'Phoenix', label: 'Phoenix' },
  { value: 'Atlanta', label: 'Atlanta' },
]

// Regions
const regions = [
  { value: 'all-regions', label: 'All regions' },
  { value: 'us-east', label: 'US East' },
  { value: 'us-central', label: 'US Central' },
  { value: 'us-west', label: 'US West' },
]

// Map projects to regions
const projectRegionMap: Record<string, string> = {
  'Henderson Power Shell': 'us-west',
  'Council Bluffs Phase 4': 'us-central',
  'Ashburn Pod 6': 'us-east',
  'Dallas Cooling Retrofit': 'us-central',
  'Lenoir Fiber Build': 'us-east',
  'Phoenix Solar Farm': 'us-west',
  'Atlanta Hub Expansion': 'us-east',
}

export default function LeadOperationalView() {
  const [activeFilter, setActiveFilter] = React.useState<FilterState>('all')
  const [processFilter, setProcessFilter] = React.useState('all-processes')
  const [programFilter, setProgramFilter] = React.useState('all-programs')
  const [regionFilter, setRegionFilter] = React.useState('all-regions')
  const [selectedItem, setSelectedItem] = React.useState<Orchestration | null>(null)
  const [staleMinutes, setStaleMinutes] = React.useState(0)

  // Apply all filters to get base data
  const baseFilteredData = React.useMemo(() => {
    let data = allOrchestrations

    // Filter by process type
    if (processFilter !== 'all-processes') {
      data = data.filter(d => d.process === processFilter)
    }

    // Filter by program (project name contains program)
    if (programFilter !== 'all-programs') {
      data = data.filter(d => d.project.includes(programFilter))
    }

    // Filter by region
    if (regionFilter !== 'all-regions') {
      data = data.filter(d => projectRegionMap[d.project] === regionFilter)
    }

    return data
  }, [processFilter, programFilter, regionFilter])

  // Calculate counts based on filtered data
  const counts = React.useMemo(() => getStatusCounts(baseFilteredData), [baseFilteredData])

  // Track time since last refresh
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStaleMinutes((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredData = React.useMemo(() => {
    if (activeFilter === 'all') return baseFilteredData
    if (activeFilter === 'agent') return baseFilteredData.filter(d => d.agent !== null)
    return baseFilteredData.filter(d => d.status === activeFilter)
  }, [activeFilter, baseFilteredData])

  const filterChips: { key: FilterState; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'BREACH', label: 'Past SLA', count: counts.breach },
    { key: 'SEVERE', label: 'Significantly past SLA', count: counts.severe },
    { key: 'PRE-BREACH', label: 'Approaching SLA', count: counts.preBreach },
    { key: 'ON TRACK', label: 'On Track', count: counts.onTrack },
    { key: 'agent', label: 'Agent-involved', count: counts.agentInvolved },
  ]

  const handleSelectRow = (item: Orchestration) => {
    setSelectedItem(prev => prev?.id === item.id ? null : item)
  }

  return (
    <AppShell
      title="Lead Operational View"
      subtitle="Orchestration command center — What needs attention right now?"
      activeHref="/lead"
    >
      <motion.div 
        className="flex h-[calc(100vh-3.5rem)] -m-3 sm:-m-4 lg:-m-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 lg:p-6">
          {/* Stale Data Banner */}
          {staleMinutes >= 15 && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber/10 border border-amber/20 flex items-center gap-2">
              <span className="text-xs text-amber font-medium">
                Data last refreshed at {new Date(Date.now() - staleMinutes * 60000).toLocaleTimeString()}. Refreshing now.
              </span>
            </div>
          )}

          {/* HEADER: Filter Bar */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {filterChips.map((chip) => {
                const isActive = activeFilter === chip.key
                const dotColor =
                  chip.key === 'BREACH' ? 'bg-red' :
                  chip.key === 'SEVERE' ? 'bg-red-dark dark:bg-red' :
                  chip.key === 'PRE-BREACH' ? 'bg-amber' :
                  chip.key === 'ON TRACK' ? 'bg-green' :
                  chip.key === 'agent' ? 'bg-teal' :
                  ''

                return (
                  <button
                    key={chip.key}
                    onClick={() => setActiveFilter(chip.key)}
                    className={cn(
                      'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
                      isActive
                        ? 'bg-navy text-white border-navy dark:bg-gold dark:text-navy dark:border-gold shadow-sm'
                        : 'bg-card text-foreground/70 border-line hover:border-foreground/20 hover:bg-muted/50'
                    )}
                  >
                    {chip.key !== 'all' && chip.key !== 'agent' && (
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor, isActive && 'opacity-70')} />
                    )}
                    {chip.label}
                    <span className={cn(
                      'tabular-nums font-bold',
                      isActive ? 'opacity-90' : 'opacity-50'
                    )}>
                      {chip.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right-side Filters */}
            <div className="flex items-center gap-2">
              <Select value={processFilter} onValueChange={setProcessFilter}>
                <SelectTrigger className="h-8 w-[150px] text-xs border-line">
                  <Filter className="w-3 h-3 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {processTypes.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs border-line">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-8 w-[130px] text-xs border-line">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs gap-1.5"
                onClick={() => exportToCSV(filteredData, `orchestrations-${new Date().toISOString().split('T')[0]}.csv`)}
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </div>

          {/* REGION 1: SLA State Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <SLAStateCard
              label="Past SLA"
              count={counts.breach}
              color="red"
              isActive={activeFilter === 'BREACH'}
              onClick={() => setActiveFilter(activeFilter === 'BREACH' ? 'all' : 'BREACH')}
            />
            <SLAStateCard
              label="Significantly past SLA"
              count={counts.severe}
              color="red-dark"
              isActive={activeFilter === 'SEVERE'}
              onClick={() => setActiveFilter(activeFilter === 'SEVERE' ? 'all' : 'SEVERE')}
            />
            <SLAStateCard
              label="Approaching SLA"
              count={counts.preBreach}
              color="amber"
              isActive={activeFilter === 'PRE-BREACH'}
              onClick={() => setActiveFilter(activeFilter === 'PRE-BREACH' ? 'all' : 'PRE-BREACH')}
            />
            <SLAStateCard
              label="On Track"
              count={counts.onTrack}
              color="green"
              isActive={activeFilter === 'ON TRACK'}
              onClick={() => setActiveFilter(activeFilter === 'ON TRACK' ? 'all' : 'ON TRACK')}
            />
          </div>

          {/* REGION 2: Orchestration Table */}
          <div className="flex-1 overflow-auto">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  No orchestrations match this filter
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-xs text-gold hover:underline font-medium"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <OrchestrationTable
                data={filteredData}
                onSelectRow={handleSelectRow}
                selectedId={selectedItem?.id ?? null}
              />
            )}
          </div>
        </div>

        {/* REGION 3: Detail Drawer */}
        {selectedItem && (
          <DetailDrawer
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </motion.div>
    </AppShell>
  )
}

// ── SLA State Card ──

function SLAStateCard({
  label,
  count,
  color,
  isActive,
  onClick,
}: {
  label: string
  count: number
  color: 'red' | 'red-dark' | 'amber' | 'green'
  isActive: boolean
  onClick: () => void
}) {
  const colorMap = {
    red: {
      bg: 'bg-gradient-to-br from-red/15 to-red/5',
      text: 'text-red',
      activeBg: 'bg-gradient-to-br from-red/25 to-red/10',
      dot: 'bg-red',
    },
    'red-dark': {
      bg: 'bg-gradient-to-br from-red-dark/15 to-red-dark/5 dark:from-red/15 dark:to-red/5',
      text: 'text-red-dark dark:text-red',
      activeBg: 'bg-gradient-to-br from-red-dark/25 to-red-dark/10 dark:from-red/25 dark:to-red/10',
      dot: 'bg-red-dark dark:bg-red animate-pulse-dot',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber/15 to-amber/5',
      text: 'text-amber',
      activeBg: 'bg-gradient-to-br from-amber/25 to-amber/10',
      dot: 'bg-amber',
    },
    green: {
      bg: 'bg-gradient-to-br from-green/15 to-green/5',
      text: 'text-green',
      activeBg: 'bg-gradient-to-br from-green/25 to-green/10',
      dot: 'bg-green',
    },
  }

  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-2xl px-4 py-3 transition-all text-left',
        isActive
          ? `${c.activeBg} ring-1 ring-current/10`
          : `${c.bg} hover:brightness-110`
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={cn('w-2 h-2 rounded-full shrink-0', c.dot)} />
        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={cn('text-2xl font-bold font-mono tabular-nums', c.text)}>
        {count}
      </p>
    </button>
  )
}

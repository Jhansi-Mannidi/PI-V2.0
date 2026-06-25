'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import { exportToPDF } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Download,
  Calendar,
  GitBranch,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { AnimNum, FadeUp } from '@/components/animated-primitives'

const dependencies = [
  { id: 'D-001', upstream: 'PYB-Hub1-1&2&3', downstream: 'NCH-Hub1-1', type: 'Power Interconnect', status: 'On Track', risk: 'Low', owner: 'Sophia Lamb', dueDate: 'Jun 15, 2026', daysDelta: 0, notes: 'Substation tie-in coordinated with utility' },
  { id: 'D-002', upstream: 'HDL-Hub1-1&2&3', downstream: 'GOR-Hub1-1&2', type: 'Fiber Backbone', status: 'At Risk', risk: 'Medium', owner: 'Brian Smith', dueDate: 'May 28, 2026', daysDelta: -5, notes: 'Vendor delay on long-lead splicing equipment' },
  { id: 'D-003', upstream: 'CHB-Hub1-1&2&3', downstream: 'EWD-Hub2-1&2&3', type: 'Water Rights Transfer', status: 'Critical', risk: 'High', owner: 'Alice Cox', dueDate: 'May 20, 2026', daysDelta: -12, notes: 'Regulatory approval pending state board review' },
  { id: 'D-004', upstream: 'HRF-Hub1-1&2&3', downstream: 'CLB-Hub2-1&2', type: 'Shared Easement', status: 'On Track', risk: 'Low', owner: 'Hasit Chetal', dueDate: 'Jul 01, 2026', daysDelta: 3, notes: 'Legal review complete, signing scheduled' },
  { id: 'D-005', upstream: 'SGR-Hub1-2&3', downstream: 'PYB-Hub1-1&2&3', type: 'Cooling Loop', status: 'At Risk', risk: 'Medium', owner: 'Anu Reddy', dueDate: 'Jun 10, 2026', daysDelta: -3, notes: 'Pipe sizing revision required per MEP update' },
  { id: 'D-006', upstream: 'NCH-Hub1-1', downstream: 'HDL-Hub1-1&2&3', type: 'Access Road', status: 'On Track', risk: 'Low', owner: 'Sean Keegan', dueDate: 'Jun 22, 2026', daysDelta: 5, notes: 'Grading complete, paving in progress' },
  { id: 'D-007', upstream: 'GOR-Hub1-1&2', downstream: 'CHB-Hub1-1&2&3', type: 'Transformer Allocation', status: 'Critical', risk: 'High', owner: 'Sophia Lamb', dueDate: 'May 25, 2026', daysDelta: -8, notes: 'Utility capacity constraint under negotiation' },
  { id: 'D-008', upstream: 'EWD-Hub2-1&2&3', downstream: 'SGR-Hub1-2&3', type: 'Network Handoff', status: 'On Track', risk: 'Low', owner: 'Brian Smith', dueDate: 'Jul 15, 2026', daysDelta: 10, notes: 'NOC coordination scheduled for Q3' },
]

const kpis = { total: 8, onTrack: 4, atRisk: 2, critical: 2, avgSlippage: -2.5 }

const typeColors: Record<string, string> = {
  'Power Interconnect': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Fiber Backbone': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  'Water Rights Transfer': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  'Shared Easement': 'bg-slate-100 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300',
  'Cooling Loop': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  'Access Road': 'bg-stone-100 dark:bg-stone-700/30 text-stone-700 dark:text-stone-300',
  'Transformer Allocation': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Network Handoff': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  'On Track': { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', icon: CheckCircle2 },
  'At Risk': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40', icon: Clock },
  'Critical': { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40', icon: AlertTriangle },
}

export default function DependencyMapPage() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'On Track' | 'At Risk' | 'Critical'>('All')

  const filtered = statusFilter === 'All' ? dependencies : dependencies.filter(d => d.status === statusFilter)

  return (
    <AppShell title="Dependency Map">
      <motion.div 
        className="space-y-6 w-full"
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
        {/* Header */}
        <FadeUp delay={0}>
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link 
                href="/reports" 
                className="mt-0.5 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back to Reports"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                  <h1 className="text-sm sm:text-base font-semibold text-foreground">Cross-Functional Dependency Map</h1>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-3">Inter-project dependencies requiring coordination across teams</p>
                <div className="ml-3 mt-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-gold text-navy rounded-full">Cross-Functional Dependency Map · Q2 2026</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'dependency-map-q2-2026', title: 'Cross-Functional Dependency Map' })}
                className="h-8 px-3 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground border border-navy/30 dark:border-white/30 hover:bg-navy/20 dark:hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>
            </div>
          </div>
        </FadeUp>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <FadeUp delay={0.1}>
            <div className="p-3 rounded-lg bg-card border border-line">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><GitBranch className="w-3.5 h-3.5" /> Total Dependencies</div>
              <div className="text-2xl font-bold text-foreground"><AnimNum value={kpis.total} delay={200} /></div>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 mb-1"><CheckCircle2 className="w-3.5 h-3.5" /> On Track</div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-300"><AnimNum value={kpis.onTrack} delay={250} /></div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 mb-1"><Clock className="w-3.5 h-3.5" /> At Risk</div>
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300"><AnimNum value={kpis.atRisk} delay={300} /></div>
            </div>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
              <div className="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-400 mb-1"><AlertTriangle className="w-3.5 h-3.5" /> Critical</div>
              <div className="text-2xl font-bold text-red-800 dark:text-red-300"><AnimNum value={kpis.critical} delay={350} /></div>
            </div>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="p-3 rounded-lg bg-card border border-line col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Layers className="w-3.5 h-3.5" /> Avg Slippage</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400"><AnimNum value={`${kpis.avgSlippage}d`} delay={400} /></div>
            </div>
          </FadeUp>
        </div>

        {/* Dependency Table */}
        <FadeUp delay={0.35}>
          <div className="bg-card border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gold" /><div><h2 className="font-semibold text-foreground">Dependency Register</h2><p className="text-xs text-muted-foreground">{filtered.length} dependencies tracked</p></div></div>
            <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-lg border border-line">
              {(['All', 'On Track', 'At Risk', 'Critical'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 h-7 text-[11px] font-medium rounded-md transition-colors', statusFilter === s ? 'bg-gold text-navy' : 'text-muted-foreground hover:text-foreground')}>{s}</button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-secondary/50 border-b border-line text-left text-muted-foreground uppercase tracking-wider"><th className="px-4 py-3 font-medium">Dependency</th><th className="px-3 py-3 font-medium hidden sm:table-cell">Type</th><th className="px-3 py-3 font-medium hidden md:table-cell">Owner</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium text-right hidden lg:table-cell">Due Date</th><th className="px-3 py-3 font-medium text-right">Delta</th><th className="px-3 py-3 w-10"></th></tr></thead>
              <tbody className="divide-y divide-line">
                {filtered.map(dep => {
                  const isExpanded = expandedId === dep.id
                  const sCfg = statusConfig[dep.status]
                  const SIcon = sCfg.icon
                  return (
                    <React.Fragment key={dep.id}>
                      <tr onClick={() => setExpandedId(isExpanded ? null : dep.id)} className={cn('hover:bg-secondary/30 cursor-pointer transition-colors', dep.status === 'Critical' && 'bg-red-50/50 dark:bg-red-900/10')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="font-mono text-foreground">{dep.upstream}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                              <span className="font-mono text-foreground">{dep.downstream}</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{dep.id}</div>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', typeColors[dep.type])}>{dep.type}</span></td>
                        <td className="px-3 py-3 hidden md:table-cell text-foreground">{dep.owner}</td>
                        <td className="px-3 py-3"><span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium', sCfg.bg, sCfg.color)}><SIcon className="w-3 h-3" />{dep.status}</span></td>
                        <td className="px-3 py-3 text-right font-mono text-foreground hidden lg:table-cell">{dep.dueDate}</td>
                        <td className="px-3 py-3 text-right font-mono"><span className={cn(dep.daysDelta > 0 ? 'text-green-600 dark:text-green-400' : dep.daysDelta < 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground')}>{dep.daysDelta > 0 ? '+' : ''}{dep.daysDelta}d</span></td>
                        <td className="px-3 py-3">{isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}</td>
                      </tr>
                      {isExpanded && <tr className="bg-secondary/20"><td colSpan={7} className="px-4 py-4"><div className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">Notes:</strong> {dep.notes}</div><div className="flex items-center gap-3"><Link href={`/projects?id=${dep.upstream}`} className="text-[11px] font-medium text-gold hover:underline inline-flex items-center gap-1">View {dep.upstream} <ExternalLink className="w-3 h-3" /></Link><Link href={`/projects?id=${dep.downstream}`} className="text-[11px] font-medium text-gold hover:underline inline-flex items-center gap-1">View {dep.downstream} <ExternalLink className="w-3 h-3" /></Link></div></td></tr>}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          </div>
        </FadeUp>

        {/* Visual Map Placeholder */}
        <FadeUp delay={0.4}>
          <div className="bg-card border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4"><GitBranch className="w-5 h-5 text-gold" /><h2 className="font-semibold text-foreground">Visual Dependency Graph</h2></div>
            <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Interactive dependency visualization (D3/force-directed graph) coming in v2.5
            </div>
          </div>
        </FadeUp>

        {/* Annotation */}
        <FadeUp delay={0.45}>
          <div className="bg-gold/10 dark:bg-gold/5 border border-gold/30 rounded-xl p-4">
            <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-gold mt-0.5" /><div><h3 className="font-medium text-foreground mb-1">Dependency Management</h3><p className="text-sm text-muted-foreground">Critical dependencies (Water Rights Transfer, Transformer Allocation) require executive escalation. Weekly sync with affected PgMs scheduled every Tuesday.</p></div></div>
          </div>
        </FadeUp>

        <div className="text-[10px] text-muted-foreground font-mono border-t border-line pt-4 flex flex-wrap items-center justify-between gap-2"><span>Generated: {new Date().toLocaleString()} · v2.4.1</span><span>Distribution: Portfolio Leadership, PgM Bench</span></div>
      </motion.div>
    </AppShell>
  )
}

'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { exportToPDF } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Bot,
  Download,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  TrendingUp,
  UserCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Data
// ============================================================

const kpis = [
  { label: 'Service Roles Assessed', value: 142, icon: Users, color: 'border-muted-foreground' },
  { label: 'Resilient (≥2 fillers)', value: 124, pct: '87%', icon: ShieldCheck, color: 'border-green-500', status: 'green' },
  { label: 'At Risk (1 filler, no backup)', value: 14, pct: '10%', icon: AlertTriangle, color: 'border-gold', status: 'amber' },
  { label: 'Critical (1 filler, agent-only)', value: 4, pct: '3%', icon: AlertCircle, color: 'border-red-500', status: 'red' },
  { label: 'Roles With Agent Filler', value: 38, pct: '27%', icon: Bot, color: 'border-teal-500', status: 'teal' },
]

const atRiskRoles = [
  { id: 1, role: 'PgM — NA-W', process: 'Multiple (8 projects)', primary: 'Lisa McIntyre', backups: 'None', openItems: 14, risk: 'Amber', action: 'Cross-train Loren Smith' },
  { id: 2, role: 'PgM — APAC', process: 'Multiple (6 projects)', primary: 'Sam Long', backups: 'None', openItems: 9, risk: 'Amber', action: 'Cross-train Mary Khor' },
  { id: 3, role: 'Cost Manager — EMEA', process: 'Multiple (4 projects)', primary: 'Gabby', backups: 'None', openItems: 6, risk: 'Amber', action: 'Cross-train Otsigh' },
  { id: 4, role: 'Termsheet Reviewer — Anu Final', process: 'All bundles', primary: 'Anu Reddy', backups: 'None', openItems: 3, risk: 'Critical', action: 'Designate proxy reviewer' },
  { id: 5, role: 'Legal Review Lead', process: 'All Construction contracts', primary: 'Legal Lead', backups: 'Agent (advisory)', openItems: 11, risk: 'Critical', action: 'Cross-train Sr. Counsel' },
  { id: 6, role: 'Cap Planning Initiator', process: 'All Seed funding workflows', primary: 'Cap Planning Lead', backups: 'None', openItems: 14, risk: 'Critical', action: 'Cross-train Cap Planning #2' },
  { id: 7, role: 'LineSight Bundle Owner', process: 'All termsheet bundles', primary: 'Sreya', backups: 'Alice (partial)', openItems: 18, risk: 'Amber', action: 'Promote Alice to full backup' },
  { id: 8, role: 'Field Conditions Approver — NA-W', process: 'All PCOs in region', primary: 'Loren Smith', backups: 'Lisa (partial)', openItems: 8, risk: 'Amber', action: 'Promote Lisa to full backup' },
  { id: 9, role: 'CLC Lead', process: 'All CLC projects', primary: 'Atishu Jain', backups: 'None', openItems: 5, risk: 'Critical', action: 'Designate proxy' },
  { id: 10, role: 'BDP Coordinator', process: 'All BDP reconciliation', primary: 'Hasit Chetal', backups: 'None', openItems: 7, risk: 'Amber', action: 'Cross-train backup' },
]

const pgmBench = [
  { name: 'Lauren Culp', region: 'NA-E', projects: 12, crossTrained: 'Loren Smith (partial)', status: 'Resilient' },
  { name: 'Loren Smith', region: 'NA-W', projects: 10, crossTrained: 'Lauren Culp, Lisa McIntyre', status: 'Resilient' },
  { name: 'Lisa McIntyre', region: 'NA-W', projects: 8, crossTrained: 'None', status: 'At Risk' },
  { name: 'Sam Long', region: 'APAC', projects: 6, crossTrained: 'None', status: 'At Risk' },
  { name: 'Paul Cahill', region: 'EMEA', projects: 9, crossTrained: 'Mary Khor (partial)', status: 'Resilient' },
  { name: 'Atishu Jain', region: 'NASA', projects: 5, crossTrained: 'None', status: 'At Risk' },
  { name: 'Sean Keegan', region: 'Procurement', projects: 22, crossTrained: 'Ryan Pond (partial)', status: 'Resilient' },
  { name: 'Mary Khor', region: 'APAC', projects: 4, crossTrained: 'Sam Long (partial)', status: 'Resilient' },
  { name: 'Cameron Martini', region: 'NA-E', projects: 6, crossTrained: 'Lauren Culp (partial)', status: 'Resilient' },
]

const agentTiers = [
  { tier: 'Tier 1 (Task Agents)', count: 24, examples: 'Variance summarizers, narrative drafters, FX converters' },
  { tier: 'Tier 2 (Process Agents)', count: 11, examples: 'SLA Sentinel, PO Workflow Coordinator, RFI Triage' },
  { tier: 'Tier 3 (Portfolio Agents)', count: 3, examples: 'Portfolio Risk Detector, Cashflow Forecaster, Procurement Anomaly Detector' },
]

const trendData = [
  { week: 'W6', pct: 72 },
  { week: 'W7', pct: 74 },
  { week: 'W8', pct: 76 },
  { week: 'W9', pct: 78 },
  { week: 'W10', pct: 79 },
  { week: 'W11', pct: 81 },
  { week: 'W12', pct: 82 },
  { week: 'W13', pct: 83 },
  { week: 'W14', pct: 84 },
  { week: 'W15', pct: 85 },
  { week: 'W16', pct: 86 },
  { week: 'W17', pct: 86 },
  { week: 'W18', pct: 87 },
]

// ============================================================
// Component
// ============================================================

export default function KeyPersonContinuityPage() {
  const [search, setSearch] = React.useState('')
  const [resilientExpanded, setResilientExpanded] = React.useState(false)
  const [agentExpanded, setAgentExpanded] = React.useState(true)
  const [selectedRole, setSelectedRole] = React.useState<typeof atRiskRoles[0] | null>(null)

  const filteredRoles = atRiskRoles.filter(r => 
    r.role.toLowerCase().includes(search.toLowerCase()) ||
    r.primary.toLowerCase().includes(search.toLowerCase()) ||
    r.process.toLowerCase().includes(search.toLowerCase())
  )

  const readinessScore = 87
  const readinessColor = readinessScore >= 85 ? 'text-green-500' : readinessScore >= 70 ? 'text-gold' : 'text-red-500'
  const readinessStatus = readinessScore >= 85 ? 'Pass' : 'Fail'

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
      case 'Amber': return 'bg-gold/10 text-gold border-gold/30'
      default: return 'bg-muted text-muted-foreground border-line'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resilient': return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'At Risk': return 'bg-gold/10 text-gold'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <AppShell title="Key-Person Continuity">
      <motion.div 
        className="space-y-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Band */}
        <div className="bg-card rounded-xl p-6 lg:p-8 border border-border">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link 
                  href="/reports" 
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to Reports"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <h1 className="text-sm lg:text-base font-semibold text-foreground">Key-Person Continuity Report</h1>
              </div>
              <p className="text-xs text-muted-foreground ml-10">
                Two-week absence test results · 142 Service Roles assessed across 87 active projects
              </p>
              <div className="ml-10">
                <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider bg-gold text-navy rounded-full">
                  KEY-PERSON CONTINUITY · MAY 2026
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToPDF({ filename: 'key-person-continuity-may-2026', title: 'Key-Person Continuity Report' })}
                className="h-8 px-3 text-xs font-medium bg-gold text-navy hover:bg-gold-soft rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button 
                onClick={() => toast.info('Schedule feature coming soon')}
                className="h-8 px-3 text-xs font-medium bg-navy/10 dark:bg-white/10 text-navy dark:text-foreground border border-navy/30 dark:border-white/30 hover:bg-navy/20 dark:hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* KPI Strip + Readiness Gauge */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* KPIs */}
          <div className="xl:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'bg-card border-l-4 rounded-lg p-4 shadow-sm',
                    kpi.color
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn(
                      'w-4 h-4',
                      kpi.status === 'green' && 'text-green-500',
                      kpi.status === 'amber' && 'text-gold',
                      kpi.status === 'red' && 'text-red-500',
                      kpi.status === 'teal' && 'text-teal-500',
                      !kpi.status && 'text-muted-foreground'
                    )} />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide truncate">
                      {kpi.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                    {kpi.pct && <span className="text-xs text-muted-foreground">({kpi.pct})</span>}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Readiness Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-line rounded-xl p-6 flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-16 mb-3">
              {/* Semi-circle gauge background */}
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path
                  d="M 5 50 A 45 45 0 0 1 95 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <path
                  d="M 5 50 A 45 45 0 0 1 95 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${readinessScore * 1.41} 141`}
                  className={readinessColor}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span className={cn('text-2xl font-bold', readinessColor)}>{readinessScore}%</span>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground text-center">Two-Week Absence Test Readiness</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Target: ≥85%. Current: {readinessScore}% (<span className={readinessColor}>{readinessStatus}</span>)
            </p>
          </motion.div>
        </div>

        {/* At-Risk Roles Table */}
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">At-Risk & Critical Roles</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Roles requiring immediate continuity planning</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full sm:w-64 pl-9 pr-3 text-sm bg-secondary/50 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-secondary/30">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Project / Process</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Primary Filler</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Backup(s)</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Open Items</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'hover:bg-secondary/30 cursor-pointer transition-colors',
                      role.risk === 'Critical' && 'bg-red-500/5'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{role.role}</div>
                      <div className="text-xs text-muted-foreground md:hidden mt-0.5">{role.process}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{role.process}</td>
                    <td className="px-4 py-3 text-foreground">{role.primary}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {role.backups === 'None' ? (
                        <span className="text-red-500">None</span>
                      ) : role.backups.includes('Agent') ? (
                        <span className="inline-flex items-center gap-1">
                          <Bot className="w-3 h-3 text-teal-500" />
                          {role.backups}
                        </span>
                      ) : (
                        role.backups
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="font-mono text-foreground">{role.openItems}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('px-2 py-1 text-[10px] font-semibold rounded-full border', getRiskBadge(role.risk))}>
                        {role.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                      <span className="text-xs">{role.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resilient Roles Summary (Collapsible) */}
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <button
            onClick={() => setResilientExpanded(!resilientExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Resilient Roles Summary</h3>
                <p className="text-xs text-muted-foreground">124 roles with ≥2 human fillers · Avg 2.8 fillers per role</p>
              </div>
            </div>
            {resilientExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
          </button>
          {resilientExpanded && (
            <div className="p-4 pt-0 border-t border-line">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-green-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">124</div>
                  <div className="text-xs text-muted-foreground">Resilient Roles</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">2.8</div>
                  <div className="text-xs text-muted-foreground">Avg Fillers/Role</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">87%</div>
                  <div className="text-xs text-muted-foreground">Coverage Rate</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">45</div>
                  <div className="text-xs text-muted-foreground">Cross-Trained Pairs</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agent-Filled Roles Panel */}
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <button
            onClick={() => setAgentExpanded(!agentExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-teal-500" />
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Agent-Filled Roles</h3>
                <p className="text-xs text-muted-foreground">38 Service Roles have an AI Agent as primary or backup filler</p>
              </div>
            </div>
            {agentExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
          </button>
          {agentExpanded && (
            <div className="p-4 pt-0 border-t border-line">
              <div className="space-y-3 mt-4">
                {agentTiers.map((tier) => (
                  <div key={tier.tier} className="flex items-start gap-3 p-3 bg-teal-500/5 dark:bg-teal-500/10 rounded-lg border border-teal-500/20">
                    <Sparkles className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{tier.tier}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-full">
                          {tier.count} roles
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{tier.examples}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PgM Bench Readiness */}
        <div className="bg-card border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gold" />
              <h2 className="text-base font-semibold text-foreground">PgM Bench Readiness</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Project Manager continuity status across all regions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-secondary/30">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">PgM</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Projects</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Cross-trained On</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pgmBench.map((pgm) => (
                  <tr key={pgm.name} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{pgm.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-secondary rounded">{pgm.region}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-foreground">{pgm.projects}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {pgm.crossTrained === 'None' ? (
                        <span className="text-red-500">None</span>
                      ) : (
                        pgm.crossTrained
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('px-2 py-1 text-[10px] font-semibold rounded-full', getStatusBadge(pgm.status))}>
                        {pgm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remediation Recommendations */}
        <div className="bg-gold/10 dark:bg-gold/5 border border-gold/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">Remediation Recommendations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                  <span><strong className="text-foreground">Critical:</strong> Designate proxy reviewers for Anu Final and CLC Lead roles within 2 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 shrink-0" />
                  <span><strong className="text-foreground">Amber:</strong> Initiate cross-training for NA-W and APAC PgMs by end of Q2</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 shrink-0" />
                  <span><strong className="text-foreground">Agent Coverage:</strong> Evaluate promoting SLA Sentinel to backup for Legal Review Lead</span>
                </li>
              </ul>
              <button className="mt-4 h-8 px-4 text-xs font-medium bg-gold hover:bg-gold/90 text-navy rounded-lg transition-colors inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Generate Cross-Training Plan
              </button>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-card border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="text-base font-semibold text-foreground">13-Week Continuity Readiness Trend</h2>
          </div>
          <div className="h-40 flex items-end gap-1">
            {trendData.map((d, i) => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative group">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      d.pct >= 85 ? 'bg-green-500' : d.pct >= 70 ? 'bg-gold' : 'bg-red-500'
                    )}
                    style={{ height: `${d.pct * 1.2}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {d.pct}%
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground">{d.week}</span>
                {i === 0 && (
                  <div className="absolute -top-2 left-0 text-[8px] text-gold bg-gold/20 px-1 rounded">
                    Baseline
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded" /> ≥85% (Pass)</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-gold rounded" /> 70-85%</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded" /> &lt;70%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-muted-foreground py-4 border-t border-line">
          Source: Service Role registry · Party Feature Catalog (reliability, workload, availability) · Orchestration engine open items
          <br />
          Computed via <span className="font-mono">odc_semantic.continuity_v1</span>
        </div>

        {/* Role Detail Modal */}
        {selectedRole && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRole(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-line rounded-xl p-6 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedRole.role}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRole.process}</p>
                </div>
                <span className={cn('px-2 py-1 text-[10px] font-semibold rounded-full border', getRiskBadge(selectedRole.risk))}>
                  {selectedRole.risk}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Primary Filler</p>
                    <p className="text-sm font-medium text-foreground">{selectedRole.primary}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Backup(s)</p>
                    <p className="text-sm font-medium text-foreground">{selectedRole.backups}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Open Items</p>
                  <p className="text-2xl font-bold text-foreground">{selectedRole.openItems}</p>
                </div>

                <div className="p-3 bg-gold/10 border border-gold/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Recommended Action</p>
                  <p className="text-sm text-foreground">{selectedRole.action}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 h-9 text-sm font-medium bg-gold hover:bg-gold/90 text-navy rounded-lg transition-colors">
                    Generate Cross-Training Plan
                  </button>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="h-9 px-4 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AppShell>
  )
}

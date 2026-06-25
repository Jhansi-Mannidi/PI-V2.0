'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { useAI } from '@/components/ai-provider'
import { recommendations, categoryMeta, engineStats } from '@/lib/recommendation-data'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'

const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const categoryDistribution = Object.entries(
  recommendations.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
).map(([name, value]) => ({ name: name.split(' ').slice(0, 2).join(' '), full: name, value }))

const impactByProject = [
  { name: 'Pryor Creek', costSaved: 46, daysRecovered: 6, recsApplied: 4 },
  { name: 'Henderson', costSaved: 24, daysRecovered: 3, recsApplied: 2 },
  { name: 'Dallas', costSaved: 34, daysRecovered: 5, recsApplied: 3 },
  { name: 'Mesa', costSaved: 18, daysRecovered: 2, recsApplied: 2 },
  { name: 'Ashburn', costSaved: 22, daysRecovered: 5, recsApplied: 3 },
  { name: 'Council Bluffs', costSaved: 16, daysRecovered: 1, recsApplied: 1 },
  { name: 'Lenoir', costSaved: 12, daysRecovered: 2, recsApplied: 1 },
]

const savingsTimeline = [
  { month: 'Jan', savings: 28, count: 6 },
  { month: 'Feb', savings: 42, count: 8 },
  { month: 'Mar', savings: 56, count: 10 },
  { month: 'Apr', savings: 78, count: 14 },
  { month: 'May', savings: 186, count: 22 },
]

const COLORS = ['#2B8A8A', '#D4A04C', '#DC2626', '#8B5CF6', '#0B1F3A', '#64748B', '#0EA5E9', '#D97706']

export default function ImpactPage() {
  const { aiEnabled } = useAI()

  if (!aiEnabled) {
    return (
      <AppShell title="Impact Analysis" subtitle="AI recommendation impact analysis" activeHref="/recommendations/impact">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center mx-auto mb-4 ring-1 ring-teal/20">
              <Sparkles className="w-7 h-7 text-teal" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">AI Recommendations Disabled</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enable AI mode from the header toggle to view impact analysis.
            </p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  const acceptedRate = Math.round((engineStats.accepted / engineStats.totalGenerated) * 100)

  return (
    <AppShell title="Impact Analysis" subtitle="Measuring the value of AI recommendations" activeHref="/recommendations/impact">
      <motion.div className="space-y-6 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* KPI strip - Professional Cards */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          {[
            { label: 'Total Savings', value: engineStats.estimatedSavings, icon: DollarSign, change: '+$42K this month', up: true, bgColor: 'bg-gold/10', iconColor: 'text-gold' },
            { label: 'Schedule Days Saved', value: String(engineStats.daysPreventedSlip), icon: Clock, change: '+8 this month', up: true, bgColor: 'bg-green/10', iconColor: 'text-green' },
            { label: 'Acceptance Rate', value: `${acceptedRate}%`, icon: CheckCircle2, change: '+4% vs last month', up: true, bgColor: 'bg-teal/10', iconColor: 'text-teal' },
            { label: 'Active Recommendations', value: String(recommendations.filter(r => r.status === 'New' || r.status === 'In Progress').length), icon: Sparkles, change: '6 new today', up: true, bgColor: 'bg-primary/10', iconColor: 'text-primary' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', stat.bgColor)}>
                    <stat.icon className={cn('w-4.5 h-4.5', stat.iconColor)} />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground tracking-tight">{stat.value}</p>
              <p className={cn('text-xs font-medium flex items-center gap-1 mt-1', stat.up ? 'text-green' : 'text-red')}>
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.change}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts row - Professional styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cumulative savings timeline */}
          <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Cumulative Savings Timeline</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Monthly savings from accepted recommendations</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal" />
                <span className="text-xs text-muted-foreground font-medium">Savings</span>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsTimeline} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${v}K`} width={45} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-lg)' }}
                    formatter={(v: number) => [`$${v}K`, 'Savings']}
                  />
                  <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#savingsGrad)" dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category distribution */}
          <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-foreground">Recommendations by Category</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribution across recommendation types</p>
            </div>
            <div className="h-[220px] flex items-center gap-6">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {categoryDistribution.map((_entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-lg)' }}
                      formatter={(v: number, _n: string, entry: { payload?: { full?: string } }) => [v, entry.payload?.full || '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2.5">
                {categoryDistribution.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground truncate flex-1">{c.name}</span>
                    <span className="text-xs font-mono font-semibold text-foreground">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Impact by project - Professional Bar Chart */}
        <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Impact by Project</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Cost savings and days recovered per project</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gold" />
                <span className="text-xs text-muted-foreground font-medium">Cost Saved ($K)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-teal" />
                <span className="text-xs text-muted-foreground font-medium">Days Recovered</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactByProject} barCategoryGap="15%" margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A04C" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#D4A04C" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="daysGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B8A8A" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2B8A8A" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={35} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-lg)' }} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                <Bar dataKey="costSaved" name="Cost Saved ($K)" fill="url(#costGradient)" radius={[4, 4, 0, 0]} maxBarSize={35} />
                <Bar dataKey="daysRecovered" name="Days Recovered" fill="url(#daysGradient)" radius={[4, 4, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Model Performance - KPI Summary */}
        <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-foreground">Model Performance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">AI recommendation accuracy and feedback metrics</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Prediction Accuracy', value: '87%', sub: 'Based on 47 recommendations', trend: 'up' },
              { label: 'False Positive Rate', value: '6.4%', sub: '3 dismissed as irrelevant', trend: 'down' },
              { label: 'Avg Confidence Score', value: '82%', sub: 'Across all categories', trend: 'up' },
              { label: 'User Satisfaction', value: '4.2/5', sub: 'Based on feedback signals', trend: 'up' },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="text-center p-4 rounded-lg bg-muted/20"
              >
                <p className="text-2xl font-bold font-mono text-foreground tracking-tight">{m.value}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1.5">{m.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{m.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}

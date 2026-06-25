'use client'

import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { Users, Building2, Star, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const parties = [
  { name: 'LineSight', type: 'PMC', rating: 4.8, projects: 4, performance: 'Excellent', risk: 'Low' },
  { name: 'Turner Construction', type: 'GC', rating: 4.5, projects: 2, performance: 'Good', risk: 'Low' },
  { name: 'AECOM', type: 'Design', rating: 4.2, projects: 3, performance: 'Good', risk: 'Medium' },
  { name: 'Jacobs Engineering', type: 'Engineering', rating: 4.6, projects: 2, performance: 'Excellent', risk: 'Low' },
  { name: 'Fluor Corporation', type: 'EPC', rating: 3.9, projects: 1, performance: 'Fair', risk: 'Medium' },
  { name: 'Black & Veatch', type: 'Engineering', rating: 4.4, projects: 2, performance: 'Good', risk: 'Low' },
]

const metrics = [
  { label: 'Total Parties', value: '24', icon: Users },
  { label: 'Active Contracts', value: '18', icon: Building2 },
  { label: 'Avg Rating', value: '4.3', icon: Star },
  { label: 'At Risk', value: '2', icon: AlertTriangle },
]

export default function PartiesPage() {
  return (
    <AppShell
      title="Party Intelligence"
      subtitle="Contractor and vendor performance tracking"
      activeHref="/parties"
    >
      <div className="space-y-6 w-full">
        {/* Metrics */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{metric.label}</p>
                <metric.icon className="w-4 h-4 text-gold" />
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Parties Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line/50">
            <h3 className="text-sm font-semibold text-foreground">Third Party Directory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-muted/30 dark:bg-navy-mid/30">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Organization</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Rating</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Projects</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Performance</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {parties.map((party, i) => (
                  <motion.tr
                    key={party.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    className="hover:bg-gold/5 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-teal" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{party.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{party.type}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-amber fill-amber" />
                        <span className="text-sm font-mono font-medium text-foreground">{party.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-mono text-foreground">{party.projects}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        party.performance === 'Excellent' ? 'bg-green/10 text-green' :
                        party.performance === 'Good' ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-amber'
                      )}>
                        {party.performance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        party.risk === 'Low' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                      )}>
                        {party.risk}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}

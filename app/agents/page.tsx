'use client'

import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { Bot, Activity, CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const agents = [
  { id: 'A-201', name: 'SLA Sentinel', status: 'active', tasks: 47, avgResponse: '2.3s', success: '98.2%', icon: Clock },
  { id: 'A-202', name: 'Risk Scanner', status: 'active', tasks: 32, avgResponse: '4.1s', success: '96.8%', icon: AlertTriangle },
  { id: 'A-203', name: 'Key-Person Detector', status: 'active', tasks: 18, avgResponse: '1.8s', success: '99.1%', icon: Bot },
  { id: 'A-204', name: 'Cost Variance Monitor', status: 'idle', tasks: 12, avgResponse: '3.2s', success: '97.5%', icon: Activity },
  { id: 'A-205', name: 'Schedule Optimizer', status: 'active', tasks: 28, avgResponse: '5.4s', success: '94.3%', icon: Zap },
]

const recentActivity = [
  { agent: 'A-201', action: 'Escalated past-SLA item to Portfolio Director', time: '2m ago', type: 'escalation' },
  { agent: 'A-202', action: 'Detected new P1 risk in Mesa Power project', time: '5m ago', type: 'detection' },
  { agent: 'A-203', action: 'Updated key-person coverage score', time: '12m ago', type: 'update' },
  { agent: 'A-201', action: 'Notified filler for Invoice Reconciliation', time: '18m ago', type: 'notification' },
  { agent: 'A-205', action: 'Recommended schedule adjustment for Pryor Creek', time: '25m ago', type: 'recommendation' },
]

export default function AgentsPage() {
  return (
    <AppShell
      title="Agent Activity"
      subtitle="Monitor autonomous agent performance and actions"
      activeHref="/agents"
    >
      <div className="space-y-6 w-full">
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[
            { label: 'Active Agents', value: '4', color: 'text-green' },
            { label: 'Tasks Today', value: '137', color: 'text-gold' },
            { label: 'Avg Response', value: '3.4s', color: 'text-teal' },
            { label: 'Success Rate', value: '97.2%', color: 'text-green' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-4"
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
              <p className={cn('text-2xl font-bold font-mono mt-1', stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line/50">
            <h3 className="text-sm font-semibold text-foreground">Registered Agents</h3>
          </div>
          <div className="divide-y divide-line/30">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-gold/5 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center ring-1 ring-teal/20">
                  <agent.icon className="w-5 h-5 text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                    <span className="text-[10px] font-mono text-muted-foreground">{agent.id}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {agent.tasks} tasks · {agent.avgResponse} avg · {agent.success} success
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                    agent.status === 'active' ? 'bg-green/10 text-green' : 'bg-muted text-muted-foreground'
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', agent.status === 'active' ? 'bg-green' : 'bg-muted-foreground')} />
                    {agent.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line/50">
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="divide-y divide-line/30">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 p-3 hover:bg-gold/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold font-mono text-teal">{activity.agent}</span>
                </div>
                <p className="flex-1 text-xs text-foreground/80">{activity.action}</p>
                <span className="text-[10px] text-muted-foreground/60 font-mono">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}

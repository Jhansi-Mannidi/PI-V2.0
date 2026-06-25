'use client'

import { AppShell } from '@/components/app-shell'
import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Users, Database, Palette, Globe, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import * as React from 'react'

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Configure alerts, email preferences, and push notifications',
    items: ['Email Alerts', 'Push Notifications', 'Slack Integration', 'Daily Digest']
  },
  {
    title: 'Security',
    icon: Shield,
    description: 'Manage authentication, sessions, and access controls',
    items: ['Two-Factor Auth', 'Session Timeout', 'API Keys', 'Audit Logs']
  },
  {
    title: 'Team',
    icon: Users,
    description: 'Manage team members, roles, and permissions',
    items: ['User Management', 'Role Assignment', 'Access Groups', 'Invitations']
  },
  {
    title: 'Data',
    icon: Database,
    description: 'Configure data sources, integrations, and sync settings',
    items: ['Data Sources', 'Sync Schedule', 'Export Settings', 'Archival Policy']
  },
  {
    title: 'Appearance',
    icon: Palette,
    description: 'Customize theme, layout, and display preferences',
    items: ['Theme Mode', 'Dashboard Layout', 'Date Format', 'Currency']
  },
  {
    title: 'Integrations',
    icon: Globe,
    description: 'Connect with external tools and services',
    items: ['Procore', 'SAP', 'Microsoft 365', 'Webhooks']
  },
]

export default function SettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false)
  const handleSave = () => {
    setIsSaving(true)
    window.setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved', { description: 'Workspace configuration updated' })
    }, 700)
  }
  const handleGenerateKey = () => {
    const key = `pk_live_${Array.from({ length: 32 }, () => Math.random().toString(36)[2] ?? '0').join('')}`
    if (navigator.clipboard) navigator.clipboard.writeText(key).catch(() => {})
    toast.success('API key generated & copied', {
      description: `${key.slice(0, 16)}…${key.slice(-4)} · store securely now`,
    })
  }
  return (
    <AppShell
      title="Settings"
      subtitle="Configure platform preferences and integrations"
      activeHref="/settings"
    >
      <div className="space-y-6 max-w-[1200px]">
        {/* Header Actions */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center ring-1 ring-gold/20">
              <Settings className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Platform Configuration</h2>
              <p className="text-[10px] text-muted-foreground/60">Manage your workspace settings</p>
            </div>
          </div>
          <Button
            size="sm"
            className="h-8 text-xs bg-gold hover:bg-gold/90 text-navy"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl p-5 cursor-pointer hover:border-gold/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center ring-1 ring-teal/20 group-hover:ring-gold/30 transition-all">
                  <section.icon className="w-5 h-5 text-teal group-hover:text-gold transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">{section.title}</h3>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 leading-relaxed">{section.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-line/30">
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((item) => (
                    <span 
                      key={item}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* API Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-line/50 rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-line/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber" />
              <h3 className="text-sm font-semibold text-foreground">API Access</h3>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleGenerateKey}>
              Generate Key
            </Button>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground/70">
              API keys allow external applications to access your portfolio data. Keep your keys secure and rotate them regularly.
            </p>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-[10px] text-muted-foreground/60 font-mono">
                pip_live_••••••••••••••••••••••••
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}

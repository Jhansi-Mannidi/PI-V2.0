'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { 
  PROJECTS, USERS, CONTROLS, type Frequency,
} from '@/lib/governance-data'

const FREQUENCIES: Frequency[] = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']

export default function ControlsAuditSchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    frequency: 'Monthly' as Frequency,
    auditorId: '',
    startDate: new Date().toISOString().slice(0, 10),
    time: '09:00',
    projectIds: [] as string[],
    controlIds: [] as string[],
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/controls-audit')
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Schedule Control Audit</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Create a new recurring audit schedule</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto p-6">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Basic Info */}
            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Audit Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Audit Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Q3 Approval Authority Controls"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Frequency</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as Frequency }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      >
                        {FREQUENCIES.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Assigned Auditor</label>
                      <select
                        value={formData.auditorId}
                        onChange={(e) => setFormData(prev => ({ ...prev, auditorId: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      >
                        <option value="">Select auditor...</option>
                        {USERS.filter(u => u.role === 'Auditor' || u.role === 'Portfolio Controls Lead').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Selection */}
            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Audit Scope</h2>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Select Controls to Audit</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border border-line rounded-lg bg-secondary/20">
                  {CONTROLS.map(control => (
                    <label key={control.id} className="flex items-center gap-3 p-2 hover:bg-secondary/40 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.controlIds.includes(control.id)}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            controlIds: e.target.checked
                              ? [...prev.controlIds, control.id]
                              : prev.controlIds.filter(id => id !== control.id)
                          }))
                        }}
                        className="w-4 h-4 rounded border-line"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{control.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{control.id}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Select Projects (Optional)</label>
                <select
                  multiple
                  value={formData.projectIds}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    projectIds: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all min-h-32"
                >
                  {PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Notes (Optional)</label>
                <textarea
                  placeholder="Add any special instructions or context for this audit..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.auditorId || formData.controlIds.length === 0}
                className="px-6 bg-gold hover:bg-gold/90 text-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Schedule
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </AppShell>
  )
}

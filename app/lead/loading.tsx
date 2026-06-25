'use client'

import { AppShell } from '@/components/app-shell'
import { LeadSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <LeadSkeleton />
      </div>
    </AppShell>
  )
}

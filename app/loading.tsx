'use client'

import { AppShell } from '@/components/app-shell'
import { DashboardSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    </AppShell>
  )
}

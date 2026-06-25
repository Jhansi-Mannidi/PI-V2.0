'use client'

import { AppShell } from '@/components/app-shell'
import { InboxSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <InboxSkeleton />
      </div>
    </AppShell>
  )
}

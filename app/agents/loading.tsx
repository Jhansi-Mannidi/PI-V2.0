'use client'

import { AppShell } from '@/components/app-shell'
import { TableSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <TableSkeleton rows={5} />
      </div>
    </AppShell>
  )
}

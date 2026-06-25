'use client'

import { AppShell } from '@/components/app-shell'
import { ProgramSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <ProgramSkeleton />
      </div>
    </AppShell>
  )
}

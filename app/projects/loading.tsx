'use client'

import { AppShell } from '@/components/app-shell'
import { ProjectsSkeleton } from '@/components/page-loading'

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6">
        <ProjectsSkeleton />
      </div>
    </AppShell>
  )
}

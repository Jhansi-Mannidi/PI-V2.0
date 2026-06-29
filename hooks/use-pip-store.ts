'use client'

// ═══════════════════════════════════════════════════════════════════════════
// usePIPStore — React hook over the central PIP localStorage store.
// Subscribes to storage events so all open tabs stay in sync.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import {
  loadStore, saveStore,
  addActivity, updateRiskState, updateRiskResponse,
  resolveSLABreach, recordControlTest,
  type PIPStoreState, type ActivityEvent, type ControlTestRun, type SLABreachRecord,
} from '@/lib/pip-store'
import { type RiskState, type ResponseStrategy } from '@/lib/risk-data'
import { USERS } from '@/lib/governance-data'

// Current session user (in a real app this comes from auth)
export const CURRENT_USER_ID = 'USR-001'
export const CURRENT_USER = USERS.find((u) => u.id === CURRENT_USER_ID)!

export function usePIPStore() {
  const [state, setState] = useState<PIPStoreState>(() => loadStore())

  // Sync across tabs via storage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'pip_store_v3') setState(loadStore())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const commit = useCallback((next: PIPStoreState) => {
    saveStore(next)
    setState(next)
  }, [])

  // ── Risk actions ──────────────────────────────────────────────────────────
  const changeRiskState = useCallback((riskId: string, newState: RiskState, note: string) => {
    commit(updateRiskState(state, riskId, newState, CURRENT_USER_ID, note))
  }, [state, commit])

  const setRiskResponse = useCallback((riskId: string, response: ResponseStrategy) => {
    commit(updateRiskResponse(state, riskId, response, CURRENT_USER_ID))
  }, [state, commit])

  const createRisk = useCallback((partial: Partial<Parameters<typeof addActivity>[1]> & { entityId: string; entityTitle: string; detail: string; affectedParties: string[] }) => {
    commit(addActivity(state, {
      kind: 'RISK_CREATED',
      actorId: CURRENT_USER_ID,
      actorName: CURRENT_USER.name,
      actorRole: CURRENT_USER.role,
      ...partial,
    }))
  }, [state, commit])

  // ── SLA actions ───────────────────────────────────────────────────────────
  const resolveBreach = useCallback((breachId: string, note: string) => {
    commit(resolveSLABreach(state, breachId, CURRENT_USER_ID, note))
  }, [state, commit])

  const escalateBreach = useCallback((breachId: string) => {
    const breach = state.slaBreaches.find((b) => b.id === breachId)
    if (!breach) return
    const updated = state.slaBreaches.map((b) =>
      b.id === breachId ? { ...b, status: 'escalated' as const } : b
    )
    let next = { ...state, slaBreaches: updated }
    next = addActivity(next, {
      kind: 'SLA_ESCALATED',
      actorId: CURRENT_USER_ID, actorName: CURRENT_USER.name, actorRole: CURRENT_USER.role,
      entityId: breachId, entityTitle: `${breach.slaName} — ${breach.instance}`,
      detail: `Escalated by ${CURRENT_USER.name}.`,
      affectedParties: breach.affectedParties,
    })
    commit(next)
  }, [state, commit])

  const reassignBreach = useCallback((breachId: string, newOwnerId: string) => {
    const breach = state.slaBreaches.find((b) => b.id === breachId)
    const newOwner = USERS.find((u) => u.id === newOwnerId)
    if (!breach || !newOwner) return
    const updated = state.slaBreaches.map((b) =>
      b.id === breachId ? { ...b, ownerId: newOwnerId, ownerName: newOwner.name } : b
    )
    let next = { ...state, slaBreaches: updated }
    next = addActivity(next, {
      kind: 'SLA_REASSIGNED',
      actorId: CURRENT_USER_ID, actorName: CURRENT_USER.name, actorRole: CURRENT_USER.role,
      entityId: breachId, entityTitle: `${breach.slaName} — ${breach.instance}`,
      detail: `Reassigned to ${newOwner.name}.`,
      affectedParties: [newOwner.name, ...breach.affectedParties],
      previousValue: breach.ownerName, newValue: newOwner.name,
    })
    commit(next)
  }, [state, commit])

  // ── Control actions ───────────────────────────────────────────────────────
  const runControlTest = useCallback((run: Omit<ControlTestRun, 'id' | 'runAt'>) => {
    commit(recordControlTest(state, run, CURRENT_USER_ID))
  }, [state, commit])

  const updateControlOwner = useCallback((controlId: string, ownerId: string) => {
    const ctrl = state.controls[controlId]
    const owner = USERS.find((u) => u.id === ownerId)
    if (!ctrl || !owner) return
    const updatedCtrl = { ...ctrl, ownerId, ownerName: owner.name }
    let next = { ...state, controls: { ...state.controls, [controlId]: updatedCtrl } }
    next = addActivity(next, {
      kind: 'CONTROL_OWNER_CHANGED',
      actorId: CURRENT_USER_ID, actorName: CURRENT_USER.name, actorRole: CURRENT_USER.role,
      entityId: controlId, entityTitle: ctrl.name,
      detail: `Owner changed to ${owner.name}.`,
      affectedParties: [owner.name, ctrl.ownerName ?? ''],
      previousValue: ctrl.ownerName ?? undefined,
      newValue: owner.name,
    })
    commit(next)
  }, [state, commit])

  // ── Derived data ──────────────────────────────────────────────────────────
  const riskList = Object.values(state.risks)
  const openBreaches = state.slaBreaches.filter((b) => b.status !== 'resolved')
  const recentActivity = state.activityLog.slice(0, 50)

  // Total financial exposure across all open risks
  const totalExposure = riskList.reduce((sum, r) => sum + (r.impactCost ?? 0), 0)

  // Risk counts by state for the command view
  const risksByState = riskList.reduce<Record<string, number>>((acc, r) => {
    acc[r.state] = (acc[r.state] ?? 0) + 1
    return acc
  }, {})

  return {
    state,
    riskList,
    openBreaches,
    recentActivity,
    totalExposure,
    risksByState,
    // Actions
    changeRiskState,
    setRiskResponse,
    createRisk,
    resolveBreach,
    escalateBreach,
    reassignBreach,
    runControlTest,
    updateControlOwner,
    // Raw commit for advanced use
    commit,
  }
}

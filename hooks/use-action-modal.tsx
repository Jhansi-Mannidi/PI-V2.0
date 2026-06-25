'use client'

import * as React from 'react'
import { ActionModal, type ActionModalProps } from '@/components/action-modal'

type Config = Omit<ActionModalProps, 'open' | 'onOpenChange'>

/**
 * useActionModal — convenience hook so pages can fire any number of
 * different ActionModal instances from a single piece of state.
 *
 * Usage:
 *   const action = useActionModal()
 *   <Button onClick={() => action.open({ title: 'Escalate', tone: 'destructive', ... })}>
 *   {action.element}
 */
export function useActionModal() {
  const [config, setConfig] = React.useState<Config | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback((next: Config) => {
    setConfig(next)
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const element = config ? (
    <ActionModal
      {...config}
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o)
      }}
    />
  ) : null

  return { open, close, element, isOpen }
}

'use client'

import * as React from 'react'

interface AIContextType {
  aiEnabled: boolean
  setAiEnabled: (enabled: boolean) => void
}

const AIContext = React.createContext<AIContextType>({
  aiEnabled: false,
  setAiEnabled: () => {},
})

export function useAI() {
  return React.useContext(AIContext)
}

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [aiEnabled, setAiEnabled] = React.useState(false)

  return (
    <AIContext.Provider value={{ aiEnabled, setAiEnabled }}>
      {children}
    </AIContext.Provider>
  )
}

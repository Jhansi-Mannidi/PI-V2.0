'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function NavigationProgressInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsNavigating(false)
    setProgress(100)
    
    const timeout = setTimeout(() => {
      setProgress(0)
    }, 200)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href)
        if (url.pathname !== pathname) {
          setIsNavigating(true)
          setProgress(0)
          
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 90) {
                clearInterval(interval)
                return prev
              }
              return prev + Math.random() * 15
            })
          }, 100)

          return () => clearInterval(interval)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return (
    <AnimatePresence>
      {(isNavigating || progress > 0) && progress < 100 && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-gold via-gold to-gold/50 shadow-[0_0_10px_rgba(212,160,76,0.5)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  )
}

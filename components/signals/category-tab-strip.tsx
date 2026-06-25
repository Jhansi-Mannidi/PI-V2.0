'use client'

import { motion } from 'framer-motion'
import { Cloud, PackageSearch, Landmark, HardHat, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryTabStripProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'labor', label: 'Labor Market', icon: HardHat, color: 'red' },
  { id: 'weather', label: 'Weather', icon: Cloud, color: 'sky' },
  { id: 'supply', label: 'Supply Chain', icon: PackageSearch, color: 'amber' },
  { id: 'regulatory', label: 'Regulatory', icon: Landmark, color: 'slate' },
  { id: 'utility', label: 'Utility', icon: Zap, color: 'gold' },
]

export function CategoryTabStrip({ activeCategory, onCategoryChange }: CategoryTabStripProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/80 dark:bg-background/60 backdrop-blur-md border-b border-border/50">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 p-4 min-w-max px-4 sm:px-5">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            
            return (
              <motion.button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  'relative px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-foreground rounded-lg -z-10"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

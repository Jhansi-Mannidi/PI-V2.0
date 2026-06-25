'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3',
          title: 'group-[.toast]:text-sm group-[.toast]:font-semibold',
          description: 'group-[.toast]:text-xs group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-lg',
          success: 'group-[.toaster]:!bg-[#E7F5EC] group-[.toaster]:dark:!bg-emerald-950/80 group-[.toaster]:!border-emerald-200 group-[.toaster]:dark:!border-emerald-800/50 group-[.toaster]:!text-emerald-800 group-[.toaster]:dark:!text-emerald-200',
          error: 'group-[.toaster]:!bg-[#FBE9E9] group-[.toaster]:dark:!bg-rose-950/80 group-[.toaster]:!border-rose-200 group-[.toaster]:dark:!border-rose-800/50 group-[.toaster]:!text-rose-800 group-[.toaster]:dark:!text-rose-200',
          warning: 'group-[.toaster]:!bg-[#FBF1E6] group-[.toaster]:dark:!bg-amber-950/80 group-[.toaster]:!border-amber-200 group-[.toaster]:dark:!border-amber-800/50 group-[.toaster]:!text-amber-800 group-[.toaster]:dark:!text-amber-200',
          info: 'group-[.toaster]:!bg-blue-50 group-[.toaster]:dark:!bg-blue-950/80 group-[.toaster]:!border-blue-200 group-[.toaster]:dark:!border-blue-800/50 group-[.toaster]:!text-blue-800 group-[.toaster]:dark:!text-blue-200',
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        error: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        loading: <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

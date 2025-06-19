"use client"

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { validateEnvironment, isDevelopmentWithPlaceholders } from '@/lib/env-check'

export function EnvironmentBanner() {
  const [envStatus, setEnvStatus] = useState<{
    errors: string[]
    warnings: string[]
    isValid: boolean
  } | null>(null)

  useEffect(() => {
    // Only run on client side
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/check-env')
        const data = await response.json()
        setEnvStatus(data)
      } catch (error) {
        console.error('Failed to check environment:', error)
      }
    }

    checkEnvironment()
  }, [])

  // Don't show banner in production with valid config
  if (!envStatus || (envStatus.isValid && process.env.NODE_ENV === 'production')) {
    return null
  }

  // Show development mode banner
  if (isDevelopmentWithPlaceholders()) {
    return (
      <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-500">Development Mode</AlertTitle>
        <AlertDescription className="text-amber-400">
          Running with placeholder environment variables. Some features may be limited.
        </AlertDescription>
      </Alert>
    )
  }

  // Show error banner if there are configuration issues
  if (!envStatus.isValid) {
    return (
      <Alert className="mb-4 border-red-500/50 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-500">Configuration Error</AlertTitle>
        <AlertDescription className="text-red-400">
          Missing required environment variables. Please check your configuration.
          <ul className="mt-2 list-disc list-inside">
            {envStatus.errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
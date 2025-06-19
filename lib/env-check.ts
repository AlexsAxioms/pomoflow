// Environment validation utility
export function validateEnvironment() {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const optionalVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ]

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName] === 'placeholder_url' || process.env[varName] === 'placeholder_key') {
      errors.push(`${varName} is missing or has placeholder value`)
    }
  }

  // Check optional variables  
  for (const varName of optionalVars) {
    if (!process.env[varName] || process.env[varName]?.startsWith('placeholder_')) {
      warnings.push(`${varName} is missing or has placeholder value (optional for development)`)
    }
  }

  return { errors, warnings, isValid: errors.length === 0 }
}

// Safe environment getter with fallbacks
export function getEnvVar(key: string, fallback = ''): string {
  const value = process.env[key]
  if (!value || value.startsWith('placeholder_')) {
    return fallback
  }
  return value
}

// Check if app is in development mode with placeholders
export function isDevelopmentWithPlaceholders(): boolean {
  return process.env.NODE_ENV !== 'production' && 
         (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder'))
}
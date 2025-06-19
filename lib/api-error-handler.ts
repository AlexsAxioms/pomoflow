import { NextResponse } from 'next/server'
import { validateEnvironment, isDevelopmentWithPlaceholders } from './env-check'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Check if environment is properly configured
  const envCheck = validateEnvironment()
  if (!envCheck.isValid) {
    return NextResponse.json(
      {
        error: 'Configuration Error',
        message: 'Server configuration is incomplete',
        details: isDevelopmentWithPlaceholders() 
          ? 'Running in development mode with placeholder environment variables' 
          : 'Missing required environment variables',
        envErrors: envCheck.errors
      },
      { status: 503 }
    )
  }

  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: 'Unknown Error',
      message: 'An unexpected error occurred'
    },
    { status: 500 }
  )
}

export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}

// Environment-aware response for when services are unavailable
export function createServiceUnavailableResponse(service: string): NextResponse {
  const message = isDevelopmentWithPlaceholders()
    ? `${service} is not configured (using placeholder values for development)`
    : `${service} is temporarily unavailable`

  return NextResponse.json(
    {
      error: 'Service Unavailable',
      message,
      service,
      development: isDevelopmentWithPlaceholders()
    },
    { status: 503 }
  )
}
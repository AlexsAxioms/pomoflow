import { NextResponse } from "next/server"

export async function GET() {
  // Check all environment variables
  const envCheck = {
    supabase: {
      url: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
          : null,
      },
      anonKey: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
          : null,
      },
      serviceKey: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        value: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`
          : null,
      },
    },
    stripe: {
      publishableKey: {
        exists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...`
          : null,
      },
      secretKey: {
        exists: !!process.env.STRIPE_SECRET_KEY,
        value: process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` : null,
      },
    },
    other: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      nodeEnv: process.env.NODE_ENV,
    },
  }

  const missingVars = []

  if (!envCheck.supabase.url.exists) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!envCheck.supabase.anonKey.exists) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return NextResponse.json({
    success: missingVars.length === 0,
    environment: envCheck,
    missing: missingVars,
    help: missingVars.length > 0 ? "Add the Supabase integration to your v0 project" : "All required variables are set",
  })
}

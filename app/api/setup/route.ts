import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("Environment check:", {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      hasServiceKey: !!supabaseServiceKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required Supabase environment variables",
          missing: {
            url: !supabaseUrl,
            anonKey: !supabaseAnonKey,
            serviceKey: !supabaseServiceKey,
          },
          help: "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set",
        },
        { status: 400 },
      )
    }

    // Create Supabase client
    const supabase = createServerClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create Supabase client",
          help: "Check your Supabase environment variables",
        },
        { status: 500 },
      )
    }

    // Test basic connection
    console.log("Testing Supabase connection...")

    try {
      // Try a simple query that should work on any Supabase instance
      const { data: connectionTest, error: connectionError } = await supabase.rpc("version").single()

      if (connectionError) {
        console.log("Connection test failed, trying alternative method...")

        // Alternative connection test
        const { data: altTest, error: altError } = await supabase.from("pg_tables").select("tablename").limit(1)

        if (altError) {
          return NextResponse.json(
            {
              success: false,
              error: "Database connection failed",
              details: altError.message,
              help: "Verify your Supabase URL and keys are correct",
            },
            { status: 500 },
          )
        }
      }

      console.log("Connection successful!")
    } catch (connError) {
      console.error("Connection error:", connError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connError instanceof Error ? connError.message : "Unknown error",
          help: "Check your Supabase project status and credentials",
        },
        { status: 500 },
      )
    }

    // Check if our custom tables exist
    const tables = ["users", "tasks", "notes", "custom_playlists", "dashboard_layouts"]
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("*").limit(1)

        tableStatus[table] = !error

        if (error) {
          console.log(`Table ${table} check failed:`, error.message)
        }
      } catch (err) {
        console.log(`Table ${table} does not exist or is not accessible`)
        tableStatus[table] = false
      }
    }

    // Generate environment template
    const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey || "your_service_role_key_here"}

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Product Configuration
STRIPE_PRICE_ID=price_your_price_id_here`

    const allTablesExist = Object.values(tableStatus).every(Boolean)

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        tables: tableStatus,
        all_tables_exist: allTablesExist,
      },
      environment: {
        supabase_configured: true,
        stripe_configured: !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY),
      },
      env_template: envTemplate,
      next_steps: allTablesExist
        ? [
            "✅ Database is fully configured!",
            "Add your Stripe API keys to environment variables",
            "Create a Stripe product and add the price ID",
            "Restart your development server",
          ]
        : [
            "Run the database setup scripts to create missing tables",
            "Add your Stripe API keys to environment variables",
            "Create a Stripe product and add the price ID",
            "Restart your development server",
          ],
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Setup check failed",
        details: error instanceof Error ? error.message : "Unknown error",
        help: "Check the server logs for more details",
      },
      { status: 500 },
    )
  }
}

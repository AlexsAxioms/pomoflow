import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create Supabase client",
          error: "Check environment variables",
        },
        { status: 500 },
      )
    }

    // Test connection with a simple query - try to access any table
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

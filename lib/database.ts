import { createServerClient } from "./supabase"

// Database connection helper
export async function getDatabase() {
  const supabase = createServerClient()

  if (!supabase) {
    throw new Error("Database connection failed. Please check your Supabase environment variables.")
  }

  return supabase
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const supabase = await getDatabase()
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

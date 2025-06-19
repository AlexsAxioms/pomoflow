import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data: playlists, error } = await supabase
      .from("custom_playlists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ playlists })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, url, platform } = await request.json()

    if (!userId || !name || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Detect platform from URL
    let detectedPlatform = platform
    if (!detectedPlatform) {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        detectedPlatform = "youtube"
      } else if (url.includes("spotify.com")) {
        detectedPlatform = "spotify"
      }
    }

    const { data: playlist, error } = await supabase
      .from("custom_playlists")
      .insert({
        user_id: userId,
        name,
        url,
        platform: detectedPlatform,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ playlist })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Playlist ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("custom_playlists").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

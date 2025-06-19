"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Lock, Plus, Music, Calendar, FileText, Timer, ListTodo } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState("")
  const [customPlaylists, setCustomPlaylists] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus()
      loadCustomPlaylists()
    }
  }, [user])

  const checkSubscriptionStatus = async () => {
    if (!user) return

    const { data } = await supabase.from("users").select("subscription_status").eq("id", user.id).single()

    setIsSubscribed(data?.subscription_status === "premium")
  }

  const loadCustomPlaylists = async () => {
    if (!user) return

    const response = await fetch(`/api/playlists?userId=${user.id}`)
    const data = await response.json()
    setCustomPlaylists(data.playlists || [])
  }

  const handleSubscribe = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomPlaylist = async () => {
    if (!newPlaylist.trim() || !user) return

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: newPlaylist.trim(),
          url: newPlaylist.trim(),
        }),
      })

      if (response.ok) {
        setNewPlaylist("")
        loadCustomPlaylists()
      }
    } catch (error) {
      console.error("Error adding playlist:", error)
    }
  }

  const removePlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/playlists?id=${playlistId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadCustomPlaylists()
      }
    } catch (error) {
      console.error("Error removing playlist:", error)
    }
  }

  const freeFeatures = [
    { icon: Timer, text: "Pomodoro Timer (25/5 min)", included: true },
    { icon: ListTodo, text: "Up to 3 Tasks", included: true },
    { icon: Music, text: "Standard Music (Lo-Fi, Jazz)", included: true },
  ]

  const premiumFeatures = [
    { icon: Music, text: "Custom YouTube/Spotify Playlists", included: false },
    { icon: Calendar, text: "Calendar Integration", included: false },
    { icon: FileText, text: "Notes Section", included: false },
    { icon: ListTodo, text: "Unlimited Tasks", included: false },
    { icon: Timer, text: "Custom Timer Intervals", included: false },
  ]

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)" }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span style={{ imageRendering: "pixelated", fontSize: "32px" }}>💰</span>
              <h1 className="text-4xl font-bold text-white neon-text" style={{ fontFamily: "Arial, sans-serif" }}>
                Music Subscription
              </h1>
            </div>
            <p className="text-xl text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
              Unlock premium features for the ultimate productivity experience
            </p>
          </div>

          {/* Subscription Status */}
          {isSubscribed && (
            <Card className="glass-card border-green-400/30 neon-glow mb-8">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>🎉</span>
                  <h2 className="text-2xl font-bold text-green-400" style={{ fontFamily: "Arial, sans-serif" }}>
                    Welcome to Premium!
                  </h2>
                </div>
                <p className="text-green-300" style={{ fontFamily: "Arial, sans-serif" }}>
                  You now have access to all premium features. Enjoy your enhanced productivity experience!
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Free Plan */}
            <Card className="glass-card border-white/20 relative">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>🆓</span>
                  <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                    Free Plan
                  </CardTitle>
                </div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                  $0<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <feature.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
                <Separator className="my-4 bg-white/10" />
                <div className="text-center">
                  <Badge variant="secondary" className="text-sm bg-gray-700/50 text-gray-300 border-gray-600">
                    Current Plan
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="glass-card border-blue-400/50 neon-glow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 text-sm font-medium border-0 shadow-lg">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>💰</span>
                  <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                    Premium Plan
                  </CardTitle>
                </div>
                <div className="text-3xl font-bold text-blue-400 neon-text" style={{ fontFamily: "Arial, sans-serif" }}>
                  $9.99<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Include all free features */}
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <feature.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300" style={{ fontFamily: "Arial, sans-serif" }}>
                      {feature.text}
                    </span>
                  </div>
                ))}

                <Separator className="my-4 bg-white/10" />

                {/* Premium exclusive features */}
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                      <Check className="w-4 h-4 text-blue-400" />
                    </div>
                    <feature.icon className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium" style={{ fontFamily: "Arial, sans-serif" }}>
                      {feature.text}
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-xs text-blue-400 border-blue-400/30 bg-blue-500/10"
                    >
                      Premium
                    </Badge>
                  </div>
                ))}

                <div className="pt-4">
                  <Button
                    onClick={handleSubscribe}
                    disabled={isSubscribed || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 neon-glow"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {loading ? "Processing..." : isSubscribed ? "Subscribed ✓" : "Subscribe Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Playlist Section */}
          <Card className={`glass-card border-white/20 ${!isSubscribed ? "opacity-75" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {!isSubscribed && <span style={{ imageRendering: "pixelated", fontSize: "24px" }}>🔒</span>}
                <CardTitle
                  className={`text-2xl font-bold ${isSubscribed ? "text-white" : "text-gray-500"}`}
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  Custom Playlists
                </CardTitle>
                {!isSubscribed && (
                  <Badge variant="secondary" className="ml-auto bg-gray-700/50 text-gray-400 border-gray-600">
                    Premium Feature
                  </Badge>
                )}
              </div>
              <p
                className={`${isSubscribed ? "text-gray-300" : "text-gray-500"}`}
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Add your favorite YouTube or Spotify playlists for the perfect focus session
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSubscribed && (
                <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/30">
                  <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
                    Premium Feature Locked
                  </h3>
                  <p className="text-gray-500 mb-4" style={{ fontFamily: "Arial, sans-serif" }}>
                    Subscribe to premium to add custom YouTube and Spotify playlists
                  </p>
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 hover:scale-105 border-0"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    Unlock Premium
                  </Button>
                </div>
              )}

              {isSubscribed && (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter YouTube or Spotify playlist URL..."
                      value={newPlaylist}
                      onChange={(e) => setNewPlaylist(e.target.value)}
                      className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                      onKeyPress={(e) => e.key === "Enter" && addCustomPlaylist()}
                    />
                    <Button
                      onClick={addCustomPlaylist}
                      disabled={!newPlaylist.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Playlist
                    </Button>
                  </div>

                  {customPlaylists.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
                        Your Custom Playlists:
                      </h4>
                      {customPlaylists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/20 rounded-lg hover:bg-green-500/20 transition-colors"
                        >
                          <Music className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300 flex-1" style={{ fontFamily: "Arial, sans-serif" }}>
                            {playlist.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => removePlaylist(playlist.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {customPlaylists.length === 0 && (
                    <div className="text-center p-6 bg-gray-800/30 rounded-lg">
                      <Music className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400" style={{ fontFamily: "Arial, sans-serif" }}>
                        No custom playlists added yet. Add your first playlist above!
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="glass-card hover:bg-white/10 text-white border-white/20 transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "Arial, sans-serif" }}
              onClick={() => window.history.back()}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy, ExternalLink, AlertTriangle, Terminal, Globe, Database } from "lucide-react"
import { DatabaseStatus } from "./database-status"

export function SetupWizard() {
  const [step, setStep] = useState(1)
  const [setupMethod, setSetupMethod] = useState<"manual" | "auto">("manual")
  const [stripeKeys, setStripeKeys] = useState({
    publishableKey: "",
    secretKey: "",
  })
  const [webhookSecret, setWebhookSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validateStripeKeys = () => {
    if (!stripeKeys.publishableKey.startsWith("pk_")) {
      setError("Publishable key should start with 'pk_'")
      return false
    }
    if (!stripeKeys.secretKey.startsWith("sk_")) {
      setError("Secret key should start with 'sk_'")
      return false
    }
    return true
  }

  const createWebhookManually = () => {
    setStep(5)
    setSuccess("Manual setup selected - follow the instructions below!")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copied to clipboard!")
    setTimeout(() => setSuccess(""), 2000)
  }

  const generateEnvFile = () => {
    const envContent = `# Supabase Configuration (these should already be set)
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || "your_supabase_url_here"}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your_supabase_anon_key_here"}
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${stripeKeys.publishableKey}
STRIPE_SECRET_KEY=${stripeKeys.secretKey}
STRIPE_WEBHOOK_SECRET=${webhookSecret || "whsec_your_webhook_secret_here"}

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Product Configuration
STRIPE_PRICE_ID=price_your_price_id_here`

    return envContent
  }

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">🚀 Pomodoro Dashboard Setup</CardTitle>
            <CardDescription className="text-gray-300">
              Let's get your database and Stripe integration configured!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Database Connection */}
            <div className={`space-y-4 ${step >= 1 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > 1 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                </div>
                <h3 className="font-semibold text-white">Database Connection</h3>
              </div>

              <div className="ml-8 space-y-3">
                <p className="text-sm text-gray-300">First, let's verify your Supabase database connection.</p>

                <DatabaseStatus />

                <Alert className="bg-blue-500/10 border-blue-400/30">
                  <Database className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    <strong>Need to set up Supabase?</strong>
                    <br />
                    1. The Supabase integration should already be connected in your v0 environment
                    <br />
                    2. If you see connection errors, check that your environment variables are properly set
                    <br />
                    3. Make sure you've run the database setup scripts
                  </AlertDescription>
                </Alert>

                {step === 1 && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setStep(2)}
                  >
                    Continue to Stripe Setup
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Stripe Account */}
            {step >= 2 && (
              <div className={`space-y-4 ${step >= 2 ? "opacity-100" : "opacity-50"}`}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > 2 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    {step > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
                  </div>
                  <h3 className="font-semibold text-white">Create Stripe Account</h3>
                </div>

                <div className="ml-8 space-y-3">
                  <p className="text-sm text-gray-300">You'll need a Stripe account to process payments.</p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
                      onClick={() => window.open("https://dashboard.stripe.com/register", "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Create Stripe Account
                    </Button>

                    {step === 2 && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => setStep(3)}
                      >
                        I have a Stripe account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Get API Keys */}
            {step >= 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > 3 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    {step > 3 ? <CheckCircle className="w-4 h-4" /> : "3"}
                  </div>
                  <h3 className="font-semibold text-white">Get Your Stripe Keys</h3>
                </div>

                <div className="ml-8 space-y-4">
                  <Alert className="bg-blue-500/10 border-blue-400/30">
                    <AlertDescription className="text-blue-300">
                      <strong>Go to your Stripe Dashboard:</strong>
                      <br />
                      1. Visit{" "}
                      <a
                        href="https://dashboard.stripe.com/apikeys"
                        target="_blank"
                        className="text-blue-400 underline"
                        rel="noreferrer"
                      >
                        Stripe API Keys
                      </a>
                      <br />
                      2. Copy your <strong>Publishable key</strong> and <strong>Secret key</strong>
                      <br />
                      3. Paste them below
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="pk_test_..."
                          className="font-mono text-sm bg-white/5 border-white/20 text-white"
                          value={stripeKeys.publishableKey}
                          onChange={(e) => setStripeKeys((prev) => ({ ...prev, publishableKey: e.target.value }))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
                          onClick={() => copyToClipboard(stripeKeys.publishableKey)}
                          disabled={!stripeKeys.publishableKey}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">STRIPE_SECRET_KEY</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="sk_test_..."
                          type="password"
                          className="font-mono text-sm bg-white/5 border-white/20 text-white"
                          value={stripeKeys.secretKey}
                          onChange={(e) => setStripeKeys((prev) => ({ ...prev, secretKey: e.target.value }))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
                          onClick={() => copyToClipboard(stripeKeys.secretKey)}
                          disabled={!stripeKeys.secretKey}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(4)}
                    disabled={!stripeKeys.publishableKey || !stripeKeys.secretKey}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Continue to Webhook Setup
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Choose Setup Method */}
            {step >= 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > 4 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    {step > 4 ? <CheckCircle className="w-4 h-4" /> : "4"}
                  </div>
                  <h3 className="font-semibold text-white">Webhook Setup</h3>
                </div>

                <div className="ml-8 space-y-4">
                  {isLocalhost && (
                    <Alert className="bg-yellow-500/10 border-yellow-400/30">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-300">
                        <strong>Local Development Detected:</strong> Stripe webhooks need a public URL. Choose your
                        preferred setup method below.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Tabs
                    value={setupMethod}
                    onValueChange={(value) => setSetupMethod(value as "manual" | "auto")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                      <TabsTrigger value="manual" className="data-[state=active]:bg-blue-500">
                        <Terminal className="w-4 h-4 mr-2" />
                        Manual Setup
                      </TabsTrigger>
                      <TabsTrigger value="auto" className="data-[state=active]:bg-purple-500">
                        <Globe className="w-4 h-4 mr-2" />
                        Production Setup
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                      <Alert className="bg-green-500/10 border-green-400/30">
                        <Terminal className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-300">
                          <strong>Recommended for Local Development</strong>
                          <br />
                          We'll create a temporary webhook secret for testing. You can set up real webhooks when you
                          deploy.
                        </AlertDescription>
                      </Alert>

                      <Button
                        onClick={createWebhookManually}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        Continue with Manual Setup
                      </Button>
                    </TabsContent>

                    <TabsContent value="auto" className="space-y-4">
                      <Alert className="bg-blue-500/10 border-blue-400/30">
                        <AlertDescription className="text-blue-300">
                          <strong>For Production Deployment</strong>
                          <br />
                          This requires a publicly accessible URL. Use this when deploying to Vercel, Netlify, or
                          similar platforms.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        <Label className="text-gray-300">Production URL</Label>
                        <Input
                          placeholder="https://your-app.vercel.app"
                          className="font-mono text-sm bg-white/5 border-white/20 text-white"
                        />
                      </div>

                      <Button
                        disabled
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 opacity-50"
                      >
                        Deploy First, Then Setup Webhooks
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {/* Step 5: Final Setup */}
            {step >= 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-white">Setup Complete! 🎉</h3>
                </div>

                <div className="ml-8 space-y-6">
                  <Alert className="bg-green-500/10 border-green-400/30">
                    <AlertDescription className="text-green-300">
                      <strong>Configuration Ready!</strong> Copy the environment variables below to complete your setup.
                    </AlertDescription>
                  </Alert>

                  {/* Environment Variables */}
                  <div>
                    <Label className="text-gray-300">Complete .env.local file:</Label>
                    <div className="relative">
                      <textarea
                        value={generateEnvFile()}
                        readOnly
                        className="w-full h-48 font-mono text-xs bg-black/50 border border-white/20 text-green-400 p-3 rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 glass-card border-white/20 text-gray-300 hover:bg-white/10"
                        onClick={() => copyToClipboard(generateEnvFile())}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy All
                      </Button>
                    </div>
                  </div>

                  <Alert className="bg-blue-500/10 border-blue-400/30">
                    <AlertDescription className="text-blue-300">
                      <strong>Next steps:</strong>
                      <br />
                      1. Copy the environment variables above to your <code>.env.local</code> file
                      <br />
                      2. Create a Stripe product and update <code>STRIPE_PRICE_ID</code>
                      <br />
                      3. Run the database setup scripts if you haven't already
                      <br />
                      4. Restart your development server
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => (window.location.href = "/")}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open("https://dashboard.stripe.com/products", "_blank")}
                      className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Create Product
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-400/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {success && (
              <Alert className="bg-green-500/10 border-green-400/30">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

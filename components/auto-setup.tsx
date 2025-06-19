"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Copy, AlertTriangle, Loader2, Database, RefreshCw } from "lucide-react"

interface SetupStatus {
  success: boolean
  database?: {
    connected: boolean
    tables: Record<string, boolean>
    all_tables_exist: boolean
  }
  environment?: {
    supabase_configured: boolean
    stripe_configured: boolean
  }
  env_template?: string
  next_steps?: string[]
  error?: string
  details?: string
  help?: string
  missing?: {
    url?: boolean
    anonKey?: boolean
    serviceKey?: boolean
  }
}

export function AutoSetup() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stripeKeys, setStripeKeys] = useState({
    publishableKey: "",
    secretKey: "",
    priceId: "",
  })
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Checking database connection...")

  const runSetup = async () => {
    setIsLoading(true)
    setProgress(20)
    setCurrentStep("Checking environment variables...")

    try {
      setProgress(40)
      setCurrentStep("Testing database connection...")

      const response = await fetch("/api/setup", { method: "POST" })
      const data = await response.json()

      setProgress(80)
      setCurrentStep("Analyzing setup status...")

      setSetupStatus(data)
      setProgress(100)
      setCurrentStep("Setup analysis complete!")
    } catch (error) {
      setSetupStatus({
        success: false,
        error: "Failed to run setup check",
        details: error instanceof Error ? error.message : "Network error",
        help: "Check your internet connection and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runSetup()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateCompleteEnv = () => {
    if (!setupStatus?.env_template) return ""

    return setupStatus.env_template
      .replace("pk_test_your_publishable_key_here", stripeKeys.publishableKey || "pk_test_your_publishable_key_here")
      .replace("sk_test_your_secret_key_here", stripeKeys.secretKey || "sk_test_your_secret_key_here")
      .replace("price_your_price_id_here", stripeKeys.priceId || "price_your_price_id_here")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">🚀 Database Setup Diagnostics</CardTitle>
            <CardDescription className="text-gray-300">
              Let me diagnose and fix your database connection issues!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-300">{currentStep}</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Setup Results */}
            {setupStatus && !isLoading && (
              <div className="space-y-6">
                {/* Error Display */}
                {!setupStatus.success && (
                  <Alert className="bg-red-500/10 border-red-400/30">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      <strong>Setup Failed:</strong> {setupStatus.error}
                      {setupStatus.details && (
                        <>
                          <br />
                          <strong>Details:</strong> {setupStatus.details}
                        </>
                      )}
                      {setupStatus.help && (
                        <>
                          <br />
                          <strong>Solution:</strong> {setupStatus.help}
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Missing Environment Variables */}
                {setupStatus.missing && (
                  <Alert className="bg-yellow-500/10 border-yellow-400/30">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      <strong>Missing Environment Variables:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {setupStatus.missing.url && <li>NEXT_PUBLIC_SUPABASE_URL</li>}
                        {setupStatus.missing.anonKey && <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>}
                        {setupStatus.missing.serviceKey && <li>SUPABASE_SERVICE_ROLE_KEY (optional)</li>}
                      </ul>
                      <div className="mt-3 p-3 bg-black/30 rounded text-xs font-mono">
                        <div>The Supabase integration should provide these automatically.</div>
                        <div>If they're missing, check your v0 project integrations.</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Database Status */}
                {setupStatus.success && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-400" />
                      <h3 className="font-semibold text-white">Database Status</h3>
                    </div>

                    <Alert className="bg-green-500/10 border-green-400/30">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        <strong>Database Connected Successfully!</strong> Your Supabase integration is working.
                      </AlertDescription>
                    </Alert>

                    {/* Table Status */}
                    {setupStatus.database?.tables && (
                      <div className="ml-6 space-y-3">
                        <h4 className="text-sm font-medium text-gray-300">Database Tables Status:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(setupStatus.database.tables).map(([table, exists]) => (
                            <div key={table} className="flex items-center gap-2">
                              {exists ? (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                              )}
                              <span className={`text-xs ${exists ? "text-green-300" : "text-yellow-300"}`}>
                                {table}
                              </span>
                            </div>
                          ))}
                        </div>

                        {!setupStatus.database.all_tables_exist && (
                          <Alert className="bg-blue-500/10 border-blue-400/30">
                            <AlertDescription className="text-blue-300">
                              <strong>Some tables need to be created.</strong>
                              <br />
                              Run the database setup script: <code>scripts/00-setup-database.sql</code>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Environment Variables Display */}
                {setupStatus.env_template && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Environment Configuration</h3>
                    <div>
                      <Label className="text-gray-300">Your .env.local file should contain:</Label>
                      <div className="relative">
                        <textarea
                          value={generateCompleteEnv()}
                          readOnly
                          className="w-full h-48 font-mono text-xs bg-black/50 border border-white/20 text-green-400 p-3 rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 glass-card border-white/20 text-gray-300 hover:bg-white/10"
                          onClick={() => copyToClipboard(generateCompleteEnv())}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {setupStatus.next_steps && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Next Steps</h3>
                    <Alert className="bg-blue-500/10 border-blue-400/30">
                      <AlertDescription className="text-blue-300">
                        <ol className="list-decimal list-inside space-y-1">
                          {setupStatus.next_steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={runSetup}
                    variant="outline"
                    className="glass-card border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recheck Connection
                  </Button>

                  {setupStatus.success && (
                    <Button
                      onClick={() => (window.location.href = "/")}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

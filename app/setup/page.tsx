import { EnvChecker } from "@/components/env-checker"
import { Database, Settings } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">🚀 Project Setup</h1>
          <p className="text-gray-300 text-lg">Let's get your Pomodoro Dashboard configured!</p>
        </div>

        <EnvChecker />

        {/* Additional Setup Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card border-white/20 p-6 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Database Setup
            </h3>
            <p className="text-gray-300 text-sm">
              Once Supabase is connected, you'll need to run the database setup scripts to create your tables.
            </p>
            <div className="text-xs text-gray-400 font-mono bg-black/30 p-2 rounded">
              Run: scripts/00-setup-database.sql
            </div>
          </div>

          <div className="glass-card border-white/20 p-6 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Optional Features
            </h3>
            <p className="text-gray-300 text-sm">
              Add Stripe integration for premium features, or customize your dashboard themes.
            </p>
            <div className="text-xs text-gray-400">These can be configured later</div>
          </div>
        </div>
      </div>
    </div>
  )
}

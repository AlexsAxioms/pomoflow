import Stripe from "stripe"

// Only create Stripe instance if the secret key is available and valid
let stripe: Stripe | null = null

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    typescript: true,
  })
}

export { stripe }

// Helper function to check if Stripe is properly configured
export function isStripeConfigured() {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
  )
}

// Helper function to check if webhooks are configured (optional for local dev)
export function areWebhooksConfigured() {
  return !!(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_"))
}

// Helper to get Stripe instance or throw error
export function getStripe() {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please check your environment variables.")
  }
  return stripe
}

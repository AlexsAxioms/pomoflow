import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  // For local development, if no webhook secret is configured, simulate the webhook
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("⚠️  Webhook secret not configured - simulating webhook for local development")

    try {
      const event = JSON.parse(body)
      console.log("📝 Simulated webhook event:", event.type)

      return NextResponse.json({
        received: true,
        simulated: true,
        message: "Webhook simulated for local development",
      })
    } catch (error) {
      console.error("Error parsing simulated webhook:", error)
      return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 })
    }
  }

  if (!signature || !stripe) {
    return NextResponse.json({ error: "Missing signature or Stripe not configured" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        console.log("💳 Payment successful:", session.id)

        // Update user subscription status
        if (session.customer_email) {
          await supabase.from("user_subscriptions").upsert({
            email: session.customer_email,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: "active",
            updated_at: new Date().toISOString(),
          })
        }
        break

      case "customer.subscription.updated":
        const subscription = event.data.object
        console.log("🔄 Subscription updated:", subscription.id)

        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object
        console.log("❌ Subscription cancelled:", deletedSubscription.id)

        await supabase
          .from("user_subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", deletedSubscription.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

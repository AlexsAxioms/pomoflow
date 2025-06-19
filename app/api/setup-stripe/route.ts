import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json()

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Secret key is required",
        },
        { status: 400 },
      )
    }

    if (!secretKey.startsWith("sk_")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid secret key format. Should start with 'sk_'",
        },
        { status: 400 },
      )
    }

    // Create Stripe instance with the provided key
    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })

    // Test the API key first
    try {
      await stripe.accounts.retrieve()
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid Stripe API key: ${error.message}`,
        },
        { status: 400 },
      )
    }

    // Create a webhook endpoint
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const webhook = await stripe.webhookEndpoints.create({
      url: `${siteUrl}/api/webhooks/stripe`,
      enabled_events: ["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"],
    })

    return NextResponse.json({
      success: true,
      webhook_id: webhook.id,
      webhook_secret: webhook.secret,
      message: "Webhook created successfully!",
    })
  } catch (error: any) {
    console.error("Error creating webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create webhook",
      },
      { status: 500 },
    )
  }
}

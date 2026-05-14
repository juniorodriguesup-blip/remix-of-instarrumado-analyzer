import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Kiwify webhook payload validation schema
const webhookSchema = z.object({
  order_status: z.string(),
  order_id: z.string().optional(),
  Customer: z.object({
    email: z.string().email(),
  }).optional(),
});

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 405 });
  }

  if (req.method !== "POST") {
    console.error(`Invalid method: ${req.method}`);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Kiwify webhook received");
    
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get("token");
    const expectedToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN");
    
    if (!expectedToken) {
      console.error("KIWIFY_WEBHOOK_TOKEN not configured");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (!tokenParam || tokenParam !== expectedToken) {
      console.error("Invalid webhook token attempt");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const rawBody = await req.json();
    
    const validation = webhookSchema.safeParse(rawBody);
    if (!validation.success) {
      console.error("Invalid webhook payload:", validation.error.issues);
      return new Response(JSON.stringify({ error: "Invalid payload format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = validation.data;
    const orderStatus = body.order_status;
    const customerEmail = body.Customer?.email?.toLowerCase().trim();
    const orderId = body.order_id || "unknown";

    console.log(`Order ${orderId} - Status: ${orderStatus} - Email: ${customerEmail ? "provided" : "missing"}`);

    if (orderStatus !== "paid") {
      console.log(`Order ${orderId} not paid yet, status: ${orderStatus}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook received, but order not paid yet" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!customerEmail) {
      console.error("No customer email provided for paid order");
      return new Response(JSON.stringify({ error: "No customer email provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate premium access token (valid for 30 days)
    const premiumToken = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase
      .from("premium_access")
      .insert({
        email: customerEmail,
        token: premiumToken,
        order_id: orderId,
        expires_at: expiresAt,
      });

    if (tokenError) {
      console.error(`Error creating premium access for order ${orderId}:`, tokenError.message);
      return new Response(JSON.stringify({ error: "Failed to create premium access" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Premium access token created for ${customerEmail} (order ${orderId})`);

    // If user has an account, also upgrade subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", customerEmail)
      .single();

    if (profile) {
      console.log(`Found existing user for order ${orderId}, upgrading subscription`);

      await supabase
        .from("user_subscriptions")
        .update({ 
          status: "premium",
          upgraded_at: new Date().toISOString()
        })
        .eq("user_id", profile.user_id);

      // Link premium access to user
      await supabase
        .from("premium_access")
        .update({ user_id: profile.user_id })
        .eq("token", premiumToken);

      console.log(`Subscription upgraded and linked for order ${orderId}`);
    }

    // Send premium email notification
    try {
      const emailResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-premium-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            email: customerEmail,
            order_id: orderId,
            premium_token: premiumToken,
          }),
        }
      );

      if (emailResponse.ok) {
        console.log(`Premium email sent to ${customerEmail} for order ${orderId}`);
      } else {
        console.warn(`Failed to send premium email for order ${orderId}`);
      }
    } catch (emailError) {
      console.warn(`Email notification error for order ${orderId}:`, emailError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Premium access granted",
      token: premiumToken,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

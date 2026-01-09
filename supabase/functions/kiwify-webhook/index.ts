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

serve(async (req) => {
  // Server-to-server webhook - reject browser preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 405 });
  }

  // Only accept POST requests for webhooks
  if (req.method !== "POST") {
    console.error(`Invalid method: ${req.method}`);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Kiwify webhook received");
    
    // Validate webhook token
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
    
    // Parse and validate request body
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

    // Only process if payment is approved
    // Kiwify statuses: paid, waiting_payment, refused, refunded, chargedback
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

    // Create Supabase client with service role key to bypass RLS
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

    // Find user by email in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", customerEmail)
      .single();

    if (profileError || !profile) {
      console.error(`User not found for order ${orderId}`);
      return new Response(JSON.stringify({ 
        error: "User not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Found user for order ${orderId}`);

    // Update subscription status to premium
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({ 
        status: "premium",
        upgraded_at: new Date().toISOString()
      })
      .eq("user_id", profile.user_id);

    if (updateError) {
      console.error(`Error updating subscription for order ${orderId}:`, updateError.message);
      return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Successfully upgraded subscription for order ${orderId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription upgraded to premium"
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

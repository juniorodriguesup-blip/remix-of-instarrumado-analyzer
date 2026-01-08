import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Kiwify webhook received");
    
    // Validate webhook token
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get("token");
    const expectedToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN");
    
    if (!tokenParam || tokenParam !== expectedToken) {
      console.error("Invalid webhook token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Parse request body
    const body = await req.json();
    console.log("Webhook payload:", JSON.stringify(body));

    // Extract data from Kiwify payload
    // Kiwify sends: order_status, Customer.email, etc.
    const orderStatus = body.order_status;
    const customerEmail = body.Customer?.email?.toLowerCase().trim();
    const orderId = body.order_id;

    console.log(`Order ${orderId} - Status: ${orderStatus} - Email: ${customerEmail}`);

    // Only process if payment is approved
    // Kiwify statuses: paid, waiting_payment, refused, refunded, chargedback
    if (orderStatus !== "paid") {
      console.log(`Order ${orderId} not paid yet, status: ${orderStatus}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook received, but order not paid yet" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!customerEmail) {
      console.error("No customer email provided");
      return new Response(JSON.stringify({ error: "No customer email provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find user by email in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", customerEmail)
      .single();

    if (profileError || !profile) {
      console.error("User not found for email:", customerEmail, profileError);
      return new Response(JSON.stringify({ 
        error: "User not found", 
        email: customerEmail 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found user ${profile.user_id} for email ${customerEmail}`);

    // Update subscription status to premium
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({ 
        status: "premium",
        upgraded_at: new Date().toISOString()
      })
      .eq("user_id", profile.user_id);

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Successfully upgraded user ${profile.user_id} to premium`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription upgraded to premium",
      user_id: profile.user_id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

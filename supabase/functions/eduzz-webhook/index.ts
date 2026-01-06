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
    console.log("Eduzz webhook received");
    
    // Get webhook token for validation
    const webhookToken = Deno.env.get("EDUZZ_WEBHOOK_TOKEN");
    
    // Parse request body
    const body = await req.json();
    console.log("Webhook payload:", JSON.stringify(body));

    // Validate webhook token if provided in headers
    const authHeader = req.headers.get("x-api-key") || req.headers.get("authorization");
    if (webhookToken && authHeader !== webhookToken && authHeader !== `Bearer ${webhookToken}`) {
      console.error("Invalid webhook token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Eduzz webhook payload structure
    // Common fields: trans_status, cus_email, trans_cod, prod_name
    const { trans_status, cus_email, trans_cod } = body;

    console.log(`Transaction ${trans_cod} - Status: ${trans_status} - Email: ${cus_email}`);

    // Only process if payment is confirmed (status 3 = paid/completed)
    // Eduzz status codes: 1=Open, 3=Paid, 4=Cancelled, 6=Waiting Payment, 7=Refunded
    if (trans_status !== 3 && trans_status !== "3") {
      console.log(`Transaction ${trans_cod} not paid yet, status: ${trans_status}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook received, but transaction not paid" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!cus_email) {
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
      .eq("email", cus_email.toLowerCase().trim())
      .single();

    if (profileError || !profile) {
      console.error("User not found for email:", cus_email, profileError);
      return new Response(JSON.stringify({ 
        error: "User not found", 
        email: cus_email 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found user ${profile.user_id} for email ${cus_email}`);

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

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
    
    // Parse request body
    const body = await req.json();
    console.log("Webhook payload:", JSON.stringify(body));

    // Detect API format and extract data
    let customerEmail: string | null = null;
    let isPaid = false;
    let transactionId: string | null = null;

    // New Eduzz API format (myeduzz webhooks)
    if (body.event && body.data) {
      console.log("Detected new Eduzz API format");
      const { event, data } = body;
      
      // Extract email from buyer object
      customerEmail = data?.buyer?.email?.toLowerCase().trim();
      transactionId = data?.id || body.id;
      
      // Check for payment confirmed events
      // Events: myeduzz.invoice_paid, myeduzz.sale_paid, myeduzz.invoice_paid_by_pix, etc.
      const paidEvents = [
        "myeduzz.invoice_paid",
        "myeduzz.sale_paid", 
        "myeduzz.invoice_paid_by_pix",
        "myeduzz.invoice_paid_by_credit_card",
        "myeduzz.invoice_paid_by_billet",
        "myeduzz.subscription_paid"
      ];
      
      isPaid = paidEvents.includes(event) || data?.status === "paid";
      
      console.log(`New API - Event: ${event}, Status: ${data?.status}, Email: ${customerEmail}`);
    } 
    // Legacy Eduzz API format
    else if (body.trans_status !== undefined) {
      console.log("Detected legacy Eduzz API format");
      customerEmail = body.cus_email?.toLowerCase().trim();
      transactionId = body.trans_cod;
      // Status 3 = Paid in legacy API
      isPaid = body.trans_status === 3 || body.trans_status === "3";
      
      console.log(`Legacy API - Status: ${body.trans_status}, Email: ${customerEmail}`);
    }

    console.log(`Transaction ${transactionId} - Paid: ${isPaid} - Email: ${customerEmail}`);

    // Only process if payment is confirmed
    if (!isPaid) {
      console.log(`Transaction ${transactionId} not paid yet`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook received, but transaction not paid yet" 
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

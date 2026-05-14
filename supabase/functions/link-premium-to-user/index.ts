import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://instarrumado.vercel.app",
  "https://instarrumado.com.br",
  "https://www.instarrumado.com.br",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, user_id } = await req.json();

    if (!token || !user_id) {
      return new Response(JSON.stringify({ error: "Token e user_id são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the token exists and is valid
    const { data: access, error: accessError } = await supabase
      .from("premium_access")
      .select("id, email, expires_at")
      .eq("token", token)
      .single();

    if (accessError || !access) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (new Date(access.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Token expirado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Link token to user
    const { error: linkError } = await supabase
      .from("premium_access")
      .update({ user_id })
      .eq("id", access.id);

    if (linkError) {
      console.error("Error linking token to user:", linkError);
      return new Response(JSON.stringify({ error: "Erro ao vincular conta" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also ensure user has premium subscription
    const { data: existingSub } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (existingSub) {
      await supabase
        .from("user_subscriptions")
        .update({ status: "premium", upgraded_at: new Date().toISOString() })
        .eq("user_id", user_id);
    } else {
      await supabase
        .from("user_subscriptions")
        .insert({ user_id, status: "premium", upgraded_at: new Date().toISOString() });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error linking premium:", err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
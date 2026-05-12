import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const leadSchema = z.object({
  email: z.string().email(),
  instagram: z.string().optional(),
  tipo: z.string().optional(),
  nicho: z.string().optional(),
  objetivo: z.string().optional(),
  source: z.string().optional().default("organic"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const rawBody = await req.json();
    const validation = leadSchema.safeParse(rawBody);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Invalid lead data" }), { status: 400 });
    }

    const { email, instagram, tipo, nicho, objetivo, source } = validation.data;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("leads").upsert(
      {
        email: email.toLowerCase().trim(),
        instagram_handle: instagram,
        profile_type: tipo,
        niche: nicho,
        goal: objetivo,
        source,
        status: "new",
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Error saving lead:", error.message);
      return new Response(JSON.stringify({ error: "Failed to save lead" }), { status: 500 });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Instarrumado <contato@instarrumado.com.br>",
            to: email,
            subject: "Seu diagnóstico Instagram está pronto! 📊",
            html: `
<!DOCTYPE html>
<html><body style="font-family: Arial; background: #0a0a0b; color: #fafafa; padding: 40px;">
<div style="max-width: 600px; margin: 0 auto;">
  <h1 style="font-size: 24px; margin-bottom: 16px;">Olá! 👋</h1>
  <p style="color: #a1a1aa; line-height: 1.6;">
    Recebemos seu pedido de diagnóstico do Instagram.
  </p>
  <p style="color: #a1a1aa; line-height: 1.6;">
    Para acessar seu diagnóstico completo e personalizado, crie sua conta gratuita:
  </p>
  <a href="https://instarrumado.com.br/auth?redirect=/diagnostico"
     style="display: inline-block; background: linear-gradient(135deg, #e1306c, #833ab4); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0;">
    Criar conta e ver diagnóstico
  </a>
  <p style="color: #52525b; font-size: 14px;">
    Enquanto isso, aqui vai uma dica: o maior erro de perfis profissionais é ter uma bio genérica.
    Sua bio deve comunicar em 3 segundos: quem você é, o que faz e por que seguir.
  </p>
</div></body></html>`,
          }),
        });
      } catch (emailError) {
        console.warn("Failed to send welcome email:", emailError);
      }
    }

    console.log(`Lead saved: ${email}`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
});

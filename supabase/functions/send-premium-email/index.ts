import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const emailSchema = z.object({
  email: z.string().email(),
  order_id: z.string().optional(),
  premium_token: z.string().optional(),
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
    const validation = emailSchema.safeParse(rawBody);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Invalid email data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, order_id, premium_token } = validation.data;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #0a0a0b; color: #fafafa; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #e1306c, #c13584, #833ab4);
             -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .badge { display: inline-block; background: linear-gradient(135deg, #e1306c, #833ab4); color: white;
             padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; margin: 20px 0; }
    .content { padding: 30px 0; }
    h1 { font-size: 24px; text-align: center; margin-bottom: 10px; }
    p { color: #a1a1aa; line-height: 1.6; font-size: 16px; }
    .benefits { background: rgba(225, 48, 108, 0.1); border: 1px solid rgba(225, 48, 108, 0.2); border-radius: 16px;
                padding: 24px; margin: 24px 0; }
    .benefits h3 { color: #e1306c; margin-top: 0; }
    .benefits ul { list-style: none; padding: 0; margin: 0; }
    .benefits li { padding: 8px 0; color: #a1a1aa; }
    .benefits li::before { content: "✅ "; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #e1306c, #833ab4); color: white;
                  text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600;
                  font-size: 16px; margin: 20px 0; }
    .footer { text-align: center; padding: 30px 0; border-top: 1px solid rgba(255,255,255,0.1);
              color: #52525b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Instarrumado</div>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <div class="badge">ACESSO PREMIUM CONFIRMADO</div>
      </div>

      <h1>Bem-vindo ao Clube VIP! 🎉</h1>
      <p style="text-align: center;">
        Seu acesso premium ao Instarrumado foi liberado com sucesso.
        Agora você tem acesso completo a todas as ferramentas de diagnóstico e análise estratégica.
      </p>

      <div class="benefits">
        <h3>Seus Benefícios VIP:</h3>
        <ul>
          <li>Diagnóstico completo com IA</li>
          <li>Bio estratégica personalizada</li>
          <li>Calendário de conteúdo 7 dias</li>
          <li>Roteiros de Reels prontos</li>
          <li>Scripts de vendas para Direct</li>
          <li>Destaques estratégicos</li>
          <li>Análises ilimitadas</li>
          <li>Suporte prioritário</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <p>Acesse agora sua área VIP e comece a transformar seu Instagram:</p>
        <a href="https://instarrumado.com.br/obrigado?token=${premium_token || ''}" class="cta-button">
          Acessar Área VIP
        </a>
      </div>

      <p style="margin-top: 30px;">
        Qualquer dúvida, responda a este email ou entre em contato pelo nosso suporte.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Instarrumado. Todos os direitos reservados.</p>
      <p>Se você não realizou esta compra, ignore este email.</p>
    </div>
  </div>
</body>
</html>`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Instarrumado <contato@instarrumado.com.br>",
        to: email,
        subject: "Seu Acesso VIP ao Instarrumado foi Liberado! 🎉",
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Premium email sent successfully to ${email}`);

    return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-premium-email:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

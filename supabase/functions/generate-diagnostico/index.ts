import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Allowed origins for CORS - restrict to known domains
const allowedOrigins = [
  "https://instarrumado.lovable.app",
  "https://instarrumado.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Input validation schema - isPremium is determined server-side, not from client
const inputSchema = z.object({
  instagram: z.string()
    .min(1, "Instagram handle required")
    .max(30, "Instagram handle too long")
    .regex(/^@?[a-zA-Z0-9._]+$/, "Invalid Instagram handle format"),
  tipo: z.enum(["criador", "empreendedor", "profissional", "politico", "outro"]),
  nicho: z.string()
    .min(2, "Nicho too short")
    .max(100, "Nicho too long"),
  objetivo: z.string()
    .min(5, "Objetivo too short")
    .max(200, "Objetivo too long"),
});

// Sanitize input for AI prompt to prevent prompt injection
function sanitizeForPrompt(input: string): string {
  return input
    .replace(/[<>"`]/g, "") // Remove potential injection chars
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .substring(0, 200); // Hard limit
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client to validate the token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate user token using getClaims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Invalid token:", claimsError);
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated request from user: ${userId}`);

    // Query subscription status server-side - never trust client input
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single();

    if (subError) {
      console.error('Failed to fetch subscription:', subError);
      return new Response(JSON.stringify({ error: 'Erro ao verificar assinatura' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine premium status server-side
    const isPremium = subscription?.status === 'premium';
    console.log(`User ${userId} subscription status: ${isPremium ? 'premium' : 'free'}`);

    // Parse and validate input
    const rawInput = await req.json();
    const validation = inputSchema.safeParse(rawInput);
    
    if (!validation.success) {
      console.error("Validation failed:", validation.error.issues);
      return new Response(JSON.stringify({ 
        error: "Dados inválidos", 
        details: validation.error.issues.map(i => i.message)
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { instagram, tipo, nicho, objetivo } = validation.data;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const tipoLabels: Record<string, string> = {
      criador: "Criador de Conteúdo",
      empreendedor: "Empreendedor",
      profissional: "Profissional Liberal",
      politico: "Político",
      outro: "Outro",
    };

    const tipoLabel = tipoLabels[tipo] || tipo;

    // Sanitize inputs before using in prompt
    const safeInstagram = sanitizeForPrompt(instagram);
    const safeNicho = sanitizeForPrompt(nicho);
    const safeObjetivo = sanitizeForPrompt(objetivo);

    const systemPrompt = `Você é um estrategista digital especialista em Instagram e posicionamento de marca pessoal. 
Sua tarefa é analisar perfis e fornecer diagnósticos estratégicos personalizados.

REGRAS IMPORTANTES:
- Seja direto e incisivo nas suas análises
- Use linguagem profissional mas acessível
- Foque em problemas ESPECÍFICOS que alguém do perfil informado provavelmente enfrenta
- Não use exemplos genéricos, personalize para o nicho e objetivo específicos
- Destaque pontos de melhoria concretos
- Use formatação com parágrafos claros

${isPremium ? `
PARA USUÁRIO PREMIUM:
- Forneça análise COMPLETA e DETALHADA
- Inclua plano de ação com passos específicos
- Dê exemplos práticos de conteúdo
- Sugira estratégias avançadas de crescimento
- Inclua dicas de frequência de postagem, horários, tipos de conteúdo
- Forneça no mínimo 5 parágrafos detalhados
` : `
PARA USUÁRIO GRATUITO:
- Forneça apenas uma análise SUPERFICIAL das principais falhas
- Aponte 2-3 problemas críticos de forma breve
- NÃO forneça soluções detalhadas
- Termine indicando que o plano completo está disponível no acesso premium
- Limite a 3-4 parágrafos curtos
`}`;

    const userPrompt = `Analise o seguinte perfil e gere um diagnóstico estratégico personalizado:

PERFIL:
- Instagram: ${safeInstagram}
- Tipo de perfil: ${tipoLabel}
- Nicho de atuação: ${safeNicho}
- Objetivo principal: ${safeObjetivo}

Gere um diagnóstico ESPECÍFICO para este perfil, considerando os desafios típicos de alguém que é ${tipoLabel} no nicho de ${safeNicho} e quer ${safeObjetivo}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao gerar diagnóstico" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const diagnostico = data.choices?.[0]?.message?.content || "Não foi possível gerar o diagnóstico.";

    console.log(`Diagnostico generated successfully for user ${userId}`);

    return new Response(JSON.stringify({ diagnostico }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-diagnostico:", error);
    return new Response(JSON.stringify({ error: "Erro ao processar solicitação" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

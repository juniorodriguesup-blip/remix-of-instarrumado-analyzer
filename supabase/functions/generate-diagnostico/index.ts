import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Allowed origins for CORS - restrict to known domains
const allowedOrigins = [
  "https://instarrumado.lovable.app",
  "https://instarrumado.com",
  "https://www.instarrumado.com.br",
  "https://instarrumado.com.br",
  "http://localhost:5173",
  "http://localhost:8080",
];

// Check if origin matches allowed patterns
function isAllowedOrigin(origin: string): boolean {
  // Check exact matches
  if (allowedOrigins.includes(origin)) return true;
  
  // Allow any *.lovable.app subdomain (for preview environments)
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Input validation schema
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
  isPremium: z.boolean().optional().default(false),
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
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(JSON.stringify({
        error: "Muitas requisições. Tente novamente em 1 minuto.",
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const { instagram, tipo, nicho, objetivo, isPremium } = validation.data;
    
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
PARA DIAGNÓSTICO PREMIUM:
- Forneça análise COMPLETA e DETALHADA
- Estruture em seções claras com títulos numerados (use **1. Título:** formato)
- Para cada problema, inclua:
  - **Problema:** descrição específica
  - **Implicação para o Objetivo:** como isso afeta o objetivo do cliente
- Inclua no mínimo 5 seções completas
- Seja profundo e estratégico
` : `
PARA DIAGNÓSTICO GRATUITO:
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

    console.log(`Diagnostico generated successfully (premium: ${isPremium})`);

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

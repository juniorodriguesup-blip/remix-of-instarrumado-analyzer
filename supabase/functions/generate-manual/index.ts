import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const inputSchema = z.object({
  instagram: z.string().min(1).max(30),
  tipo: z.enum(["criador", "empreendedor", "profissional", "politico", "outro"]),
  nicho: z.string().min(2).max(100),
  objetivo: z.string().min(5).max(200),
});

function sanitizeForPrompt(input: string): string {
  return input
    .replace(/[<>"`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 200);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Verify premium status
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single();

    if (subscription?.status !== 'premium') {
      return new Response(JSON.stringify({ error: 'Acesso exclusivo para usuários Premium' }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawInput = await req.json();
    const validation = inputSchema.safeParse(rawInput);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos" }), {
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
    const safeInstagram = sanitizeForPrompt(instagram);
    const safeNicho = sanitizeForPrompt(nicho);
    const safeObjetivo = sanitizeForPrompt(objetivo);

    const systemPrompt = `Você é um estrategista de Instagram especialista em arrumação de perfis e posicionamento digital.
Sua tarefa é criar um MANUAL DE ARRUMAÇÃO 100% PERSONALIZADO para o perfil do cliente.

FORMATO OBRIGATÓRIO - Use EXATAMENTE estas seções com os marcadores:

**1. Bio Estratégica Personalizada:**
Crie uma bio PRONTA para o cliente copiar e colar, específica para o nicho e objetivo dele.
Inclua emojis estratégicos, linha de autoridade, transformação que oferece, e CTA.

**2. Estrutura de Destaques:**
Liste 5-6 destaques estratégicos com nomes criativos e específicos para o nicho.
Para cada destaque, explique o que colocar dentro (5-7 stories por destaque).

**3. Estratégia Visual do Feed:**
Defina paleta de cores específica para o nicho (cite cores em português).
Sugira padrão de organização (xadrez, linhas, colunas) e explique como aplicar.
Dê exemplos de tipos de post para cada posição.

**4. Calendário de Conteúdo (7 dias):**
Crie um calendário ESPECÍFICO para a semana com:
- Dia da semana
- Formato (Reels, Carrossel, Stories, Post único)
- Tema/título do conteúdo específico para o nicho
- Objetivo do post (engajamento, autoridade, venda, conexão)
- Horário sugerido

**5. Roteiros de Reels Prontos:**
Crie 3 roteiros COMPLETOS de Reels específicos para o nicho:
- Gancho (primeiros 3 segundos)
- Desenvolvimento
- CTA final
Cada roteiro deve ser sobre um tema relevante para o objetivo do cliente.

**6. Scripts de Conversão no Direct:**
Crie 4 scripts prontos para usar no Direct:
- Primeiro contato
- Qualificação
- Apresentação do serviço/produto
- Fechamento
Personalize para o tipo de oferta que o cliente provavelmente tem.

REGRAS:
- Seja ULTRA ESPECÍFICO para o nicho e objetivo informados
- Use exemplos reais e práticos que o cliente possa aplicar HOJE
- Não use conteúdo genérico - cada seção deve refletir o perfil do cliente
- Use linguagem direta e profissional
- Formate cada seção claramente para fácil leitura`;

    const userPrompt = `Crie um Manual de Arrumação COMPLETO e PERSONALIZADO para este perfil:

PERFIL DO CLIENTE:
- Instagram: ${safeInstagram}
- Tipo: ${tipoLabel}
- Nicho: ${safeNicho}
- Objetivo: ${safeObjetivo}

Lembre-se: Este cliente é ${tipoLabel} que atua no nicho de "${safeNicho}" e quer "${safeObjetivo}".
Todo o conteúdo do manual deve ser específico para esta combinação única.`;

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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao gerar manual" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const manual = data.choices?.[0]?.message?.content || "Não foi possível gerar o manual.";

    console.log(`Manual generated successfully for user ${userId}`);

    return new Response(JSON.stringify({ manual }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-manual:", error);
    return new Response(JSON.stringify({ error: "Erro ao processar solicitação" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

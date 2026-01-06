import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { instagram, tipo, nicho, objetivo, isPremium } = await req.json();
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
- Instagram: ${instagram}
- Tipo de perfil: ${tipoLabel}
- Nicho de atuação: ${nicho}
- Objetivo principal: ${objetivo}

Gere um diagnóstico ESPECÍFICO para este perfil, considerando os desafios típicos de alguém que é ${tipoLabel} no nicho de ${nicho} e quer ${objetivo}.`;

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

    return new Response(JSON.stringify({ diagnostico }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-diagnostico:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

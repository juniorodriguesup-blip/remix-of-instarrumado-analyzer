import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const allowedOrigins = [
  "https://instarrumado.vercel.app",
  "https://instarrumado.com",
  "https://www.instarrumado.com.br",
  "https://instarrumado.com.br",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
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

const inputSchema = z.object({
  instagram: z.string().min(1).max(30),
  tipo: z.enum(["criador", "empreendedor", "profissional", "politico", "outro"]),
  nicho: z.string().min(2).max(100),
  objetivo: z.string().min(5).max(200),
});

const tipoLabels: Record<string, string> = {
  criador: "Criador de Conteúdo",
  empreendedor: "Empreendedor",
  profissional: "Profissional Liberal",
  politico: "Político",
  outro: "Outro",
};

function gerarManual(instagram: string, tipo: string, nicho: string, objetivo: string): string {
  const tipoLabel = tipoLabels[tipo] || tipo;
  const capsNicho = nicho.charAt(0).toUpperCase() + nicho.slice(1);

  const bioOptions = [
    `Ajudo ${nicho === "fitness" ? "pessoas a transformarem o corpo" : nicho === "estética" ? "pessoas a realçarem a beleza" : nicho === "direito" ? "pessoas a resolverem problemas jurídicos" : `pessoas no ${nicho}`} com estratégia e resultado.`,
    `${capsNicho} é o que importa. Transformo desafios em resultados para quem busca ${objetivo}.`,
    `Especialista em ${nicho} • ${objetivo} • Transformando conhecimento em resultado.`,
  ];

  const randomBio = bioOptions[Math.floor(Math.random() * bioOptions.length)];

  return `**1. Bio Estratégica Personalizada:**

✨ ${capsNicho} | ${tipoLabel}
🎯 ${randomBio}
📲 Dica grátis toda semana nos Stories
👇 Clique no link e transforme seu resultado

**2. Estrutura de Destaques:**

📌 **Quem Sou** — Sua história, formação e propósito (5-7 stories)
🏆 **Resultados** — Cases e provas sociais organizadas (5-7 stories)
🎯 **O que Faço** — Serviços e produtos explicados (5-7 stories)
💡 **Dicas Grátis** — Conteúdo educativo de alto valor (5-7 stories)
💬 **Depoimentos** — Provas sociais de clientes (5-7 stories)
📞 **Contato** — Informações e link direto (5-7 stories)

**3. Estratégia Visual do Feed:**

🎨 **Paleta Recomendada:**
- Cor principal: tons que remetem ao seu nicho (${nicho === "estética" || nicho === "beleza" ? "rosa suave, nude, dourado" : nicho === "direito" ? "azul marinho, cinza, branco" : nicho === "fitness" ? "preto, vermelho, cinza" : nicho === "marketing" ? "roxo, laranja, preto" : "azul, verde, branco"})
- Cor de destaque: para CTAs e elementos importantes
- Neutra: branco ou off-white para fundo

📐 **Padrão Recomendado:** Grid em xadrez (alterna post informativo com post visual)

📸 **Dicas:**
- Use sempre o mesmo filtro/preset em todas as fotos
- Fonte consistente em todos os cards
- Planeje sempre 9 posts por vez para visualizar o grid completo

**4. Calendário de Conteúdo (7 dias):**

📅 **Semana 1 — Tema: ${capsNicho} que Transforma**

**Segunda-feira** 📱 Formato: Reels
Tema: Gancho poderoso sobre ${nicho}
Objetivo: Entretenimento + Educação | Horário: 12h

**Terça-feira** 📚 Formato: Carrossel
Tema: 3 passos essenciais para ${objetivo}
Objetivo: Autoridade | Horário: 18h

**Quarta-feira** 🎬 Formato: Reels
Tema: Bastidores do seu processo em ${nicho}
Objetivo: Conexão | Horário: 12h

**Quinta-feira** 📝 Formato: Post único
Tema: Case/resultado real de cliente
Objetivo: Prova social | Horário: 18h

**Sexta-feira** 🎥 Formato: Reels
Tema: Respondendo dúvidas comuns sobre ${nicho}
Objetivo: Engajamento | Horário: 12h

**Sábado** 💬 Formato: Stories
Tema: Enquete/Caixa de perguntas sobre ${objetivo}
Objetivo: Interação | Horário: 10h

**Domingo** ✨ Formato: Post único
Tema: Reflexão ou inspiração sobre ${nicho}
Objetivo: Conexão pessoal | Horário: 19h

**5. Roteiros de Reels Prontos:**

🎬 **Reel 1 — Gancho Forte**
Cena 1 (0-3s): "Pare de fazer isso no seu ${nicho} se você quer ${objetivo}"
Cena 2 (3-15s): Mostre o erro comum e por que não funciona
Cena 3 (15-25s): Apresente a alternativa correta
Cena 4 (25-30s): CTA: "Salva esse Reels pra não esquecer"

🎬 **Reel 2 — História/Bastidores**
Cena 1 (0-3s): "Meu maior erro em ${nicho} foi..."
Cena 2 (3-15s): Conte a história do erro e o aprendizado
Cena 3 (15-25s): Mostre como você faz hoje
Cena 4 (25-30s): CTA: "Comenta aqui se você já passou por isso"

🎬 **Reel 3 — Lista Rápida**
Cena 1 (0-3s): "3 coisas que ninguém te conta sobre ${nicho}"
Cena 2 (3-20s): Liste e explique cada uma
Cena 3 (20-28s): Resumo e conclusão
Cena 4 (28-30s): CTA: "Qual delas você mais precisa?"

**6. Scripts de Conversão no Direct:**

💬 **Script 1 — Primeiro Contato:**
"Oi [nome]! Vi seu perfil e notei que você é [característica do lead]. Sou [seu nome], ${tipoLabel} especialista em ${nicho}. Posso te ajudar com [problema específico]?"

💬 **Script 2 — Qualificação:**
"Que legal seu interesse! Me conta: qual é seu maior desafio com ${nicho} hoje? Assim posso te ajudar melhor."

💬 **Script 3 — Apresentação:**
"Entendi! Tenho um [serviço/produto] que ajuda exatamente com isso. Ele funciona assim: [explicação rápida]. Posso te explicar como funciona para o seu caso?"

💬 **Script 4 — Fechamento:**
"Perfeito! Para começar, o investimento é [valor]. Esse valor inclui [benefícios]. Te envio o link de pagamento?"

💬 **Script 5 — Follow-up:**
"Oi [nome]! Passando pra saber se conseguiu ver minha mensagem. Ainda estou por aqui se precisar de ajuda com ${nicho}."`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawInput = await req.json();
    const validation = inputSchema.safeParse(rawInput);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { instagram, tipo, nicho, objetivo } = validation.data;
    const manual = gerarManual(instagram, tipo, nicho, objetivo);

    return new Response(JSON.stringify({ manual }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Erro ao processar solicitação" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60_000;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const inputSchema = z.object({
  instagram: z.string().min(1).max(30),
  tipo: z.enum(["criador", "empreendedor", "profissional", "politico", "outro"]),
  nicho: z.string().min(2).max(100),
  objetivo: z.string().min(5).max(200),
  isPremium: z.boolean().optional().default(false),
});

const tipoLabels: Record<string, string> = {
  criador: "Criador de Conteúdo",
  empreendedor: "Empreendedor",
  profissional: "Profissional Liberal",
  politico: "Político",
  outro: "Outro",
};

const problemasPorNicho: Record<string, Array<{ problema: string; implicacao: string; solucao: string }>> = {
  default: [
    {
      problema: "Bio genérica e sem direcionamento",
      implicacao: "Visitantes não entendem seu valor em 3 segundos e abandonam o perfil",
      solucao: "Bio estratégica com título de autoridade, transformação oferecida e CTA claro",
    },
    {
      problema: "Feed sem identidade visual consistente",
      implicacao: "Cada post parece de um perfil diferente, gerando desconfiança",
      solucao: "Paleta de cores definida, padrão de posts e grid harmonioso",
    },
    {
      problema: "Destaques desorganizados sem funil",
      implicacao: "O visitante não sabe por onde começar e sai sem se engajar",
      solucao: "Estrutura de destaques em funil: Apresentação → Provas → Oferta → Contato",
    },
    {
      problema: "Legendas sem estratégia de copywriting",
      implicacao: "Baixo engajamento mesmo com bom alcance",
      solucao: "Copy diretas com gancho, desenvolvimento e CTA persuasivo",
    },
    {
      problema: "Call to Action ausente ou fraco",
      implicacao: "Seguidores não sabem o que fazer depois de ver o post",
      solucao: "CTA estratégico em cada post alinhado ao objetivo do perfil",
    },
    {
      problema: "Falta de prova social estruturada",
      implicacao: "Novos visitantes não confiam no seu trabalho",
      solucao: "Depoimentos, resultados e cases organizados em destaque fixo",
    },
    {
      problema: "Conteúdo sem planejamento estratégico",
      implicacao: "Posta no achismo, sem consistência, resultados imprevisíveis",
      solucao: "Calendário editorial com mix de conteúdo: educar, entreter, vender",
    },
  ],
  "Estética": [
    {
      problema: "Portfólio de resultados desorganizado",
      implicacao: "Potenciais clientes não veem a qualidade do seu trabalho",
      solucao: "Destaque 'Antes e Depois' organizado por categoria de procedimento",
    },
    {
      problema: "Falta de conteúdo educativo sobre procedimentos",
      implicacao: "Seguidores não entendem o valor dos seus serviços",
      solucao: "Série de posts explicando cada procedimento com benefícios e cuidados",
    },
  ],
  "Direito": [
    {
      problema: "Linguagem muito técnica afasta clientes",
      implicacao: "Potenciais clientes não entendem como você pode ajudá-los",
      solucao: "Conteúdo que traduz termos jurídicos em benefícios reais",
    },
    {
      problema: "Falta de cases e resultados",
      implicacao: "Sem prova social, a confiança demora mais para se estabelecer",
      solucao: "Cases anonimizados organizados por área de atuação",
    },
  ],
  "Marketing": [
    {
      problema: "Conteúdo muito genérico sobre marketing",
      implicacao: "Não diferencia seu trabalho dos concorrentes",
      solucao: "Cases reais com dados e resultados específicos",
    },
    {
      problema: "Feed parece mais entretenimento que autoridade",
      implicacao: "Clientes sérios não te levam a sério",
      solucao: "Equilíbrio entre conteúdo educativo, cases e bastidores",
    },
  ],
  "Música": [
    {
      problema: "Falta de identidade visual como artista",
      implicacao: "O público não reconhece sua marca pessoal nas redes",
      solucao: "Paleta de cores, fontes e estética que reflitam seu estilo musical",
    },
    {
      problema: "Conteúdo sem mostrar o processo criativo",
      implicacao: "Fãs querem bastidores, não só o produto final",
      solucao: "Série de conteúdos mostrando making of, ensaios e bastidores",
    },
  ],
  "Moda": [
    {
      problema: "Feed sem curadoria visual",
      implicacao: "Parece amador e não atrai parcerias",
      solucao: "Grid planejado com harmonia de cores e estilos",
    },
    {
      problema: "Falta de conteúdo de look do dia / estilo",
      implicacao: "Seguidores não se inspiram para comprar ou seguir",
      solucao: "Série de looks organizados por ocasião e estação",
    },
  ],
  "Viagem": [
    {
      problema: "Conteúdo só de destino, sem dicas úteis",
      implicacao: "Seguidores curtem mas não salvam nem compartilham",
      solucao: "Roteiros completos, dicas de hospedagem e orçamento",
    },
    {
      problema: "Falta de engajamento com a audiência",
      implicacao: "Baixo alcance orgânico e pouca interação",
      solucao: "Enquetes e caixas de perguntas sobre próximos destinos",
    },
  ],
  "Gastronomia": [
    {
      problema: "Fotos de comida sem qualidade profissional",
      implicacao: "Não transmite o sabor e a experiência",
      solucao: "Dicas de fotografia gastronômica com luz natural e composição",
    },
    {
      problema: "Falta de receitas escritas nos posts",
      implicacao: "Seguidores consomem mas não salvam o conteúdo",
      solucao: "Carrosséis com passo a passo das receitas",
    },
  ],
  "Saúde": [
    {
      problema: "Informação sem fonte ou embasamento",
      implicacao: "Perde credibilidade profissional",
      solucao: "Posts com referências científicas e dados confiáveis",
    },
    {
      problema: "Linguagem muito técnica",
      implicacao: "Público leigo não entende e não se engaja",
      solucao: "Traduzir termos técnicos em benefícios práticos",
    },
  ],
  "Educação": [
    {
      problema: "Conteúdo muito denso sem didática",
      implicacao: "Alunos perdem interesse rápido",
      solucao: "Micro-conteúdo com exemplos práticos e visuais",
    },
    {
      problema: "Falta de autoridade no nicho",
      implicacao: "Potenciais alunos não confiam no seu método",
      solucao: "Cases de alunos, certificações e parcerias acadêmicas",
    },
  ],
  "Tecnologia": [
    {
      problema: "Conteúdo genérico sobre tech",
      implicacao: "Não se diferencia dos milhares de perfis de tecnologia",
      solucao: "Tutoriais práticos, reviews honestos e cases reais",
    },
    {
      problema: "Falta de demonstração prática",
      implicacao: "Seguidores não veem a aplicação real do conhecimento",
      solucao: "Screenshots, gravações de tela e projetos ao vivo",
    },
  ],
  "Fotografia": [
    {
      problema: "Portfólio desorganizado no feed",
      implicacao: "Clientes não conseguem avaliar seu estilo",
      solucao: "Grid temático por tipo de ensaio ou paleta de cor",
    },
    {
      problema: "Pouco conteúdo educativo sobre fotografia",
      implicacao: "Não atrai seguidores qualificados",
      solucao: "Dicas de composição, iluminação e edição nos posts",
    },
  ],
  "Imobiliário": [
    {
      problema: "Fotos de imóveis sem qualidade",
      implicacao: "Imóveis parecem menos valiosos do que são",
      solucao: "Fotografia profissional e vídeos com tour guiado",
    },
    {
      problema: "Falta de conteúdo sobre o mercado",
      implicacao: "Não constrói autoridade como corretor",
      solucao: "Análises de mercado, dicas para compradores e tendências",
    },
  ],
  "Política": [
    {
      problema: "Falta de propostas claras no perfil",
      implicacao: "Eleitores não entendem seu posicionamento",
      solucao: "Destaques organizados por eixos de proposta de governo",
    },
    {
      problema: "Baixa interação com a base",
      implicacao: "Alcance orgânico baixo e engajamento fraco",
      solucao: "Conteúdo de bastidores e enquetes para engajar a base",
    },
  ],
  "Fitness": [
    {
      problema: "Resultados sem contexto ou método",
      implicacao: "Parece milagroso e perde credibilidade",
      solucao: "Mostrar o processo, não só o resultado final",
    },
    {
      problema: "Falta de conteúdo educativo sobre treinos",
      implicacao: "Seguidores não veem valor além das fotos",
      solucao: "Dicas de treino, nutrição e mentalidade organizadas em série",
    },
  ],
};

interface Problema {
  problema: string;
  implicacao: string;
  solucao: string;
}

function getProblemas(nicho: string): Problema[] {
  const lowerNicho = nicho.toLowerCase();
  for (const [key, problemas] of Object.entries(problemasPorNicho)) {
    if (lowerNicho.includes(key.toLowerCase())) {
      return [...problemas, ...problemasPorNicho.default];
    }
  }
  return problemasPorNicho.default;
}

function shuffleAndTake<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function gerarDiagnostico(
  instagram: string,
  tipo: string,
  nicho: string,
  objetivo: string,
  isPremium: boolean
): string {
  const tipoLabel = tipoLabels[tipo] || tipo;
  const problemas = getProblemas(nicho);
  const selecionados = shuffleAndTake(problemas, isPremium ? 6 : 3);

  if (!isPremium) {
    return `**Diagnóstico Rápido — @${instagram}**

Olhamos rapidamente seu perfil como ${tipoLabel} no nicho de ${nicho} com objetivo de ${objetivo}. Aqui está o que saltou aos olhos:

${selecionados.map((p, i) => `
**${i + 1}. ${p.problema}**
* **Problema:** ${p.problema}
* **Implicação para o Objetivo:** ${p.implicacao}
`).join("\n")}

**📊 Total de problemas identificados: ${problemas.length}**
Mostramos apenas 3 acima. No diagnóstico completo, você recebe análise detalhada de todos os pontos mais:

✅ Bio estratégica personalizada pronta para copiar
✅ Estrutura de destaques em funil de vendas
✅ Calendário de conteúdo 7 dias para seu nicho
✅ Roteiros de Reels prontos para gravar
✅ Scripts de conversão para o Direct

👉 Desbloqueie o diagnóstico completo e transforme seu Instagram em uma máquina de resultados.`;
  }

  return `**Diagnóstico Estratégico Completo — @${instagram}**

**Perfil Analisado:**
- **Instagram:** @${instagram}
- **Tipo:** ${tipoLabel}
- **Nicho:** ${nicho}
- **Objetivo Principal:** ${objetivo}

---

${selecionados.map((p, i) => `
**${i + 1}. ${p.problema}**

* **Problema Identificado:** ${p.problema}
  Seu perfil atual mostra sinais claros de que esse ponto precisa de atenção urgente para você atingir seu objetivo de ${objetivo}.

* **Impacto no seu Objetivo:** ${p.implicacao}
  Isso está diretamente impedindo você de ${objetivo}. Enquanto esse problema não for resolvido, seus resultados vão continuar abaixo do potencial.

* **Solução Recomendada:** ${p.solucao}
  Essa é a abordagem que recomendamos para perfis como o seu no nicho de ${nicho}.
`).join("\n")}

---

**📋 Resumo da Análise**

Foram analisados ${problemas.length} pontos críticos do seu perfil @${instagram}. Destes, ${selecionados.length} foram detalhados neste diagnóstico.

**🎯 Próximos Passos**

Com base no seu objetivo de ${objetivo}, recomendamos:

1. **Prioridade 1 — Bio e Posicionamento:** Sua bio precisa comunicar claramente quem você é, o que faz e por que seguir você — tudo em 3 segundos.
2. **Prioridade 2 — Organização Visual:** Um feed coerente transmite profissionalismo antes mesmo de lerem sua legenda.
3. **Prioridade 3 — Estratégia de Conteúdo:** Publique com propósito. Cada post deve mover o seguidor um passo mais perto da conversão.

**💡 Dica de Ouro**
O Instagram de ${nicho} de maior sucesso não é o que tem mais seguidores — é o que tem mais clareza. Seu perfil precisa responder em 5 segundos: "Quem é, o que faz e por que eu deveria me importar?"

Este diagnóstico foi gerado automaticamente pelo Instarrumado para @${instagram}.`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em 1 minuto." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawInput = await req.json();
    const validation = inputSchema.safeParse(rawInput);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos", details: validation.error.issues.map(i => i.message) }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { instagram, tipo, nicho, objetivo, isPremium } = validation.data;
    const diagnostico = gerarDiagnostico(instagram, tipo, nicho, objetivo, isPremium);

    return new Response(JSON.stringify({ diagnostico }), {
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

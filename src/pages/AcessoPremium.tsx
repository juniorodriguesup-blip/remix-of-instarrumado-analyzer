import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Instagram, Sparkles, ShieldCheck, Loader2, CheckCircle, Star, LayoutGrid, Calendar, FileText, MessageSquare, TrendingUp, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoFormPremium from "@/components/diagnostico/DiagnosticoFormPremium";
import { Button } from "@/components/ui/button";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const AcessoPremium = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscriptionStatus, loading: authLoading, refreshSubscription } = useAuth();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Check if user has valid token or premium subscription
  const token = searchParams.get("token");
  const hasValidToken = token === "premium2026";
  const isPremiumUser = subscriptionStatus === "premium";
  const hasAccess = hasValidToken || isPremiumUser;

  // Manual de Arrumação - Entregas Premium
  const entregas = [
    {
      icon: Star,
      title: "Bio Pronta",
      description: "Modelo de bio magnética que converte visitantes em seguidores",
      content: `🎯 [Sua especialidade em 1 linha]
💡 Ajudo [público] a [transformação]
📍 [Cidade] | 📲 Link abaixo
👇 [CTA forte]

📌 EXEMPLOS PRONTOS:

🔹 Para Profissionais Liberais:
"Advogado | Direito Trabalhista
💼 Ajudo trabalhadores a receberem o que merecem
📍 São Paulo | 📲 Consulta online
👇 Agende sua análise gratuita"

🔹 Para Empreendedores:
"🚀 Mentoria para Negócios Digitais
💰 +500 alunos faturando 6 dígitos
📚 Curso disponível no link
👇 Comece sua transformação"

🔹 Para Criadores de Conteúdo:
"✨ Dicas de [nicho] todos os dias
🎯 Te ajudo a [resultado]
🔔 Ative as notificações
👇 E-book gratuito no link"`,
    },
    {
      icon: LayoutGrid,
      title: "Funil de Destaques",
      description: "Estrutura estratégica para guiar visitantes até a conversão",
      content: `📌 FUNIL DE DESTAQUES ESTRATÉGICO:

🔹 DESTAQUE 1 - SOBRE MIM
- Sua história em 5-7 stories
- Mostre credenciais e resultados
- Termine com CTA para próximo destaque

🔹 DESTAQUE 2 - DEPOIMENTOS
- Prints de resultados de clientes
- Vídeos curtos de feedback
- Números e transformações

🔹 DESTAQUE 3 - SERVIÇOS/PRODUTOS
- O que você oferece
- Benefícios claros
- Preços (opcional)

🔹 DESTAQUE 4 - FAQ
- Dúvidas mais comuns
- Objeções respondidas
- Formas de pagamento

🔹 DESTAQUE 5 - COMO COMPRAR
- Passo a passo simples
- Link direto
- Garantias

💡 DICA: Use capas padronizadas com sua identidade visual
🎨 Mantenha consistência nas cores e fontes`,
    },
    {
      icon: TrendingUp,
      title: "Estratégia Visual",
      description: "Guia completo para criar um feed profissional e harmonioso",
      content: `🎨 ESTRATÉGIA VISUAL COMPLETA:

📐 PADRÕES DE FEED:

1️⃣ PADRÃO XADREZ:
Alterne entre 2 tipos de post
Ex: Foto pessoal + Carrossel educativo

2️⃣ PADRÃO LINHAS:
Cada linha de 3 posts tem um tema/cor
Linha 1: Tons claros
Linha 2: Tons escuros
Linha 3: Tons claros

3️⃣ PADRÃO COLUNAS:
Coluna 1: Conteúdo educativo
Coluna 2: Pessoal/bastidores
Coluna 3: Vendas/CTA

🎨 PALETA DE CORES:
- 1 cor principal (sua marca)
- 1 cor secundária (contraste)
- 1 cor neutra (branco/preto/cinza)

📸 CHECKLIST DE QUALIDADE:
✅ Mesma fonte em todos os posts
✅ Filtros consistentes
✅ Planeje 9 posts por vez
✅ Fotos em boa iluminação
✅ Elementos gráficos padronizados`,
    },
    {
      icon: Calendar,
      title: "Conteúdo para 7 Dias",
      description: "Calendário estratégico completo para a semana toda",
      content: `📅 CALENDÁRIO DE CONTEÚDO SEMANAL:

🔹 SEGUNDA-FEIRA - EDUCATIVO
Formato: Carrossel
Tema: "5 erros que você comete em [tema]"
Objetivo: Mostrar autoridade

🔹 TERÇA-FEIRA - BASTIDORES
Formato: Stories + Reels
Tema: Seu dia a dia de trabalho
Objetivo: Conexão pessoal

🔹 QUARTA-FEIRA - DICA VIRAL
Formato: Reels (30-60s)
Tema: "Você está fazendo [erro] e nem sabe"
Objetivo: Alcance orgânico

🔹 QUINTA-FEIRA - PROVA SOCIAL
Formato: Post único ou carrossel
Tema: Resultado de cliente/depoimento
Objetivo: Gerar desejo

🔹 SEXTA-FEIRA - ENTRETENIMENTO
Formato: Reels descontraído
Tema: Trend adaptada ao seu nicho
Objetivo: Engajamento

🔹 SÁBADO - INTERAÇÃO
Formato: Stories com enquetes
Tema: Perguntas ao público
Objetivo: Entender audiência

🔹 DOMINGO - REFLEXÃO
Formato: Post com texto
Tema: Insight pessoal/profissional
Objetivo: Conexão emocional

⏰ MELHORES HORÁRIOS: 7h, 12h, 18h, 21h`,
    },
    {
      icon: FileText,
      title: "Roteiros de Reels",
      description: "Scripts prontos para criar Reels que viralizam",
      content: `🎬 ROTEIROS DE REELS VIRAIS:

📌 ROTEIRO 1 - GANCHO FORTE
"Você está fazendo [erro comum] e nem sabe..."
[Mostrar o problema em 3 segundos]
[Explicar por que é errado]
[Dar a solução simples]
[CTA: Salva esse Reels pra não esquecer]

📌 ROTEIRO 2 - ANTES/DEPOIS
"Antes eu [situação ruim]..."
"Passava por [dificuldade]..."
"Até que eu descobri [solução]..."
"Agora eu [resultado incrível]"
[CTA: Comenta SIM se você quer isso também]

📌 ROTEIRO 3 - LISTA
"3 coisas que [seu público] precisa saber:"
1. [Dica bombástica 1]
2. [Dica bombástica 2]
3. [Dica bombástica 3]
[CTA: Qual dica você mais precisava?]

📌 ROTEIRO 4 - POLÊMICA
"Vou falar uma verdade que ninguém quer ouvir..."
[Opinião forte sobre o nicho]
[Argumentos]
[CTA: Concorda ou discorda?]

📌 ROTEIRO 5 - TUTORIAL RÁPIDO
"Como fazer [resultado] em [tempo]:"
Passo 1: [Ação]
Passo 2: [Ação]
Passo 3: [Ação]
[CTA: Marca alguém que precisa ver isso]`,
    },
    {
      icon: MessageSquare,
      title: "Conversão em Vendas",
      description: "Scripts de Direct para transformar seguidores em clientes",
      content: `💬 SCRIPTS DE CONVERSÃO EM VENDAS:

📌 SCRIPT 1 - PRIMEIRO CONTATO
"Oi [nome]! 👋
Vi que você [ação que a pessoa fez].
Posso te ajudar com algo específico sobre [tema]?"

📌 SCRIPT 2 - QUALIFICAÇÃO
"Que legal seu interesse! 😊
Me conta: qual é seu maior desafio com [tema] hoje?
Quero entender melhor pra ver se consigo te ajudar."

📌 SCRIPT 3 - APRESENTAÇÃO
"Entendi perfeitamente! 🎯
Tenho um [serviço/produto] que ajuda exatamente com isso.
[Benefício 1]
[Benefício 2]
[Benefício 3]
Posso te explicar como funciona?"

📌 SCRIPT 4 - FECHAMENTO
"Perfeito! 🚀
Para começar, o investimento é [valor].
Você pode parcelar em até [X]x.
Posso te enviar o link de pagamento agora?"

📌 SCRIPT 5 - FOLLOW-UP (24h depois)
"Oi [nome]! 👋
Passando para saber se conseguiu ver minha mensagem.
Ainda está interessado(a) em [resultado]?
Posso esclarecer alguma dúvida?"

📌 SCRIPT 6 - OBJEÇÃO DE PREÇO
"Entendo sua preocupação com o investimento.
Pensa comigo: quanto você está perdendo por mês sem [solução]?
Esse valor se paga em [tempo] com os resultados que você vai ter."`,
    }
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  useEffect(() => {
    // If user has valid token, refresh subscription status in background
    if (hasValidToken && user) {
      refreshSubscription();
    }
  }, [hasValidToken, user, refreshSubscription]);

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    // Redirect to home if no valid access
    if (!authLoading && user && !hasAccess) {
      toast.error("Acesso exclusivo para usuários Premium");
      navigate("/");
    }
  }, [user, hasAccess, authLoading, navigate]);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-instagram-pink mx-auto" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  // Don't render if no access (will redirect)
  if (!user || !hasAccess) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-instagram-pink/20 text-instagram-pink flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Acesso VIP
            </span>
          </div>
        </div>
      </header>

      {step === "form" && (
        <>
          {/* Hero */}
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-instagram-pink/10 border border-instagram-pink/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-instagram-pink" />
                <span className="text-sm font-medium text-instagram-pink">Acesso Premium Liberado</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Parabéns pela sua compra! <span className="gradient-text">Seu diagnóstico premium está aqui.</span>
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Preencha os campos abaixo para receber seu diagnóstico completo e personalizado com IA.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Pagamento confirmado • Diagnóstico Premium ilimitado</span>
              </div>
            </div>
          </section>

          {/* Form */}
          <DiagnosticoFormPremium onSubmit={handleFormSubmit} />

          {/* Manual de Arrumação */}
          <section className="py-12 md:py-16 border-t border-border/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Manual de Arrumação Completo
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Sua nova presença digital começa aqui. Copie e aplique no seu perfil.
                </p>
              </div>

              <div className="grid gap-6 md:gap-8">
                {entregas.map((entrega, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 md:p-8"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-instagram-pink/10">
                        <entrega.icon className="h-6 w-6 text-instagram-pink" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {entrega.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {entrega.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Desbloqueado
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-xl p-4 md:p-6 border border-border/50">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {entrega.content}
                      </pre>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(entrega.content, entrega.title)}
                        className="flex-1 md:flex-none"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedItem === entrega.title ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {step === "result" && formData && (
        <>
          {/* Result */}
          <DiagnosticoResult isPremium={true} formData={formData} />
          
          {/* CTA to generate another or see materials */}
          <section className="py-12 md:py-16 border-t border-border/30">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Quer gerar outro <span className="gradient-text">diagnóstico premium</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Como usuário VIP, você pode gerar diagnósticos ilimitados.
              </p>
              <button
                onClick={() => {
                  setStep("form");
                  setFormData(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Gerar Novo Diagnóstico
              </button>
            </div>
          </section>

          {/* Manual de Arrumação após resultado */}
          <section className="py-12 md:py-16 border-t border-border/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Manual de Arrumação Completo
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Sua nova presença digital começa aqui. Copie e aplique no seu perfil.
                </p>
              </div>

              <div className="grid gap-6 md:gap-8">
                {entregas.map((entrega, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 md:p-8"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-instagram-pink/10">
                        <entrega.icon className="h-6 w-6 text-instagram-pink" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {entrega.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {entrega.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Desbloqueado
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-xl p-4 md:p-6 border border-border/50">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {entrega.content}
                      </pre>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(entrega.content, entrega.title)}
                        className="flex-1 md:flex-none"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedItem === entrega.title ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Instarrumado. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default AcessoPremium;

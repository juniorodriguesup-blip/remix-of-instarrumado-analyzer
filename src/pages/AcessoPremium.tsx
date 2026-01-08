import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Instagram, CheckCircle, Copy, Sparkles, Calendar, MessageSquare, LayoutGrid, FileText, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Token secreto para acesso direto - só quem pagar recebe este link
const SECRET_TOKEN = "premium2026";

const AcessoPremium = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token === SECRET_TOKEN) {
      setIsAuthorized(true);
    } else {
      // Token inválido - redireciona para home
      navigate("/");
    }
  }, [searchParams, navigate]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const entregas = [
    {
      icon: Star,
      title: "Bio Otimizada Pronta",
      description: "Modelo de bio magnética que converte visitantes em seguidores",
      content: `🎯 [Sua especialidade em 1 linha]
💡 Ajudo [público] a [transformação]
📍 [Cidade] | 📲 Link abaixo
👇 [CTA forte]`,
    },
    {
      icon: LayoutGrid,
      title: "Estrutura de Destaques",
      description: "Organização estratégica dos seus destaques para guiar o visitante",
      content: `📌 DESTAQUES ESSENCIAIS:

1. SOBRE MIM - Sua história e credenciais
2. DEPOIMENTOS - Provas sociais
3. SERVIÇOS - O que você oferece
4. FAQ - Dúvidas frequentes
5. CONTATO - Como te achar

💡 Dica: Use capas padronizadas com sua identidade visual`,
    },
    {
      icon: Calendar,
      title: "Calendário de Conteúdo Semanal",
      description: "Planejamento estratégico de posts para a semana toda",
      content: `📅 CALENDÁRIO SEMANAL:

🔹 SEGUNDA - Conteúdo educativo (carrossel)
🔹 TERÇA - Bastidores / dia a dia (stories + reels)
🔹 QUARTA - Dica rápida (reels viral)
🔹 QUINTA - Prova social / resultado (post)
🔹 SEXTA - Conteúdo leve / entretenimento (reels)
🔹 SÁBADO - Interação / enquetes (stories)
🔹 DOMINGO - Reflexão / conexão pessoal (post)

⏰ Melhores horários: 7h, 12h, 18h, 21h`,
    },
    {
      icon: FileText,
      title: "Roteiros de Reels Virais",
      description: "Scripts prontos para criar Reels que engajam",
      content: `🎬 ROTEIRO 1 - GANCHO FORTE:
"Você está fazendo [erro comum] e nem sabe..."
[Mostrar o problema]
[Dar a solução]
[CTA: Salva esse Reels]

🎬 ROTEIRO 2 - ANTES/DEPOIS:
"Antes eu [situação ruim]..."
"Até que eu descobri [solução]..."
"Agora eu [resultado]"
[CTA: Comenta SIM se você quer isso]

🎬 ROTEIRO 3 - LISTA:
"3 coisas que [seu público] precisa saber:"
1. [Dica 1]
2. [Dica 2]
3. [Dica 3]
[CTA: Qual dica você mais precisava?]`,
    },
    {
      icon: MessageSquare,
      title: "Scripts para Direct",
      description: "Mensagens prontas para converter seguidores em clientes",
      content: `💬 SCRIPT 1 - PRIMEIRO CONTATO:
"Oi [nome]! Vi que você [ação]. Posso te ajudar com algo específico sobre [tema]?"

💬 SCRIPT 2 - QUALIFICAÇÃO:
"Que legal seu interesse! Me conta: qual é seu maior desafio com [tema] hoje?"

💬 SCRIPT 3 - APRESENTAÇÃO:
"Entendi! Tenho um [serviço/produto] que ajuda exatamente com isso. Posso te explicar como funciona?"

💬 SCRIPT 4 - FECHAMENTO:
"Perfeito! Para começar, o investimento é [valor]. Posso te enviar o link de pagamento?"

💬 SCRIPT 5 - FOLLOW-UP:
"Oi [nome]! Passando para saber se conseguiu ver minha mensagem. Ainda posso te ajudar?"`,
    },
    {
      icon: LayoutGrid,
      title: "Organização Visual do Feed",
      description: "Guia para criar um feed harmonioso e profissional",
      content: `🎨 ORGANIZAÇÃO DO FEED:

📐 PADRÃO 1 - XADREZ:
Alterne entre 2 tipos de post (ex: foto + carrossel)

📐 PADRÃO 2 - LINHAS:
Cada linha de 3 posts tem um tema/cor

📐 PADRÃO 3 - COLUNAS:
Coluna 1: Educativo | Coluna 2: Pessoal | Coluna 3: Vendas

🎨 PALETA RECOMENDADA:
- 1 cor principal (sua marca)
- 1 cor secundária (contraste)
- 1 cor neutra (branco/preto)

📸 DICAS:
- Use sempre a mesma fonte
- Mantenha filtros consistentes
- Planeje 9 posts por vez`,
    }
  ];

  if (!isAuthorized) {
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

      {/* Hero */}
      <section className="py-12 md:py-16 border-b border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-instagram-pink/10 border border-instagram-pink/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-instagram-pink" />
            <span className="text-sm font-medium text-instagram-pink">Acesso Exclusivo</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Parabéns pela sua compra! <span className="gradient-text">Seu material está aqui.</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Abaixo estão todas as entregas do seu plano Premium. 
            Copie, salve e aplique no seu perfil.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Pagamento confirmado • Acesso vitalício</span>
          </div>
        </div>
      </section>

      {/* Entregas */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
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

      {/* CTA Diagnóstico */}
      <section className="py-12 md:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Quer um diagnóstico <span className="gradient-text">personalizado com IA</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Faça login na plataforma para acessar o diagnóstico completo do seu Instagram.
          </p>
          <Button
            size="lg"
            className="btn-gradient"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Acessar Diagnóstico Premium
          </Button>
        </div>
      </section>

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

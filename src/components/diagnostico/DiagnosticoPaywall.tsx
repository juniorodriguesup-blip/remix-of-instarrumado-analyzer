import { Lock, Sparkles, ArrowRight, Star, Calendar, MessageSquare, LayoutGrid, Video, FileText } from "lucide-react";

const paywallItems = [
  {
    icon: Star,
    title: "Bio Estratégica Personalizada",
    preview: "Uma bio pronta para copiar e colar que comunica seu valor em 3 segundos",
    value: "Atrai o cliente certo logo de cara",
  },
  {
    icon: LayoutGrid,
    title: "Estrutura de Destaques",
    preview: "Funil de vendas nos seus destaques: do primeiro contato ao fechamento",
    value: "Guia o visitante até a conversão",
  },
  {
    icon: FileText,
    title: "Estratégia Visual do Feed",
    preview: "Paleta de cores, padrão visual e organização que refletem sua marca",
    value: "Feed profissional e coerente",
  },
  {
    icon: Calendar,
    title: "Calendário de Conteúdo 7 Dias",
    preview: "Plano dia a dia com temas, formatos e horários para o seu nicho",
    value: "Nunca mais fique sem ideia do que postar",
  },
  {
    icon: Video,
    title: "Roteiros de Reels Prontos",
    preview: "3 roteiros completos com gancho, desenvolvimento e CTA",
    value: "Reels que vendem sem aparecer",
  },
  {
    icon: MessageSquare,
    title: "Scripts de Conversão no Direct",
    preview: "Mensagens prontas: abordagem, qualificação e fechamento",
    value: "Transforma seguidor em cliente",
  },
];

const DiagnosticoPaywall = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/[0.03] to-instagram-pink/[0.03]" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-instagram-pink" />
            <span className="text-sm font-medium gradient-text">Desbloqueie o diagnóstico completo</span>
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Manual de Arrumação Completo
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tudo que você precisa para transformar seu Instagram em uma máquina de resultados.
            Personalizado pela IA para o SEU perfil e objetivo.
          </p>
        </div>

        <div className="space-y-4">
          {paywallItems.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-border/50 group hover:border-instagram-pink/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/90 backdrop-blur-sm" />

              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-instagram-purple/20 to-instagram-pink/20 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-instagram-pink" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">
                        {item.title}
                      </h3>
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground/80 mb-2">
                      {item.preview}
                    </p>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-instagram-pink" />
                      <span className="text-xs font-medium text-instagram-pink">{item.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-block glass-card rounded-2xl p-6 max-w-md">
            <p className="text-lg font-bold text-foreground mb-2">
              Tudo isso por menos de R$ 2/dia
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Diagnóstico completo, bio pronta, calendário, roteiros e scripts — tudo personalizado para você.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>🔒 Pagamento seguro</span>
              <span>⚡ Acesso imediato</span>
              <span>↩️ Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoPaywall;

import { Brain, Palette, PenTool, MessageCircle, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Diagnóstico Profundo com IA",
    description: "Nossa inteligência artificial analisa seu perfil como um estrategista faria — bio, feed, destaques, posicionamento e estética.",
    color: "from-violet-500 to-purple-600",
    highlight: "Análise completa em segundos",
  },
  {
    icon: Palette,
    title: "Identidade Visual Coesa",
    description: "Guia passo a passo para criar um feed harmonioso e profissional. Cores, fontes e padrão visual que contam sua história.",
    color: "from-pink-500 to-rose-600",
    highlight: "Design sem complicação",
  },
  {
    icon: PenTool,
    title: "Conteúdo Estratégico",
    description: "Legendas, roteiros de Reels e ideias de posts que respeitam seu estilo e falam diretamente com seu público ideal.",
    color: "from-orange-500 to-amber-600",
    highlight: "Conteúdo que vende",
  },
  {
    icon: MessageCircle,
    title: "Scripts de Conversão",
    description: "Mensagens prontas para o Direct, estruturadas em funil: primeiro contato, qualificação, apresentação e fechamento.",
    color: "from-emerald-500 to-teal-600",
    highlight: "Mais clientes no direct",
  },
  {
    icon: BarChart3,
    title: "Calendário Personalizado",
    description: "Plano de conteúdo de 7 dias ajustado ao seu nicho. Saiba exatamente o que postar em cada dia da semana.",
    color: "from-blue-500 to-indigo-600",
    highlight: "Nunca mais sem ideia",
  },
  {
    icon: ShieldCheck,
    title: "Análise de Autoridade",
    description: "Avaliamos se seu perfil transmite confiança e credibilidade. Um vision board profissional do que você precisa ajustar.",
    color: "from-purple-500 to-pink-600",
    highlight: "Perfil que vende",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-pink/[0.03] to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-instagram-purple/10 border border-instagram-purple/20 rounded-full px-4 py-1.5 mb-6">
              <Brain className="h-4 w-4 text-instagram-purple" />
              <span className="text-sm font-medium text-instagram-purple">Tudo que você precisa</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              O Instarrumado analisa, organiza e{" "}
              <span className="gradient-text">entrega pronto</span>.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enquanto você se preocupa com seu negócio, a IA organiza seu Instagram para ele vender por você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative glass-card rounded-2xl p-6 hover:border-instagram-pink/30 transition-all duration-500 hover:translate-y-[-4px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-instagram-pink/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <span className="inline-block text-xs font-semibold text-instagram-pink bg-instagram-pink/10 rounded-full px-3 py-1 mb-3">
                    {feature.highlight}
                  </span>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-background/50 border border-border/50 rounded-full px-5 py-2.5">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Diagnóstico gratuito disponível — sem compromisso</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

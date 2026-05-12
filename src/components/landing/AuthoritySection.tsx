import { Store, Eye, TrendingUp, Quote } from "lucide-react";

const AuthoritySection = () => {
  const points = [
    {
      icon: Store,
      title: "Seu Instagram é sua vitrine",
      description: "Antes de comprar, as pessoas olham seu perfil. Antes de confiar, elas sentem sua presença. Um perfil desorganizado afasta clientes antes mesmo da primeira conversa.",
    },
    {
      icon: Eye,
      title: "Aparência comunica valor",
      description: "Você pode ser o melhor profissional do mundo, mas se seu Instagram parece amador, as pessoas assumem que seu trabalho também é. Percepção é realidade.",
    },
    {
      icon: TrendingUp,
      title: "Organização vende",
      description: "Perfis organizados têm mais engajamento, mais autoridade e convertem mais. Não é sobre ter muitos seguidores — é sobre ter o perfil certo para as pessoas certas.",
    },
  ];

  const testimonials = [
    {
      text: "Eu postava todo dia e não via resultado. O diagnóstico mostrou que meu problema não era conteúdo, era organização. Mudei o feed e em 2 semanas dobrei o engajamento.",
      author: "Camila R.",
      role: "Consultora de imagem",
    },
    {
      text: "Achei que meu Instagram era bom até ver o diagnóstico. Coisas simples que eu nunca tinha percebido. A bio nova sozinha já trouxe 3 clientes em uma semana.",
      author: "Rafael M.",
      role: "Personal trainer",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/[0.03] to-background" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-instagram-purple/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-instagram-pink/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Authority Points */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-6">
              <Store className="h-4 w-4 text-instagram-pink" />
              <span className="text-sm font-medium gradient-text">Por que isso importa</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Seu Instagram é sua{" "}
              <span className="gradient-text">vitrine digital</span>.<br />
              Você deixaria sua loja bagunçada?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo dia, centenas de pessoas passam pelo seu perfil. Em segundos, decidem se você é confiável ou não.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {points.map((point, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover:border-instagram-pink/20 transition-all duration-500 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-instagram-pink/20 to-instagram-purple/20 flex items-center justify-center mb-5">
                  <point.icon className="h-6 w-6 text-instagram-pink" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>

          {/* Social Proof / Testimonials */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-10">
              <Quote className="h-5 w-5 text-instagram-pink" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Quem já usou, aprovou
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 relative"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-instagram-pink/10 to-transparent rounded-bl-[100px]" />
                  
                  <div className="relative z-10">
                    <p className="text-sm text-foreground/80 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="text-sm font-bold text-foreground">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;

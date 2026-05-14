import { Check, Sparkles, ArrowRight, X, HelpCircle, Clock, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const freePlan = {
    name: "Diagnóstico Gratuito",
    price: "R$ 0",
    period: "",
    cta: "Começar grátis",
    ctaLink: "/diagnostico",
    features: [
      { text: "Análise básica do perfil", included: true },
      { text: "3 problemas principais identificados", included: true },
      { text: "Prévia do diagnóstico estratégico", included: true },
      { text: "Bio otimizada pronta", included: false },
      { text: "Estrutura de destaques", included: false },
      { text: "Calendário de conteúdo 7 dias", included: false },
      { text: "Roteiros de Reels prontos", included: false },
      { text: "Scripts de conversão para Direct", included: false },
      { text: "Manual de Arrumação completo", included: false },
      { text: "Suporte prioritário", included: false },
    ],
  };

  const premiumPlan = {
    name: "Plano Premium",
    price: "R$ 57,90",
    period: "/mês",
    originalPrice: "R$ 197",
    cta: "Quero meu diagnóstico completo agora",
    ctaLink: "/auth",
    popular: true,
    features: [
      { text: "Diagnóstico completo com IA", included: true },
      { text: "Todos os problemas identificados", included: true },
      { text: "Relatório estratégico completo", included: true },
      { text: "Bio otimizada pronta para copiar", included: true },
      { text: "Estrutura de destaques personalizada", included: true },
      { text: "Calendário de conteúdo 7 dias", included: true },
      { text: "Roteiros de Reels prontos", included: true },
      { text: "Scripts de conversão para Direct", included: true },
      { text: "Manual de Arrumação completo", included: true },
      { text: "Suporte prioritário", included: true },
    ],
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" id="precos">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-pink/[0.02] to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Scarcity banner */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-full px-5 py-2.5 animate-pulse">
              <Clock className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                Oferta por tempo limitado! Pode encerrar a qualquer momento!
              </span>
            </div>
          </div>

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-instagram-pink" />
              <span className="text-sm font-medium gradient-text">Edição inaugural</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Comece <span className="gradient-text">grátis</span>. Depois decida.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Veja o diagnóstico básico sem custo. Se fizer sentido, desbloqueie o completo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card rounded-2xl p-8 relative hover:border-instagram-pink/20 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{freePlan.name}</h3>
                <p className="text-sm text-muted-foreground">Para quem quer começar</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">{freePlan.price}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {freePlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-muted-foreground/50" />
                      </div>
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="outline"
                className="w-full py-6 text-base border-muted-foreground/30 hover:border-instagram-pink/50 hover:text-instagram-pink"
              >
                <Link to={freePlan.ctaLink}>
                  {freePlan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="relative rounded-2xl">
              <div className="absolute -inset-1 bg-gradient-to-br from-instagram-purple via-instagram-pink to-instagram-orange rounded-2xl blur-sm opacity-75" />
              
              <div className="relative glass-card rounded-2xl p-8 bg-background/95 backdrop-blur-xl h-full flex flex-col">
                <div className="absolute -top-3 right-6">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-instagram-purple to-instagram-pink text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-lg shadow-instagram-pink/30">
                    <Sparkles className="w-3 h-3" />
                    EDICAO INAUGURAL
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold gradient-text mb-1">{premiumPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">Acesso completo — liberação imediata</p>
                </div>

                {/* Value anchoring - original price struck through */}
                <div className="mb-2">
                  <span className="text-lg text-muted-foreground line-through">{premiumPlan.originalPrice}</span>
                  <span className="text-xs text-muted-foreground ml-2">Valor real do diagnóstico</span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">{premiumPlan.price}</span>
                  <span className="text-muted-foreground ml-1">{premiumPlan.period}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Menos de R$ 2/dia — mais barato que um cafezinho premium
                  </p>
                  <p className="text-xs text-green-500 font-medium mt-1">
                    ⚡ Uma consultoria de Instagram custa de R$ 200 a R$ 500 por hora.
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {premiumPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-instagram-pink to-instagram-purple flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={feature.included ? "text-foreground font-medium" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="btn-gradient w-full py-6 text-base shadow-lg shadow-instagram-pink/25 hover:shadow-instagram-pink/40 transition-all"
                >
                  <Link to={premiumPlan.ctaLink}>
                    <Zap className="mr-2 h-5 w-5" />
                    {premiumPlan.cta}
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span>🔒 Pagamento 100% seguro</span>
                  <span>⚡ Acesso imediato</span>
                  <span>↩️ Garantia 7 dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust + urgency footer */}
          <div className="text-center mt-12 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2.5">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Essa oferta pode expirar a qualquer momento!</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-background/50 border border-border/50 rounded-full px-5 py-2.5">
              <Shield className="h-4 w-4" />
              <span>7 dias de garantia. Se não fizer sentido, devolvemos 100%.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

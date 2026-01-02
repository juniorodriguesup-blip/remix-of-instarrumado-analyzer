import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const freePlan = {
    name: "FREE",
    subtitle: "Diagnóstico Essencial",
    price: "Grátis",
    features: [
      "Visão geral do seu perfil",
      "Pontos de melhoria visíveis",
      "Clareza do que está te travando",
    ],
  };

  const premiumPlan = {
    name: "PREMIUM",
    subtitle: "Instagram Profissional & Magnético",
    price: "R$27,90",
    period: "/mês",
    features: [
      "Bio otimizada pronta",
      "Estrutura de destaques",
      "Calendário de conteúdo",
      "Roteiros de Reels",
      "Scripts para Direct",
      "Organização visual do feed",
    ],
  };

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Comece <span className="gradient-text">grátis</span>.
            </h2>
            <p className="text-xl text-muted-foreground">
              E só continue se fizer sentido.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="glass-card p-8 relative">
              <div className="mb-6">
                <span className="text-sm font-bold text-muted-foreground tracking-wider">{freePlan.name}</span>
                <h3 className="text-2xl font-bold mt-1">{freePlan.subtitle}</h3>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">{freePlan.price}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {freePlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full py-6 text-lg">
                Começar grátis
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="glass-card p-8 relative gradient-border overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10" />
              
              <div className="relative z-10">
                {/* Popular Badge */}
                <div className="absolute -top-0 -right-0">
                  <span className="gradient-bg text-primary-foreground font-bold px-4 py-1.5 rounded-full text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RECOMENDADO
                  </span>
                </div>
                
                <div className="mb-6">
                  <span className="text-sm font-bold gradient-text tracking-wider">{premiumPlan.name}</span>
                  <h3 className="text-2xl font-bold mt-1">{premiumPlan.subtitle}</h3>
                </div>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold gradient-text">{premiumPlan.price}</span>
                  <span className="text-muted-foreground">{premiumPlan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {premiumPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="btn-gradient w-full py-6 text-lg animate-pulse-glow">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Desbloquear versão Premium
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  💎 Menos que um café por semana para não parecer amador online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

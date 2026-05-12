import { Search, Cpu, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Informe seu perfil",
      description: "Digite seu @ do Instagram e responda 4 perguntas rápidas sobre seu nicho e objetivo. Leva menos de 1 minuto.",
      detail: "Sem criar conta, sem cartão",
    },
    {
      number: "02",
      icon: Cpu,
      title: "IA analisa tudo",
      description: "Nossa inteligência artificial examina seu perfil, bio, feed, destaques e posicionamento como um estrategista faria.",
      detail: "Análise em tempo real",
    },
    {
      number: "03",
      icon: FileText,
      title: "Diagnóstico completo",
      description: "Você recebe um relatório claro com problemas identificados, impacto no seu objetivo e um plano de ação personalizado.",
      detail: "Gratuito + upgrade premium",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-pink/[0.03] to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-instagram-pink/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-instagram-pink/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-6">
              <Cpu className="h-4 w-4 text-instagram-pink" />
              <span className="text-sm font-medium gradient-text">3 passos simples</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Não é sobre postar mais.{" "}
              <span className="gradient-text">É sobre postar certo.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Você está a 3 passos de descobrir exatamente o que está travando seu crescimento no Instagram.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-24 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-0.5 bg-gradient-to-r from-instagram-purple/40 via-instagram-pink/40 to-instagram-orange/40" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="glass-card rounded-2xl p-8 text-center relative z-10 h-full hover:border-instagram-pink/30 transition-all duration-500 hover:translate-y-[-4px]">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-instagram-pink/5 group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-instagram-pink" />
                    </div>

                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-instagram-purple to-instagram-pink text-white font-bold text-sm mb-4 shadow-lg">
                      {step.number}
                    </span>

                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <span className="inline-block text-xs font-medium text-instagram-pink bg-instagram-pink/10 rounded-full px-3 py-1">
                      {step.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="btn-gradient text-base px-8 py-6 h-auto group"
            >
              <Link to="/diagnostico">
                Quero meu diagnóstico gratuito
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

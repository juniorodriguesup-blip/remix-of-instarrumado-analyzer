import { Lightbulb, ArrowRight } from "lucide-react";

const DiagnosticoWarning = () => {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-r from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10 border border-instagram-pink/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-instagram-pink/20 to-instagram-purple/20 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-instagram-pink" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Você está vendo a prévia gratuita
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                O diagnóstico acima já mostra problemas reais do seu perfil. Mas isso é apenas a superfície.
                No <strong className="text-foreground">plano completo</strong>, você recebe:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Análise detalhada de todos os pontos",
                  "Bio personalizada pronta para copiar",
                  "Calendário de conteúdo 7 dias",
                  "Roteiros de Reels e Scripts de Vendas",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3 text-instagram-pink flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoWarning;

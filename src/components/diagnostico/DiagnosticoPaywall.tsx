import { Lock } from "lucide-react";

const paywallItems = [
  { title: "BIO PRONTA", description: "Desbloquear via Eduzz" },
  { title: "FUNIL DE DESTAQUES", description: "Desbloquear via Eduzz" },
  { title: "ESTRATÉGIA VISUAL", description: "Desbloquear via Eduzz" },
  { title: "CONTEÚDO PARA 7 DIAS", description: "Desbloquear via Eduzz" },
  { title: "ROTEIROS DE REELS", description: "Desbloquear via Eduzz" },
  { title: "CONVERSÃO EM VENDAS", description: "Acesso exclusivo" },
];

const DiagnosticoPaywall = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Manual de Arrumação Completo
          </h2>
          <p className="text-lg text-muted-foreground">
            Sua nova presença digital começa aqui
          </p>
        </div>

        {/* Locked items grid */}
        <div className="grid gap-4">
          {paywallItems.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm p-6 flex items-center justify-between group hover:border-instagram-pink/30 transition-colors"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-[2px]" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-instagram-pink/20 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-instagram-pink" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    🔒 {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Lock icon on right */}
              <div className="relative z-10">
                <Lock className="h-6 w-6 text-muted-foreground/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoPaywall;

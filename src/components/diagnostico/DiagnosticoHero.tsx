import { BarChart3, Sparkles } from "lucide-react";

const DiagnosticoHero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-instagram-purple/[0.05] via-background to-background" />
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-instagram-pink/10 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-1/4 w-56 h-56 bg-instagram-purple/10 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-6">
          <BarChart3 className="h-4 w-4 text-instagram-pink" />
          <span className="text-sm font-medium gradient-text">Diagnóstico Gratuito</span>
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Descubra o que seu Instagram{" "}
          <span className="gradient-text">está escondendo</span> de você
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Análise estratégica real do seu perfil. Identificamos exatamente onde você está perdendo seguidores, engajamento e vendas.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-instagram-pink" />
            <span>Análise por IA</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span>Sem compromisso</span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span>Grátis</span>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoHero;

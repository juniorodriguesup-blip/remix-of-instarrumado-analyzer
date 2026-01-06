import { Instagram } from "lucide-react";

const DiagnosticoHero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-instagram-purple/10 via-background to-background" />
      
      {/* Glow effects */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-instagram-pink/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-instagram-orange/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Instagram className="h-10 w-10 md:h-12 md:w-12 text-instagram-pink" />
          <span className="text-3xl md:text-4xl font-bold gradient-text">Instarrumado</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Seu Instagram.{" "}
          <span className="gradient-text">Arrumado.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Análise estratégica real para transformar seguidores em clientes em 2026.
        </p>
        <p className="text-base md:text-lg text-muted-foreground/80 font-medium">
          Sem elogios. Sem achismo. Sem passar a mão na cabeça.
        </p>
      </div>
    </section>
  );
};

export default DiagnosticoHero;

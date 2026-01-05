import { Search, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/instagram-video.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/10 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-up flex items-center justify-center gap-3" style={{ animationDelay: "0.1s" }}>
          <Instagram className="h-8 w-8 md:h-10 md:w-10 text-instagram-pink" />
          <span className="text-2xl md:text-3xl font-bold gradient-text">Instarrumado</span>
        </div>
        
        {/* Main Title */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Seu Instagram está bonito…{" "}
          <span className="gradient-text">ou só parece?</span>
        </h1>
        
        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          A maioria dos perfis não perde seguidores.{" "}
          <span className="text-foreground font-medium">Perde atenção, clareza e autoridade.</span>
        </p>
        
        <p 
          className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          O Instarrumado analisa seu perfil real, mostra exatamente onde você está travando,
          e organiza tudo para que seu Instagram pareça profissional, confiável e pronto para vender.
        </p>
        
        {/* CTA Button */}
        <div 
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Button 
            asChild
            size="lg" 
            className="btn-gradient text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 h-auto animate-pulse-glow group"
          >
            <Link to="/diagnostico">
              <Search className="mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              Analisar meu perfil agora
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            sem cartão • leva menos de 1 minuto
          </p>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { Search, Instagram, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const FinalCTASection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-instagram-purple/20 via-instagram-pink/10 to-background" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-instagram-pink/20 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Arrume seu Instagram.<br />
            <span className="gradient-text">O algoritmo vem depois.</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Você não precisa virar influencer.
          </p>
          <p className="text-xl md:text-2xl text-foreground font-medium mb-10">
            Só precisa parecer profissional.
          </p>
          
          {/* CTA */}
          <div className="mb-6">
            <p className="text-muted-foreground mb-6">
              👉 Comece com o diagnóstico gratuito.
            </p>
            
            <Button 
              asChild
              size="lg" 
              className="btn-gradient text-lg md:text-xl px-10 md:px-14 py-6 md:py-8 h-auto animate-pulse-glow group"
            >
              <Link to="/diagnostico">
                <Search className="mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                Analisar meu perfil agora
              </Link>
            </Button>
          </div>
          
          {/* Footer with Contact Info */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/instarrumado.oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-instagram-pink transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">@instarrumado.oficial</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/5511999484196"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">+55 11 99948-4196</span>
              </a>

              {/* Email */}
              <a
                href="mailto:suporte@instarrumado.com.br"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">suporte@instarrumado.com.br</span>
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 Instarrumado. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

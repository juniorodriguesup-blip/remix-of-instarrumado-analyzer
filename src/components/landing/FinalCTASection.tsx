import { Search, Instagram, Phone, Mail, Sparkles, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/10 to-instagram-pink/10" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-instagram-purple/15 via-instagram-pink/10 to-instagram-orange/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="h-4 w-4 text-instagram-pink" />
            <span className="text-sm font-medium gradient-text">Último passo</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Arrume seu Instagram.{" "}
            <span className="gradient-text">O algoritmo vem depois.</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Você não precisa virar influencer. Só precisa parecer profissional.
          </p>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-10 max-w-2xl mx-auto">
            Em menos de 1 minuto, você descobre exatamente o que está travando seu crescimento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="btn-gradient text-base px-10 py-6 h-auto group shadow-lg shadow-instagram-pink/25 hover:shadow-instagram-pink/40 transition-all"
            >
              <Link to="/diagnostico">
                <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Analisar meu perfil agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 h-auto border-muted-foreground/30 hover:border-instagram-pink/50"
            >
              <Link to="/auth">
                Criar conta gratuita
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-instagram-pink" />
              <span>Leva menos de 1 minuto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-instagram-purple" />
              <span>Diagnóstico por IA</span>
            </div>
          </div>

          <div className="border-t border-border/30 pt-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Instagram className="h-5 w-5 text-instagram-pink" />
              <span className="font-bold gradient-text text-lg">Instarrumado</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-4">
              <a
                href="https://www.instagram.com/instarrumado.oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-instagram-pink transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="text-sm">@instarrumado.oficial</span>
              </a>

              <a
                href="https://wa.me/5511999484196"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">+55 11 99948-4196</span>
              </a>

              <a
                href="mailto:suporte@instarrumado.com.br"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">suporte@instarrumado.com.br</span>
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              © 2026 Instarrumado. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

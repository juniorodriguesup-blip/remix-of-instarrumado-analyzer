import { Unlock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiagnosticoCTA = () => {
  const handlePayment = () => {
    window.open("https://pay.kiwify.com.br/6n0HjlG", "_blank");
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-instagram-purple/20 via-background to-background" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-instagram-pink/30 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center">
        {/* Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Sua cura estratégica está pronta.
        </h2>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
          As seções acima contêm o plano prático para arrumar seu perfil HOJE.
        </p>
        <p className="text-foreground font-medium mb-10">
          Sem teoria. Sem motivação vazia. Sem achismo.
        </p>

        {/* CTA Button */}
        <Button
          onClick={handlePayment}
          className="h-12 px-6 text-base md:h-16 md:px-12 md:text-xl font-bold btn-gradient animate-pulse-glow w-full max-w-xs md:max-w-none md:w-auto"
        >
          <Unlock className="mr-2 h-5 w-5 md:mr-3 md:h-6 md:w-6" />
          DESBLOQUEAR TUDO — R$ 27,90
        </Button>

        {/* Microcopy */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Liberação imediata</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Acesso completo ao diagnóstico real</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            © 2026 Instarrumado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoCTA;

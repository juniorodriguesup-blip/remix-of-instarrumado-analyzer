import { Sparkles, Shield, Zap, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiagnosticoCTA = () => {
  const handlePayment = () => {
    window.location.href = "https://pay.kiwify.com.br/6n0HjlG";
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/[0.04] to-instagram-pink/[0.04]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center">
        {/* Scarcity banner */}
        <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-full px-5 py-2.5 mb-6">
          <Clock className="h-4 w-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">
            Oferta por tempo limitado! Pode encerrar a qualquer momento!
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Seu diagnóstico completo está pronto
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto">
          Você viu apenas uma prévia. O relatório completo com bio pronta, calendário, roteiros e scripts está esperando por você.
        </p>

        {/* Value anchoring */}
        <div className="mb-6">
          <span className="text-lg text-muted-foreground line-through">De: R$ 197</span>
          <span className="text-sm text-muted-foreground ml-2">Valor real do diagnóstico</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            onClick={handlePayment}
            className="btn-gradient text-base px-8 py-6 h-auto shadow-lg shadow-instagram-pink/25 hover:shadow-instagram-pink/40 transition-all group"
          >
            <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Desbloquear tudo — R$ 57,90
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Agência cobra de R$ 3 mil a R$ 8 mil por mês. Você paga menos de R$ 2/dia.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Pagamento 100% seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-instagram-pink" />
            <span>Acesso imediato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Garantia 7 dias</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-8 max-w-md mx-auto">
          ⚠️ Após a confirmação do pagamento, você será redirecionado automaticamente para a área VIP com todo o conteúdo personalizado.
        </p>

        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            © 2026 Instarrumado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoCTA;

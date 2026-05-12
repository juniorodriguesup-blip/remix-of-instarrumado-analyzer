import { Gift, Sparkles } from "lucide-react";

const FreeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10 border border-instagram-pink/20 rounded-xl p-4 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-instagram-pink/20 to-instagram-purple/20 flex items-center justify-center flex-shrink-0">
          <Gift className="h-4 w-4 text-instagram-pink" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Você está no acesso gratuito
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Esta prévia já mostra problemas reais. O diagnóstico completo + manual de arrumação está disponível no plano Premium.
          </p>
          <p className="text-xs text-instagram-pink font-medium mt-1">
            <Sparkles className="h-3 w-3 inline mr-0.5" />
            Desbloqueie tudo por menos de R$ 1/dia
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeBanner;

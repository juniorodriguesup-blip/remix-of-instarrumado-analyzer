import { Crown, Sparkles } from "lucide-react";

const PremiumBanner = () => {
  return (
    <div className="bg-gradient-to-r from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10 border border-instagram-pink/20 rounded-xl p-4 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-instagram-pink/20 via-instagram-purple/20 to-instagram-orange/20 flex items-center justify-center flex-shrink-0">
          <Crown className="h-4 w-4 text-instagram-yellow" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Acesso Premium Liberado! 🎉
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Você não comprou conteúdo. Você desbloqueou clareza estratégica.
          </p>
          <p className="text-xs text-instagram-pink font-medium mt-1">
            <Sparkles className="h-3 w-3 inline mr-0.5" />
            Gere diagnósticos ilimitados para quantos perfis quiser
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;

import { CheckCircle } from "lucide-react";

const PremiumBanner = () => {
  return (
    <div className="bg-instagram-pink/10 border border-instagram-pink/30 rounded-xl p-4 mb-8">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-instagram-pink flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Acesso liberado.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Você não comprou conteúdo. Você desbloqueou clareza estratégica.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;

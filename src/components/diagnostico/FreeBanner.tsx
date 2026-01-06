import { AlertTriangle } from "lucide-react";

const FreeBanner = () => {
  return (
    <div className="bg-instagram-orange/10 border border-instagram-orange/30 rounded-xl p-4 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-instagram-orange flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Você está no acesso gratuito.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Aqui você vê apenas um exemplo do nível da análise.
            O diagnóstico real do seu perfil está bloqueado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeBanner;

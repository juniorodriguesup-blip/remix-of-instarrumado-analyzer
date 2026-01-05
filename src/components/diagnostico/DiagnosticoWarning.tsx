import { AlertTriangle } from "lucide-react";

const DiagnosticoWarning = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-instagram-orange/10 border border-instagram-orange/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-instagram-orange" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                ⚠️ Aviso importante
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                O diagnóstico abaixo é um <strong className="text-foreground">EXEMPLO ILUSTRATIVO</strong> de como o Instarrumado analisa um perfil.
                Ele demonstra o nível de profundidade, franqueza e estratégia da análise.
              </p>
              <p className="text-instagram-pink font-medium mt-3">
                O diagnóstico real do seu perfil é liberado apenas no acesso completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoWarning;

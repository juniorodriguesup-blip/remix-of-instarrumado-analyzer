import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/pages/Diagnostico";

interface DiagnosticoResultProps {
  isPremium?: boolean;
  formData: FormData;
}

const DiagnosticoResult = ({ isPremium = false, formData }: DiagnosticoResultProps) => {
  const [diagnostico, setDiagnostico] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateDiagnostico = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-diagnostico", {
          body: {
            instagram: formData.instagram,
            tipo: formData.tipo,
            nicho: formData.nicho,
            objetivo: formData.objetivo,
            isPremium,
          },
        });

        if (fnError) {
          throw new Error(fnError.message || "Erro ao gerar diagnóstico");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setDiagnostico(data.diagnostico);
      } catch (err) {
        console.error("Error generating diagnostico:", err);
        setError(err instanceof Error ? err.message : "Erro ao gerar diagnóstico. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    generateDiagnostico();
  }, [formData, isPremium]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Gerando seu Diagnóstico...
            </h2>
            <p className="text-muted-foreground">
              Analisando @{formData.instagram}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-pink"></div>
              <p className="text-muted-foreground text-center">
                Nossa IA está analisando seu perfil e gerando um diagnóstico personalizado...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="text-center py-8">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-gradient px-6 py-3 rounded-lg font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Split paragraphs for better formatting
  const paragraphs = diagnostico?.split("\n").filter((p) => p.trim()) || [];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Diagnóstico Estratégico
          </h2>
          <p className="text-muted-foreground">
            {isPremium ? "Seu Diagnóstico Completo" : "Análise Preliminar"} — @{formData.instagram}
          </p>
        </div>

        {/* Profile info summary */}
        <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-sm">
          <span className="bg-instagram-pink/20 text-instagram-pink px-3 py-1 rounded-full">
            {formData.tipo}
          </span>
          <span className="bg-instagram-purple/20 text-instagram-purple px-3 py-1 rounded-full">
            {formData.nicho}
          </span>
          <span className="bg-instagram-orange/20 text-instagram-orange px-3 py-1 rounded-full">
            {formData.objetivo}
          </span>
        </div>

        {/* Diagnosis content */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="prose prose-invert max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed text-lg mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Psychological break - only show for free users */}
        {!isPremium && (
          <div className="mt-12 text-center space-y-4">
            <p className="text-2xl md:text-3xl font-bold gradient-text">
              Quer o plano de ação completo para seu perfil?
            </p>
            <p className="text-lg text-muted-foreground">
              O que você leu acima é apenas uma prévia das falhas identificadas.
            </p>
            <p className="text-instagram-pink font-medium text-lg">
              O diagnóstico completo com estratégias práticas está disponível no acesso premium.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiagnosticoResult;

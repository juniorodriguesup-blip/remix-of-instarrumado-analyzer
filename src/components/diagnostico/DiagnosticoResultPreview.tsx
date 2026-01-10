import { useEffect, useState } from "react";
import { AlertTriangle, Target, Lightbulb, Eye } from "lucide-react";
import type { FormData } from "@/pages/Diagnostico";

interface DiagnosticoResultPreviewProps {
  formData: FormData;
}

// Dados simulados baseados no nicho/objetivo para dar uma prévia convincente
const generatePreviewData = (formData: FormData) => {
  const { nicho, objetivo, instagram, tipo } = formData;
  
  return {
    sections: [
      {
        title: "Identidade Visual",
        problem: `A estrutura visual do perfil @${instagram} não está comunicando autoridade no nicho de ${nicho}. A falta de consistência visual impede que visitantes te reconheçam como referência.`,
        implication: `Isso prejudica diretamente seu objetivo de ${objetivo}, pois visitantes não desenvolvem confiança visual.`,
      },
      {
        title: "Biografia",
        problem: `A bio atual não está otimizada para conversão. Como ${tipo}, você precisa de uma bio que comunique claramente sua proposta única.`,
        implication: `Potenciais clientes/seguidores não entendem em segundos o que você oferece, abandonando o perfil.`,
      },
      {
        title: "Destaques",
        problem: `Os destaques não estão estruturados em funil de conversão. Para ${nicho}, existe uma estrutura específica que aumenta engajamento.`,
        implication: `Você está perdendo oportunidades de converter visitantes curiosos em seguidores engajados.`,
      },
    ],
    totalIssues: 7,
  };
};

const DiagnosticoResultPreview = ({ formData }: DiagnosticoResultPreviewProps) => {
  const [previewData, setPreviewData] = useState<ReturnType<typeof generatePreviewData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simular tempo de "análise"
    const timer = setTimeout(() => {
      setPreviewData(generatePreviewData(formData));
      setIsGenerating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [formData]);

  if (isGenerating) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Analisando seu perfil...
            </h2>
            <p className="text-muted-foreground">
              Identificando pontos de melhoria em @{formData.instagram}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-pink"></div>
              <p className="text-muted-foreground text-center">
                Nossa IA está analisando seu perfil e identificando problemas estratégicos...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!previewData) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-instagram-pink/20 text-instagram-pink px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Eye className="w-4 h-4" />
            Prévia do Diagnóstico
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Identificamos {previewData.totalIssues} pontos críticos
          </h2>
          <p className="text-muted-foreground text-lg">
            Prévia da análise para @{formData.instagram}
          </p>
        </div>

        {/* Profile info summary */}
        <div className="glass-card rounded-xl p-5 mb-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-instagram-pink/20 text-instagram-pink px-4 py-2 rounded-full font-medium">
            {formData.tipo}
          </span>
          <span className="bg-instagram-purple/20 text-instagram-purple px-4 py-2 rounded-full font-medium">
            {formData.nicho}
          </span>
          <span className="bg-instagram-orange/20 text-instagram-orange px-4 py-2 rounded-full font-medium">
            {formData.objetivo}
          </span>
        </div>

        {/* Preview sections */}
        <div className="space-y-6">
          {previewData.sections.map((section, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-instagram-pink/20 via-instagram-purple/20 to-instagram-orange/20 p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-instagram-pink/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-instagram-pink" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {index + 1}. {section.title}
                  </h3>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">
                      Problema Identificado
                    </span>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {section.problem}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-instagram-orange/20 flex items-center justify-center mt-1">
                    <Target className="w-3.5 h-3.5 text-instagram-orange" />
                  </div>
                  <div>
                    <span className="text-instagram-orange font-semibold text-sm uppercase tracking-wide">
                      Impacto no seu Objetivo
                    </span>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {section.implication}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Locked sections indicator */}
          <div className="glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-instagram-pink/5 via-instagram-purple/5 to-instagram-orange/5 border border-instagram-pink/20">
            <div className="inline-flex items-center gap-2 bg-instagram-pink/20 text-instagram-pink px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              + {previewData.totalIssues - 3} problemas adicionais identificados
            </div>
            <p className="text-xl md:text-2xl font-bold gradient-text mb-2">
              O diagnóstico completo está pronto!
            </p>
            <p className="text-muted-foreground">
              Desbloqueie agora para ver todos os problemas e receber o plano de ação personalizado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoResultPreview;

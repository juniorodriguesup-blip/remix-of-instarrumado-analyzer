import { useEffect, useState } from "react";
import { Search, Cpu, Brain, FileText, Sparkles, Instagram } from "lucide-react";

interface Step {
  icon: typeof Search;
  text: string;
  duration: number;
}

const steps: Step[] = [
  { icon: Search, text: "Localizando seu perfil no Instagram...", duration: 800 },
  { icon: Cpu, text: "Analisando bio e posicionamento...", duration: 1200 },
  { icon: Brain, text: "Identificando padrões visuais do feed...", duration: 1000 },
  { icon: Search, text: "Avaliando estrutura de destaques...", duration: 900 },
  { icon: Cpu, text: "Comparando com perfis de alto desempenho...", duration: 1100 },
  { icon: Brain, text: "Gerando diagnóstico personalizado...", duration: 1500 },
  { icon: Sparkles, text: "Preparando seu relatório...", duration: 600 },
];

interface MagicalLoadingProps {
  instagram: string;
  onComplete: () => void;
}

const MagicalLoading = ({ instagram, onComplete }: MagicalLoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete();
      return;
    }

    const step = steps[currentStep];
    const startTime = Date.now();
    const endTime = startTime + step.duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const stepProgress = Math.min(elapsed / step.duration, 1);

      setProgress((currentStep + stepProgress) / steps.length * 100);

      if (now >= endTime) {
        clearInterval(timer);
        setCurrentStep((prev) => prev + 1);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  const visibleStep = Math.min(currentStep, steps.length - 1);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-instagram-purple/[0.02] via-background to-instagram-pink/[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-instagram-purple/5 via-instagram-pink/5 to-instagram-orange/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-6">
            <Cpu className="h-4 w-4 text-instagram-pink" />
            <span className="text-sm font-medium gradient-text">IA analisando</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Analisando @{instagram}
          </h2>
          <p className="text-sm text-muted-foreground">
            Nossa inteligência artificial está examinando cada detalhe do seu perfil
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right mt-1.5">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === visibleStep;
              const isComplete = index < visibleStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isActive ? "opacity-100" : isComplete ? "opacity-50" : "opacity-20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isComplete
                        ? "bg-green-500/20"
                        : isActive
                        ? "bg-gradient-to-br from-instagram-purple/30 to-instagram-pink/30 animate-pulse"
                        : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isComplete
                          ? "text-green-500"
                          : isActive
                          ? "text-instagram-pink"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isComplete
                          ? "text-green-500"
                          : isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.text}
                    </p>
                  </div>

                  {isComplete && (
                    <Sparkles className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Instagram className="h-3.5 w-3.5" />
            <span>Análise segura • Seus dados não são armazenados</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagicalLoading;

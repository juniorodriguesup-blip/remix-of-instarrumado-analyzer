import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Instagram, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  CheckCircle, 
  Crown,
  Gift,
  Zap,
  Star,
  BookOpen,
  Target,
  Calendar,
  Video,
  MessageSquare,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoFormPremium from "@/components/diagnostico/DiagnosticoFormPremium";
import ManualResult from "@/components/diagnostico/ManualResult";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const benefitItems = [
  {
    icon: Target,
    title: "Diagnóstico Completo",
    description: "Análise profunda de todos os pontos do seu perfil"
  },
  {
    icon: BookOpen,
    title: "Bio Estratégica",
    description: "Bio personalizada pronta para copiar e colar"
  },
  {
    icon: Calendar,
    title: "Calendário 7 Dias",
    description: "Planejamento de conteúdo semanal completo"
  },
  {
    icon: Video,
    title: "Roteiros de Reels",
    description: "Scripts prontos para viralizar"
  },
  {
    icon: MessageSquare,
    title: "Scripts de Vendas",
    description: "Mensagens de conversão para o Direct"
  },
  {
    icon: Star,
    title: "Destaques Estratégicos",
    description: "Estrutura ideal para seus destaques"
  }
];

const AcessoPremium = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"welcome" | "form" | "result">("welcome");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for valid token (used for post-payment redirect from Kiwify)
  const token = searchParams.get("token");
  const hasValidToken = token === "premium2026";

  useEffect(() => {
    // Verificar acesso
    if (hasValidToken) {
      setHasAccess(true);
      
      // Tentar carregar formData do localStorage
      const savedFormData = localStorage.getItem("instarrumado_formData");
      if (savedFormData) {
        try {
          const parsed = JSON.parse(savedFormData);
          setFormData(parsed);
          // Se já tem dados, vai direto pro resultado
          setStep("result");
        } catch (e) {
          console.error("Error parsing saved formData:", e);
          // Se não conseguiu parsear, vai pro form
          setStep("form");
        }
      } else {
        // Se não tem dados salvos, vai direto pro formulário (pula welcome)
        setStep("form");
      }
    }
    setIsLoading(false);
  }, [hasValidToken]);

  const handleFormSubmit = (data: FormData) => {
    // Salvar no localStorage para persistência
    localStorage.setItem("instarrumado_formData", JSON.stringify(data));
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartForm = () => {
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-instagram-pink mx-auto" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <AlertCircle className="h-16 w-16 text-instagram-pink mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Acesso Restrito
            </h1>
            <p className="text-muted-foreground mb-8">
              Esta área é exclusiva para clientes que adquiriram o pacote premium.
              Complete seu diagnóstico gratuito e desbloqueie o acesso completo.
            </p>
            <button
              onClick={() => navigate("/diagnostico")}
              className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
            >
              <Target className="h-5 w-5" />
              Fazer Diagnóstico Gratuito
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-instagram-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-instagram-pink/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-instagram-orange/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 border border-instagram-pink/30 rounded-full px-4 py-2">
            <Crown className="h-4 w-4 text-instagram-yellow" />
            <span className="text-sm font-semibold gradient-text">Acesso VIP</span>
          </div>
        </div>
      </header>

      {/* Welcome Step */}
      {step === "welcome" && (
        <>
          {/* Hero Section */}
          <section className="relative py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
              {/* Success badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2.5 mb-8 animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-semibold text-green-500">Pagamento Confirmado!</span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="text-foreground">Parabéns! 🎉</span>
                <br />
                <span className="gradient-text">Seu Acesso VIP</span>
                <br />
                <span className="text-foreground">está Liberado!</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Você acaba de desbloquear o <strong className="text-foreground">Diagnóstico Completo</strong> + 
                <strong className="text-foreground"> Manual de Arrumação Estratégico</strong> 100% personalizado com IA.
              </p>

              {/* Gift animation */}
              <div className="relative inline-block mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-instagram-purple via-instagram-pink to-instagram-orange p-1 rounded-2xl">
                  <div className="bg-background/90 backdrop-blur-sm rounded-xl p-8">
                    <Gift className="h-16 w-16 text-instagram-pink mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">Seu pacote premium está pronto!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-12 md:py-16 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  O que você vai <span className="gradient-text">receber agora</span>
                </h2>
                <p className="text-muted-foreground">
                  Tudo personalizado para o SEU perfil e objetivo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                {benefitItems.map((item, index) => (
                  <div 
                    key={index}
                    className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="h-7 w-7 text-instagram-pink" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-green-500 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Incluído no seu acesso
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleStartForm}
                  className="group relative inline-flex items-center gap-3 btn-gradient px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-instagram-pink/25 hover:shadow-instagram-pink/40 transition-all"
                >
                  <Zap className="h-6 w-6" />
                  <span>Gerar Meu Material Agora</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-muted-foreground mt-4">
                  ⏱️ Leva menos de 2 minutos
                </p>
              </div>
            </div>
          </section>

          {/* Trust badges */}
          <section className="py-12 border-t border-border/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Acesso Imediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-instagram-pink" />
                  <span>100% Personalizado por IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-instagram-yellow" />
                  <span>Geração Ilimitada</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Form Step */}
      {step === "form" && (
        <>
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-instagram-pink/10 border border-instagram-pink/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-instagram-pink" />
                <span className="text-sm font-medium text-instagram-pink">Passo Final</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Preencha seus dados para <span className="gradient-text">personalização</span>
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                A IA vai usar essas informações para criar seu material 100% personalizado.
              </p>
            </div>
          </section>

          <DiagnosticoFormPremium onSubmit={handleFormSubmit} />
        </>
      )}

      {/* Result Step */}
      {step === "result" && formData && (
        <>
          {/* Success header */}
          <section className="py-8 md:py-12 border-b border-border/30 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Material Gerado com Sucesso!
                </span>
              </div>
            </div>
          </section>

          {/* Diagnosis Result */}
          <DiagnosticoResult isPremium={true} formData={formData} />
          
          {/* Manual de Arrumação Personalizado */}
          <ManualResult formData={formData} />
          
          {/* CTA to generate another */}
          <section className="py-16 md:py-20 border-t border-border/30 bg-gradient-to-br from-instagram-purple/5 via-instagram-pink/5 to-instagram-orange/5">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-instagram-yellow/10 border border-instagram-yellow/30 rounded-full px-4 py-2 mb-6">
                <Crown className="h-4 w-4 text-instagram-yellow" />
                <span className="text-sm font-semibold text-instagram-yellow">Benefício VIP</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Quer gerar para <span className="gradient-text">outro perfil</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Como cliente VIP, você tem acesso ilimitado. Gere diagnósticos e manuais para quantos perfis quiser!
              </p>
              <button
                onClick={() => {
                  setStep("form");
                  setFormData(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Gerar Novo Material
              </button>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="h-5 w-5 text-instagram-pink" />
            <span className="font-semibold gradient-text">Instarrumado</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Instarrumado. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default AcessoPremium;

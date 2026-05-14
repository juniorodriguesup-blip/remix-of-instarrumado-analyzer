import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getPremiumToken, setPremiumToken } from "@/lib/premiumAccess";
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
  Mail,
  UserPlus,
} from "lucide-react";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoFormPremium from "@/components/diagnostico/DiagnosticoFormPremium";
import ManualResult from "@/components/diagnostico/ManualResult";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface TokenStatus {
  valid: boolean;
  email?: string;
  expiresAt?: string;
  error?: string;
}

const AcessoPremium = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<"validating" | "welcome" | "form" | "result" | "invalid">("validating");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [tokenEmail, setTokenEmail] = useState<string | null>(null);
  const [linkingAccount, setLinkingAccount] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      // Check if there's a token in the URL
      if (token) {
        setPremiumToken(token);
      }

      const storedToken = getPremiumToken();

      if (!storedToken) {
        setTokenStatus({ valid: false, error: "Token não encontrado" });
        setStep("invalid");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("validate-premium-token", {
          body: { token: storedToken },
        });

        if (error || !data?.valid) {
          setTokenStatus({ valid: false, error: data?.error || "Token inválido ou expirado" });
          setStep("invalid");
          return;
        }

        setTokenStatus({ valid: true, email: data.email, expiresAt: data.expires_at });
        setTokenEmail(data.email);

        const savedFormData = localStorage.getItem("instarrumado_formData");
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            setFormData(parsed);
            setStep("result");
            return;
          } catch (e) {
            console.error("Error parsing saved formData:", e);
          }
        }

        setStep("welcome");
      } catch (err) {
        console.error("Error validating token:", err);
        setTokenStatus({ valid: false, error: "Erro ao validar acesso" });
        setStep("invalid");
      }
    };

    validateToken();
  }, [token]);

  const handleFormSubmit = (data: FormData) => {
    localStorage.setItem("instarrumado_formData", JSON.stringify(data));
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartForm = () => {
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkAccount = async () => {
    if (!user || !tokenEmail) return;
    setLinkingAccount(true);

    try {
      const { error } = await supabase.functions.invoke("link-premium-to-user", {
        body: { 
          token: getPremiumToken(),
          user_id: user.id,
        },
      });

      if (error) throw error;

      // Refresh auth to get new subscription status
      await supabase.auth.refreshSession();
      toast.success("Conta vinculada com sucesso! Seu acesso premium está garantido.");
      setLinkingAccount(false);
    } catch (err: any) {
      console.error("Error linking account:", err);
      toast.error("Erro ao vincular conta. Tente novamente.");
      setLinkingAccount(false);
    }
  };

  if (step === "validating") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-instagram-pink mx-auto" />
          <p className="text-muted-foreground">Validando seu acesso premium...</p>
        </div>
      </main>
    );
  }

  if (step === "invalid") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acesso não autorizado
          </h1>
          <p className="text-muted-foreground mb-2">
            {tokenStatus?.error || "Token inválido ou expirado."}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Se você acabou de pagar, aguarde alguns minutos e use o link enviado no seu email.
          </p>
          <Button onClick={() => navigate("/")} className="btn-gradient">
            Voltar para o início
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-instagram-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-instagram-pink/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-instagram-orange/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <header className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {tokenEmail && !user && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {tokenEmail}
              </div>
            )}
            <div className="flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 border border-instagram-pink/30 rounded-full px-4 py-2">
              <Crown className="h-4 w-4 text-instagram-yellow" />
              <span className="text-sm font-semibold gradient-text">Acesso VIP</span>
            </div>
          </div>
        </div>
      </header>

      {step === "welcome" && (
        <>
          <section className="relative py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2.5 mb-8 animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-semibold text-green-500">Pagamento Confirmado!</span>
              </div>

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

              {/* Account linking banner */}
              {tokenEmail && !user && (
                <div className="max-w-lg mx-auto mb-12 glass-card rounded-2xl p-6 border border-instagram-pink/20">
                  <div className="flex items-center gap-3 mb-3">
                    <UserPlus className="h-5 w-5 text-instagram-pink" />
                    <h3 className="text-lg font-bold text-foreground">
                      Salve seu acesso para sempre
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie uma conta grátis com <strong>{tokenEmail}</strong> e seu acesso premium ficará salvo 
                    para você acessar de qualquer dispositivo, quando quiser.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => navigate(`/auth?redirect=/obrigado&email=${encodeURIComponent(tokenEmail)}`)}
                      className="btn-gradient flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Criar conta grátis
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleStartForm}
                      className="flex-1"
                    >
                      Agora não, quero ver o material
                    </Button>
                  </div>
                </div>
              )}

              {/* Already linked */}
              {user && tokenStatus?.valid && (
                <div className="max-w-lg mx-auto mb-12 glass-card rounded-2xl p-6 border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-foreground">
                      Conta vinculada! Seu acesso premium está salvo na sua conta.
                    </p>
                  </div>
                </div>
              )}

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

      {step === "result" && formData && (
        <>
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

          <DiagnosticoResult isPremium={true} formData={formData} />
          
          <ManualResult formData={formData} />
          
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
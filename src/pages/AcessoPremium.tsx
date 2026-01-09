import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Instagram, Sparkles, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoFormPremium from "@/components/diagnostico/DiagnosticoFormPremium";
import ManualResult from "@/components/diagnostico/ManualResult";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const AcessoPremium = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscriptionStatus, loading: authLoading, refreshSubscription } = useAuth();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  // Check for valid token (used for post-payment redirect from Kiwify)
  // Token grants temporary access while webhook processes the payment
  const token = searchParams.get("token");
  const hasValidToken = token === "premium2026";
  const isPremiumUser = subscriptionStatus === "premium";
  const hasAccess = hasValidToken || isPremiumUser;

  useEffect(() => {
    // If user has valid token, refresh subscription status in background
    // This ensures the premium status gets updated from the webhook
    if (hasValidToken && user) {
      refreshSubscription();
    }
  }, [hasValidToken, user, refreshSubscription]);

  useEffect(() => {
    // Redirect to auth if not logged in, but preserve the return URL
    if (!authLoading && !user) {
      const currentUrl = `/area-vip${token ? `?token=${token}` : ''}`;
      navigate(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    
    // Redirect to home if no valid access (no token AND not premium)
    if (!authLoading && user && !hasAccess) {
      toast.error("Acesso exclusivo para usuários Premium");
      navigate("/");
    }
  }, [user, hasAccess, authLoading, navigate, token]);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-instagram-pink mx-auto" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  // Don't render if no access (will redirect)
  if (!user || !hasAccess) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-instagram-pink/20 text-instagram-pink flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Acesso VIP
            </span>
          </div>
        </div>
      </header>

      {step === "form" && (
        <>
          {/* Hero */}
          <section className="py-12 md:py-16 border-b border-border/30">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-instagram-pink/10 border border-instagram-pink/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-instagram-pink" />
                <span className="text-sm font-medium text-instagram-pink">Acesso Premium Liberado</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Parabéns pela sua compra! <span className="gradient-text">Seu acesso VIP está liberado.</span>
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Preencha os campos abaixo para receber seu diagnóstico completo e Manual de Arrumação 100% personalizado com IA.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Pagamento confirmado • Diagnóstico + Manual Personalizado</span>
              </div>
            </div>
          </section>

          {/* Form */}
          <DiagnosticoFormPremium onSubmit={handleFormSubmit} />
        </>
      )}

      {step === "result" && formData && (
        <>
          {/* Diagnosis Result */}
          <DiagnosticoResult isPremium={true} formData={formData} />
          
          {/* Manual de Arrumação Personalizado */}
          <ManualResult formData={formData} />
          
          {/* CTA to generate another */}
          <section className="py-12 md:py-16 border-t border-border/30">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Quer gerar outro <span className="gradient-text">diagnóstico + manual</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Como usuário VIP, você pode gerar diagnósticos e manuais ilimitados.
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
                Gerar Novo Diagnóstico
              </button>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Instarrumado. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default AcessoPremium;

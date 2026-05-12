import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/ui/SEO";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import DiagnosticoForm from "@/components/diagnostico/DiagnosticoForm";
import DiagnosticoWarning from "@/components/diagnostico/DiagnosticoWarning";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoPaywall from "@/components/diagnostico/DiagnosticoPaywall";
import DiagnosticoCTA from "@/components/diagnostico/DiagnosticoCTA";
import MagicalLoading from "@/components/ui/MagicalLoading";
import EmailCaptureModal from "@/components/ui/EmailCaptureModal";
import { Instagram, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trackCustomEvent } from "@/components/ui/Tracking";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const Diagnostico = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [diagnostico, setDiagnostico] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    localStorage.setItem("instarrumado_formData", JSON.stringify(data));
    setFormData(data);
    setError(null);
    setStep("generating");

    trackCustomEvent("DiagnosticoStarted", {
      instagram: data.instagram,
      tipo: data.tipo,
      nicho: data.nicho,
    });

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "generate-diagnostico",
        {
          body: {
            instagram: data.instagram,
            tipo: data.tipo,
            nicho: data.nicho,
            objetivo: data.objetivo,
            isPremium: false,
          },
        }
      );

      if (fnError) throw fnError;

      const content = result?.diagnostico || "Não foi possível gerar o diagnóstico.";
      setDiagnostico(content);

      if (user) {
        await supabase.from("analyses").insert({
          user_id: user.id,
          instagram_handle: data.instagram,
          profile_type: data.tipo,
          niche: data.nicho,
          goal: data.objetivo,
          is_premium: false,
          diagnostico_content: content,
        });
      }

      trackCustomEvent("DiagnosticoCompleted", {
        instagram: data.instagram,
        hasUser: !!user,
      });

      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (!user) {
        setTimeout(() => setShowEmailCapture(true), 4000);
      }
    } catch (err: any) {
      console.error("Error generating diagnosis:", err);
      setError(err.message || "Erro ao gerar diagnóstico");
      toast.error("Erro ao gerar diagnóstico. Tente novamente.");
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLoadingComplete = useCallback(() => {
    // The actual generation is already complete, this is just for the visual
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Diagnóstico de Instagram Grátis"
        description="Descubra exatamente o que está travando seu Instagram. Análise inteligente gratuita do seu perfil com recomendações personalizadas."
      />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Button>
            )}
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth?redirect=/diagnostico")}
                className="text-muted-foreground hover:text-foreground"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {step === "form" && (
        <>
          <DiagnosticoHero />
          <DiagnosticoForm onSubmit={handleFormSubmit} />
        </>
      )}

      {step === "generating" && formData && (
        <MagicalLoading
          instagram={formData.instagram}
          onComplete={handleLoadingComplete}
        />
      )}

      {step === "result" && formData && (
        <>
          {error ? (
            <section className="py-16">
              <div className="container mx-auto px-4 max-w-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Erro ao gerar diagnóstico
                </h2>
                <p className="text-muted-foreground mb-8">{error}</p>
                <Button
                  onClick={() => {
                    setStep("form");
                    setError(null);
                  }}
                  className="btn-gradient"
                >
                  Tentar novamente
                </Button>
              </div>
            </section>
          ) : (
            <>
              <DiagnosticoWarning />
              <DiagnosticoResult diagnostico={diagnostico || ""} formData={formData} />
              <DiagnosticoPaywall />
              <DiagnosticoCTA />
            </>
          )}
        </>
      )}

      {showEmailCapture && formData && (
        <EmailCaptureModal trigger="on-result" formData={formData} />
      )}
    </main>
  );
};

export default Diagnostico;

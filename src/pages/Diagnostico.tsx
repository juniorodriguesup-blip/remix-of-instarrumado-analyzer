import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DiagnosticoHeader from "@/components/diagnostico/DiagnosticoHeader";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import DiagnosticoForm from "@/components/diagnostico/DiagnosticoForm";
import DiagnosticoWarning from "@/components/diagnostico/DiagnosticoWarning";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoPaywall from "@/components/diagnostico/DiagnosticoPaywall";
import DiagnosticoCTA from "@/components/diagnostico/DiagnosticoCTA";
import FreeBanner from "@/components/diagnostico/FreeBanner";
import PremiumBanner from "@/components/diagnostico/PremiumBanner";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const Diagnostico = () => {
  const navigate = useNavigate();
  const { user, loading, subscriptionStatus } = useAuth();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instagram-pink mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  const isPremium = subscriptionStatus === "premium";

  return (
    <main className="min-h-screen bg-background">
      <DiagnosticoHeader />

      <div className="container mx-auto px-4 py-8">
        {isPremium ? <PremiumBanner /> : <FreeBanner />}
      </div>

      {step === "form" && (
        <>
          <DiagnosticoHero />
          <DiagnosticoForm onSubmit={handleFormSubmit} />
        </>
      )}

      {step === "result" && (
        <>
          <DiagnosticoWarning />
          <DiagnosticoResult isPremium={isPremium} />
          {!isPremium && (
            <>
              <DiagnosticoPaywall />
              <DiagnosticoCTA />
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Diagnostico;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import DiagnosticoForm from "@/components/diagnostico/DiagnosticoForm";
import DiagnosticoWarning from "@/components/diagnostico/DiagnosticoWarning";
import DiagnosticoResultPreview from "@/components/diagnostico/DiagnosticoResultPreview";
import DiagnosticoPaywall from "@/components/diagnostico/DiagnosticoPaywall";
import DiagnosticoCTA from "@/components/diagnostico/DiagnosticoCTA";
import { Instagram } from "lucide-react";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const Diagnostico = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    // Salvar dados no localStorage para usar na página premium
    localStorage.setItem("instarrumado_formData", JSON.stringify(data));
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
          </div>
        </div>
      </header>

      {step === "form" && (
        <>
          <DiagnosticoHero />
          <DiagnosticoForm onSubmit={handleFormSubmit} />
        </>
      )}

      {step === "result" && formData && (
        <>
          <DiagnosticoWarning />
          <DiagnosticoResultPreview formData={formData} />
          <DiagnosticoPaywall />
          <DiagnosticoCTA />
        </>
      )}
    </main>
  );
};

export default Diagnostico;

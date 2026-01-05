import { useState } from "react";
import DiagnosticoHero from "@/components/diagnostico/DiagnosticoHero";
import DiagnosticoForm from "@/components/diagnostico/DiagnosticoForm";
import DiagnosticoWarning from "@/components/diagnostico/DiagnosticoWarning";
import DiagnosticoResult from "@/components/diagnostico/DiagnosticoResult";
import DiagnosticoPaywall from "@/components/diagnostico/DiagnosticoPaywall";
import DiagnosticoCTA from "@/components/diagnostico/DiagnosticoCTA";

export interface FormData {
  instagram: string;
  tipo: string;
  nicho: string;
  objetivo: string;
}

const Diagnostico = () => {
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      {step === "form" && (
        <>
          <DiagnosticoHero />
          <DiagnosticoForm onSubmit={handleFormSubmit} />
        </>
      )}

      {step === "result" && (
        <>
          <DiagnosticoWarning />
          <DiagnosticoResult />
          <DiagnosticoPaywall />
          <DiagnosticoCTA />
        </>
      )}
    </main>
  );
};

export default Diagnostico;

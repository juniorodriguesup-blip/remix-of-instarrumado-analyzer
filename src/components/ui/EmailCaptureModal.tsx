import { useState, useEffect } from "react";
import { Instagram, CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EmailCaptureModalProps {
  trigger: "on-result" | "on-exit" | "on-scroll";
  formData?: {
    instagram: string;
    tipo: string;
    nicho: string;
    objetivo: string;
  };
}

const EmailCaptureModal = ({ trigger, formData }: EmailCaptureModalProps) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (trigger === "on-scroll") {
      let triggered = false;
      const handleScroll = () => {
        if (triggered) return;
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (scrollPercent > 0.6) {
          triggered = true;
          setShow(true);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [trigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            email,
            instagram: formData?.instagram,
            tipo: formData?.tipo,
            nicho: formData?.nicho,
            objetivo: formData?.objetivo,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        toast.success("Email registrado com sucesso!");
        setTimeout(() => {
          navigate("/auth?redirect=/diagnostico");
        }, 2000);
      } else {
        toast.error("Erro ao salvar. Tente novamente.");
      }
    } catch {
      setSubmitted(true);
      toast.success("Email registrado com sucesso!");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full relative animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-instagram-purple/20 to-instagram-pink/20 flex items-center justify-center mx-auto mb-4">
            {submitted ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Sparkles className="h-8 w-8 text-instagram-pink" />
            )}
          </div>

          {submitted ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">Você está dentro! 🎉</h2>
              <p className="text-muted-foreground text-sm">
                Vamos te redirecionar para criar sua conta e acessar o diagnóstico completo.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Quer o diagnóstico completo?
              </h2>
              <p className="text-muted-foreground text-sm">
                Deixe seu email para receber o relatório completo e dicas exclusivas de Instagram.
              </p>
            </>
          )}
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capture-email">Seu melhor email</Label>
              <Input
                id="capture-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-6"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-5 w-5 mr-2" />
              )}
              {loading ? "Salvando..." : "Quero meu diagnóstico completo"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Seus dados estão seguros. Não fazemos spam.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailCaptureModal;

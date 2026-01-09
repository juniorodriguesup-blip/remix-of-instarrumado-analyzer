import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { Instagram } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Get the redirect URL from query params (used after login)
  const redirectTo = searchParams.get("redirect") || "/diagnostico";

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          navigate(redirectTo);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        navigate(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
          },
        });
        if (error) throw error;
        toast.success("Conta criada com sucesso!");
      }
    } catch (error: any) {
      if (error.message === "User already registered") {
        toast.error("Este e-mail já está cadastrado. Faça login.");
      } else if (error.message === "Invalid login credentials") {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.error(error.message || "Erro ao processar sua solicitação.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 flex items-center justify-center gap-3">
          <Instagram className="h-8 w-8 md:h-10 md:w-10 text-instagram-pink" />
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Instarrumado</span>
          </h1>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Acesse sua Análise Estratégica
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Entre para continuar seu diagnóstico."
                : "Crie sua conta para iniciar o diagnóstico."}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Seu progresso e sua liberação ficam salvos com segurança.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-background/50 border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-6 text-base"
            >
              {loading ? "Processando..." : isLogin ? "👉 Entrar" : "👉 Criar conta gratuita"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Não tem conta? Criar conta gratuita"
                : "Já tem conta? Fazer login"}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              O acesso gratuito libera apenas uma demonstração estratégica.
              <br />
              O plano completo é liberado somente após confirmação de pagamento.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/ui/SEO";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  Instagram,
  BarChart3,
  History,
  Crown,
  LogOut,
  Sparkles,
  Clock,
  Search,
  TrendingUp,
  Target,
  ChevronRight,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface Analysis {
  id: string;
  instagram_handle: string;
  profile_type: string;
  niche: string;
  goal: string;
  is_premium: boolean;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, subscriptionStatus, signOut } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/dashboard");
      return;
    }

    if (user) {
      fetchAnalyses();
    }
  }, [user, authLoading, navigate]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error: any) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Análise removida com sucesso");
    } catch (error: any) {
      toast.error("Erro ao remover análise");
    } finally {
      setDeleting(null);
    }
  };

  const handleExportAnalysis = (analysis: Analysis) => {
    const content = `INSTARRUMADO - Diagnóstico de Perfil\n
Instagram: @${analysis.instagram_handle}
Tipo: ${analysis.profile_type}
Nicho: ${analysis.niche}
Objetivo: ${analysis.goal}
Data: ${new Date(analysis.created_at).toLocaleDateString("pt-BR")}
Tipo de Análise: ${analysis.is_premium ? "Premium" : "Gratuita"}\n
---\n
Esta análise foi gerada pelo Instarrumado.\n
Acesse instarrumado.vercel.app para mais informações.`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `instarrumado-${analysis.instagram_handle}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Análise exportada com sucesso!");
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Carregando seu dashboard..." />;
  }

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Dashboard"
        description="Acompanhe suas análises de Instagram, histórico de diagnósticos e gerencie seu acesso premium."
      />
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Instarrumado</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {subscriptionStatus === "premium" && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 text-instagram-pink border border-instagram-pink/30">
                <Crown className="h-3.5 w-3.5" />
                Premium
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/diagnostico")}
            >
              <Search className="h-4 w-4 mr-1.5" />
              Nova Análise
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-8 md:py-12 border-b border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Seu <span className="gradient-text">Dashboard</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-instagram-purple/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-instagram-purple" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{analyses.length}</p>
                  <p className="text-sm text-muted-foreground">Análises realizadas</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-instagram-pink/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-instagram-pink" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {analyses.filter((a) => a.is_premium).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Análises Premium</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-instagram-orange/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-instagram-orange" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {new Set(analyses.map((a) => a.niche)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Nichos analisados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-instagram-pink" />
              <h2 className="text-2xl font-bold">Histórico de Análises</h2>
            </div>

            {!subscriptionStatus || subscriptionStatus === "free" ? (
              <Button
                onClick={() => navigate("/diagnostico")}
                className="btn-gradient text-sm"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Fazer análise gratuita
              </Button>
            ) : null}
          </div>

          {analyses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Nenhuma análise ainda
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Suas análises de perfil aparecerão aqui. Faça sua primeira análise
                para começar a organizar seu Instagram.
              </p>
              <Button
                onClick={() => navigate("/diagnostico")}
                className="btn-gradient"
              >
                <Search className="h-5 w-5 mr-2" />
                Analisar meu perfil agora
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="glass-card p-5 rounded-xl flex items-center justify-between group hover:border-instagram-pink/30 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-instagram-purple/20 to-instagram-pink/20 flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-instagram-pink" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground truncate">
                          @{analysis.instagram_handle}
                        </h4>
                        {analysis.is_premium && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-instagram-yellow/20 text-instagram-yellow border border-instagram-yellow/30">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {analysis.niche} &middot; {analysis.goal}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {new Date(analysis.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleExportAnalysis(analysis)}
                      title="Exportar análise"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteAnalysis(analysis.id)}
                      disabled={deleting === analysis.id}
                      title="Remover análise"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-instagram-pink"
                      onClick={() => navigate(`/diagnostico`)}
                      title="Ver análise completa"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/ui/SEO";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  Instagram,
  Users,
  Mail,
  Crown,
  TrendingUp,
  Clock,
  UserPlus,
  CreditCard,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalLeads: number;
  totalPremium: number;
  newUsersToday: number;
  newLeadsToday: number;
}

interface RecentUser {
  id: string;
  email: string;
  created_at: string;
  subscription: string;
}

interface RecentLead {
  id: string;
  email: string;
  instagram_handle: string | null;
  created_at: string;
  source: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLeads: 0,
    totalPremium: 0,
    newUsersToday: 0,
    newLeadsToday: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/admin");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [profiles, subscriptions, leads, usersToday, leadsToday] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_subscriptions").select("id", { count: "exact", head: true }).eq("status", "premium"),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      ]);

      const [recentProfiles, recentLeadsData] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, email, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("leads")
          .select("id, email, instagram_handle, created_at, source")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const userIds = recentProfiles.data?.map((p) => p.user_id) || [];
      let subMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: subs } = await supabase
          .from("user_subscriptions")
          .select("user_id, status")
          .in("user_id", userIds);

        subs?.forEach((s) => {
          subMap[s.user_id] = s.status;
        });
      }

      setStats({
        totalUsers: profiles.count || 0,
        totalLeads: leads.count || 0,
        totalPremium: subscriptions.count || 0,
        newUsersToday: usersToday.count || 0,
        newLeadsToday: leadsToday.count || 0,
      });

      setRecentUsers(
        recentProfiles.data?.map((p) => ({
          id: p.user_id,
          email: p.email || "sem email",
          created_at: p.created_at,
          subscription: subMap[p.user_id] || "free",
        })) || []
      );

      setRecentLeads(recentLeadsData.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Carregando painel..." />;
  }

  return (
    <main className="min-h-screen bg-background">
      <SEO title="Admin" description="Painel administrativo Instarrumado" />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-instagram-pink" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">Admin</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Painel <span className="gradient-text">Administrativo</span>
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={stats.totalUsers}
              label="Usuários"
              color="from-blue-500 to-indigo-600"
            />
            <StatCard
              icon={<Mail className="h-5 w-5" />}
              value={stats.totalLeads}
              label="Leads"
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              icon={<Crown className="h-5 w-5" />}
              value={stats.totalPremium}
              label="Premium"
              color="from-amber-500 to-orange-600"
            />
            <StatCard
              icon={<UserPlus className="h-5 w-5" />}
              value={stats.newUsersToday}
              label="Hoje (users)"
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value={stats.newLeadsToday}
              label="Hoje (leads)"
              color="from-rose-500 to-red-600"
            />
          </div>

          {/* Config Section */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-instagram-pink" />
              Configuração do Kiwify (Checkout)
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground font-medium mb-1">URL do Webhook (configurar no Kiwify):</p>
                <code className="block bg-background/80 rounded-lg p-3 text-xs text-foreground break-all">
                  {import.meta.env.VITE_SUPABASE_URL}/functions/v1/kiwify-webhook?token=SEU_TOKEN_AQUI
                </code>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">URL de Sucesso (redirect pós-pagamento):</p>
                <code className="block bg-background/80 rounded-lg p-3 text-xs text-foreground break-all">
                  https://instarrumado.com.br/obrigado
                </code>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">Link do Checkout:</p>
                <code className="block bg-background/80 rounded-lg p-3 text-xs text-foreground break-all">
                  https://pay.kiwify.com.br/6n0HjlG
                </code>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-xs text-amber-500 font-medium">
                  ⚠️ No Kiwify, vá em "Integrações" e configure o Webhook com a URL acima.
                  Defina a variável de ambiente <strong>KIWIFY_WEBHOOK_TOKEN</strong> no Supabase com um token secreto.
                </p>
              </div>
            </div>
          </div>

          {/* Two columns: Users and Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-instagram-pink" />
                Últimos Usuários
              </h3>
              <div className="space-y-2">
                {recentUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum usuário ainda</p>
                ) : (
                  recentUsers.map((u) => (
                    <div key={u.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(u.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${
                        u.subscription === "premium"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {u.subscription === "premium" ? "Premium" : "Free"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Leads */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-instagram-pink" />
                Últimos Leads Capturados
              </h3>
              <div className="space-y-2">
                {recentLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum lead ainda</p>
                ) : (
                  recentLeads.map((l) => (
                    <div key={l.id} className="glass-card rounded-xl p-3">
                      <p className="text-sm font-medium text-foreground">{l.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{l.instagram_handle ? `@${l.instagram_handle}` : "sem instagram"}</span>
                        <span>•</span>
                        <span>{l.source}</span>
                        <span>•</span>
                        <span>{new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const StatCard = ({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) => (
  <div className="glass-card rounded-xl p-4 text-center">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mx-auto mb-3`}>
      <div className="text-white">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

export default Admin;

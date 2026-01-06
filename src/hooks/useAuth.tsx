import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionStatus = "free" | "premium";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("free");

  const fetchSubscriptionStatus = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Failed to fetch subscription status:", error.message);
      setSubscriptionStatus("free");
      return;
    }

    setSubscriptionStatus((data?.status as SubscriptionStatus) ?? "free");
  }, []);

  const refreshSubscription = useCallback(async () => {
    if (user) {
      await fetchSubscriptionStatus(user.id);
    }
  }, [user, fetchSubscriptionStatus]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer Supabase call to avoid deadlock
          setTimeout(() => {
            fetchSubscriptionStatus(session.user.id);
          }, 0);
        } else {
          setSubscriptionStatus("free");
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchSubscriptionStatus(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // After checkout, the payment confirmation webhook can arrive seconds/minutes later.
  // While the user is still "free", we briefly re-check in the background so the UI
  // flips to Premium automatically as soon as the backend updates.
  useEffect(() => {
    if (!user) return;
    if (subscriptionStatus === "premium") return;

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      if (Date.now() - startedAt > 2 * 60 * 1000) {
        window.clearInterval(interval);
        return;
      }
      fetchSubscriptionStatus(user.id);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [user, subscriptionStatus, fetchSubscriptionStatus]);

  // Also refresh when user comes back to the tab (common after paying in another page).
  useEffect(() => {
    if (!user) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSubscriptionStatus(user.id);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [user, fetchSubscriptionStatus]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscriptionStatus("free");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscriptionStatus,
        signOut,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

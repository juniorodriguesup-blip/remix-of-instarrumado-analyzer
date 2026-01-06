import { useState, useEffect, createContext, useContext, ReactNode } from "react";
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

  const fetchSubscriptionStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("status")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      setSubscriptionStatus(data.status as SubscriptionStatus);
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      await fetchSubscriptionStatus(user.id);
    }
  };

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

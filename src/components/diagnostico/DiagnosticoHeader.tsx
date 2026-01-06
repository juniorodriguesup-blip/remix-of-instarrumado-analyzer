import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiagnosticoHeader = () => {
  const { user, subscriptionStatus, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Instagram className="h-6 w-6 text-instagram-pink" />
          <h1 className="text-xl font-bold">
            <span className="gradient-text">Instarrumado</span>
          </h1>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              subscriptionStatus === "premium"
                ? "bg-instagram-pink/20 text-instagram-pink"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {subscriptionStatus === "premium" ? "Premium" : "Gratuito"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DiagnosticoHeader;

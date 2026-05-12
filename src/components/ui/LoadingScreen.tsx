import { Instagram, Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Carregando..." }: LoadingScreenProps) => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Instagram className="h-8 w-8 text-instagram-pink animate-pulse" />
          <span className="text-2xl font-bold gradient-text">Instarrumado</span>
        </div>
        <Loader2 className="h-10 w-10 animate-spin text-instagram-pink mx-auto" />
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </main>
  );
};

export default LoadingScreen;

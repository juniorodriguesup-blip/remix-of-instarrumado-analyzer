import { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground">
              Algo deu errado
            </h1>
            
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>

            {this.state.error?.message && (
              <pre className="text-xs text-left bg-muted p-4 rounded-lg overflow-auto max-h-32 text-muted-foreground">
                {this.state.error.message}
              </pre>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="btn-gradient"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

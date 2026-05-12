import { ArrowRight, BarChart3, Instagram, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 20000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(225, 48, 108, 0.15)";
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(225, 48, 108, ${0.05 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-instagram-purple/5 via-transparent to-instagram-pink/5 z-0" />
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-instagram-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-instagram-pink/10 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-instagram-purple/20 to-instagram-pink/20 border border-instagram-pink/20 rounded-full px-4 py-1.5 mb-8">
              <BarChart3 className="h-4 w-4 text-instagram-pink" />
              <span className="text-sm font-medium gradient-text">
                Diagnóstico Inteligente de Instagram
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6">
              Seu Instagram está{" "}
              <span className="gradient-text">funcionando</span>
              {" "}ou{" "}
              <span className="text-muted-foreground line-through decoration-instagram-pink/50">só parece?</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl">
              A maioria dos perfis não perde seguidores.{" "}
              <span className="text-foreground font-semibold">Perde atenção, clareza e autoridade.</span>
            </p>

            <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
              O Instarrumado analisa seu perfil com IA, revela exatamente onde você está travando,
              e entrega um plano de ação personalizado para transformar seu Instagram em uma máquina de resultados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="btn-gradient text-base px-8 py-6 h-auto group"
              >
                <Link to="/diagnostico">
                  Analisar meu perfil agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 h-auto border-muted-foreground/30 hover:border-instagram-pink/50"
              >
                <Link to="/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Criar conta gratuita
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Sem cartão
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Leva menos de 1 minuto
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Gratuito
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 rounded-3xl blur-3xl" />
              
              <div className="relative glass-card rounded-3xl p-1">
                <div className="bg-background/95 backdrop-blur-xl rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-instagram-purple to-instagram-pink flex items-center justify-center">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">@seuperfil</p>
                        <p className="text-xs text-muted-foreground">Diagnóstico em tempo real</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                      <span className="text-xs font-medium text-green-500">Online</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-red-500/30 via-orange-500/30 to-yellow-500/30 rounded-full overflow-hidden">
                      <div className="h-full w-[35%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Bio", value: "42%", color: "text-red-400" },
                        { label: "Feed", value: "58%", color: "text-orange-400" },
                        { label: "Destaques", value: "23%", color: "text-red-400" },
                      ].map((item) => (
                        <div key={item.label} className="bg-background/50 rounded-xl p-3 text-center border border-border/50">
                          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Diagnóstico Rápido
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Bio sem CTA claro — visitantes não sabem o que fazer
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Destaques desorganizados — funil de vendas quebrado
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Feed sem identidade visual consistente
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-9 bg-gradient-to-r from-instagram-purple to-instagram-pink rounded-xl flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        Relatório completo disponível no plano Premium →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-instagram-yellow/30 to-instagram-orange/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-instagram-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="text-xs">Role para conhecer</span>
          <div className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-instagram-pink/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

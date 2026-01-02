import { AlertCircle, XCircle, Eye, Users } from "lucide-react";

const PainPointsSection = () => {
  const painPoints = [
    { icon: AlertCircle, text: "A bio não convence" },
    { icon: XCircle, text: "O feed não conversa entre si" },
    { icon: Eye, text: "Os destaques parecem soltos" },
    { icon: Users, text: "As pessoas entram… e saem" },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 leading-tight">
            Você já sentiu que seu Instagram poderia ser melhor…{" "}
            <span className="gradient-text">mas não sabe exatamente o quê mudar?</span>
          </h2>
          
          {/* Introduction Text */}
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-muted-foreground mb-2">Você posta.</p>
            <p className="text-lg md:text-xl text-muted-foreground mb-2">Às vezes até recebe likes.</p>
            <p className="text-lg md:text-xl text-foreground font-medium">Mas algo não encaixa.</p>
          </div>
          
          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="glass-card p-6 flex items-center gap-4 group hover:border-instagram-pink/50 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-instagram-pink/20 group-hover:bg-instagram-pink/30 transition-colors">
                  <point.icon className="w-6 h-6 text-instagram-pink" />
                </div>
                <span className="text-lg font-medium">{point.text}</span>
              </div>
            ))}
          </div>
          
          {/* Conclusion */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              Não é falta de esforço.<br />
              <span className="text-foreground font-medium">É falta de direção visual e estratégica.</span>
            </p>
            
            <div className="pt-6 space-y-2">
              <p className="text-xl md:text-2xl font-semibold">
                👉 O problema <span className="text-instagram-pink">não é você</span>.
              </p>
              <p className="text-xl md:text-2xl font-semibold">
                👉 É o seu Instagram <span className="gradient-text">desorganizado</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;

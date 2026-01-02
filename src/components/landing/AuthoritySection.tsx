import { Store, Eye, Sparkles } from "lucide-react";

const AuthoritySection = () => {
  const points = [
    { icon: Store, text: "Instagram não é brincadeira" },
    { icon: Eye, text: "Aparência comunica valor" },
    { icon: Sparkles, text: "Organização vende" },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-instagram-purple/10 via-instagram-pink/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Seu Instagram é sua{" "}
            <span className="gradient-text">vitrine</span>.<br />
            Você deixaria sua loja bagunçada?
          </h2>
          
          {/* Text */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hoje, antes de comprar, as pessoas olham seu perfil.<br />
            Antes de confiar, elas sentem sua presença.
          </p>
          
          {/* Points */}
          <div className="mb-8">
            <p className="text-lg text-muted-foreground mb-6">
              O Instarrumado existe para quem entende que:
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="glass-card px-6 py-4 flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <point.icon className="w-5 h-5 text-instagram-pink" />
                  <span className="font-medium">📌 {point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;

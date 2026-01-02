import { Brain, Palette, PenTool, MessageCircle } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Diagnóstico Inteligente do Perfil",
      description: "Analisamos sua bio, destaques, posicionamento e estética atual, do jeito que um estrategista faria.",
      color: "instagram-purple",
    },
    {
      icon: Palette,
      title: "Organização Visual do Feed",
      description: "Mostramos como deixar seu Instagram mais bonito, coerente e profissional, mesmo sem saber design.",
      color: "instagram-pink",
    },
    {
      icon: PenTool,
      title: "Conteúdo que Combina com Você",
      description: "Legendas, ideias de posts e roteiros de Reels que respeitam seu estilo, não frases prontas.",
      color: "instagram-orange",
    },
    {
      icon: MessageCircle,
      title: "Instagram que Responde por Você",
      description: "Scripts inteligentes para Direct, pensados para transformar seguidores em conversas reais.",
      color: "instagram-yellow",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              O Instarrumado faz o que{" "}
              <span className="gradient-text">ninguém faz</span>.
            </h2>
            <p className="text-xl text-muted-foreground">
              Ele não te entrega dicas genéricas.<br />
              <span className="text-foreground font-medium">Ele analisa o seu perfil real.</span>
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 group hover:scale-[1.02] transition-all duration-300 gradient-border"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

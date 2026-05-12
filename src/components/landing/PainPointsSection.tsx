import { MessageCircle, Image, LayoutGrid, Users, TrendingDown, EyeOff } from "lucide-react";

const painPoints = [
  {
    icon: MessageCircle,
    title: "Bio genérica",
    description: "Sua bio não comunica valor em 3 segundos. Visitantes não entendem o que você faz nem por que deveriam te seguir.",
    stat: "80%",
    statLabel: "decidem em segundos",
  },
  {
    icon: Image,
    title: "Feed sem identidade",
    description: "Cada post parece de um perfil diferente. Falta consistência visual e seu feed parece amador — mesmo com conteúdo de qualidade.",
    stat: "2x",
    statLabel: "mais engajamento com identidade visual",
  },
  {
    icon: LayoutGrid,
    title: "Destaques bagunçados",
    description: "Seus destaques não guiam o visitante. Em vez de um funil de vendas, você tem uma gaveta de arquivos mortos.",
    stat: "67%",
    statLabel: "visitantes olham destaques primeiro",
  },
  {
    icon: TrendingDown,
    title: "Conteúdo sem estratégia",
    description: "Você posta no achismo. Post que viraliza hoje, silêncio amanhã. Seu esforço não vira resultado consistente.",
    stat: "73%",
    statLabel: "dos perfis não têm estratégia",
  },
  {
    icon: EyeOff,
    title: "Baixa conversão",
    description: "Seguidores não viram clientes. Seu Instagram pode ter alcance, mas se não converte, é só um mural de fotos bonito.",
    stat: "95%",
    statLabel: "nunca compram pelo Instagram",
  },
  {
    icon: Users,
    title: "Crescimento estagnado",
    description: "Você trava nos mesmos números. Posta, engaja um pouco, mas não sai do lugar. Falta o diagnóstico certo.",
    stat: "60%",
    statLabel: "desistem nos primeiros 3 meses",
  },
];

const PainPointsSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-purple/[0.03] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-instagram-pink/[0.02] rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-400">Sintomas comuns</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Seu Instagram está{" "}
              <span className="gradient-text">perdendo oportunidades</span>{" "}
              agora mesmo?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Responda com honestidade: quantos desses problemas você reconhece no seu perfil?
              Cada um deles está custando seguidores, engajamento e vendas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="group relative glass-card rounded-2xl p-6 hover:border-instagram-pink/30 transition-all duration-500 hover:translate-y-[-4px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-instagram-pink/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-instagram-pink/20 to-instagram-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <point.icon className="h-6 w-6 text-instagram-pink" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text">{point.stat}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{point.statLabel}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-instagram-pink transition-colors">
                    {point.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-block glass-card rounded-2xl p-6 md:p-8 max-w-2xl">
              <p className="text-xl md:text-2xl font-bold mb-3">
                O problema <span className="text-instagram-pink">não é você</span>.
              </p>
              <p className="text-xl md:text-2xl font-bold mb-4">
                É a <span className="gradient-text">falta de um diagnóstico</span> profissional.
              </p>
              <p className="text-muted-foreground">
                Você não precisa de mais dicas genéricas. Precisa de alguém que olhe para o SEU perfil e diga exatamente o que mudar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;

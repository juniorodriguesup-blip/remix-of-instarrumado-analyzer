const DiagnosticoResult = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Diagnóstico Estratégico
          </h2>
          <p className="text-muted-foreground">Perfil Público (Exemplo)</p>
        </div>

        {/* Diagnosis content */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              "Sua aspiração ao cargo máximo da nação em 2026 exige uma reformulação completa da sua vitrine digital, pois o que se apresenta hoje é a imagem de um senador combativo — não a de um chefe de Estado em construção.
            </p>

            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              O erro central da sua comunicação está na <span className="text-instagram-pink font-medium">dependência excessiva do legado familiar</span> como principal motor de engajamento. Isso dilui sua autoridade individual e impede que o público o enxergue como um líder autônomo, capaz de conduzir o país por conta própria.
            </p>

            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              A estética do feed comunica <span className="text-instagram-orange font-medium">confronto, ruído e instabilidade</span>. Cortes agressivos de embates políticos e artes visuais carregadas afastam imediatamente o eleitor moderado, o empresariado e o mercado financeiro. Um presidente precisa transmitir previsibilidade, sobriedade e domínio institucional — hoje, seu perfil entrega militância, não estadismo.
            </p>

            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              Sua linha editorial está presa ao <span className="text-instagram-purple font-medium">ciclo da reação</span>. Você responde, critica e ataca com eficiência, mas não constrói futuro. Campanhas majoritárias não vencem com ressentimento; vencem com visão, esperança e projeto de país. O algoritmo entende seu conteúdo como polarizado e limita seu alcance a quem já concorda com você.
            </p>

            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              Falta <span className="text-instagram-yellow font-medium">humanização estratégica</span>. Não exposição vazia, mas a construção da imagem de gestor, conciliador e líder familiar. Sua comunicação atual garante relevância no Senado, mas jamais sustenta uma faixa presidencial.
            </p>

            <p className="text-foreground font-medium text-lg border-l-4 border-instagram-pink pl-4">
              Como este é um acesso gratuito, aponto apenas as falhas estruturais mais graves. O plano completo de correção estratégica permanece restrito ao acesso premium."
            </p>
          </div>
        </div>

        {/* Psychological break */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-2xl md:text-3xl font-bold gradient-text">
            Agora imagine esse nível de análise aplicado AO SEU PERFIL.
          </p>
          <p className="text-lg text-muted-foreground">
            O que você leu acima é apenas a superfície.
          </p>
          <p className="text-instagram-pink font-medium text-lg">
            O plano prático de correção não está disponível no acesso gratuito.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoResult;

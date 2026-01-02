import { AtSign, Search, FileCheck } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: AtSign,
      title: "Informe seu @",
      description: "Você informa seu @ do Instagram e responde poucas perguntas.",
    },
    {
      number: "02",
      icon: Search,
      title: "Análise especializada",
      description: "O Instarrumado analisa seu perfil como um especialista faria, estética, clareza e posicionamento.",
    },
    {
      number: "03",
      icon: FileCheck,
      title: "Diagnóstico claro",
      description: "Você recebe um diagnóstico claro do que está travando seu crescimento.",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-instagram-pink/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Não é sobre postar mais.<br />
              <span className="gradient-text">É sobre postar certo.</span>
            </h2>
          </div>
          
          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="glass-card p-8 text-center relative z-10 h-full">
                    {/* Number Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="gradient-bg text-primary-foreground font-bold px-4 py-2 rounded-full text-sm">
                        {step.number}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-instagram-pink/20 flex items-center justify-center mx-auto mb-6 mt-4">
                      <step.icon className="w-8 h-8 text-instagram-pink" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Note */}
          <p className="text-center text-muted-foreground mt-12 text-lg">
            👉 As melhorias completas ficam disponíveis no{" "}
            <span className="text-instagram-pink font-semibold">plano Premium</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

import SEO from "@/components/ui/SEO";
import HeroSection from "@/components/landing/HeroSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import AuthoritySection from "@/components/landing/AuthoritySection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Instarrumado - Diagnóstico de Instagram com IA"
        description="Descubra exatamente o que está travando seu Instagram. Análise inteligente do seu perfil com recomendações personalizadas para transformar seguidores em clientes."
      />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <AuthoritySection />
      <FinalCTASection />
    </main>
  );
};

export default Index;

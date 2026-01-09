import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Star, 
  LayoutGrid, 
  Palette, 
  Calendar, 
  Video, 
  MessageSquare, 
  Copy, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FormData } from "@/pages/AcessoPremium";

interface ManualResultProps {
  formData: FormData;
}

interface ParsedSection {
  title: string;
  content: string;
  icon: typeof Star;
}

const sectionConfig: { pattern: RegExp; icon: typeof Star; title: string }[] = [
  { pattern: /bio\s*(estratégica|pronta|personalizada)/i, icon: Star, title: "Bio Estratégica Personalizada" },
  { pattern: /estrutura\s*de?\s*destaques/i, icon: LayoutGrid, title: "Estrutura de Destaques" },
  { pattern: /estratégia\s*visual|feed/i, icon: Palette, title: "Estratégia Visual do Feed" },
  { pattern: /calendário\s*de?\s*conteúdo/i, icon: Calendar, title: "Calendário de Conteúdo (7 dias)" },
  { pattern: /roteiros?\s*de?\s*reels/i, icon: Video, title: "Roteiros de Reels Prontos" },
  { pattern: /scripts?\s*de?\s*conversão|direct/i, icon: MessageSquare, title: "Scripts de Conversão no Direct" },
];

const parseManual = (text: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];
  const lines = text.split("\n");
  
  let currentSection: ParsedSection | null = null;
  let currentContent: string[] = [];

  const findSectionConfig = (line: string) => {
    for (const config of sectionConfig) {
      if (config.pattern.test(line)) {
        return config;
      }
    }
    return null;
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this is a section header
    const isSectionHeader = trimmedLine.match(/^\*\*\d+\.\s+[^*]+:\*\*$/) || 
                           trimmedLine.match(/^##?\s*\d+\./);
    
    if (isSectionHeader) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent.join("\n").trim();
        sections.push(currentSection);
      }
      
      // Find matching config
      const config = findSectionConfig(trimmedLine);
      if (config) {
        currentSection = {
          title: config.title,
          content: "",
          icon: config.icon,
        };
        currentContent = [];
      } else {
        // Generic section
        const title = trimmedLine
          .replace(/^\*\*\d+\.\s*/, "")
          .replace(/:\*\*$/, "")
          .replace(/^##?\s*\d+\.\s*/, "")
          .replace(/:$/, "")
          .trim();
        currentSection = {
          title,
          content: "",
          icon: Star,
        };
        currentContent = [];
      }
      continue;
    }

    // Add content to current section
    if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join("\n").trim();
    sections.push(currentSection);
  }

  return sections;
};

const formatContent = (content: string): string => {
  return content
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markdown
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic markdown
    .replace(/^[-•]\s*/gm, "• ") // Normalize bullet points
    .trim();
};

const ManualResult = ({ formData }: ManualResultProps) => {
  const [manual, setManual] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const generateManual = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-manual", {
          body: {
            instagram: formData.instagram,
            tipo: formData.tipo,
            nicho: formData.nicho,
            objetivo: formData.objetivo,
          },
        });

        if (fnError) {
          throw new Error(fnError.message || "Erro ao gerar manual");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setManual(data.manual);
      } catch (err) {
        console.error("Error generating manual:", err);
        setError(err instanceof Error ? err.message : "Erro ao gerar manual. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    generateManual();
  }, [formData]);

  const handleCopy = (content: string, title: string) => {
    navigator.clipboard.writeText(formatContent(content));
    setCopiedSection(title);
    toast.success(`${title} copiado!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Gerando seu Manual de Arrumação...
            </h2>
            <p className="text-muted-foreground">
              Criando conteúdo personalizado para @{formData.instagram}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-instagram-pink" />
              <p className="text-muted-foreground text-center">
                Nossa IA está criando seu manual personalizado com bio, destaques, calendário e roteiros...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="text-center py-8">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-gradient px-6 py-3 rounded-lg font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const sections = parseManual(manual || "");

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-instagram-purple/20 text-instagram-purple px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Manual Personalizado
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Manual de Arrumação Completo
          </h2>
          <p className="text-muted-foreground text-lg">
            Conteúdo exclusivo criado para @{formData.instagram}
          </p>
        </div>

        {/* Profile summary */}
        <div className="glass-card rounded-xl p-5 mb-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-instagram-pink/20 text-instagram-pink px-4 py-2 rounded-full font-medium">
            {formData.tipo}
          </span>
          <span className="bg-instagram-purple/20 text-instagram-purple px-4 py-2 rounded-full font-medium">
            {formData.nicho}
          </span>
          <span className="bg-instagram-orange/20 text-instagram-orange px-4 py-2 rounded-full font-medium">
            {formData.objetivo}
          </span>
        </div>

        {/* Manual sections */}
        <div className="space-y-6">
          {sections.length > 0 ? (
            sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 p-5 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-instagram-purple/30 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-instagram-purple" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {index + 1}. {section.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Personalizado
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6">
                    <div className="bg-background/50 rounded-xl p-4 md:p-6 border border-border/50">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {formatContent(section.content)}
                      </pre>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(section.content, section.title)}
                        className="flex-1 md:flex-none"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedSection === section.title ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback: show raw content
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <div className="bg-background/50 rounded-xl p-4 md:p-6 border border-border/50">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                  {formatContent(manual || "")}
                </pre>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(manual || "", "Manual Completo")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedSection === "Manual Completo" ? "Copiado!" : "Copiar Tudo"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManualResult;

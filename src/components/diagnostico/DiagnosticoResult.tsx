import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle2, Lightbulb, Target, TrendingUp, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadReport, downloadPdfReport, copyToClipboard } from "@/lib/exportReport";
import type { FormData } from "@/pages/AcessoPremium";

interface DiagnosticoResultProps {
  isPremium?: boolean;
  formData: FormData;
  diagnostico?: string | null;
}

interface ParsedSection {
  title: string;
  items: ParsedItem[];
}

interface ParsedItem {
  subtitle?: string;
  problem?: string;
  implication?: string;
  content?: string;
}

const parseMarkdown = (text: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];
  const lines = text.split("\n").filter((line) => line.trim());

  let currentSection: ParsedSection | null = null;
  let currentItem: ParsedItem = {};

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Main title (e.g., **Diagnóstico Estratégico Detalhado:**)
    if (trimmedLine.match(/^\*\*[^*]+:\*\*$/) && !trimmedLine.match(/^\*\*\d+\./)) {
      // Skip main titles, we have our own header
      continue;
    }

    // Numbered section (e.g., **1. Title:**)
    if (trimmedLine.match(/^\*\*\d+\.\s+[^*]+:\*\*$/)) {
      if (currentSection) {
        if (Object.keys(currentItem).length > 0) {
          currentSection.items.push(currentItem);
          currentItem = {};
        }
        sections.push(currentSection);
      }
      const title = trimmedLine.replace(/^\*\*\d+\.\s+/, "").replace(/:\*\*$/, "");
      currentSection = { title, items: [] };
      continue;
    }

    // Sub-item with asterisk (e.g., * **Problema:** or ***Implicação:**)
    const problemMatch = trimmedLine.match(/^\*?\s?\*\*Problema:\*\*\s*(.+)/);
    const implicationMatch = trimmedLine.match(/^\*?\s?\*\*Implicação para o Objetivo:\*\*\s*(.+)/);

    if (problemMatch) {
      if (Object.keys(currentItem).length > 0 && currentSection) {
        currentSection.items.push(currentItem);
        currentItem = {};
      }
      currentItem.problem = problemMatch[1];
      continue;
    }

    if (implicationMatch) {
      currentItem.implication = implicationMatch[1];
      continue;
    }

    // Regular content
    if (trimmedLine && !trimmedLine.startsWith("**") && currentSection) {
      // Clean up any remaining markdown
      const cleanedContent = trimmedLine
        .replace(/^\*\s*/, "")
        .replace(/\*\*/g, "")
        .trim();
      
      if (cleanedContent) {
        if (currentItem.problem || currentItem.implication) {
          // Append to existing content
          currentItem.content = currentItem.content 
            ? currentItem.content + " " + cleanedContent 
            : cleanedContent;
        } else {
          currentItem.content = cleanedContent;
        }
      }
    }
  }

  // Push last item and section
  if (currentSection) {
    if (Object.keys(currentItem).length > 0) {
      currentSection.items.push(currentItem);
    }
    sections.push(currentSection);
  }

  return sections;
};

const DiagnosticoResult = ({ isPremium = false, formData, diagnostico: propDiagnostico }: DiagnosticoResultProps) => {
  const [diagnostico, setDiagnostico] = useState<string | null>(propDiagnostico || null);
  const [loading, setLoading] = useState(!propDiagnostico);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propDiagnostico) {
      setDiagnostico(propDiagnostico);
      setLoading(false);
      return;
    }

    const generateDiagnostico = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-diagnostico", {
          body: {
            instagram: formData.instagram,
            tipo: formData.tipo,
            nicho: formData.nicho,
            objetivo: formData.objetivo,
            isPremium: true,
          },
        });

        if (fnError) {
          throw new Error(fnError.message || "Erro ao gerar diagnóstico");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setDiagnostico(data.diagnostico);
      } catch (err) {
        console.error("Error generating diagnostico:", err);
        setError(err instanceof Error ? err.message : "Erro ao gerar diagnóstico. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    generateDiagnostico();
  }, [formData, propDiagnostico]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Gerando seu Diagnóstico Completo...
            </h2>
            <p className="text-muted-foreground">
              Analisando @{formData.instagram}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instagram-pink"></div>
              <p className="text-muted-foreground text-center">
                Nossa IA está analisando seu perfil e gerando um diagnóstico completo e personalizado...
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

  const sections = parseMarkdown(diagnostico || "");
  const sectionIcons = [Target, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-instagram-pink/20 text-instagram-pink px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Diagnóstico Premium Completo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Diagnóstico Estratégico
          </h2>
          <p className="text-muted-foreground text-lg">
            Análise personalizada para @{formData.instagram}
          </p>
        </div>

        {/* Profile info summary */}
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

        {/* Export Actions */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadPdfReport({
                diagnostico: diagnostico || "",
                formData,
                isPremium,
              });
              toast.success("PDF gerado com sucesso!");
            }}
            className="border-instagram-pink/30 text-instagram-pink hover:bg-instagram-pink/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadReport({
                diagnostico: diagnostico || "",
                formData,
                isPremium,
              });
              toast.success("Relatório baixado com sucesso!");
            }}
            className="border-instagram-purple/30 text-instagram-purple hover:bg-instagram-purple/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar TXT
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const success = await copyToClipboard(diagnostico || "");
              if (success) {
                toast.success("Diagnóstico copiado!");
              } else {
                toast.error("Erro ao copiar");
              }
            }}
            className="border-instagram-purple/30 text-instagram-purple hover:bg-instagram-purple/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Diagnóstico
          </Button>
        </div>

        {/* Diagnosis content - Sections */}
        <div className="space-y-6">
          {sections.length > 0 ? (
            sections.map((section, sectionIndex) => {
              const IconComponent = sectionIcons[sectionIndex % sectionIcons.length];
              return (
                <div
                  key={sectionIndex}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-instagram-pink/20 via-instagram-purple/20 to-instagram-orange/20 p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-instagram-pink/30 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-instagram-pink" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {sectionIndex + 1}. {section.title}
                      </h3>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 space-y-5">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-4">
                        {item.problem && (
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <div>
                              <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">
                                Problema Identificado
                              </span>
                              <p className="text-muted-foreground mt-1 leading-relaxed">
                                {item.problem}
                              </p>
                            </div>
                          </div>
                        )}

                        {item.implication && (
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-instagram-orange/20 flex items-center justify-center mt-1">
                              <Target className="w-3.5 h-3.5 text-instagram-orange" />
                            </div>
                            <div>
                              <span className="text-instagram-orange font-semibold text-sm uppercase tracking-wide">
                                Impacto no seu Objetivo
                              </span>
                              <p className="text-muted-foreground mt-1 leading-relaxed">
                                {item.implication}
                              </p>
                            </div>
                          </div>
                        )}

                        {item.content && !item.problem && !item.implication && (
                          <p className="text-muted-foreground leading-relaxed pl-9">
                            {item.content}
                          </p>
                        )}

                        {itemIndex < section.items.length - 1 && (
                          <div className="border-t border-white/5 pt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback: render raw text with basic formatting
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <div className="prose prose-invert max-w-none">
                {diagnostico?.split("\n").filter((p) => p.trim()).map((paragraph, index) => {
                  // Clean up markdown
                  const cleanedParagraph = paragraph
                    .replace(/\*\*/g, "")
                    .replace(/^\*\s*/, "")
                    .trim();
                  
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed text-lg mb-4">
                      {cleanedParagraph}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiagnosticoResult;

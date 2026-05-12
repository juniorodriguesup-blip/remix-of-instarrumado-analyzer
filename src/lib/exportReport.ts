import type { FormData } from "@/pages/Diagnostico";

interface ExportOptions {
  diagnostico: string;
  formData: FormData;
  isPremium?: boolean;
}

const formatDate = () => {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateTextReport = ({ diagnostico, formData, isPremium }: ExportOptions): string => {
  const cleanText = diagnostico
    .replace(/\*\*/g, "")
    .replace(/^\*\s*/gm, "- ")
    .replace(/^#+\s*/gm, "")
    .trim();

  return `
========================================
      INSTARRUMADO - RELATÓRIO
      Diagnóstico de Perfil Instagram
========================================

Data: ${formatDate()}

DADOS DO PERFIL
----------------------------------------
Instagram: @${formData.instagram}
Tipo: ${formData.tipo}
Nicho: ${formData.nicho}
Objetivo: ${formData.objetivo}
Tipo: ${isPremium ? "Premium" : "Gratuito"}

DIAGNÓSTICO
----------------------------------------
${cleanText}

----------------------------------------
Gerado por Instarrumado
instarrumado.vercel.app
========================================
`.trim();
};

export const downloadReport = (options: ExportOptions) => {
  const content = generateTextReport(options);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `instarrumado-${options.formData.instagram}-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

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

const cleanDiagnostico = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\*\s*/gm, "- ")
    .replace(/^#+\s*/gm, "")
    .trim();
};

export const generateTextReport = ({ diagnostico, formData, isPremium }: ExportOptions): string => {
  const cleanText = cleanDiagnostico(diagnostico);

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

export const downloadPdfReport = (options: ExportOptions) => {
  const { diagnostico, formData, isPremium } = options;
  const cleanText = cleanDiagnostico(diagnostico);
  const sections = cleanText.split("\n").filter((p) => p.trim());

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Instarrumado - Relatório @${formData.instagram}</title>
  <style>
    @page { margin: 20mm 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a2e;
      line-height: 1.6;
      padding: 0;
      background: #fff;
    }
    .header {
      background: linear-gradient(135deg, #833ab4, #e1306c);
      color: white;
      padding: 30px 40px;
      border-radius: 0;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      margin-top: 8px;
    }
    .content { padding: 30px 40px; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 30px;
    }
    .info-item {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .info-item label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .info-item p { font-size: 15px; color: #1a1a2e; margin-top: 2px; font-weight: 500; }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e1306c;
    }
    .diagnostico-text p {
      margin-bottom: 12px;
      color: #374151;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 20px 40px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 30px;
    }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Instarrumado</h1>
    <p>Relatório de Diagnóstico — @${formData.instagram}</p>
    <div class="badge">${isPremium ? "Premium" : "Gratuito"}  •  ${formatDate()}</div>
  </div>

  <div class="content">
    <div class="section-title">📋 Dados do Perfil</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Instagram</label>
        <p>@${formData.instagram}</p>
      </div>
      <div class="info-item">
        <label>Tipo</label>
        <p>${formData.tipo}</p>
      </div>
      <div class="info-item">
        <label>Nicho</label>
        <p>${formData.nicho}</p>
      </div>
      <div class="info-item">
        <label>Objetivo</label>
        <p>${formData.objetivo}</p>
      </div>
    </div>

    <div class="section-title">🔍 Diagnóstico</div>
    <div class="diagnostico-text">
      ${sections.map((p) => `<p>${p}</p>`).join("")}
    </div>
  </div>

  <div class="footer">
    <p>Gerado por Instarrumado • instarrumado.com.br</p>
    <p style="margin-top:4px;">Este relatório foi gerado automaticamente por inteligência artificial.</p>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `instarrumado-${formData.instagram}-${new Date().toISOString().split("T")[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

import { useState } from "react";
import { Search, AtSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormData } from "@/pages/AcessoPremium";

interface DiagnosticoFormPremiumProps {
  onSubmit: (data: FormData) => void;
}

const DiagnosticoFormPremium = ({ onSubmit }: DiagnosticoFormPremiumProps) => {
  const [instagram, setInstagram] = useState("");
  const [tipo, setTipo] = useState("");
  const [nicho, setNicho] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instagram && tipo && nicho && objetivo) {
      onSubmit({ instagram, tipo, nicho, objetivo });
    }
  };

  const isFormValid = instagram && tipo && nicho && objetivo;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-xl">
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-2xl space-y-6">
          {/* Premium badge */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-instagram-pink/20 via-instagram-purple/20 to-instagram-orange/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-instagram-pink" />
            <span className="text-sm font-medium gradient-text">Diagnóstico Premium</span>
          </div>

          {/* Instagram handle */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-foreground flex items-center gap-2">
              <AtSign className="h-4 w-4 text-instagram-pink" />
              Seu Instagram
            </Label>
            <Input
              id="instagram"
              type="text"
              placeholder="@seuusuario"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value.replace(/^@/, ''))}
              className="bg-background/50 border-border/50 focus:border-instagram-pink h-12"
              required
            />
          </div>

          {/* Tipo de perfil */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-foreground">
              Quem é você?
            </Label>
            <Select value={tipo} onValueChange={setTipo} required>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-instagram-pink h-12">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="criador">Criador de Conteúdo</SelectItem>
                <SelectItem value="empreendedor">Empreendedor</SelectItem>
                <SelectItem value="profissional">Profissional Liberal</SelectItem>
                <SelectItem value="politico">Político</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nicho */}
          <div className="space-y-2">
            <Label htmlFor="nicho" className="text-foreground">
              Seu Nicho
            </Label>
            <Input
              id="nicho"
              type="text"
              placeholder="Ex: Estética, Política, Direito, Marketing"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-instagram-pink h-12"
              required
            />
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="objetivo" className="text-foreground">
              Maior objetivo com o Instagram
            </Label>
            <Input
              id="objetivo"
              type="text"
              placeholder="Ex: vender mentoria, gerar autoridade, ganhar eleições"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-instagram-pink h-12"
              required
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-14 text-lg font-semibold btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="mr-2 h-5 w-5" />
            Gerar Diagnóstico Premium
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Como VIP, você tem acesso ao diagnóstico completo com todas as estratégias detalhadas.
          </p>
        </form>
      </div>
    </section>
  );
};

export default DiagnosticoFormPremium;

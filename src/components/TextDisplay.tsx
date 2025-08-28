import { useState } from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface TextDisplayProps {
  text: string;
  fileName: string;
}

export const TextDisplay = ({ text, fileName }: TextDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Texto copiado! ✨",
        description: "O texto foi copiado para sua área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName.replace('.pdf', '') + '.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download iniciado! 💖",
      description: "Seu arquivo de texto está sendo baixado.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <h2 className="text-xl font-serif font-semibold text-foreground">
          Texto Extraído ✨
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-rose-light bg-white/50 hover:bg-rose-light transition-all duration-300"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-gradient-primary shadow-soft hover:shadow-elegant transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download TXT
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-card shadow-elegant">
        <div className="p-6">
          <Textarea
            value={text}
            readOnly
            className="min-h-[400px] resize-none bg-white/70 border-rose-light focus:border-primary transition-all duration-300"
            placeholder="O texto extraído aparecerá aqui..."
          />
        </div>
      </Card>
    </div>
  );
};
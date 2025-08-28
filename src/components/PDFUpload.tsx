import { useState, useCallback } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import flowersDecoration from '@/assets/flowers-decoration.png';

interface PDFUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
}

export const PDFUpload = ({ onTextExtracted }: PDFUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      processPDF(pdfFile);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive"
      });
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      processPDF(file);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive"
      });
    }
  }, []);

  const processPDF = async (file: File) => {
    setIsProcessing(true);
    
    // Simulação do processamento do PDF
    // Em uma implementação real, você usaria uma biblioteca como pdf-lib ou pdf2pic
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockText = `Este é um exemplo de texto extraído do arquivo "${file.name}".

Em uma implementação real, o texto seria extraído do PDF usando bibliotecas como:
- pdf-lib
- pdf2pic
- pdf-parse

O texto extraído apareceria aqui com toda a formatação preservada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

      onTextExtracted(mockText, file.name);
      
      toast({
        title: "PDF convertido com sucesso! ✨",
        description: "Seu texto está pronto para visualização e download.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar PDF",
        description: "Ocorreu um erro durante a conversão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-card shadow-elegant transition-all duration-300 ${
      isDragOver ? 'shadow-glow scale-[1.02]' : ''
    }`}>
      <div
        className="relative p-8 text-center border-2 border-dashed border-rose-light rounded-lg transition-colors duration-300"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img 
          src={flowersDecoration} 
          alt="Decoração floral" 
          className="absolute top-2 right-2 w-16 h-16 opacity-30"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-2">
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Processando seu PDF... ✨
                </h3>
                <p className="text-sm text-muted-foreground">
                  Extraindo o texto com cuidado especial
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
                {isDragOver ? (
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Arraste seu PDF aqui ou clique para selecionar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Suportamos apenas arquivos PDF
                </p>
              </div>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              
              <Button 
                variant="default" 
                onClick={() => document.getElementById('pdf-upload')?.click()}
                className="bg-gradient-primary border-0 shadow-soft hover:shadow-elegant transition-all duration-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Selecionar PDF
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
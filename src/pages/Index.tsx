import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { PDFUpload } from '@/components/PDFUpload';
import { TextDisplay } from '@/components/TextDisplay';
import flowersDecoration from '@/assets/flowers-decoration.png';

const Index = () => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleTextExtracted = (text: string, name: string) => {
    setExtractedText(text);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 relative">
          <img 
            src={flowersDecoration} 
            alt="Decoração floral" 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-32 h-24 opacity-20"
          />
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              PDF para Texto
              <Sparkles className="inline-block w-8 h-8 ml-2 text-primary animate-pulse" />
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Converta seus arquivos PDF em texto de forma elegante e gratuita. 
              Uma ferramenta delicada e feminina para suas necessidades de conversão.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <section>
            <PDFUpload onTextExtracted={handleTextExtracted} />
          </section>

          {/* Results Section */}
          {extractedText && (
            <section className="animate-in slide-in-from-bottom-4 duration-500">
              <TextDisplay text={extractedText} fileName={fileName} />
            </section>
          )}

          {/* Features Section */}
          {!extractedText && (
            <section className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="text-center p-6 rounded-lg bg-white/50 shadow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Interface Delicada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Design feminino e elegante para uma experiência suave
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white/50 shadow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Conversão Rápida
                </h3>
                <p className="text-sm text-muted-foreground">
                  Processe seus PDFs rapidamente e com qualidade
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-white/50 shadow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Totalmente Gratuito
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use quantas vezes quiser, sem custos ou limites
                </p>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-rose-light">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-current" /> para você
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
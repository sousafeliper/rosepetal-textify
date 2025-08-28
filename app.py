import os
from flask import Flask, render_template, request, send_file
import fitz  # PyMuPDF
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import io

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Opcional: Especifique o caminho para o executável do Tesseract-OCR se não estiver no PATH do sistema
# Por exemplo, no Windows:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf(pdf_path):
    """
    Extrai texto de um arquivo PDF. Tenta a extração direta primeiro e,
    se o texto for insuficiente, aplica OCR.
    """
    full_text = ""
    try:
        # Tenta extrair texto diretamente com PyMuPDF
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            full_text += page.get_text()
        doc.close()

        # Se o texto extraído for muito curto, tenta o OCR
        if len(full_text.strip()) < 100:
            full_text = ocr_from_pdf(pdf_path)

    except Exception as e:
        print(f"Erro ao processar o PDF: {e}")
        # Se a extração direta falhar, tenta o OCR como alternativa
        try:
            full_text = ocr_from_pdf(pdf_path)
        except Exception as ocr_error:
            print(f"Erro no OCR: {ocr_error}")
            return "Erro ao extrair texto do PDF. O arquivo pode estar corrompido ou em um formato não suportado."

    return full_text

def ocr_from_pdf(pdf_path):
    """
    Converte as páginas do PDF em imagens e aplica OCR para extrair o texto.
    """
    text = ""
    try:
        images = convert_from_path(pdf_path)
        for i, image in enumerate(images):
            # Salva a imagem temporariamente para o Tesseract processar
            temp_image_path = f"temp_page_{i}.png"
            image.save(temp_image_path, 'PNG')
            text += pytesseract.image_to_string(Image.open(temp_image_path), lang='por+eng') # Adicione os idiomas que precisar
            os.remove(temp_image_path) # Remove o arquivo de imagem temporário
    except Exception as e:
        raise e
    return text

@app.route('/', methods=['GET', 'POST'])
def index():
    extracted_text = ""
    if request.method == 'POST':
        if 'pdf_file' not in request.files:
            return render_template('index.html', error="Nenhum arquivo enviado.")
        
        file = request.files['pdf_file']
        
        if file.filename == '':
            return render_template('index.html', error="Nenhum arquivo selecionado.")
        
        if file and file.filename.endswith('.pdf'):
            filename = file.filename
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(pdf_path)
            
            extracted_text = extract_text_from_pdf(pdf_path)

            # Salva o texto extraído em um arquivo de texto para download
            text_filename = os.path.splitext(filename)[0] + '.txt'
            text_filepath = os.path.join(app.config['UPLOAD_FOLDER'], text_filename)
            with open(text_filepath, 'w', encoding='utf-8') as text_file:
                text_file.write(extracted_text)
                
            return render_template('index.html', extracted_text=extracted_text, text_filename=text_filename)

    return render_template('index.html')

@app.route('/download/<filename>')
def download_file(filename):
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)

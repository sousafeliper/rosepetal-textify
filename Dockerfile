# Usa uma imagem base do Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Atualiza os pacotes do sistema e instala Tesseract, Poppler e Git
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-por \
    poppler-utils \
    git \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copia o arquivo de dependências do Python
COPY requirements.txt .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o resto do código do projeto para o container
COPY . .

# Expõe a porta que o Gunicorn vai usar
EXPOSE 10000

# Comando para iniciar a aplicação quando o container rodar
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:10000", "app:app"]

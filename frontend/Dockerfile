# Usa a imagem oficial do Node.js versão 20
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código fonte
COPY . .

# Faz o build de produção do Angular
RUN npm run build

# Instala servidor web simples para servir os arquivos
RUN npm install -g http-server

# Expõe a porta
EXPOSE 4200

# Comando para servir os arquivos de produção
CMD ["http-server", "dist/case-itau-angular/browser", "-p", "4200", "-a", "0.0.0.0"] 
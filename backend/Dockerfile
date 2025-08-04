# Usa a imagem oficial do Node.js versão 20
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies para build)
RUN npm ci

# Copia todo o código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"] 
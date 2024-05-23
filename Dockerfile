# Use uma imagem oficial do Node.js como base
FROM node:14

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale todas as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Construa o aplicativo React
RUN npm run build

# Exponha a porta que o aplicativo usará
EXPOSE 3000

# Defina o comando para executar o aplicativo
CMD [ "npm", "start-server" ]

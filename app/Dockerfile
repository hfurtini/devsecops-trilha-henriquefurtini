FROM node:22-alpine

WORKDIR /app

# só as dependências, usando o lockfile
# depois remove o npm da imagem final
# npm embutido costuma trazer dependências com CVE's
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY . .

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]
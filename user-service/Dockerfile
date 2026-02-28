FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]
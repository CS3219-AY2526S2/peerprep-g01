FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# Install all dependencies including devDependencies for nodemon
RUN pnpm install

COPY . .

EXPOSE 3004

# Run the dev script instead of direct node
CMD ["pnpm", "run", "dev"]

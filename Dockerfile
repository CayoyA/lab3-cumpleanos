FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./

RUN npm install --no-audit --progress=false


FROM node:20-slim
WORKDIR /app
COPY package.json app.js ./

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000
CMD ["node", "app.js"]
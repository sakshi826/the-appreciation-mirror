FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies needed for both frontend & backend build
COPY package*.json ./
RUN npm ci

COPY . .

# Build the Vite frontend application
RUN npm run build

# Compile TypeScript backend
RUN npm run build:server

FROM node:22-alpine AS runner

WORKDIR /app

# Only copy over the production assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./server
COPY --from=builder /app/database ./database
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 8080

CMD ["node", "server/index.js"]

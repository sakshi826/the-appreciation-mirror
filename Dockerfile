FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Create the subdirectory and copy build files into it
RUN mkdir -p /usr/share/nginx/html/the-appreciation-mirror
COPY --from=builder /app/dist /usr/share/nginx/html/the-appreciation-mirror

RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

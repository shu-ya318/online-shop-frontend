# ===== Stage 1:  Build the app =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files to leverage Docker cache
COPY package*.json ./

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# Build the application for production
RUN npm run build

# ===== Stage 2: Serve the app with Nginx =====
FROM nginx:stable-alpine AS production

LABEL maintainer="ShuYaHsieh <shuyahsieh318@gmail.com>" \
      version="1.0.0" \
      description="Online Shop Frontend deployment with Nginx"

# Copy built assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

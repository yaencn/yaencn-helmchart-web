### Frontend multi-stage build for production
FROM node:20-alpine AS build-stage
WORKDIR /app

# Allow build args to set Vite env variables
ARG VITE_BACKEND_URL
ARG VITE_CHARTS_BASE

# Write optional env file for Vite build
RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL:-/api}" > .env.production || true
RUN echo "VITE_CHARTS_BASE=${VITE_CHARTS_BASE:-/charts}" >> .env.production || true

#COPY package*.json ./
#RUN npm ci --silent
COPY . .
RUN apk add --no-cache make g++ python3 && npm install --silent && npm run build

# Production image serving with nginx
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy nginx config from build context (ensure frontend/nginx.conf exists)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

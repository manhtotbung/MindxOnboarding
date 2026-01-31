# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use install instead of ci for flexibility)
RUN npm install --legacy-peer-deps

# Copy source code and config
COPY . .

# Build Arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_OPENID_REDIRECT_URI
ENV VITE_OPENID_REDIRECT_URI=$VITE_OPENID_REDIRECT_URI
ARG VITE_OPENID_CLIENT_ID
ENV VITE_OPENID_CLIENT_ID=$VITE_OPENID_CLIENT_ID
ARG VITE_OPENID_ISSUER
ENV VITE_OPENID_ISSUER=$VITE_OPENID_ISSUER

# Build production bundle
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

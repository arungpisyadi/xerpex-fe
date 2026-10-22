# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Vite inlines VITE_* variables at build time, so they must be build args.
ARG VITE_API_BASE_URL
ARG VITE_PACKAGE_CATEGORIES
ARG VITE_PACKAGE_TYPES
ARG VITE_FORMKIT_PRO_KEY
ARG VITE_WA_SALES_ADMIN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_PACKAGE_CATEGORIES=$VITE_PACKAGE_CATEGORIES \
    VITE_PACKAGE_TYPES=$VITE_PACKAGE_TYPES \
    VITE_FORMKIT_PRO_KEY=$VITE_FORMKIT_PRO_KEY \
    VITE_WA_SALES_ADMIN=$VITE_WA_SALES_ADMIN

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build-only

# ---- Runtime stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

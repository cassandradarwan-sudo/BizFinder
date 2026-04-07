# Stage 1: Build
FROM node:20-alpine AS build

# Set build directory
WORKDIR /opt/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /opt/app

# Set environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts and public assets
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/.strapi ./.strapi

# Expose port
EXPOSE 1337

# Run Strapi
CMD ["npm", "run", "start"]

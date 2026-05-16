# Use Node.js 20 base image
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-slim

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port (Cloud Run sets PORT env var, but we use 3000)
EXPOSE 3000

# Start command
CMD ["npm", "start"]

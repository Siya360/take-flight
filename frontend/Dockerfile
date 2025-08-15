FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lockb ./

# Install dependencies (prefer bun if available, fallback to npm)
RUN which bun > /dev/null 2>&1 && bun install || npm ci

# Copy source code
COPY . .

# Build the app
RUN which bun > /dev/null 2>&1 && bun run build || npm run build

# Expose port
EXPOSE 3000

# Start the app in preview mode (serves built files)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

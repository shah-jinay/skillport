# Use Debian slim to avoid the Rollup-on-Alpine issue
FROM node:20-bookworm-slim

WORKDIR /app

# Install deps with a clean, reproducible install
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 5173
CMD ["npm","run","dev","--","--host"]

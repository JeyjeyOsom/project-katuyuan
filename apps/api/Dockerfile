FROM node:20-slim
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Copy all package.jsons (to cache the install layer)
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/ts-config/package.json ./packages/ts-config/

# 3. Install dependencies
RUN pnpm install --frozen-lockfile

# 4. Copy the entire source
COPY . .

# 5. Build the specific app using filter
# This ensures pnpm knows it's part of the workspace
RUN pnpm --filter api build

EXPOSE 3001

# Start the app
CMD ["node", "apps/api/dist/app.js"]
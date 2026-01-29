FROM node:20-slim
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./

# 2. Copy all package.jsons
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/ts-config/package.json ./packages/ts-config/

# 3. Install ALL dependencies (including devDependencies needed for build)
# We remove --frozen-lockfile temporarily to ensure links are created
RUN pnpm install

# 4. Copy the rest of the source
COPY . .

# 5. Build
# Using the root pnpm to run the build for the sub-app
RUN pnpm --filter web build

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
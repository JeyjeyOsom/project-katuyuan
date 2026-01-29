FROM node:20-slim
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/ts-config/package.json ./packages/ts-config/

RUN pnpm install --frozen-lockfile

COPY . .

# Expose the Hardhat RPC port
EXPOSE 8545

# Start the local blockchain node
CMD ["pnpm", "--filter", "contracts", "hardhat", "node", "--hostname", "0.0.0.0"]
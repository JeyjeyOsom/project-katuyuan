import { createPublicClient, http } from 'viem';
import { hardhat } from 'viem/chains';

// This URL changes depending on if you are inside Docker or running locally
// Local: http://127.0.0.1:8545
// Docker: http://hardhat:8545 (using the service name)
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(RPC_URL),
});
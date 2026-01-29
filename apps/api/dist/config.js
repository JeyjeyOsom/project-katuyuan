import { createPublicClient, http } from 'viem';
import { hardhat } from 'viem/chains';
import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT || 3001;
// Initialize Viem Client (The connection to Ethereum)
export const publicClient = createPublicClient({
    // chain: sepolia,
    // Using Sepolia testnet
    // transport: http(process.env.RPC_URL || 'https://rpc.sepolia.org') ,
    chain: hardhat,
    // Use the RPC_URL from environment, or default to localhost for non-docker dev
    transport: http(process.env.RPC_URL || 'http://127.0.0.1:8545')
});
//# sourceMappingURL=config.js.map
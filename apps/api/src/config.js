import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT || 3001;
// Initialize Viem Client (The connection to Ethereum)
export const publicClient = createPublicClient({
    chain: sepolia, // Using Sepolia testnet
    transport: http(process.env.RPC_URL || 'https://rpc.sepolia.org')
});

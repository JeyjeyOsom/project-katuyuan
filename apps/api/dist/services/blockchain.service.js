import { formatEther } from 'viem';
import { publicClient } from '../config.js';
// Simple in-memory cache object (simulating Redis)
const cache = {
    data: {},
    expiry: {}
};
// Add the contract ABI (just the balance function)
const TOKEN_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'balance', type: 'uint256' }],
    },
    {
        name: 'symbol',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
    }
];
const CONTRACT_ADDRESS = '0x325f5662ef6bc49ba9726d1318a8aad8d093a310'; // Paste from Tier 3
export class BlockchainService {
    // Helper to get/set cache
    getCache(key) {
        if (cache.expiry[key] && cache.expiry[key] > Date.now()) {
            return cache.data[key];
        }
        return null;
    }
    setCache(key, data, ttlSeconds) {
        cache.data[key] = data;
        cache.expiry[key] = Date.now() + (ttlSeconds * 1000);
    }
    // 1. Get General Network Stats (Cached for 15 seconds)
    async getNetworkStats() {
        const cacheKey = 'network_stats';
        const cached = this.getCache(cacheKey);
        if (cached)
            return cached;
        const [gasPrice, blockNumber] = await Promise.all([
            publicClient.getGasPrice(),
            publicClient.getBlockNumber()
        ]);
        const stats = {
            gasPriceWei: gasPrice.toString(),
            gasPriceGwei: formatEther(gasPrice * BigInt(1000000000)), // Rough conversion
            blockNumber: blockNumber.toString()
        };
        this.setCache(cacheKey, stats, 15); // Cache for 15s
        return stats;
    }
    async getTokenData(address) {
        const [balance, symbol] = await Promise.all([
            publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: TOKEN_ABI,
                functionName: 'balanceOf',
                args: [address],
                authorizationList: undefined
            }),
            publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: TOKEN_ABI,
                functionName: 'symbol',
                authorizationList: undefined
            })
        ]);
        return {
            balance: formatEther(balance),
            symbol: symbol
        };
    }
    // 2. Get Account Details
    async getAccountDetails(address) {
        // Validate address format
        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum Address');
        }
        const balance = await publicClient.getBalance({
            address: address
        });
        return {
            address,
            balanceWei: balance.toString(),
            balanceEther: formatEther(balance)
        };
    }
}
//# sourceMappingURL=blockchain.service.js.map
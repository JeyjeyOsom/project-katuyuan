import { formatEther } from 'viem';
import { publicClient } from '../config.js';
// Simple in-memory cache object (simulating Redis)
const cache = {
    data: {},
    expiry: {}
};
// 1. Updated ABI to match a Counter contract
const COUNTER_ABI = [
    {
        name: 'number', // Change this to 'getCount' if that's what's in your .sol
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    }
];
const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Paste from Tier 3
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
    // 2. Fetch the actual Counter value
    async getCounterValue() {
        const cacheKey = 'counter_value';
        const cached = this.getCache(cacheKey);
        if (cached)
            return cached;
        try {
            const count = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: COUNTER_ABI,
                functionName: 'number', // Matches the ABI above
            });
            const result = { count: count.toString() };
            this.setCache(cacheKey, result, 5); // Cache for 5s (counters change fast!)
            return result;
        }
        catch (error) {
            console.error("Failed to read contract:", error);
            throw new Error("Contract read failed");
        }
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
                abi: COUNTER_ABI,
                functionName: 'number',
                authorizationList: undefined
            }),
            publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: COUNTER_ABI,
                functionName: 'number',
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
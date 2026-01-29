'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'viem' // Utility to convert Wei to ETH

// 1. Define the shape of an Etherscan transaction
interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timeStamp: string
  isError: string
}

interface TransactionListProps {
  address?: string
}

export function TransactionList({ address }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2. Fetch logic
  useEffect(() => {
    // Don't fetch if no address or if it's invalid
    if (!address || !address.startsWith('0x')) return

    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // ⚠️ NOTE: In Tier 2, we will move this API Key to the Backend to hide it.
        const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
        
        const response = await fetch(
          `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`
        )

        const data = await response.json()

        if (data.status === '1') {
          setTransactions(data.result)
        } else if (data.message === 'No transactions found') {
          setTransactions([])
        } else {
          throw new Error(data.result || 'Failed to fetch transactions')
        }
      } catch (err) {
        console.error(err)
        setError('Could not load transaction history.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [address])

  // 3. Render States
  if (!address) return null 
  
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📜</span> Transaction History (Sepolia)
      </h3>

      {isLoading && <p className="text-gray-500 animate-pulse">Loading on-chain data...</p>}
      
      {error && <p className="text-red-500 bg-red-50 p-2 rounded">{error}</p>}

      {!isLoading && !error && transactions.length === 0 && (
        <p className="text-gray-500">No transactions found for this address.</p>
      )}

      {/* 4. Transaction List */}
      <div className="space-y-3">
        {transactions.map((tx) => {
          const isIncoming = tx.to.toLowerCase() === address.toLowerCase()
          
          return (
            <div 
              key={tx.hash} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono text-sm"
                >
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                </a>
                <span className="text-xs text-gray-400">
                  {new Date(Number(tx.timeStamp) * 1000).toLocaleDateString()}
                </span>
              </div>

              <div className={`text-right ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-bold">
                  {isIncoming ? '+' : '-'} {Number(formatEther(BigInt(tx.value))).toFixed(4)} ETH
                </span>
                <div className="text-xs text-gray-400 uppercase">
                  {isIncoming ? 'Received' : 'Sent'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
'use client'

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'

const ABI = [{
  name: 'mint',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [{ name: 'amount', type: 'uint256' }],
  outputs: [],
}] as const

export function MintToken() {
  const { address } = useAccount()
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const handleMint = () => {
    writeContract({
      address: '0x325f5662ef6bc49ba9726d1318a8aad8d093a310', // From Tier 3
      abi: ABI,
      functionName: 'mint',
      args: [parseEther('10')], // Mint 10 tokens
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-bold mb-2">Mint M-REPO Tokens</h3>
      <button 
        disabled={isPending || isConfirming || !address}
        onClick={handleMint}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Minting...' : 'Mint 10 Tokens'}
      </button>

      {isSuccess && <p className="text-green-600 mt-2">Tokens Minted! Hash: {hash?.slice(0, 10)}...</p>}
      {error && <p className="text-red-500 mt-2">Error: {error.message.split('\n')[0]}</p>}
    </div>
  )
}
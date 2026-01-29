'use client'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { useIsMounted } from '../hooks/useIsMounted'

export function WalletProfile() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const isMounted = useIsMounted()
    if (!isMounted) return null

  if (isConnected) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-gray-500">Connected to:</p>
        <p className="font-mono font-bold">{address}</p>
        <p className="mt-2 text-xl">
          Balance: <span className="text-blue-600">{balance ? formatUnits(balance.value, balance.decimals) : '0'} {balance?.symbol}</span>
        </p>
        <button 
          onClick={() => disconnect()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Connect {connector.name}
        </button>
      ))}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}
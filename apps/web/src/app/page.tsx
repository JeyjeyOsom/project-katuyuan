'use client'

import { useAccount } from 'wagmi'
import { WalletProfile } from '../components/WalletProfile'
import { TransactionList } from '../components/TransactionList'

export default function Home() {
  // Get the current connected address
  const { address } = useAccount()

  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Web3 Dashboard</h1>
      
      <WalletProfile />
      
      {/* Only show list if we have an address */}
      {address && <TransactionList address={address} />}
    </main>
  )
}
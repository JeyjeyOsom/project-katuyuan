import { Request, Response } from 'express'
import { BlockchainService } from '../services/blockchain.service.js'

const blockchainService = new BlockchainService()

export const getAccountInfo = async (req: Request, res: Response) => {
  try {
    const { address: addressParam } = req.params
    const address = Array.isArray(addressParam) ? addressParam[0] : addressParam

    // Fetch data in parallel
    const [networkStats, accountData] = await Promise.all([
      blockchainService.getNetworkStats(),
      blockchainService.getAccountDetails(address)
    ])

    // Combine response
    res.json({
      success: true,
      data: {
        network: networkStats,
        account: accountData
      }
    })

  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    })
  }
}
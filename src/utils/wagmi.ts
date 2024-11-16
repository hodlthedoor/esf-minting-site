'use client'

import { useAccount, useChainId } from 'wagmi'
import { config } from '@/app/config'

/**
 * Hook to check if we're on the correct network and get relevant chain IDs
 * @returns object with correctChainId and isCorrectNetwork values
 */
export const useNetworkStatus = () => {
  const { chainId } = useAccount()
  const correctChainId = config.chains[0].id
  
  return {
    correctChainId,
    isCorrectNetwork: chainId === correctChainId
  }
}
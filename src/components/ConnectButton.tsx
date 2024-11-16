'use client'

import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi'
import { switchChain } from '@wagmi/core'
import { injected, walletConnect } from 'wagmi/connectors'
import { useState } from 'react'
import { config } from '@/app/config'
import { useNetworkStatus } from '@/utils/wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { correctChainId, isCorrectNetwork } = useNetworkStatus()
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? '' })

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleConnect = async (connector: 'injected' | 'walletConnect') => {
    setIsDropdownOpen(false)
    try {
      if (connector === 'injected') {
        connect({ connector: injected() })
      } else if (connector === 'walletConnect') {
        connect({ connector: walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        })})
      }
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  const handleNetworkSwitch = () => {
    switchChain(config, { chainId: correctChainId })
  }

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={isCorrectNetwork ? handleDisconnect : handleNetworkSwitch}
          className={`flex items-center px-4 py-2 space-x-2 text-base text-white rounded-lg transition-colors ${
            isCorrectNetwork 
              ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 border border-green-400/50'
              : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-400/50'
          }`}
        >
          {isCorrectNetwork ? (
            <>
              {ensAvatar && (
                <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={ensAvatar} 
                    alt="ENS Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              {!ensAvatar && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex-shrink-0" />
              )}
              <span className="truncate max-w-xs">
                {ensName || formatAddress(address || '')}
              </span>
              <span className="flex-shrink-0">×</span>
            </>
          ) : (
            <span>Switch to Ethereum</span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 rounded-lg transition-colors border border-green-400/50 shadow-lg shadow-cyan-500/20"
      >
        Connect Wallet
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/30 backdrop-blur-md rounded-lg shadow-lg shadow-cyan-500/20 border border-cyan-500/20 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleConnect('injected')}
              className="block w-full px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 text-left transition-colors"
              role="menuitem"
            >
              MetaMask
            </button>
            <button
              onClick={() => handleConnect('walletConnect')}
              className="block w-full px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 text-left transition-colors"
              role="menuitem"
            >
              WalletConnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
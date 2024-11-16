// app/page.tsx
'use client'

import { useState } from 'react'
import { ConnectButton } from '@/components/ConnectButton'
import { Search, type SearchResult } from '@/components/Search'
import { MintButton } from '@/components/MintButton'
import { useAccount } from 'wagmi'

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult>()
  const { isConnected } = useAccount()

  const handleSearch = (result: SearchResult) => {
    console.log('Searching for:', result.fullDomain)
    setSearchResult(result)
  }

  const handleMintSuccess = (txHash: `0x${string}`) => {
    console.log('Mint successful:', txHash)
    // You could add a toast notification here
    // Or reset the search
    setSearchResult(undefined)
  }

  const handleMintError = (error: Error) => {
    console.error('Mint failed:', error)
    // You could add an error toast notification here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Connect Button */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">digijoint.eth</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Search for your digijoint.eth subdomain
            </p>
            
            {/* Search Component */}
            <Search 
              onSearch={handleSearch}
              placeholder="Search by label"
              className="max-w-2xl mx-auto"
            />
          </div>

          {/* Results Section with Mint Button */}
          {searchResult && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Domain Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchResult.fullDomain}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${searchResult.exists 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                      }`}>
                      {searchResult.exists ? 'Taken' : 'Available'}
                    </span>
                  </div>
                </div>

                {/* Show Mint Button only if domain doesn't exist and wallet is connected */}
                {!searchResult.exists && (
                  <div className="pt-4 border-t border-gray-200">
                    {isConnected ? (
                      <MintButton
                        searchResult={searchResult}
                        onMintSuccess={handleMintSuccess}
                        onMintError={handleMintError}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Connect your wallet to mint this domain
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
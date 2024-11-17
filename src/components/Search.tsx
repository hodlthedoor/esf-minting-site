// components/Search.tsx
'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useReadContract } from 'wagmi'
import { Address, zeroAddress, namehash } from 'viem'
import { abi } from '@/abis/esf'

export interface SearchResult {
  term: string
  exists: boolean
  fullDomain: string
  namehash: `0x${string}`
  domainData: bigint | undefined
}

export interface SearchProps {
  onSearch?: (result: SearchResult) => void
  placeholder?: string
  className?: string
}

export function Search({ 
  onSearch, 
  placeholder = "Search...",
  className = "" 
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 500)

    console.log('fqdn:', `${debouncedTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Contract read hook with proper typing
  const { data: domainData, isError } = useReadContract({
    address: process.env.NEXT_PUBLIC_ESF_ADDRESS as Address || zeroAddress,
    abi,
    functionName: 'HashToIdMap',
    args: debouncedTerm ? [
      namehash(`${debouncedTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`)
    ] : undefined,
    
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    // Only allow letters, numbers, and hyphens
    const sanitizedValue = value.replace(/[^a-z0-9-]/g, '')
    setSearchTerm(sanitizedValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const exists = domainData !== undefined && domainData !== BigInt(0)
      const fullDomain = `${searchTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`
      
      onSearch?.({
        term: searchTerm,
        exists,
        fullDomain,
        namehash: namehash(fullDomain),
        domainData,
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  // Get validation state
  const isValidDomain = (searchTerm != "") && !isError && domainData !== undefined
  const domainExists = isValidDomain && domainData !== BigInt(0)

  return (
    <div className="flex w-full max-w-3xl flex-col items-center mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`flex w-full items-center gap-2 ${className}`}
      >
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isLoading}
            pattern="[a-z0-9-]*"
            className={`w-full px-4 py-3 pr-12 text-gray-900 border rounded-xl 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     placeholder:text-gray-400 bg-white shadow-sm
                     disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                     transition duration-200 ease-in-out
                     ${isValidDomain 
                       ? domainExists 
                         ? 'border-red-500 focus:ring-red-500' 
                         : 'border-green-500 focus:ring-green-500'
                       : 'border-gray-200 focus:ring-blue-500'
                     }`}
          />
          {searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isValidDomain && (
                <span className={`h-2 w-2 rounded-full ${domainExists ? 'bg-red-500' : 'bg-green-500'}`} />
              )}
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!searchTerm || !isValidDomain || isLoading || domainExists}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium 
                   rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200 ease-in-out shadow-sm"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>
      </form>
      {domainExists && searchTerm && (
        <p className="mt-2 text-sm text-red-500">
          This domain is already taken
        </p>
      )}
    </div>
  )
}
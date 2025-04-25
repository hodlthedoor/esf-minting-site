// components/Search.tsx
"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useReadContract } from "wagmi";
import { Address, zeroAddress, namehash } from "viem";
import { abi } from "@/abis/esf";

export interface SearchResult {
  term: string;
  exists: boolean;
  fullDomain: string;
  namehash: `0x${string}`;
  domainData: bigint | undefined;
}

export interface SearchProps {
  onSearch?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function Search({
  onSearch,
  placeholder = "Search...",
  className = "",
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [domainHash, setDomainHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [canProceedAnyway, setCanProceedAnyway] = useState(false);
  const [proceedTimeout, setProceedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset proceed state when search term changes
  useEffect(() => {
    setCanProceedAnyway(false);
    if (proceedTimeout) {
      clearTimeout(proceedTimeout);
      setProceedTimeout(null);
    }
  }, [searchTerm, proceedTimeout]);

  // Calculate the domain hash when the search term changes
  useEffect(() => {
    if (debouncedTerm) {
      const fullDomain = `${debouncedTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`;
      const hash = namehash(fullDomain);
      setDomainHash(hash);
    } else {
      setDomainHash(undefined);
    }
  }, [debouncedTerm]);

  // Contract read hook with proper typing
  const {
    data: domainData,
    isError,
    isLoading: isContractLoading,
    error,
  } = useReadContract({
    address: (process.env.NEXT_PUBLIC_ESF_ADDRESS as Address) || zeroAddress,
    abi,
    functionName: "HashToIdMap",
    args: domainHash ? [domainHash] : undefined,
  });

  // Set a timer to allow proceeding anyway after a contract error
  useEffect(() => {
    if (isError && domainHash && !canProceedAnyway) {
      const timer = setTimeout(() => {
        setCanProceedAnyway(true);
      }, 5000); // After 5 seconds, allow proceeding

      setProceedTimeout(timer);
      return () => clearTimeout(timer);
    }
  }, [isError, domainHash, canProceedAnyway]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    // Only allow letters, numbers, and hyphens
    const sanitizedValue = value.replace(/[^a-z0-9-]/g, "");
    setSearchTerm(sanitizedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const exists = domainData !== undefined && domainData !== BigInt(0);
      const fullDomain = `${searchTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`;

      onSearch?.({
        term: searchTerm,
        exists,
        fullDomain,
        namehash: domainHash || "0x0",
        domainData,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (proceedTimeout) {
      clearTimeout(proceedTimeout);
      setProceedTimeout(null);
    }
    setCanProceedAnyway(false);
  };

  // Handle minting even with contract error
  const handleProceedAnyway = () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const fullDomain = `${searchTerm}.${process.env.NEXT_PUBLIC_DOMAIN}`;

      onSearch?.({
        term: searchTerm,
        exists: false, // Assume domain doesn't exist
        fullDomain,
        namehash: domainHash || "0x0",
        domainData: undefined,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const isValidDomain =
    searchTerm !== "" && !isError && domainData !== undefined;
  const domainExists = isValidDomain && domainData !== BigInt(0);

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
            pattern="[a-z0-9\-]*"
            className={`w-full px-4 py-3 pr-12 text-gray-900 border rounded-xl 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     placeholder:text-gray-400 bg-white shadow-sm
                     disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                     transition duration-200 ease-in-out
                     ${
                       isValidDomain
                         ? domainExists
                           ? "border-red-500 focus:ring-red-500"
                           : "border-green-500 focus:ring-green-500"
                         : "border-gray-200 focus:ring-blue-500"
                     }`}
          />
          {searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isValidDomain && (
                <span
                  className={`h-2 w-2 rounded-full ${
                    domainExists ? "bg-red-500" : "bg-green-500"
                  }`}
                />
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
          disabled={
            !searchTerm ||
            (!isValidDomain && !canProceedAnyway) ||
            isLoading ||
            domainExists
          }
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium 
                   rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200 ease-in-out shadow-sm"
        >
          {isLoading || isContractLoading ? (
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

      {!isValidDomain && searchTerm && isContractLoading && (
        <p className="mt-2 text-sm text-gray-500">
          Checking domain availability...
        </p>
      )}

      {isError && searchTerm && !canProceedAnyway && (
        <p className="mt-2 text-sm text-amber-500">
          Error checking domain:{" "}
          {error?.message?.substring(0, 50) || "Unknown error"}...
          <br />
          Waiting to enable mint option...
        </p>
      )}

      {isError && searchTerm && canProceedAnyway && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-amber-500">
            Unable to verify domain availability due to RPC issues. You can try
            minting anyway.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleProceedAnyway}
              className="px-4 py-2 text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-md transition-colors"
            >
              Proceed with Mint Anyway
            </button>
            <button
              onClick={clearSearch}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

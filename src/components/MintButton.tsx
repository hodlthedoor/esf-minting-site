// components/MintButton.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Address,
} from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
  useAccount,
} from "wagmi";
import { ExternalLink } from "lucide-react";
import { abi } from "@/abis/esf";
import { SearchResult } from "./Search";
import { getEtherscanTransactionLink } from "@/utils/etherscan";
import { getLabelId } from "@/utils/ens";

const LABEL_ID = await getLabelId(process.env.NEXT_PUBLIC_DOMAIN as string);

export interface MintButtonProps {
  searchResult?: SearchResult;
  disabled?: boolean;
  className?: string;
  onMintSuccess?: (txHash: `0x${string}`) => void;
  onMintError?: (error: Error) => void;
}

export function MintButton({
  searchResult,
  disabled = false,
  className = "",
  onMintSuccess,
  onMintError,
}: MintButtonProps) {
  const esf = {
    address: process.env.NEXT_PUBLIC_ESF_ADDRESS as Address,
    abi,
  } as const;

  const wrapper = {
    address: process.env.NEXT_PUBLIC_TLD_TOKEN_ADDRESS as Address,
    abi,
  } as const;

  const [mintPrice, setMintPrice] = useState(BigInt(0));

  const { address } = useAccount();

  const { data, error: readError } = useReadContracts({
    contracts: [
      { ...wrapper, functionName: "ownerOf", args: [LABEL_ID] },
      { ...esf, functionName: "DefaultMintPrice", args: [LABEL_ID] },
    ],
    allowFailure: false,
  });

  useEffect(() => {
    if (!readError && data && address) {
      const owner = data[0] as Address;
      const price = data[1] as bigint;
      const calculatedPrice =
        owner.toLowerCase() == address.toLowerCase() ? BigInt(0) : price;

      setMintPrice(calculatedPrice);
    }
  }, [data, readError]);

  const [isWaiting, setIsWaiting] = useState(false);
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isPending || isConfirming || isWaiting;

  const handleMint = async () => {
    if (!searchResult) return;

    setIsWaiting(true);

    try {
      await writeContract({
        ...esf,
        functionName: "registerSubdomain",
        args: [LABEL_ID, searchResult.term, []],
        value: mintPrice,
      });

      if (hash) {
        onMintSuccess?.(hash);
      }
    } catch (error) {
      console.error("Mint error:", error);
      onMintError?.(error as Error);
    } finally {
      setIsWaiting(false);
    }
  };

  // Button states
  const isDisabled =
    disabled || !searchResult || searchResult.exists || isLoading;

  return (
    <div className="space-y-4">
      <button
        onClick={handleMint}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center px-6 py-3 
                   font-medium rounded-xl shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-offset-2
                   transition duration-200 ease-in-out
                   ${
                     isDisabled
                       ? "bg-gray-300 cursor-not-allowed"
                       : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                   }
                   ${className}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>
              {isPending
                ? "Waiting for transaction..."
                : isConfirming
                ? "Confirming..."
                : "Processing..."}
            </span>
          </div>
        ) : (
          <span>Mint Domain</span>
        )}
      </button>

      {hash && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              {isConfirming
                ? "Transaction is being confirmed..."
                : isSuccess
                ? "Transaction confirmed!"
                : "Transaction submitted"}
            </span>
            <a
              href={getEtherscanTransactionLink(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              View on Etherscan
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error: {error.message || "Failed to mint domain"}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { Search, type SearchResult } from "@/components/Search";
import { MintButton } from "@/components/MintButton";
import { useAccount } from "wagmi";
import { useNetworkStatus } from "@/utils/wagmi";
import Image from "next/image";
import digijoint from "@/images/digijoint.png";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const { isConnected } = useAccount();
  const { isCorrectNetwork } = useNetworkStatus();

  const handleSearch = (result: SearchResult) => {
    console.log("Searching for:", result.fullDomain);
    setSearchResult(result);
  };

  const handleMintSuccess = (txHash: `0x${string}`) => {
    console.log("Mint successful:", txHash);
    setSearchResult(undefined);
  };

  const handleMintError = (error: Error) => {
    console.error("Mint failed:", error);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#09090b_15%,#1a103d_30%,#3b1694_70%,#86198f_100%)] relative">
      {/* Animated stars background - fixed positioning and lowest z-index */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.2)_2px,transparent_40px)] bg-[length:50px_50px] opacity-20"></div>
      </div>

      {/* Header with Connect Button - highest z-index */}
      <header className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-cyan-500/10" style={{ zIndex: 50 }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            digijoint.eth
          </h1>
          <ConnectButton />
        </div>
      </header>

      {/* Rest of the content remains the same */}
      <main className="relative pt-20 pb-12 px-4" style={{ zIndex: 10 }}>
        <div className="container mx-auto">
          {/* Hero Section with Image */}
          <div className="text-center mb-12">
            <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/20 mb-8">
              <div className="relative pt-[100%]">
                <Image
                  src={digijoint}
                  alt="digijoint"
                  fill
                  className="object-cover opacity-50 mix-blend-luminosity"
                  priority
                />
              </div>
            </div>

            {/* Search Component - ensure it's clickable */}
            <div className="relative z-20">
              <Search
                onSearch={handleSearch}
                placeholder="Search subdomain"
                className="max-w-2xl mx-auto"
              />
            </div>
          </div>

          {/* Results Section with Mint Button - ensure it's clickable */}
          {searchResult && (
            <div className="mt-12 max-w-2xl mx-auto relative z-20">
              <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg shadow-cyan-500/20 border border-cyan-500/20 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-md">
                      {searchResult.fullDomain}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${
                        searchResult.exists
                          ? "bg-red-500/20 text-red-400 border border-red-500/50"
                          : "bg-green-500/20 text-green-400 border border-green-500/50"
                      }`}
                    >
                      {searchResult.exists ? "Taken" : "Available"}
                    </span>
                  </div>
                </div>

                {/* Show Mint Button only if domain doesn't exist and wallet is connected */}
                {!searchResult.exists && (
                  <div className="pt-4 border-t border-cyan-500/20">
                    {isConnected ? (
                      isCorrectNetwork ? (
                        <MintButton
                          searchResult={searchResult}
                          onMintSuccess={handleMintSuccess}
                          onMintError={handleMintError}
                          className="w-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 text-white border border-green-400/50 shadow-lg shadow-cyan-500/20"
                        />
                      ) : (
                        <div className="text-center">
                          <ConnectButton />
                        </div>
                      )
                    ) : (
                      <div className="text-center p-4 bg-black/20 rounded-lg border border-cyan-500/20">
                        <p className="text-sm text-cyan-400/70">
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

        {/* Grid effect at the bottom - fixed positioning and lowest z-index */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-fuchsia-500/20 to-transparent pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20"></div>
        </div>
      </main>

            {/* Footer */}
            <Footer />
    </div>
  );
}
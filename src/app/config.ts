// config/wagmi.ts
import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Make sure to add your WalletConnect project ID in .env.local
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const chains = [mainnet] as const;

// Use multiple reliable public RPC endpoints with fallbacks
const publicRpcUrls = [
  "https://eth.llamarpc.com",
  "https://ethereum.blockpi.network/v1/rpc/public",
  "https://rpc.ankr.com/eth",
  "https://eth-mainnet.public.blastapi.io",
  "https://cloudflare-eth.com",
];

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId,
      showQrModal: true,

      metadata: {
        name: "digijoint.eth",
        description: "Mint digijoint.eth ENS subdomains",
        url: "https://digijoint.club",
        icons: ["https://digijoint.club/favicon.ico"],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(publicRpcUrls[0], {
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  syncConnectedChain: true,
});

export type Config = typeof config;

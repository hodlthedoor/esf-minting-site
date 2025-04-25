# DigiJoint.ETH Subdomain Minter

A web application for minting subdomains on the DigiJoint.eth ENS domain. This project allows users to check the availability of subdomains and mint them directly through a clean, modern interface.

## Features

- Check subdomain availability in real-time
- Connect your wallet with MetaMask or WalletConnect
- Mint available subdomains
- Fallback functionality for RPC errors
- ENS integration with name and avatar display

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: Ethereum, ENS (Ethereum Name Service)
- **Web3 Integration**: wagmi, viem
- **Authentication**: WalletConnect, MetaMask

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- MetaMask or other Ethereum wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hodlthedoor/digijoint.git
cd digijoint
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```bash
# Required environment variables
NEXT_PUBLIC_DOMAIN=digijoint.eth
NEXT_PUBLIC_ESF_ADDRESS=0xDcbf49BDB92B2Aa84de4e428fd5b2C9C58412Bc5
NEXT_PUBLIC_TLD_TOKEN_ADDRESS=0xbB326E4C0d505334Bb437E36c8A34d79a9B02073
NEXT_PUBLIC_ETHERSCAN_URL=https://etherscan.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

You can create a WalletConnect project ID at [WalletConnect Cloud](https://cloud.walletconnect.com/).

4. Run the development server:

```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Enter your desired subdomain in the search box
3. If the domain is available, you'll see a green indicator
4. Click the search button to mint the subdomain
5. Approve the transaction in your wallet

## Error Handling

The application includes robust error handling:

- If the RPC connection encounters issues during domain checks, the app will allow you to proceed with minting after 5 seconds
- Network switching is supported if you're not on Ethereum mainnet
- Clear error messages guide you through any issues

## Deployment

The app can be deployed on Vercel or any other Next.js compatible hosting:

```bash
yarn build
yarn start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ENS (Ethereum Name Service)](https://ens.domains/)
- [wagmi](https://wagmi.sh/) for React Hooks for Ethereum
- [viem](https://viem.sh/) for Ethereum interaction
- [TailwindCSS](https://tailwindcss.com/) for styling

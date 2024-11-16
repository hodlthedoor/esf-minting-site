

export function getEtherscanTransactionLink(txHash: `0x${string}`) {
    const etherscanUrl = process.env.NEXT_PUBLIC_ETHERSCAN_URL;
  return `${etherscanUrl}/tx/${txHash}`;
}
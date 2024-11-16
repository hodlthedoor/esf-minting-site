import { hexToBigInt, keccak256, toHex } from "viem";

export const getLabelId = async (fullDomain: string) => {

    const domainLabel = fullDomain.split(".")[0];
    const tokenId = hexToBigInt(keccak256(toHex(domainLabel)))

    return tokenId;
}
import { ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import {StreamProvider} from "@metamask/providers";
declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}

export const fetchTokenInfo = async (
    contractAddress: string,
    provider: ethers.providers.Provider
): Promise<Token> => {
    try {
        const tokenContract = new ethers.Contract(contractAddress, [
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ], provider);

        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        console.log("symbol",symbol);
        console.log("decimals",decimals);

        return new Token(11155111, contractAddress, decimals, symbol);
    } catch (error) {
        console.error("Failed to fetch token information:", error);
        throw new Error("Invalid contract address or network error.");
    }
};

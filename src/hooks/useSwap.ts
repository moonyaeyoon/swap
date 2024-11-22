import { useState } from "react";
import {SWAP_ROUTER_02_ADDRESSES, Token} from "@uniswap/sdk-core";
import { getQuote, swapTokens } from "@/services/swapService";
import { QuoteResponse, SwapResult} from "@/types/swap";
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import { ethers } from "ethers";

const SWAP_ROUTER_ABI = SwapRouter.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const chainId = 11155111;
const ROUTER_ADDRESS = SWAP_ROUTER_02_ADDRESSES(chainId);
const swapRouterContract = new ethers.Contract(ROUTER_ADDRESS,SWAP_ROUTER_ABI,signer);



interface UseSwapParams {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: string;
    slippage: number;
    deadline: number;
    walletAddress: string;
}

interface UseSwapReturn {
    quote: QuoteResponse | null;
    loading: boolean;
    error: string | null;
    fetchQuote: () => Promise<void>;
    executeSwap: () => Promise<SwapResult | null>;
}

export function useSwap({ tokenIn, tokenOut, amountIn, slippage, deadline,walletAddress }: UseSwapParams): UseSwapReturn {
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchQuote = async () => {
        if (!tokenIn || !tokenOut || !amountIn || !walletAddress) {
            setError("Invalid input");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await getQuote({
                tokenIn,
                tokenOut,
                amountIn,
                slippage,
                deadline,
                walletAddress,
            });
            console.log("response", response);
            setQuote(response);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch quote");
        } finally {
            setLoading(false);
        }
    };

    const executeSwap = async (): Promise<SwapResult | null> => {
        if (!quote) {
            setError("Quote not available");
            return null;
        }

        setLoading(true);
        try {
            const result = await swapTokens(
                tokenIn,
                tokenOut,
                amountIn,
                slippage,
                deadline,
                walletAddress);
            return result;
        } catch (err) {
            console.error(err);
            setError("Swap failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { quote, loading, error, fetchQuote, executeSwap };
}
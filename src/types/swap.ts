import { ethers,BigNumber } from "ethers";
import { Token } from "@uniswap/sdk-core";


export interface QuoteParams {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: string;
    slippage: number;
    deadline: number;
    walletAddress: string;
}
export interface Transaction {
    from: string;
    to: string;
    value: BigNumber;
    data: string;
    gasPrice: BigNumber;
    gasLimit: BigNumber;
}

export interface QuoteResponse {
    transaction: Transaction;
    quoteAmountOut: string;
    ratio: string;
}


export interface SwapParams {
    transaction: Transaction;
    signer: ethers.Signer;
    contractAddress: string;
    amountIn: string;
}

export interface SwapResult {
    transactionHash: string;
    status: boolean;
}
import {BigNumber} from "ethers";
import {Token} from "@uniswap/sdk-core";


export interface AddLiquidityParams {
    token0: Token;
    token1: Token;
    amount0: string;
    amount1: string;
    priceLower: string;
    priceUpper: string;
    slippageTolerance: number;
    deadline: number;
    fee: number;
}

export interface IncreaseLiquidityParams {
    tokenId: number;
    amountAdd0:string;
    amountAdd1: string;
    slippageTolerance: number;
    deadline: number;
}

export interface RemoveLiquidityParams {
    tokenId: number;
    liquidity: string;
    slippageTolerance: number;
    deadline: number;
}

export interface LiquidityResponse {
    transactionHash: string;
    status : boolean;
}

export interface CollectFeesParams {
    tokenId: number;            // NFT의 고유 ID
    recipient : string;
    amount0Max: BigNumber;
    amount1Max: BigNumber;
}

export interface FeeCollection {
    tokenId : number;
    amount0: BigNumber;
    amount1: BigNumber;
}


import { Token } from "@uniswap/sdk-core";

export interface PoolInfo {
    tokenA: Token;
    tokenB: Token;
    fee: number;
    sqrtPriceX96: string;
    liquidity: string;
    tick: number;
}
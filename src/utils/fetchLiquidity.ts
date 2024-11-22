"use client"
import { ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import JSBI from "jsbi";
import {Pool} from "@uniswap/v3-sdk";
import {FACTORY_ADDRESS} from "@/constants";
import {StreamProvider} from "@metamask/providers";
declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}
const provider = new ethers.providers.Web3Provider(window.ethereum);
const IUniswapV3FactoryABI = UniswapV3Factory.abi;
const IUniswapV3PoolABI = UniswapV3Pool.abi;

export async function fetchLiquidity(tokenIn: Token, tokenOut: Token, fee: number): Promise<Pool|null> {
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, IUniswapV3FactoryABI, provider);

    const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, fee);
    if (poolAddress === ethers.constants.AddressZero) {
        console.log("No pool ");
        return null;
    }

    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);


    const liquidity = await poolContract.liquidity();
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = JSBI.BigInt(slot0[0].toString());
    const tick = slot0.tick;

    return new Pool(
        tokenIn,
        tokenOut,
        fee,
        sqrtPriceX96,
        JSBI.BigInt(liquidity.toString()),
        tick
    );
}
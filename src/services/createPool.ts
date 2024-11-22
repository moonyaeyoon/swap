"use client"
import { ethers } from "ethers";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import { FACTORY_ADDRESS } from "@/constants";
import {Token} from "@uniswap/sdk-core";
import { getPoolKey, computeAddress } from "@/utils/poolAddress";
import {StreamProvider} from "@metamask/providers";
declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}
const IUniswapV3FactoryABI = UniswapV3Factory.abi;
const IUniswapV3PoolABI = UniswapV3Pool.abi;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export async function initializePool(tokenA: Token, tokenB: Token, fee: number, sqrtPriceX96: ethers.BigNumber): Promise<string> {
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, IUniswapV3FactoryABI, signer);

    // const poolKey = getPoolKey(tokenA.address, tokenB.address, fee);
    // let poolAddress = computeAddress(FACTORY_ADDRESS, poolKey);


    // To do : 리팩터링 필요
    // 여기에서 오류 발생
    console.log("hi");
    let poolAddress = await factoryContract.getPool(tokenA.address, tokenB.address, fee);
    //const code = await provider.getCode(poolAddress);
    if (poolAddress === ethers.constants.AddressZero) {
        const tx = await factoryContract.createPool(tokenA.address, tokenB.address, fee);
        const receipt = await tx.wait();
        poolAddress = await factoryContract.getPool(tokenA.address, tokenB.address, fee);
        // if (code === "0x") {
        //     throw new Error("풀 생성 후 주소를 가져올 수 없습니다.");
        // }

        const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, signer);
        const initTx = await poolContract.initialize(sqrtPriceX96.toString());
        const initReceipt = await initTx.wait();
        console.log("풀 초기화 완료:", initReceipt);
    }

    return poolAddress;
}

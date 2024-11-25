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

    // 이미 생성된 풀 주소를 확인
    let poolAddress = await factoryContract.getPool(tokenA.address, tokenB.address, fee);

    // 풀 주소가 존재하지 않는다면 새로 생성
    if (poolAddress === ethers.constants.AddressZero) {
        console.log("풀이 존재하지 않으므로 새 풀을 생성합니다.");
        const tx = await factoryContract.createPool(tokenA.address, tokenB.address, fee);
        const receipt = await tx.wait(); // 풀 생성 완료까지 기다림

        // 새로 생성된 풀 주소를 확인
        poolAddress = await factoryContract.getPool(tokenA.address, tokenB.address, fee);
    }

    // 풀 계약에 접근하여 초기화 상태 확인
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, signer);
    const slot0 = await poolContract.slot0();

    // sqrtPriceX96이 0이면 초기화되지 않은 풀
    const isInitialized = slot0[0].toString() !== '0';  // sqrtPriceX96이 0이면 초기화되지 않은 풀

    if (!isInitialized) {
        // 풀 초기화
        console.log("풀 초기화가 필요합니다.");
        const initTx = await poolContract.initialize(sqrtPriceX96.toString());
        const initReceipt = await initTx.wait();
        console.log("풀 초기화 완료:", initReceipt);
    } else {
        console.log("풀은 이미 초기화되었습니다.");
    }

    return poolAddress;
}

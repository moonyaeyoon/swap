import {BigNumber, ethers} from "ethers";
import NonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { POSITION_MANAGER_ADDRESS } from "@/constants";
import { AddLiquidityParams, IncreaseLiquidityParams, RemoveLiquidityParams, LiquidityResponse } from "@/types/liquidity";
import {initializePool} from "@/services/createPool";

const NonfungiblePositionManagerABI = NonfungiblePositionManager.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


const positionManagerContract = new ethers.Contract(POSITION_MANAGER_ADDRESS, NonfungiblePositionManagerABI, signer);

const calculateAmountMin = (amount: BigNumber, slippageTolerance: number): BigNumber => {
    return amount.mul(100 - slippageTolerance).div(100);
};


export async function liquidityService(params: AddLiquidityParams): Promise<LiquidityResponse> {
    const amount0Desired = ethers.utils.parseUnits(params.amount0, 18);
    const amount1Desired = ethers.utils.parseUnits(params.amount1, 18);
    const amount0Min = calculateAmountMin(amount0Desired, params.slippageTolerance);
    const amount1Min = calculateAmountMin(amount1Desired, params.slippageTolerance);
    const sqrtPriceX96 = ethers.utils.parseUnits(params.priceLower, 18);
    const poolAddress = await initializePool(params.token0, params.token1, params.fee, sqrtPriceX96);

    return await positionManagerContract.mint({
        token0: params.token0.address,
        token1: params.token1.address,
        fee: params.fee,
        tickLower: parseFloat(params.priceLower),
        tickUpper: parseFloat(params.priceUpper),
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        recipient: await signer.getAddress(),
        deadline: Math.floor(Date.now() / 1000) + 60 * params.deadline
    });
}


export async function increaseLiquidity(params: IncreaseLiquidityParams): Promise<LiquidityResponse> {
    const amountAdd0 = ethers.utils.parseUnits(params.amountAdd0, 18);
    const amountAdd1 = ethers.utils.parseUnits(params.amountAdd1, 18);
    const amount0Min = calculateAmountMin(amountAdd0, params.slippageTolerance);
    const amount1Min = calculateAmountMin(amountAdd1, params.slippageTolerance);

    return await positionManagerContract.increaseLiquidity({
        tokenId: params.tokenId,
        amount0Desired: amountAdd0,
        amount1Desired: amountAdd1,
        amount0Min,
        amount1Min,
        deadline: Math.floor(Date.now() / 1000) + 60 * params.deadline
    });
}

export async function removeLiquidity(params: RemoveLiquidityParams): Promise<LiquidityResponse> {
    const liquidity = ethers.utils.parseUnits(params.liquidity, 18);
    const amount0Min = calculateAmountMin(liquidity, params.slippageTolerance);
    const amount1Min = calculateAmountMin(liquidity, params.slippageTolerance);

    return await positionManagerContract.decreaseLiquidity({
        tokenId: params.tokenId,
        liquidity,
        amount0Min,
        amount1Min,
        deadline: Math.floor(Date.now() / 1000) + 60 * params.deadline
    });
}

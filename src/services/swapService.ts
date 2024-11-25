"use client"
import { ethers, BigNumber } from "ethers";
import {  ROUTER_ADDRESS } from "@/constants";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import {Route, Trade, SwapRouter, Pool} from "@uniswap/v3-sdk";
import Erc20Contract from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { fetchLiquidity } from "@/utils/fetchLiquidity";
import { QuoteParams, QuoteResponse, SwapParams, SwapResult } from "@/types/swap";
import JSBI from "jsbi";
import {StreamProvider} from "@metamask/providers";
declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}

const Erc20ABI = Erc20Contract.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


export async function getBalance(contractAddress: string, signer: ethers.Signer): Promise<string> {
    const contract = new ethers.Contract(contractAddress, Erc20ABI, signer);
    const balance = await contract.balanceOf(await signer.getAddress());
    return ethers.utils.formatEther(balance);
}

export async function getQuote(params: QuoteParams): Promise<QuoteResponse> {
    const { tokenIn, tokenOut, amountIn, slippage, deadline } = params;

    // 입력 토큰의 양 설정
    const weiAmount = ethers.utils.parseUnits(amountIn.toString(), tokenIn.decimals);
    const currencyAmount = CurrencyAmount.fromRawAmount(tokenIn, JSBI.BigInt(weiAmount.toString()));

    // 유동성 조회 및 거래 경로 설정
    const feeTiers = [500, 3000, 10000];
    let pool: Pool | null = null;
    for (const fee of feeTiers) {
        try {
            pool = await fetchLiquidity(tokenIn, tokenOut, fee);
            if (pool) {
                console.log(`Found pool with fee tier: ${fee}`);
                break;
            }
        } catch (error) {
            console.error(`No pool found for fee tier ${fee}`);
        }
    }

    const route = new Route([pool as Pool], tokenIn, tokenOut);
    const trade = await Trade.fromRoute(route, currencyAmount, TradeType.EXACT_INPUT);
    console.log("trade", trade);
    // 슬리피지 적용
    const slippageTolerance = new Percent(slippage.toString(), "100");
    const minimumAmountOut = trade.minimumAmountOut(slippageTolerance).toSignificant(6);

    // 스왑 트랜잭션을 위한 파라미터
    const { calldata, value } = SwapRouter.swapCallParameters([trade], {
        slippageTolerance,
        recipient: signer.getAddress().toString(),
        deadline: deadline,
    });

    const gasEstimate = await provider.estimateGas({
        from: signer.getAddress(),
        to: ROUTER_ADDRESS,
        value: BigNumber.from(value),
        data: calldata
    });

    // 트랜잭션 객체 생성
    const transaction = {
        from: signer.getAddress().toString(),
        to: ROUTER_ADDRESS,
        value: BigNumber.from(value),
        data: calldata,
        gasPrice: await provider.getGasPrice(),
        gasLimit: gasEstimate
    };

    return {
        transaction,
        quoteAmountOut: minimumAmountOut,
        ratio: (parseFloat(amountIn) / parseFloat(minimumAmountOut)).toFixed(3)
    };
}

export async function executeSwap(params: SwapParams): Promise<SwapResult> {
    const { transaction, signer, contractAddress, amountIn } = params;

    const contract = new ethers.Contract(contractAddress, Erc20ABI, signer);
    const allowance = await contract.allowance(await signer.getAddress(), ROUTER_ADDRESS);

    const approvalAmount = ethers.utils.parseUnits(amountIn, 18).mul(10);
    if (allowance.lt(approvalAmount)) {
        const approveTx = await contract.approve(ROUTER_ADDRESS, approvalAmount);
        await approveTx.wait();
    }

    const tx = await signer.sendTransaction(transaction);
    await tx.wait();

    return {
        transactionHash: tx.hash,
        status: true
    };
}

export async function swapTokens(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: string,
    slippage: number,
    deadline: number,
): Promise<SwapResult> {
    const quoteParams: QuoteParams = {
        tokenIn,
        tokenOut,
        amountIn,
        slippage,
        deadline,
    };
    const quoteResponse = await getQuote(quoteParams);

    const swapParams: SwapParams = {
        transaction: quoteResponse.transaction,
        signer,
        contractAddress: tokenIn.address,
        amountIn
    };

    return await executeSwap(swapParams);
}
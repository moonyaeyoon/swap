"use client"
import { ethers, Event } from "ethers";
import {abi as NonfungiblePositionManagerABI} from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"
import { POSITION_MANAGER_ADDRESS } from "@/constants";
import { TransferHelper } from "@/utils/TransferHelper";
import {StreamProvider} from "@metamask/providers";
declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export async function collectFees(tokenId: number) {
    const positionManagerContract = new ethers.Contract(POSITION_MANAGER_ADDRESS, NonfungiblePositionManagerABI, signer);

    const txTransfer = await positionManagerContract['safeTransferFrom(address,address,uint256)'](
        await signer.getAddress(),
        POSITION_MANAGER_ADDRESS,
        tokenId
    );
    await txTransfer.wait();

    const collectParams = {
        tokenId,
        recipient: POSITION_MANAGER_ADDRESS,
        amount0Max: ethers.constants.MaxUint256,
        amount1Max: ethers.constants.MaxUint256,
    };

    const txCollect = await positionManagerContract.collect(collectParams);
    const receipt = await txCollect.wait();
    const collectEvent = receipt.events?.find((event: Event) => event.event === "Collect");

    if (!collectEvent || !collectEvent.args) {
        throw new Error("Collect event not found or missing args");
    }

    const { amount0, amount1 } = collectEvent.args;
    await sendToOwner(tokenId, amount0, amount1);
}

async function sendToOwner(tokenId: number, amount0: ethers.BigNumber, amount1: ethers.BigNumber) {
    const positionManagerContract = new ethers.Contract(POSITION_MANAGER_ADDRESS, NonfungiblePositionManagerABI, signer);
    const position = await positionManagerContract.positions(tokenId);
    const { owner, token0, token1 } = position;

    if (amount0.gt(0)) await TransferHelper.safeTransfer(token0, owner, amount0, signer);
    if (amount1.gt(0)) await TransferHelper.safeTransfer(token1, owner, amount1, signer);
}

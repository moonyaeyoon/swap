
import { ethers } from "ethers";

export const TransferHelper = {
    async safeTransfer(tokenAddress: string, to: string, amount: ethers.BigNumber, signer: ethers.Signer) {
        const tokenContract = new ethers.Contract(tokenAddress, ["function transfer(address,uint256) returns (bool)"], signer);
        const tx = await tokenContract.transfer(to, amount);
        await tx.wait();
    }
};

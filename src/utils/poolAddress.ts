import { ethers } from "ethers";

const POOL_INIT_CODE_HASH = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";

interface PoolKey {
    token0: string;
    token1: string;
    fee: number;
}

// 토큰 정렬 함수 (token0은 항상 작은 주소여야 함)
export function getPoolKey(tokenA: string, tokenB: string, fee: number): PoolKey {
    return tokenA.toLowerCase() < tokenB.toLowerCase()
        ? { token0: tokenA, token1: tokenB, fee }
        : { token0: tokenB, token1: tokenA, fee };
}

// 풀 주소 계산 함수
export function computeAddress(factory: string, poolKey: PoolKey): string {
    const { token0, token1, fee } = poolKey;

    return ethers.utils.getAddress(
        ethers.utils.keccak256(
            ethers.utils.solidityPack(
                ["bytes1", "address", "bytes32", "bytes32"],
                [
                    "0xff",
                    factory,
                    ethers.utils.keccak256(ethers.utils.solidityPack(["address", "address", "uint24"], [token0, token1, fee])),
                    POOL_INIT_CODE_HASH,
                ]
            )
        ).slice(-40) // 마지막 20 바이트 (풀 주소)만 가져옵니다
    );
}

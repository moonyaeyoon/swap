import {ethers} from "ethers";
import { useState } from "react";
import {liquidityService, increaseLiquidity, removeLiquidity} from "@/services/liquidityService";
import {AddLiquidityParams, IncreaseLiquidityParams, LiquidityResponse, RemoveLiquidityParams} from "@/types/liquidity";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const useLiquidity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initializeAndAddLiquidity = async (params: AddLiquidityParams): Promise<LiquidityResponse | null> => {
        if (!params.token0 || !params.token1) throw new Error("토큰을 선택해 주세요.");
        setLoading(true);
        try {
            return await liquidityService(params);
        } catch (err: any) {
            setError(err.message || "Failed to add liquidity.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleIncreaseLiquidity = async function (params: IncreaseLiquidityParams): Promise<LiquidityResponse | null> {
        setLoading(true);
        setError(null);

        try {
            return await increaseLiquidity(params);
        } catch (err: any) {
            setError(err.message || "Failed to increase liquidity.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveLiquidity = async (params: RemoveLiquidityParams): Promise<LiquidityResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            return await removeLiquidity(params);
        } catch (err: any) {
            setError(err.message || "Failed to remove liquidity.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        initializeAndAddLiquidity,
        handleIncreaseLiquidity,
        handleRemoveLiquidity,
    };
};
import React, { useState } from "react";
import { useLiquidity } from "@/hooks/useLiquidity";

// TO DO : 실제 입력받는 값으로 수정해야함
const RemoveLiquidityComponent: React.FC = () => {
    const { loading, handleRemoveLiquidity } = useLiquidity();
    const [tokenId, setTokenId] = useState<number>(1);
    const [liquidity, setLiquidity] = useState("");
    const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);

    const onSubmit = async () => {
        await handleRemoveLiquidity({
            tokenId,
            liquidity,
            slippageTolerance,
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        });
    };

    return (
        <div>
            <input value={liquidity} onChange={(e) => setLiquidity((e.target.value))} />
            <button onClick={onSubmit} disabled={loading}>
                {loading ? "Processing..." : "Remove Liquidity"}
            </button>
        </div>
    );
};

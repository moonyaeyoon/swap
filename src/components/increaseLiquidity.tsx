import React, { useState } from "react";
import { useLiquidity } from "@/hooks/useLiquidity";

// TO DO : 실제 입력받는 값으로 수정해야함
const IncreaseLiquidityComponent: React.FC = () => {
    const { loading, handleIncreaseLiquidity } = useLiquidity();
    const [tokenId, setTokenId] = useState<number>(1);
    const [amountAdd0, setAmountAdd0] = useState<string>("1");
    const [amountAdd1, setAmountAdd1] = useState<string>("1");
    const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);

    const onSubmit = async () => {
        await handleIncreaseLiquidity({
            tokenId,
            amountAdd0,
            amountAdd1,
            slippageTolerance,
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        });
    };

    return (
        <div>
            <input value={amountAdd0} onChange={(e) => setAmountAdd0(e.target.value)} placeholder="Add amount 0" />
            <input value={amountAdd1} onChange={(e) => setAmountAdd1(e.target.value)} placeholder="Add amount 1" />
            <button onClick={onSubmit} disabled={loading}>
                {loading ? "Processing..." : "Increase Liquidity"}
            </button>
        </div>
    );
};

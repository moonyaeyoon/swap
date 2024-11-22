"use client";
import React, { useEffect, useState } from "react";
import { Token } from "@uniswap/sdk-core";
import { useSwap } from "@/hooks/useSwap";
import { SwapResult } from "@/types/swap";
import TokenSearchModal from "@/components/tokenSearchModal";
import styles from "@/styles/SwapBox.module.css";
import OptionModal from "@/components/optionModal";


interface SwapBoxProps {
    walletAddress: string | null;
}


const SwapBox: React.FC<SwapBoxProps> = ({ walletAddress }) => {
    const [amountIn, setAmountIn] = useState<string>("");
    const [slippage, setSlippage] = useState<number>(0.5);
    const [deadline, setDeadline] = useState<number>(20);
    const [tokenIn, setTokenIn] = useState<Token | null>(null);
    const [tokenOut, setTokenOut] = useState<Token | null>(null);
    const [showTokenSearch, setShowTokenSearch] = useState<'in' | 'out' | null>(null);
    const [showOptionModal, setShowOptionModal] = useState<boolean>(false);

    const { quote, loading, error, fetchQuote, executeSwap } = useSwap({
        tokenIn: tokenIn as Token,
        tokenOut: tokenOut as Token,
        amountIn,
        slippage,
        deadline : Math.floor(Date.now() / 1000) + deadline * 60,
        walletAddress: walletAddress || "",
    });

    const handleTokenSelect = (token: Token) => {
        if (showTokenSearch === 'in') {
            setTokenIn(token);
        } else {
            setTokenOut(token);
        }
        setShowTokenSearch(null);
    };

    useEffect(() => {
        if (amountIn && tokenIn && tokenOut) {
            fetchQuote();
        }
    }, [amountIn, tokenIn, tokenOut]);

    const handleAmountInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountIn(e.target.value);
    };


    const handleSwap = async () => {
        if (!walletAddress || !tokenIn || !tokenOut) return; // Ensure tokenIn and tokenOut are selected
        const result: SwapResult | null = await executeSwap();
        if (result && result.status) {
            alert("Swap successful! Transaction hash: ${result.transactionHash}");
        } else {
            alert("Swap failed");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Swap</h2>
            <button onClick={() => setShowOptionModal(true)} className={styles.optionButton}>
                ⚙
            </button>

            <TokenSearchModal
                isOpen={!!showTokenSearch}
                onClose={() => setShowTokenSearch(null)}
                onSelectToken={handleTokenSelect}
            />

            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Sell</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="number"
                        value={amountIn}
                        onChange={handleAmountInChange}
                        placeholder="0.0"
                        className={styles.inputField}
                    />
                    <button onClick={() => setShowTokenSearch('in')} className={styles.selectButton}>
                        {tokenIn ? tokenIn.symbol : 'Select Token'}
                    </button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Buy</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        value={quote ? quote.quoteAmountOut : ""}
                        placeholder="0.0"
                        readOnly
                        className={styles.inputField}
                    />
                    <button onClick={() => setShowTokenSearch('out')} className={styles.selectButton}>
                        {tokenOut ? tokenOut.symbol : 'Select Token'}
                    </button>
                </div>
            </div>

            <OptionModal
                isOpen={showOptionModal}
                onClose={() => setShowOptionModal(false)}
                slippage={slippage}
                setSlippage={setSlippage}
                deadline={deadline}
                setDeadline={setDeadline}
            />

            <div className={styles.alert}>
                Please ensure that you have sufficient balance for the swap.
            </div>

            <button onClick={handleSwap} disabled={loading || !amountIn || !tokenIn || !tokenOut || !!error}
                    className={styles.button}>
                {loading ? "Swapping..." : "Swap"}
            </button>

            {error && <p className={styles.insufficientBalance}>{error}</p>}
        </div>
    );
};

export default SwapBox;
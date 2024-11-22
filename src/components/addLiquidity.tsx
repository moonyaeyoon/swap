import React, { useState } from "react";
import { useLiquidity } from "@/hooks/useLiquidity";
import { Token } from "@uniswap/sdk-core";
import { POOL_FEE_TIER } from "@/constants";
import TokenSearchModal from "@/components/tokenSearchModal";
import OptionModal from "@/components/optionModal";
import styles from "@/styles/AddLiquidity.module.css";


const AddLiquidity: React.FC = () => {
    const [token0, setToken0] = useState<Token | null>(null);
    const [token1, setToken1] = useState<Token | null>(null);
    const [showTokenSearch, setShowTokenSearch] = useState<"0" | "1" | null>(null);
    const [fee, setFee] = useState(POOL_FEE_TIER.MEDIUM);
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [priceLower, setPriceLower] = useState("");
    const [priceUpper, setPriceUpper] = useState("");
    const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
    const [deadline, setDeadline] = useState<number>(20);
    const [showOptionModal, setShowOptionModal] = useState<boolean>(false);
    const { loading, initializeAndAddLiquidity } = useLiquidity();

    const handleTokenSelect = (token: Token) => {
        if (showTokenSearch === "0") {
            setToken0(token);
        } else if (showTokenSearch === "1") {
            setToken1(token);
        }
        setShowTokenSearch(null);

    };

    const handleAddLiquidity = async () => {
        if (!token0 || !token1) {
            alert("Please select both tokens.");
            return;
        }
        const params = {
            token0,
            token1,
            amount0,
            amount1,
            priceLower,
            priceUpper,
            slippageTolerance,
            deadline,
            fee,
        };
        try {
            const receipt = await initializeAndAddLiquidity(params);
            if (receipt) {
                alert("Liquidity added successfully!");
            }
        } catch (error) {
            console.error("Error adding liquidity:", error);
            alert("Failed to add liquidity.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Add Liquidity</h2>

            <button onClick={() => setShowOptionModal(true)} className={styles.optionButton}>
                ⚙
            </button>

            <div className={styles.selectPair}>
                <button onClick={() => setShowTokenSearch("0")}>
                    {token0 ? token0.symbol : "Select Token"}
                </button>
                <button onClick={() => setShowTokenSearch("1")}>
                    {token1 ? token1.symbol : "Select Token"}
                </button>
            </div>

            <TokenSearchModal
                isOpen={!!showTokenSearch}
                onClose={() => setShowTokenSearch(null)}
                onSelectToken={handleTokenSelect}
            />

            <OptionModal
                isOpen={showOptionModal}
                onClose={() => setShowOptionModal(false)}
                slippage={slippageTolerance}
                setSlippage={setSlippageTolerance}
                deadline={deadline}
                setDeadline={setDeadline}
            />

            <div className={styles.feeOptions}>
                {Object.values(POOL_FEE_TIER).map((value) => (
                    <label
                        key={value}
                        className={`${styles.feeOption} ${fee === value ? styles.checked : ""}`}
                        onClick={() => setFee(value)}
                    >
                        <input
                            type="radio"
                            name="fee"
                            value={value}
                            checked={fee === value}
                            onChange={() => setFee(value)}
                        />
                        {value / 10000}%
                    </label>
                ))}
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Amount A</label>
                <input
                    type="number"
                    placeholder="amount"
                    value={amount0}
                    onChange={(e) => setAmount0(e.target.value)}
                    className={styles.inputField}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Amount B</label>
                <input
                    type="number"
                    placeholder="amount"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    className={styles.inputField}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Price Range</label>
                <input
                    type="number"
                    placeholder="Lower Bound"
                    value={priceLower}
                    onChange={(e) => setPriceLower(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="number"
                    placeholder="Upper Bound"
                    value={priceUpper}
                    onChange={(e) => setPriceUpper(e.target.value)}
                    className={styles.inputField}
                />
            </div>

            <div className={styles.alert}>
                Your position will not earn fees or be used in trades until the market price moves into your range.
            </div>

            <button onClick={handleAddLiquidity} disabled={loading} className={styles.button}>
                {loading ? "Processing..." : "Add Liquidity"}
            </button>
        </div>
    );
};

export default AddLiquidity;

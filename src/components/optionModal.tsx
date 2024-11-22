import React from "react";
import styles from "@/styles/OptionModal.module.css";

interface OptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    slippage: number;
    setSlippage: (value: number) => void;
    deadline: number;
    setDeadline: (value: number) => void;
}

const OptionModal: React.FC<OptionModalProps> = ({ isOpen, onClose, slippage, setSlippage, deadline, setDeadline }) => {
    if (!isOpen) return null;

    const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlippage(parseFloat(e.target.value));
    };

    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeadline(parseInt(e.target.value));
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>Swap Options</h3>
                <button className={styles.closeButton} onClick={onClose}>Close</button>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Max Slippage (%)</label>
                    <input
                        type="number"
                        value={slippage}
                        onChange={handleSlippageChange}
                        placeholder="0.5"
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Transaction Deadline (minutes)</label>
                    <input
                        type="number"
                        value={deadline}
                        onChange={handleDeadlineChange}
                        placeholder="20"
                        className={styles.inputField}
                    />
                </div>
            </div>
        </div>
    );
};

export default OptionModal;

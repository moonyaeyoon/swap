import React from "react";
import styles from "@/styles/Pool.module.css";

interface PoolProps {
    onNewPositionClick: () => void;
}

const Pool: React.FC<PoolProps> = ({ onNewPositionClick }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Positions</h2>
                <div>
                    <button
                        className={styles.newPositionButton}
                        onClick={onNewPositionClick}
                    >
                        + New Position
                    </button>
                </div>
            </header>
            <div className={styles.emptyState}>
                <p> No Pools </p>
                <p>Your active V3 liquidity positions will appear here.</p>
            </div>
        </div>
    );
};

export default Pool;

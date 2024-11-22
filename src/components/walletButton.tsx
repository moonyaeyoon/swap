"use client"
import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import styles from "@/styles/WalletButton.module.css"

const WalletConnect: React.FC = () => {
    const { account, connectWallet, disconnectWallet } = useWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConnectClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConnectMetaMask = async () => {
        await connectWallet();
        setIsModalOpen(false);
    };

    const handleDisconnect = () => {
        disconnectWallet();
        setIsModalOpen(false);
    };

    return (
        <div className={styles.walletConnect}>
            <button
                onClick={account ? handleDisconnect : handleConnectClick}
                className={styles.connectWalletButton}
            >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner click
                    >
                        <div className={styles.modalHeader}>
                            <span>Connect a Wallet</span>
                            <button
                                onClick={handleCloseModal}
                                className={styles.closeButton}
                                aria-label="Close Modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.walletOption}
                                onClick={handleConnectMetaMask}
                            >
                                <img
                                    src="/icons/meta.png"
                                    alt="MetaMask Icon"
                                    className={styles.walletIcon}
                                />
                                <span>MetaMask</span>
                            </button>
                        </div>
                        {account && (
                            <button
                                onClick={handleDisconnect}
                                className={styles.disconnectButton}
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

};

export default WalletConnect;

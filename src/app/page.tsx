"use client"
import React, {useState} from "react";
import WalletButton from "@/components/walletButton";
import SwapBox from "@/components/swapBox";
import "@/styles/globals.css"
import {useWallet} from "@/hooks/useWallet";
import AddLiquidity from "@/components/addLiquidity";
import Pool from "@/components/pool";

const Page: React.FC = () => {
    const { account } = useWallet();
    const [activeTab, setActiveTab] = useState("swap");
    return (
        <main className="page">
            <header className="header">
                <div className="header-left">
                    <img src="/icons/bay.png" alt="Logo" className="logo"/>
                    <nav className="nav-container">
                            <a
                                href="#"
                                className={`nav-link ${activeTab === "swap" ? "active" : ""}`}
                                onClick={() => setActiveTab("swap")}
                            >
                                SWAP
                            </a>
                            <a
                                href="#"
                                className={`nav-link ${activeTab === "pool" ? "active" : ""}`}
                                onClick={() => setActiveTab("pool")}
                            >
                                POOL
                            </a>
                    </nav>
                </div>
                    <WalletButton/>
            </header>
            <div className="content">
                {activeTab === "swap" && <SwapBox walletAddress={account} />}
                {activeTab === "pool" && (
                    <Pool onNewPositionClick={() => setActiveTab("addLiquidity")} />
                )}
                {activeTab === "addLiquidity" && <AddLiquidity />}
            </div>
        </main>
    );
};
export default Page;

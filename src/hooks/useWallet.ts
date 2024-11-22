"use client"
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {StreamProvider} from "@metamask/providers";

declare global {
    interface Window {
        ethereum: StreamProvider;
    }
}
export function useWallet() {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (window.ethereum) {
            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(ethersProvider);
        }
    }, []);

    // Connect wallet function
    const connectWallet = async () => {
        if (!provider) {
            alert("MetaMask is not installed!");
            return;
        }
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setIsModalOpen(false);

        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    // Disconnect wallet function
    const disconnectWallet = () => {
        setAccount(null);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return { account, connectWallet, disconnectWallet, provider,isModalOpen, openModal, closeModal };
}

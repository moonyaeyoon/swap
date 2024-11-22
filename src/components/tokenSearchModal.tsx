import React, {useState} from "react";
import {Token} from "@uniswap/sdk-core";
import {ethers} from "ethers";
import styles from "@/styles/TokenSearchModal.module.css";
import {fetchTokenInfo} from "@/services/fetchTokenInfo";

interface TokenSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectToken: (token: Token) => void;
}

const TokenSearchModal: React.FC<TokenSearchModalProps> = ({isOpen, onClose, onSelectToken}) => {
    const [contractAddress, setContractAddress] = useState("");
    const [tokenInfo, setTokenInfo] = useState<Token | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 토큰 검색 함수
    const handleSearchToken = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token = await fetchTokenInfo(contractAddress, provider); // 서비스 호출
            setTokenInfo(token);
        } catch (error) {
            setError("no token");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectToken = () => {
        if (tokenInfo) {
            onSelectToken(tokenInfo);
            setContractAddress("");
            setTokenInfo(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>Close</button>
                <h2 className={styles.title}>Select a token</h2>
                <input
                    type="text"
                    placeholder="Enter token contract address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className={styles.input}
                />
                <button className={styles.searchButton} onClick={handleSearchToken} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
                {error && <p className={styles.error}>{error}</p>}
                {tokenInfo && (
                    <div className={styles.tokenInfo}>
                        <p> {tokenInfo.symbol}</p>
                        <button className={styles.selectButton} onClick={handleSelectToken}>Select</button>
                    </div>
                )}
            </div>
        </div>
    );
};



export default TokenSearchModal;

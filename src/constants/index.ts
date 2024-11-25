
export interface TokenInfo {
    symbol: string;
    address: string;
    decimals: number;
    name?: string;
    chainId: number;
    logoUrl?: string;
}

export const TOKENS: { [key: string]: TokenInfo } = {
    UNI: {
        symbol: 'UNI',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        name: 'Uniswap',
        chainId: 11155111,
        logoUrl: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg'
    },
    WETH: {
        symbol: 'WETH',
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        decimals: 18,
        name: 'Wrapped Ether',
        chainId: 11155111,
        logoUrl:'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    },
    TKA:{
        symbol : 'TKA',
        address : '0xd78ea88d7e92AAf0BaA666ECC877BA45364e221f',
        decimals : 18,
        name : 'TokenA',
        chainId : 11155111
    },
    TKB:{
        symbol : 'TKB',
        address : '0x14Ff3A62591c318AD4031b06814bbD31dD2A23b5',
        decimals : 18,
        name : 'TokenB',
        chainId : 11155111
    }
};
export const POOL_FEE_TIER = {
    LOW: 500,           // 0.05% 수수료
    MEDIUM: 3000,       // 0.3% 수수료
    HIGH: 10000         // 1% 수수료
};



export const FACTORY_ADDRESS = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"
export const POSITION_MANAGER_ADDRESS = "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2"
export const ROUTER_ADDRESS = "0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4";


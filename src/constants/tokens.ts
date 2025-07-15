import { USDC_ABI} from "./abi/usdc";
import { GRASP_ABI} from "./abi/grasp";
import { USDT_ABI } from "./abi/usdt";
import { DLCBTC_ABI } from "./abi/dlcbtc";
import { ADEX_ABI } from "./abi/adex";
import { WETH_ABI } from "./abi/weth";
import { ESD_ABI } from "./abi/esd";

interface Token {
    name: string;        // Nombre del token
    symbol: string;      // Símbolo del token
    decimals: number;    // Decimales del token
    contractId: string;  // ID del contrato
}

export const tokensAvailable: Token[] = [
    {
        name: "USD Coin",
        symbol: "USDC",
        decimals: 18,
        contractId: "0x77721D19BDfc67fe8cc46ddaa3cc4C94e6826E3C",
    },
    {
        name: "Grasp",
        symbol: "GRASP",
        decimals: 18,
        contractId: "0x3eB2Eb8E2a0E26BEf3Dc3E78289Be7343355FeBC",
    },
    {
        name: "USDT",
        symbol: "USDT",
        decimals: 18,
        contractId: "0xBCe9628e89eC686C9E1878065bec04b45DBD0B40",
    },
    {
        name: "dlcBTC",
        symbol: "dlcBTC",
        decimals: 8,
        contractId: "0x89f0415Ab9f69c7b04ECd476FD6e23D0A82dD6F0",
    },
    {
        name: "Academy DEX",
        symbol: "ADEX",
        decimals: 18,
        contractId: "0x81962760B26D4c2C6eD373F615310633abFd47c1",
    },
    {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        contractId: "0xbd51800607E7C743a0e9b0D89D837058F4f42756",
    },
    {
        name: "Esd Stablecoin",
        symbol: "ESD",
        decimals: 18,
        contractId: "0xCef966528A867176BF3a575c9951f695e8eB77a3",
    },
  ];

export const abiByToken = [
    {
        contractId: "0x77721D19BDfc67fe8cc46ddaa3cc4C94e6826E3C",
        ABI: USDC_ABI
    },
    {
        contractId: "0x3eB2Eb8E2a0E26BEf3Dc3E78289Be7343355FeBC",
        ABI: GRASP_ABI
    },
    {
        contractId: "0xBCe9628e89eC686C9E1878065bec04b45DBD0B40",
        ABI: USDT_ABI
    },
    {
        contractId: "0x89f0415Ab9f69c7b04ECd476FD6e23D0A82dD6F0",
        ABI: DLCBTC_ABI
    },
    {
        contractId: "0x81962760B26D4c2C6eD373F615310633abFd47c1",
        ABI: ADEX_ABI
    },
    {
        contractId: "0xbd51800607E7C743a0e9b0D89D837058F4f42756",
        ABI: WETH_ABI
    },
    {
        contractId: "0xCef966528A867176BF3a575c9951f695e8eB77a3",
        ABI: ESD_ABI
    },
]

export const concatenatedTokens = tokensAvailable
        .map(
        (token) =>
            `Name: ${token.name}, Symbol: ${token.symbol}, Decimals: ${token.decimals}, Contract ID: ${token.contractId}`
        )
        .join("\n");
import { defineChain } from 'viem'

export const primordialTestnet = defineChain({
    id: 1043,
    name: 'Primordial BlockDAG Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'BDAG',
      symbol: 'BDAG',
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.primordial.bdagscan.com"],
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://primordial.bdagscan.com/' },
    },
  })
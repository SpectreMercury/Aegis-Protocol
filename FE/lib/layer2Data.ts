import { Layer2Data } from "@/types/layer2";

export const layer2Data: Layer2Data[] = [
  {
    id: 1,
    name: "Arbitrum One",
    icon: "./img/arbitrum.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "6d 8h",
    dataAvailability: "Onchain",
    exitWindow: "7d",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tvl: 15200000000,
    tokenPrice: 0.00026,
    details: {
      description: "Arbitrum是一个低成本的第二层解决方案，适用于构建安全的以太坊DApps。",
      technology: "Optimistic Rollup",
      website: "https://arbitrum.io",
      explorer: "https://arbiscan.io",
      bridge: "https://bridge.arbitrum.io"
    }
  },
  {
    id: 4,
    name: "Blast",
    icon: "./img/blast.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tvl: 6100000000,
    tokenPrice: 0.00022,
    details: {
      description: "Blast是一个创新的L2网络，专注于原生收益和ETH质押。",
      technology: "Optimistic Rollup",
      website: "https://blast.io",
      explorer: "https://blastscan.io",
      bridge: "https://blast.io/bridge"
    }
  },
  // ... 其他链的数据
];

export function getLayer2ByName(name: string): Layer2Data | undefined {
  return layer2Data.find(l2 => l2.name.toLowerCase() === name.toLowerCase());
} 
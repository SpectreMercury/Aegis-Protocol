"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";
import { type Chain } from "viem";


const queryClient = new QueryClient();

// 定义自定义网络
const customChain: Chain = {
  id: 133, // Hardhat 本地网络 ID
  name: 'HashKey Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: { 
      http: ['https://hashkeychain-testnet.alt.technology'] 
    },
    public: { 
      http: ['https://hashkeychain-testnet.alt.technology'] 
    }
  },
};

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: "c5d8ee40ad3f8a4f9affcc79ad4c47f9",
    appName: "Aegis Protocol",
    chains: [customChain, sepolia], // 添加自定义网络和 Sepolia 测试网
  }),
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 
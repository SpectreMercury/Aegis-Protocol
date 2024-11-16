"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: "c5d8ee40ad3f8a4f9affcc79ad4c47f9",
    appName: "Aegis Protocol",
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
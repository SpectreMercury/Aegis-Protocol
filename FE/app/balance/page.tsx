"use client";

import { Card } from "@/components/ui/card";
import { TokenETH, TokenUSDC } from "@web3icons/react";

interface TokenBalance {
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
}

export default function BalancePage() {
  // 统一的代币列表
  const tokens: TokenBalance[] = [
    { 
      symbol: "ETH", 
      balance: "0.00", 
      usdValue: "$0.00", 
      icon: "TokenETH",
    },
    { 
      symbol: "USDC", 
      balance: "0.00",
      usdValue: "$0.00", 
      icon: "TokenUSDC" 
    },
    { 
      symbol: "USDT", 
      balance: "0.00", 
      usdValue: "$0.00", 
      icon: "TokenUSDT" 
    },
    { 
      symbol: "DAI", 
      balance: "0.00", 
      usdValue: "$0.00", 
      icon: "TokenDAI" 
    },
  ];

  const TokenList = ({ tokens }: { tokens: TokenBalance[] }) => (
    <div className="grid grid-cols-4 gap-3">
      {tokens.map((token) => (
        <Card key={token.symbol} className="p-3 bg-white hover:bg-neutral-50">
          <div className="flex items-center gap-2 mb-1">
            {token.icon === "TokenETH" && <TokenETH size={24} />}
            {token.icon === "TokenUSDC" && <TokenUSDC size={24} />}
            <div>
              <div className="text-sm font-medium">{token.symbol}</div>
              <div className="text-xs text-muted-foreground">{token.symbol}</div>
            </div>
          </div>
          <div className="space-y-0.5 mt-2">
            <div className="text-lg font-medium">{token.balance}</div>
            <div className="text-sm text-muted-foreground">{token.usdValue}</div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* Layer 2 余额 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Layer 2</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-teal-500 text-white text-sm">
              Deposit
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white text-sm border">
              Withdraw
            </button>
          </div>
        </div>
        <Card className="p-6">
          <TokenList tokens={tokens} />
        </Card>
      </div>

      {/* Layer 1 余额 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Layer 1</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-teal-500 text-white text-sm">
              Bridge
            </button>
          </div>
        </div>
        <Card className="p-6">
          <TokenList tokens={tokens} />
        </Card>
      </div>
    </div>
  );
} 
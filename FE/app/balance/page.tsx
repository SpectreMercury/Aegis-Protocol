"use client";

import { Card } from "@/components/ui/card";
import { TokenETH, TokenUSDC, TokenBTC } from "@web3icons/react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useSystemStore } from '@/lib/store';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 硬编码汇率 (相对于 ETH)
const TOKEN_RATES = {
  ETH: 1,
  USDC: 1/3800,    // 1 ETH = 3800 USDC
  WBTC: 20,        // 1 ETH = 0.05 WBTC
  TLT: 1/2000,     // 1 ETH = 2000 TLT
  MT: 1/2000,      // 1 ETH = 2000 MT
  BLT: 1/5000,     // 1 ETH = 5000 BLT
};

interface TokenBalance {
  symbol: string;
  balance: string;
  ethValue: string;
  usdValue: string;
  icon: string;
}

export default function BalancePage() {
  const tokenBalances = useTokenBalances();
  const ETH_USD_PRICE = 3800;
  const isEmergencyMode = useSystemStore((state) => state.isEmergencyMode);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const calculateValues = (token: { symbol: string, balance: string }) => {
    const balance = parseFloat(token.balance || '0');
    const ethValue = balance * (TOKEN_RATES[token.symbol as keyof typeof TOKEN_RATES] || 0);
    const usdValue = ethValue * ETH_USD_PRICE;
    return {
      ethValue: ethValue.toFixed(6),
      usdValue: `$${usdValue.toFixed(2)}`
    };
  };

  const tokens: TokenBalance[] = tokenBalances.map(token => {
    const values = calculateValues(token);
    return {
      symbol: token.symbol,
      balance: token.balance || '0.00',
      ethValue: `${values.ethValue} ETH`,
      usdValue: values.usdValue,
      icon: `Token${token.symbol}`,
    };
  });

  const TokenList = ({ tokens, layer }: { tokens: TokenBalance[], layer: 'L1' | 'L2' }) => (
    <div className="grid grid-cols-4 gap-3">
      {tokens
        .filter(token => layer === 'L1' ? token.symbol === 'ETH' : true)
        .map((token) => (
          <Card key={token.symbol} className="p-3 bg-white hover:bg-neutral-50">
            <div className="flex items-center gap-2 mb-1">
              {token.icon === "TokenETH" && <TokenETH size={24} />}
              {token.icon === "TokenUSDC" && <TokenUSDC size={24} />}
              {token.icon === "TokenWBTC" && <TokenBTC size={24} />}
              <div>
                <div className="text-sm font-medium">{token.symbol}</div>
                <div className="text-xs text-muted-foreground">{token.symbol}</div>
              </div>
            </div>
            <div className="space-y-0.5 mt-2">
              <div className="text-lg font-medium">{token.balance}</div>
              <div className="text-sm text-muted-foreground">{token.ethValue}</div>
              <div className="text-sm text-muted-foreground">{token.usdValue}</div>
            </div>
          </Card>
        ))}
    </div>
  );

  const handleEmergencyWithdraw = () => {
    setIsWithdrawing(true);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* System Status Indicator */}
      <Card className={cn(
        "p-4 flex items-center justify-between",
        isEmergencyMode ? "bg-red-50" : "bg-green-50"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isEmergencyMode ? "bg-red-500" : "bg-green-500"
          )} />
          <span className="font-medium">
            {isEmergencyMode ? "System Emergency Mode" : "System Normal"}
          </span>
        </div>
        {isEmergencyMode && !isWithdrawing && (
          <Button 
            variant="destructive"
            onClick={handleEmergencyWithdraw}
            className="gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Emergency Withdraw
          </Button>
        )}
      </Card>

      {/* Layer 2 Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Layer 2</h2>
          {!isEmergencyMode && (
            <div className="flex gap-2">
              <Button variant="default">Deposit</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          )}
        </div>
        <Card className={cn(
          "p-6",
          isWithdrawing && "opacity-50"
        )}>
          <TokenList tokens={tokens} layer="L2" />
        </Card>
      </div>

      {/* Layer 1 Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Layer 1</h2>
          {!isEmergencyMode && (
            <Button variant="default">Bridge</Button>
          )}
        </div>
        <Card className="p-6">
          <TokenList 
            tokens={isWithdrawing ? [
              {
                ...tokens.find(t => t.symbol === "ETH")!,
                balance: tokens.reduce((acc, token) => {
                  const ethValue = parseFloat(token.ethValue.split(' ')[0]);
                  return acc + ethValue;
                }, 0).toFixed(6),
                ethValue: "Pending withdrawal...",
                usdValue: "Pending..."
              }
            ] : tokens} 
            layer="L1" 
          />
        </Card>
      </div>
    </div>
  );
} 
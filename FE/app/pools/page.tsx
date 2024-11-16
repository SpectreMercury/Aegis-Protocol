"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenBTC, TokenETH, TokenUSDC } from '@web3icons/react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatUnits } from "viem";

export default function PoolsPage() {
  // Calculate pool rate in ETH terms
  const calculateRate = (reserve0: string, reserve1: string, decimals0: number, decimals1: number) => {
    if (!reserve0 || !reserve1) return "0";
    const amount0 = parseFloat(formatUnits(BigInt(reserve0), decimals0));
    const amount1 = parseFloat(formatUnits(BigInt(reserve1), decimals1));
    return (amount0 / amount1).toFixed(6); // Reversed to show ETH rate
  };

  const mockPools = [
    {
      address: "0x1",
      token0: { symbol: "ETH", decimals: 18 },
      token1: { symbol: "USDC", decimals: 6 },
      reserve0: "10000000000000000000", // 10 ETH
      reserve1: "38000000000", // 38,000 USDC
    },
    {
      address: "0x2", 
      token0: { symbol: "ETH", decimals: 18 },
      token1: { symbol: "WBTC", decimals: 8 },
      reserve0: "20000000000000000000", // 20 ETH
      reserve1: "100000000", // 1 WBTC
    },
    {
      address: "0x3",
      token0: { symbol: "ETH", decimals: 18 },
      token1: { symbol: "TLT", decimals: 18 },
      reserve0: "15000000000000000000", // 15 ETH
      reserve1: "30000000000000000000000", // 30,000 TLT
    },
    {
      address: "0x4",
      token0: { symbol: "ETH", decimals: 18 },
      token1: { symbol: "MT", decimals: 18 },
      reserve0: "8000000000000000000", // 8 ETH
      reserve1: "16000000000000000000000", // 16,000 MT
    },
    {
      address: "0x5",
      token0: { symbol: "ETH", decimals: 18 },
      token1: { symbol: "BLT", decimals: 18 },
      reserve0: "12000000000000000000", // 12 ETH
      reserve1: "48000000000000000000000", // 48,000 BLT
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Liquidity Pools</h1>
        <Link href="/pool/create">
          <Button className="rounded-full">
            Create Pool
          </Button>
        </Link>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input 
              placeholder="Search token pairs" 
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-6 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
          <div className="col-span-2">Pool</div>
          <div>Reserves</div>
          <div>Price</div>
          <div>TVL</div>
          <div></div>
        </div>

        {mockPools.map((pool) => {
          const ethAmount = parseFloat(formatUnits(BigInt(pool.reserve0), pool.token0.decimals));
          const tvl = (ethAmount * 3800).toFixed(2);
          const rate = calculateRate(pool.reserve0, pool.reserve1, pool.token0.decimals, pool.token1.decimals);

          return (
            <div 
              key={pool.address}
              className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-neutral-50 items-center"
            >
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <TokenETH size={28} className="z-10" />
                  {pool.token1.symbol === "USDC" && <TokenUSDC size={28} />}
                  {pool.token1.symbol === "WBTC" && <TokenBTC size={28} />}
                </div>
                <span className="font-medium">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </span>
              </div>
              <div className="space-y-1">
                <div>{ethAmount.toFixed(2)} ETH</div>
                <div>{formatUnits(BigInt(pool.reserve1), pool.token1.decimals)} {pool.token1.symbol}</div>
              </div>
              <div>
                1 ETH = {rate} {pool.token1.symbol}
              </div>
              <div>
                ${tvl}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Add Liquidity
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

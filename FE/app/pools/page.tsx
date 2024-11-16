"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenETH, TokenUSDC, TokenUSDT, TokenDAI, IconComponentProps } from '@web3icons/react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface Pool {
  id: string;
  token0: {
    symbol: string;
    icon: ForwardRefExoticComponent<Omit<IconComponentProps, "ref"> & RefAttributes<SVGSVGElement>>;
  };
  token1: {
    symbol: string;
    icon: ForwardRefExoticComponent<Omit<IconComponentProps, "ref"> & RefAttributes<SVGSVGElement>>;
  };
  tvl: string;
  volume24h: string;
  apy: string;
}

export default function PoolsPage() {
  const pools: Pool[] = [
    {
      id: "eth-usdc",
      token0: { symbol: "ETH", icon: TokenETH },
      token1: { symbol: "USDC", icon: TokenUSDC },
      tvl: "$1.2M",
      volume24h: "$234.5K",
      apy: "12.34%"
    },
    {
      id: "usdc-usdt",
      token0: { symbol: "USDC", icon: TokenUSDC },
      token1: { symbol: "USDT", icon: TokenUSDT },
      tvl: "$2.5M",
      volume24h: "$456.7K",
      apy: "8.45%"
    },
    {
      id: "eth-dai",
      token0: { symbol: "ETH", icon: TokenETH },
      token1: { symbol: "DAI", icon: TokenDAI },
      tvl: "$890.3K",
      volume24h: "$123.4K",
      apy: "15.67%"
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pools</h1>
        <Button className="rounded-full">
          Create Pool
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input 
              placeholder="Search Paris" 
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline">
            Search
          </Button>
        </div>
      </Card>

      {/* 池列表 */}
      <Card>
        {/* 表头 */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
          <div className="col-span-2">Pool</div>
          <div>TVL</div>
          <div>24H Volume</div>
          <div>APY</div>
          <div></div>
        </div>

        {/* 池列表项 */}
        {pools.map((pool) => (
          <Link 
            href={`/pools/${pool.id}`} 
            key={pool.id}
            className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-neutral-50 items-center"
          >
            <div className="col-span-2 flex items-center gap-2">
              <div className="flex -space-x-2">
                <pool.token0.icon size={28} className="z-10" />
                <pool.token1.icon size={28} />
              </div>
              <span className="font-medium">
                {pool.token0.symbol}/{pool.token1.symbol}
              </span>
            </div>
            <div>{pool.tvl}</div>
            <div>{pool.volume24h}</div>
            <div className="text-green-600">{pool.apy}</div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                Add Liquidity
              </Button>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
} 
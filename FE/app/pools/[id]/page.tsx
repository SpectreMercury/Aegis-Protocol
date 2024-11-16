"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenETH, TokenUSDC } from '@web3icons/react';
import { ArrowLeft, TrendingUp, Wallet2, Activity } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PoolDetailPage() {
  // 模拟池数据
  const pool = {
    token0: { symbol: "ETH", icon: TokenETH },
    token1: { symbol: "USDC", icon: TokenUSDC },
    tvl: "$1.2M",
    volume24h: "$234.5K",
    apy: "12.34%",
    myLiquidity: "$1,234",
    token0Price: "1,800 USDC",
    token1Price: "0.00055 ETH",
    poolShare: "0.12%"
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/pools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <pool.token0.icon size={32} className="z-10" />
            <pool.token1.icon size={32} />
          </div>
          <h1 className="text-2xl font-semibold">
            {pool.token0.symbol}/{pool.token1.symbol} Pool
          </h1>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>总流动性</span>
          </div>
          <div className="text-xl font-semibold">{pool.tvl}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Activity className="h-4 w-4" />
            <span>24h交易量</span>
          </div>
          <div className="text-xl font-semibold">{pool.volume24h}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>APY</span>
          </div>
          <div className="text-xl font-semibold text-green-600">{pool.apy}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Wallet2 className="h-4 w-4" />
            <span>我的流动性</span>
          </div>
          <div className="text-xl font-semibold">{pool.myLiquidity}</div>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4">
            {/* 价格信息 */}
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">价格信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETH 价格</span>
                  <span>{pool.token0Price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">USDC 价格</span>
                  <span>{pool.token1Price}</span>
                </div>
              </div>
            </Card>

            {/* 我的仓位 */}
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">我的仓位</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">池份额</span>
                  <span>{pool.poolShare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">未领取收益</span>
                  <span>$12.34</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href="/pools/add">
                  <Button className="flex-1">添加流动性</Button>
                </Link>
                <Button variant="outline" className="flex-1">移除流动性</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-4">
            {/* 这里可以添加图表和更详细的分析数据 */}
            <div className="text-center text-muted-foreground">
              图表开发中...
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
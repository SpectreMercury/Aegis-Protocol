"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenETH, TokenUSDC, TokenUSDT, TokenDAI, IconComponentProps } from '@web3icons/react';
import { ArrowLeft, ChevronDown, Settings, ArrowDown, Check, Search, X } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Token {
  symbol: string;
  name: string;
  icon: ForwardRefExoticComponent<Omit<IconComponentProps, "ref"> & RefAttributes<SVGSVGElement>>;
  balance: string;
}

interface TokenList {
  id: string;
  name: string;
  tokens: Token[];
}

export default function AddLiquidityPage() {
  const [showTokenList, setShowTokenList] = useState(false);
  const [activeField, setActiveField] = useState<"token0" | "token1" | null>(null);
  const [token0, setToken0] = useState<Token>({ 
    symbol: "ETH", 
    name: "Ethereum",
    icon: TokenETH, 
    balance: "0.0" 
  });
  const [token1, setToken1] = useState<Token>({ 
    symbol: "USDC", 
    name: "USD Coin",
    icon: TokenUSDC, 
    balance: "0.0" 
  });
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedList, setSelectedList] = useState<TokenList>({
    id: "default",
    name: "Default List", 
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: TokenETH, balance: "0.0" },
      { symbol: "USDC", name: "USD Coin", icon: TokenUSDC, balance: "0.0" },
      { symbol: "USDT", name: "Tether", icon: TokenUSDT, balance: "0.0" },
      { symbol: "DAI", name: "Dai", icon: TokenDAI, balance: "0.0" },
    ]
  });

  // 模拟的 token lists
  const tokenLists: TokenList[] = [
    {
      id: "default",
      name: "Default List",
      tokens: [
        { symbol: "ETH", name: "Ethereum", icon: TokenETH, balance: "0.0" },
        { symbol: "USDC", name: "USD Coin", icon: TokenUSDC, balance: "0.0" },
        { symbol: "USDT", name: "Tether", icon: TokenUSDT, balance: "0.0" },
        { symbol: "DAI", name: "Dai", icon: TokenDAI, balance: "0.0" },
      ]
    },
    {
      id: "defi",
      name: "DeFi List",
      tokens: [
        { symbol: "AAVE", name: "Aave", icon: TokenETH, balance: "0.0" },
        { symbol: "UNI", name: "Uniswap", icon: TokenUSDC, balance: "0.0" },
        // ... 更多 DeFi 代币
      ]
    },
    {
      id: "stablecoin",
      name: "Stablecoin List",
      tokens: [
        { symbol: "USDC", name: "USD Coin", icon: TokenUSDC, balance: "0.0" },
        { symbol: "USDT", name: "Tether", icon: TokenUSDT, balance: "0.0" },
        { symbol: "DAI", name: "Dai", icon: TokenDAI, balance: "0.0" },
      ]
    }
  ];

  const handleTokenSelect = (token: Token) => {
    if (activeField === "token0") {
      setToken0(token);
    } else {
      setToken1(token);
    }
    setShowTokenList(false);
  };

  const handleAddLiquidity = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      // TODO: 实际的添加流动性逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-[480px] p-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/pools">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold">Add Liquidity</h2>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* 代币选择和金额输入 */}
        <div className="space-y-2">
          {/* 第一个代币输入 */}
          <div className="rounded-2xl bg-muted p-4">
            <div className="flex justify-between mb-2">
              <Input
                type="number"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                className="border-0 bg-transparent text-2xl w-[200px] p-0 focus-visible:ring-0"
                placeholder="0"
              />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowTokenList(true);
                  setActiveField("token0");
                }}
              >
                <token0.icon size={24} />
                <span>{token0.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Balance: {token0.balance}</span>
              <Button variant="ghost" size="sm" className="h-auto p-0">
                MAX
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-background rounded-full p-2">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          <div className="rounded-2xl bg-muted p-4">
            <div className="flex justify-between mb-2">
              <Input
                type="number"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="border-0 bg-transparent text-2xl w-[200px] p-0 focus-visible:ring-0"
                placeholder="0"
              />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowTokenList(true);
                  setActiveField("token1");
                }}
              >
                <token1.icon size={24} />
                <span>{token1.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Balance: {token1.balance}</span>
              <Button variant="ghost" size="sm" className="h-auto p-0">
                Max
              </Button>
            </div>
          </div>
        </div>

        {/* 添加流动性按钮 */}
        <Button 
          className="w-full mt-4" 
          size="lg"
          onClick={handleAddLiquidity}
        >
          Add Liquidity
        </Button>

        {/* Token List Modal */}
        <Dialog open={showTokenList} onOpenChange={setShowTokenList}>
          <DialogContent className="max-w-[400px] p-0">
            <div className="p-4">
              {/* 标题和关闭按钮行 */}
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">Choose Token</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto"
                  onClick={() => setShowTokenList(false)}
                >
                </Button>
              </div>

              {/* Token List 选择器独立一行 */}
              <div className="mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {selectedList.name}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {tokenLists.map((list) => (
                      <DropdownMenuItem
                        key={list.id}
                        onClick={() => setSelectedList(list)}
                        className="flex items-center justify-between"
                      >
                        {list.name}
                        {selectedList.id === list.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 搜索框和其他内容保持不变 */}
              <div className="relative mb-4">
                <Input 
                  placeholder="Search Token or Contract Address" 
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Common Tokens</div>
                <div className="flex flex-wrap gap-2">
                  {selectedList.tokens.slice(0, 4).map((token) => (
                    <Button
                      key={token.symbol}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleTokenSelect(token)}
                    >
                      <token.icon size={16} />
                      {token.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 代币列表 */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedList.tokens.map((token) => (
                  <Button
                    key={token.symbol}
                    variant="ghost"
                    className="w-full justify-between h-[64px]"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center gap-3">
                      <token.icon size={32} />
                      <div className="text-left">
                        <div>{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{token.balance}</div>
                      {token.balance !== "0.0" && (
                        <div className="text-xs text-muted-foreground">
                          ≈ $0.00
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* 管理代币列表链接 */}
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm"
                  onClick={() => {
                    // TODO: 实现管理代币列表功能
                  }}
                >
                  管理代币列表
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 确认弹窗 */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="max-w-[400px]">
            {!isSuccess ? (
              <>
                <DialogHeader>
                  <DialogTitle>确认添加流动性</DialogTitle>
                  <DialogDescription>
                    请确认您要添加的流动性数量
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {/* 代币数量确认 */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <token0.icon size={20} />
                        <span>{amount0}</span>
                      </div>
                      <span>{token0.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <token1.icon size={20} />
                        <span>{amount1}</span>
                      </div>
                      <span>{token1.symbol}</span>
                    </div>
                  </div>

                  {/* 价格和份额信息 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">价格比率</span>
                      <span>1 {token0.symbol} = 1,800 {token1.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">份额</span>
                      <span>0.01%</span>
                    </div>
                  </div>

                  {/* 提示信息 */}
                  <Alert variant="default" className="bg-muted">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      当您添加流动性时，将获得代表您份额的流动性代币
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                  >
                    取消
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleConfirm}
                  >
                    确认
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>添加流动性成功</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {/* LP 代币信息 */}
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="relative">
                        <token0.icon size={32} className="absolute -left-2" />
                        <token1.icon size={32} className="absolute -right-2" />
                      </div>
                    </div>
                    <div className="mt-8 space-y-1">
                      <div className="text-2xl font-medium">0.0001</div>
                      <div className="text-sm text-muted-foreground">
                        {token0.symbol}/{token1.symbol} LP 代币
                      </div>
                    </div>
                  </div>

                  {/* 详细信息 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">已添加</span>
                      <div className="text-right">
                        <div>{amount0} {token0.symbol}</div>
                        <div>{amount1} {token1.symbol}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">池份额</span>
                      <span>0.01%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowConfirm(false);
                      setIsSuccess(false);
                    }}
                  >
                    关闭
                  </Button>
                  <Link href="/pools" className="flex-1">
                    <Button className="w-full">
                      查看池列表
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
} 
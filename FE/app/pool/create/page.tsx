"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Settings, ChevronDown, ArrowDown, Search } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { commonTokens } from "@/lib/tokens";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI } from "@/lib/contracts";
import { formatUnits, parseAbi, parseUnits } from "viem";
import { ConnectKitButton } from "connectkit";

export default function CreatePoolPage() {
  const { isConnected, address } = useAccount();
  const [showTokenList, setShowTokenList] = useState(false);
  const [activeField, setActiveField] = useState<"token0" | "token1" | null>(null);
  const [token0, setToken0] = useState(commonTokens[0]);
  const [token1, setToken1] = useState(commonTokens[1]);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [tokenBalances, setTokenBalances] = useState<{[key: string]: string}>({});

  // 余额查询逻辑
  const parsedERC20ABI = parseAbi([
    'function balanceOf(address account) external view returns (uint256)',
  ]);

  const contracts = commonTokens.map(token => ({
    address: token.address as `0x${string}`,
    abi: parsedERC20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  }));

  const { data: balanceData } = useReadContracts({
    contracts: address ? contracts : [],
  });

  useEffect(() => {
    if (balanceData) {
      const formattedBalances = balanceData.reduce((acc, balance, index) => {
        if (balance.status === 'success') {
          const token = commonTokens[index];
          const formatted = formatUnits(balance.result as bigint, token.decimals);
          acc[token.symbol] = formatted;
        }
        return acc;
      }, {} as {[key: string]: string});
      
      setTokenBalances(formattedBalances);
    }
  }, [balanceData]);

  const formattedToken0Balance = tokenBalances[token0.symbol] || '0.0';
  const formattedToken1Balance = tokenBalances[token1.symbol] || '0.0';

  // 合约交互相关代码保持不变
  const { writeContract: approveToken0 } = useWriteContract();
  const { writeContract: approveToken1 } = useWriteContract();
  const { writeContract: createPool } = useWriteContract();

  const handleTokenSelect = (token: typeof commonTokens[0]) => {
    if (activeField === "token0") {
      setToken0(token);
    } else {
      setToken1(token);
    }
    setShowTokenList(false);
  };

  const handleCreatePool = async () => {
    if (!isConnected || !amount0 || !amount1) return;

    try {
      // 1. Approve token0
      const tx1 = await approveToken0({
        address: token0.address as `0x${string}`,
        abi: parseAbi(['function approve(address spender, uint256 amount) returns (bool)']),
        functionName: 'approve',
        args: [SWAP_ROUTER_ADDRESS, parseUnits(amount0, token0.decimals)],
      });

      // 2. Approve token1
      const tx2 = await approveToken1({
        address: token1.address as `0x${string}`,
        abi: parseAbi(['function approve(address spender, uint256 amount) returns (bool)']),
        functionName: 'approve',
        args: [SWAP_ROUTER_ADDRESS, parseUnits(amount1, token1.decimals)],
      });

      // 3. Create pool
      const tx3 = await createPool({
        address: SWAP_ROUTER_ADDRESS,
        abi: parseAbi(SWAP_ROUTER_ABI),
        functionName: 'createPool',
        args: [
          token0.address,
          token1.address,
          parseUnits(amount0, token0.decimals),
          parseUnits(amount1, token1.decimals)
        ],
      });

    } catch (error) {
      console.error('创建池子失败:', error);
    }
  };

  const handleMaxAmount = (field: "token0" | "token1") => {
    if (field === "token0") {
      setAmount0(formattedToken0Balance);
    } else {
      setAmount1(formattedToken1Balance);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-[480px] p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/pools">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold">创建新池子</h2>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          {/* Token0 输入 */}
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
                <span>{token0.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>余额: {formattedToken0Balance}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0"
                onClick={() => handleMaxAmount("token0")}
              >
                最大
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-background rounded-full p-2">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* Token1 输入 */}
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
                <span>{token1.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>余额: {formattedToken1Balance}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0"
                onClick={() => handleMaxAmount("token1")}
              >
                最大
              </Button>
            </div>
          </div>
        </div>

        {/* 创建池子按钮 */}
        {isConnected ? (
          <Button 
            className="w-full mt-4" 
            onClick={handleCreatePool}
            disabled={!amount0 || !amount1}
          >
            创建池子
          </Button>
        ) : (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <Button className="w-full mt-4" onClick={show}>
                连接钱包
              </Button>
            )}
          </ConnectKitButton.Custom>
        )}
      </Card>

      {/* 代币列表弹窗 */}
      <Dialog open={showTokenList} onOpenChange={setShowTokenList}>
        <DialogContent className="max-w-[400px] p-0">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">选择代币</h2>
            <div className="relative mb-4">
              <Input 
                placeholder="搜索代币名称" 
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {commonTokens.map((token) => (
                <Button
                  key={token.symbol}
                  variant="ghost"
                  className="w-full justify-between h-[64px]"
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {token.symbol.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div>{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {tokenBalances[token.symbol] || '0.0'}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
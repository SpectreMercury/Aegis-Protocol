"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, ChevronDown, ArrowDownUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccount, useReadContracts, useWriteContract } from 'wagmi'
import { ConnectKitButton } from "connectkit";
import { commonTokens, Token } from "@/lib/tokens";
import { parseUnits, formatUnits } from "viem";
import { SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, ERC20_ABI } from "@/lib/contracts";
import { parseAbi } from 'viem';

export default function SwapPage() {
  const { isConnected, address } = useAccount();
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [showTokenList, setShowTokenList] = useState(false);
  const [activeField, setActiveField] = useState<"input" | "output" | null>(null);
  const [inputToken, setInputToken] = useState(commonTokens[0]);
  const [outputToken, setOutputToken] = useState(commonTokens[1]);
  const [tokenBalances, setTokenBalances] = useState<{[key: string]: string}>({});

  // 将 ABI 转换为正确的格式
  const parsedERC20ABI = parseAbi([
    'function balanceOf(address account) external view returns (uint256)',
  ]);

  // 构建合约调用配置
  const contracts = commonTokens.map(token => ({
    address: token.address as `0x${string}`,
    abi: parsedERC20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  }));

  // 使用 useContractReads 批量读取余额
  const { data: balanceData } = useReadContracts({
    contracts: address ? contracts : [],
  });

  // 处理余额数据
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

  // 获取当前选中代币的余额
  const formattedInputBalance = tokenBalances[inputToken.symbol] || '0.0';
  const formattedOutputBalance = tokenBalances[outputToken.symbol] || '0.0';

  // 使用新的 useWriteContract hook
  const { writeContract: approveToken } = useWriteContract();
  const { writeContract: executeSwap } = useWriteContract();

  // 处理代币交换
  const handleSwapTokens = async () => {
    if (!isConnected || !inputAmount) return;

    try {
      // 1. 先approve Router合约
      await approveToken({
        address: inputToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [
          SWAP_ROUTER_ADDRESS,
          parseUnits(inputAmount, inputToken.decimals)
        ],
      });

      // 2. 执行swap
      await executeSwap({
        address: SWAP_ROUTER_ADDRESS as `0x${string}`,
        abi: SWAP_ROUTER_ABI,
        functionName: 'swap',
        args: [
          inputToken.address,
          outputToken.address,
          parseUnits(inputAmount, inputToken.decimals)
        ],
      });

    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const handleTokenSelect = (token: Token) => {
    if (activeField === "input") {
      setInputToken(token);
    } else {
      setOutputToken(token);
    }
    setShowTokenList(false);
  };

  // 修改 Token 显示部分
  const TokenDisplay = ({ token }: { token: Token }) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
        {token.symbol.charAt(0)}
      </div>
      <span>{token.symbol}</span>
      <ChevronDown className="h-4 w-4" />
    </div>
  );

  // Token List Modal 中的渲染部分也需要修改
  const renderTokenList = () => (
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
  );

  // 添加代币切换功能
  const switchTokens = () => {
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <Card className="w-full max-w-[480px] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Swap</h2>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

   
          <div className="rounded-2xl bg-muted p-4 mb-1">
            <div className="flex justify-between mb-2">
              <Input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="border-0 bg-transparent text-2xl w-[200px] p-0 focus-visible:ring-0"
                placeholder="0"
              />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowTokenList(true);
                  setActiveField("input");
                }}
              >
                <TokenDisplay token={inputToken} />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Balance: {formattedInputBalance} {inputToken.symbol}
            </div>
          </div>

          {/* 切换按钮 */}
          <div className="flex justify-center -my-2 z-10 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-background rounded-full border shadow-md"
              onClick={switchTokens}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* 代币输出 */}
          <div className="rounded-2xl bg-muted p-4 mt-1">
            <div className="flex justify-between mb-2">
              <Input
                type="number"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="border-0 bg-transparent text-2xl w-[200px] p-0 focus-visible:ring-0"
                placeholder="0"
              />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowTokenList(true);
                  setActiveField("output");
                }}
              >
                <TokenDisplay token={outputToken} />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Balance: {formattedOutputBalance} {outputToken.symbol}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span>1 {inputToken.symbol} = 3,800 {outputToken.symbol}</span>
            </div>
          </div>

          {/* Swap/Connect 按钮 */}
          {isConnected ? (
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={() => handleSwapTokens()}
            >
              Swap
            </Button>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={show}
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          )}
        </Card>
      </div>

      {/* Token List Modal */}
      <Dialog open={showTokenList} onOpenChange={setShowTokenList}>
        <DialogContent className="max-w-[400px] p-0">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Choose Token</h2>
            <div className="relative mb-4">
              <Input 
                placeholder="搜索代币名称" 
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            {renderTokenList()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
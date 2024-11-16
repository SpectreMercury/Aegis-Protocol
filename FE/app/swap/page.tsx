"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, ChevronDown, ArrowDownUp, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TokenETH, TokenUSDC, TokenUSDT, TokenDAI } from '@web3icons/react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccount } from 'wagmi'
import { ConnectKitButton } from "connectkit";

export default function SwapPage() {
  const { isConnected } = useAccount()
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [showTokenList, setShowTokenList] = useState(false);
  const [activeField, setActiveField] = useState<"input" | "output" | null>(null);
  const [inputToken, setInputToken] = useState({ symbol: "ETH", icon: TokenETH });
  const [outputToken, setOutputToken] = useState({ symbol: "USDC", icon: TokenUSDC });

  const tokenList = [
    { symbol: "ETH", name: "Ethereum", icon: TokenETH, balance: "0.0" },
    { symbol: "USDC", name: "USD Coin", icon: TokenUSDC, balance: "0.0" },
    { symbol: "USDT", name: "Tether", icon: TokenUSDT, balance: "0.0" },
    { symbol: "DAI", name: "Dai", icon: TokenDAI, balance: "0.0" },
  ];

  const handleSwapTokens = () => {
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);
    
    const tempAmount = inputAmount;
    setInputAmount(outputAmount);
    setOutputAmount(tempAmount);
  };

  const handleTokenSelect = (token: typeof tokenList[0]) => {
    if (activeField === "input") {
      setInputToken({ symbol: token.symbol, icon: token.icon });
    } else {
      setOutputToken({ symbol: token.symbol, icon: token.icon });
    }
    setShowTokenList(false);
  };

  // Swap 操作函数
  // const handleSwapOrConnect = () => {
  //   if (!isConnected) {
  //     open(); // 打开连接钱包的 modal
  //     return;
  //   }
  //   // 这里添加 swap 逻辑
  //   console.log("Swapping tokens...");
  // };

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
                <inputToken.icon size={24} />
                <span>{inputToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Balance: 0.0 {inputToken.symbol}
            </div>
          </div>

          {/* 切换按钮 */}
          <div className="flex justify-center -my-2 z-10 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-background rounded-full border shadow-md"
              onClick={handleSwapTokens}
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
                <outputToken.icon size={24} />
                <span>{outputToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Balance: 0.0 {outputToken.symbol}
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
            <h2 className="text-xl font-semibold mb-4">选择代币</h2>
            <div className="relative mb-4">
              <Input 
                placeholder="搜索代币名称" 
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {tokenList.map((token) => (
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
                  <div className="text-right text-sm text-muted-foreground">
                    {token.balance}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
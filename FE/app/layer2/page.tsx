/* eslint-disable @next/next/no-img-element */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Layer2Data {
  chainId: number;
  name: string;
  icon: string;
  stateValidation: string;
  challengePeriod: string;
  dataAvailability: string;
  exitWindow: string;
  sequencer: string;
  proposer: string;
  tvl: number;
  tokenPrice: number;
  metrics?: {
    tvlChange24h: number;
    transactions7d: number;
    transactionsChange7d: number;
    fees7d: number;
  };
}

export default function Layer2Page() {
  const [layer2Data, setLayer2Data] = useState<Layer2Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [selectedL2, setSelectedL2] = useState<Layer2Data | null>(null);
  const [amount, setAmount] = useState("");
  const [balance] = useState("1000");

  useEffect(() => {
    const fetchL2Data = async () => {
      try {
        const response = await fetch('/api/l2data');
        if (!response.ok) {
          throw new Error('Failed to fetch L2 data');
        }
        const data = await response.json();
        setLayer2Data(data);
      } catch (error) {
        console.error('Error fetching L2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchL2Data();
  }, []);

  const handleBuy = (l2: Layer2Data) => {
    setSelectedL2(l2);
    setAmount("");
    setShowBuyDialog(true);
  };

  const handleSell = (l2: Layer2Data) => {
    setSelectedL2(l2);
    setAmount("");
    setShowSellDialog(true);
  };

  const handleMax = () => {
    setAmount(balance);
  };

  const formatTVL = (value: number): string => {
    if (value === 0) return '$0';
    
    const billion = 1000000000;
    const million = 1000000;
    
    if (value >= billion) {
      return `$${(value / billion).toFixed(2)}B`;
    } else if (value >= million) {
      return `$${(value / million).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString(undefined, {
        maximumFractionDigits: 2
      })}`;
    }
  };

  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <div 
          key={index}
          className="grid grid-cols-10 gap-4 p-4 border-b hover:bg-neutral-50/50 items-center"
        >
          <div className="col-span-2 flex items-center gap-2">
            <Skeleton circle width={24} height={24} />
            <Skeleton width={100} />
          </div>
          <div><Skeleton width={80} /></div>
          <div><Skeleton width={60} /></div>
          <div><Skeleton width={70} /></div>
          <div><Skeleton width={50} /></div>
          <div><Skeleton width={80} /></div>
          <div><Skeleton width={80} /></div>
          <div><Skeleton width={120} /></div>
          <div className="flex flex-col gap-2">
            <Skeleton width="100%" height={32} />
            <Skeleton width="100%" height={32} />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <Card className="bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-10 gap-4 p-4 border-b font-medium">
          <div className="col-span-1">Chain</div>
          <div className="col-span-2 flex items-center gap-2">State Validation</div>
          <div>Challenge Period</div>
          <div>Data Availability</div>
          <div>Exit Window</div>
          <div>Sequencer</div>
          <div>Proposer</div>
          <div>TVL</div>
          <div>Actions</div>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          layer2Data.map((l2) => (
            <div 
              key={l2.chainId}
              className="grid grid-cols-10 gap-4 p-4 border-b hover:bg-neutral-50/50 items-center text-sm"
            >
              <div className="col-span-1 flex items-center gap-2">
                <img src={l2.icon} alt={l2.name} className="w-6 h-6" />
                <span>{l2.name}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">{l2.stateValidation}</div>
              <div>{l2.challengePeriod}</div>
              <div>{l2.dataAvailability}</div>
              <div>{l2.exitWindow}</div>
              <div>{l2.sequencer}</div>
              <div>{l2.proposer}</div>
              <div className="font-mono">
                {formatTVL(l2.tvl)}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleBuy(l2)}
                >
                  Buy
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSell(l2)}
                >
                  Sell
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>

      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {selectedL2?.name} with ETH</DialogTitle>
            <DialogDescription>
              Current Price: 1 ETH = {selectedL2 ? (1 / selectedL2?.tokenPrice).toFixed(0) : 0} {selectedL2?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (ETH)</label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              You will receive: {amount ? (parseFloat(amount) / (selectedL2?.tokenPrice || 1)).toFixed(2) : '0'} {selectedL2?.name}
            </div>
            <Button className="w-full">Buy</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell {selectedL2?.name} for ETH</DialogTitle>
            <DialogDescription>
              Current Price: 1 {selectedL2?.name} = {selectedL2?.tokenPrice} ETH
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Amount ({selectedL2?.name})</label>
                <div className="text-sm text-muted-foreground">
                  Balance: {balance} {selectedL2?.name}
                </div>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                  onClick={handleMax}
                >
                  MAX
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              You will receive: {amount ? (parseFloat(amount) * (selectedL2?.tokenPrice || 0)).toFixed(6) : '0'} ETH
            </div>
            <Button className="w-full">Sell</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
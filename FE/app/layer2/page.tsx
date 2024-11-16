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
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Layer2Data {
  id: number;
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
}

const layer2Data: Layer2Data[] = [
  {
    id: 1,
    name: "Arbitrum One",
    icon: "./img/arbitrum.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "6d 8h",
    dataAvailability: "Onchain",
    exitWindow: "7d",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tvl: 15200000000,
    tokenPrice: 0.00026
  },
  {
    id: 2,
    name: "Base",
    icon: "./img/base.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "3d 12h",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tvl: 8100000000,
    tokenPrice: 0.00018
  },
  {
    id: 3,
    name: "OP Mainnet",
    icon: "./img/op.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "3d 12h",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tvl: 7200000000,
    tokenPrice: 0.00035
  },
  {
    id: 4,
    name: "Blast",
    icon: "./img/blast.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tvl: 6100000000,
    tokenPrice: 0.00022
  },
  {
    id: 5,
    name: "Scroll",
    icon: "./img/scroll.webp",
    stateValidation: "ZK proofs (SN)",
    challengePeriod: "",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tvl: 5200000000,
    tokenPrice: 0.00019
  },
  {
    id: 6,
    name: "Linea",
    icon: "./img/linea.webp",
    stateValidation: "ZK proofs (SN)",
    challengePeriod: "",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tvl: 4800000000,
    tokenPrice: 0.00015
  },
  {
    id: 7,
    name: "ZKsync Era",
    icon: "./img/zksync.webp",
    stateValidation: "ZK proofs (ST, SN)",
    challengePeriod: "",
    dataAvailability: "Onchain (SD)",
    exitWindow: "None",
    sequencer: "Enqueue via L1",
    proposer: "Cannot withdraw",
    tvl: 4500000000,
    tokenPrice: 0.00028
  },
  {
    id: 8,
    name: "Starknet",
    icon: "./img/starknet.webp",
    stateValidation: "ZK proofs (ST)",
    challengePeriod: "",
    dataAvailability: "Onchain (SD)",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tvl: 4100000000,
    tokenPrice: 0.00032
  },
  {
    id: 9,
    name: "Mode",
    icon: "./img/mode.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tvl: 3800000000,
    tokenPrice: 0.00012
  },
  {
    id: 10,
    name: "Fuel Ignition",
    icon: "./img/fuel.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tvl: 3500000000,
    tokenPrice: 0.00014
  }
];

export default function Layer2Page() {
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [selectedL2, setSelectedL2] = useState<Layer2Data | null>(null);
  const [amount, setAmount] = useState("");

  const handleBuy = (l2: Layer2Data) => {
    setSelectedL2(l2);
    setShowBuyDialog(true);
  };

  const handleSell = (l2: Layer2Data) => {
    setSelectedL2(l2);
    setShowSellDialog(true);
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <Card className="bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-8 gap-4 p-4 border-b text-xs font-medium text-muted-foreground tracking-wide uppercase">
          <div className="col-span-2">Name</div>
          <div>State Validation</div>
          <div>Data Availability</div>
          <div>Exit Window</div>
          <div>Sequencer</div>
          <div>Proposer</div>
          <div>TVL</div>
          <div className="text-right">Actions</div>
        </div>

        {layer2Data.map((l2) => (
          <div 
            key={l2.id} 
            className="grid grid-cols-8 gap-4 p-4 border-b hover:bg-neutral-50/50 items-center text-sm"
          >
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  <img 
                    src={l2.icon} 
                    alt={l2.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="font-medium">{l2.name}</span>
              </div>
            </div>
            <div className="text-neutral-600">{l2.stateValidation}</div>
            <div className="text-neutral-600">{l2.dataAvailability}</div>
            <div className={cn(
              "text-neutral-600",
              l2.exitWindow === "None" && "text-red-500"
            )}>{l2.exitWindow}</div>
            <div className="text-neutral-600">{l2.sequencer}</div>
            <div className={cn(
              "text-neutral-600",
              l2.proposer === "Cannot withdraw" && "text-red-500"
            )}>{l2.proposer}</div>
            <div className="font-mono">{l2.tvl} ETH</div>
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm"
                variant="outline" 
                className="rounded-full text-xs px-4"
                onClick={() => handleBuy(l2)}
              >
                Buy
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs px-4"
                onClick={() => handleSell(l2)}
              >
                Sell
              </Button>
            </div>
          </div>
        ))}
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
              <label className="text-sm font-medium">Amount ({selectedL2?.name})</label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
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
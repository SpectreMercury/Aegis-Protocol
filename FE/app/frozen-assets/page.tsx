'use client';

import { useEffect, useState } from 'react';
import { commonTokens, Token } from '@/lib/tokens';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FrozenAsset extends Token {
  frozenBalance?: string;
  totalSupply?: string;
}

export default function FrozenAssetsPage() {
  const [frozenAssets, setFrozenAssets] = useState<FrozenAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock frozen assets data
  const mockFrozenData = () => {
    return commonTokens.map(token => ({
      ...token,
      // Mock frozen balance
      frozenBalance: (Math.random() * 1000).toFixed(4),
      // Mock total supply
      totalSupply: (Math.random() * 9000 + 1000).toFixed(4)
    }));
  };

  useEffect(() => {
    setTimeout(() => {
      setFrozenAssets(mockFrozenData());
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Frozen Assets Overview</h1>
        <p className="text-muted-foreground">
          Block Range: 12570 - 1116788
        </p>
      </div>

      <div className="grid gap-6">
        {frozenAssets.map((asset) => (
          <Card key={asset.address} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Frozen Amount: {asset.frozenBalance}</p>
                <p className="text-sm text-muted-foreground">
                  Total Supply: {asset.totalSupply}
                </p>
              </div>
            </div>
            <Progress 
              value={Number(asset.frozenBalance) / (Number(asset.totalSupply)) * 100} 
              className="h-2"
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Frozen Ratio: {((Number(asset.frozenBalance) / Number(asset.totalSupply)) * 100).toFixed(2)}%
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
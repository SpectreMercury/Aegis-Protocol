import { NextResponse } from 'next/server';
import { layer2Configs } from '@/lib/layer2Config';

export const dynamic = 'force-dynamic';

interface ChainTVLResponse {
  gecko_id: string;
  tvl: number;
  tokenSymbol: string;
  cmcId: string | null;
  name: string;
  chainId: number;
}

export async function GET() {
  try {
    // 使用 DeFiLlama API
    const response = await fetch('https://api.llama.fi/v2/chains', {
      headers: {
        'accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from DeFiLlama');
    }

    const chainData: ChainTVLResponse[] = await response.json();

    // 合并配置和实时数据
    const combinedData = layer2Configs.map(config => {
      const chainInfo = chainData.find(
        chain => chain.chainId === config.chainId
      );

      return {
        ...config,
        tvl: chainInfo?.tvl || 0,
        metrics: {
          tvlChange24h: 0, // 如果需要24h变化，需要另外调用API
          transactions7d: 0,
          transactionsChange7d: 0,
          fees7d: 0
        }
      };
    });

    // 检查数据
    console.log('Chain data from DeFiLlama:', chainData);
    console.log('Combined data:', combinedData);

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching L2 data:', error);
    // 如果API调用失败，返回配置数据作为后备
    const fallbackData = layer2Configs.map(config => ({
      ...config,
      tvl: 0,
      metrics: {
        tvlChange24h: 0,
        transactions7d: 0,
        transactionsChange7d: 0,
        fees7d: 0
      }
    }));

    return NextResponse.json(fallbackData);
  }
}
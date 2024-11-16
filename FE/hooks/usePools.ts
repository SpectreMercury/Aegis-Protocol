import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';
import { SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI } from '@/lib/contracts';
import { commonTokens } from '@/lib/tokens';
import { parseAbi } from 'viem';

export interface Pool {
  token0: typeof commonTokens[0];
  token1: typeof commonTokens[0];
  address: string;
  reserve0?: string;
  reserve1?: string;
}

export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取所有可能的代币对组合
  const tokenPairs = commonTokens.flatMap((token0, i) =>
    commonTokens.slice(i + 1).map(token1 => [token0, token1])
  );

  // 查询每个代币对是否存在池子
  const { data: poolAddresses } = useReadContracts({
    contracts: tokenPairs.map(([token0, token1]) => ({
      address: SWAP_ROUTER_ADDRESS as `0x${string}`,
      abi: parseAbi(SWAP_ROUTER_ABI),
      functionName: 'pools',
      args: [token0.address, token1.address],
    })),
    query: {
      enabled: true,
      refetchInterval: 5000 // 每5秒刷新一次
    }
  });

  // 查询池子的储备金额
  const { data: poolReserves } = useReadContracts({
    contracts: pools.flatMap(pool => [
      {
        address: pool.address as `0x${string}`,
        abi: parseAbi(['function reserve0() view returns (uint256)']),
        functionName: 'reserve0',
      },
      {
        address: pool.address as `0x${string}`,
        abi: parseAbi(['function reserve1() view returns (uint256)']),
        functionName: 'reserve1',
      }
    ]),
    query: {
      enabled: pools.length > 0,
      refetchInterval: 5000
    }
  });

  useEffect(() => {
    if (poolAddresses) {
      const activePools = poolAddresses
        .map((result, i) => {
          if (result.status === 'success' && result.result !== '0x0000000000000000000000000000000000000000') {
            const [token0, token1] = tokenPairs[i];
            return {
              token0,
              token1,
              address: result.result,
            };
          }
          return null;
        })
        .filter((pool): pool is Pool => pool !== null);

      setPools(activePools);
    }
  }, [poolAddresses]);

  useEffect(() => {
    if (poolAddresses) {
      setIsLoading(false);
    }
  }, [poolAddresses]);

  // 更新池子储备金额
  useEffect(() => {
    if (!isLoading && poolReserves) {
      const updatedPools = pools.map((pool, i) => ({
        ...pool,
        reserve0: poolReserves[i * 2]?.result?.toString(),
        reserve1: poolReserves[i * 2 + 1]?.result?.toString(),
      }));
      setPools(updatedPools);
    }
  }, [poolReserves]);

  return { pools: pools || [], isLoading };
}
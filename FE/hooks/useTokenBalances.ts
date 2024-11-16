import { useAccount, useReadContracts } from 'wagmi';
import { parseAbi, formatUnits } from 'viem';
import { commonTokens } from '@/lib/tokens';
import { useEffect } from 'react';

export function useTokenBalances() {
  const { address } = useAccount();
  
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

  // 使用 useReadContracts 批量读取余额
  const { data: balanceData, isSuccess } = useReadContracts({
    contracts: address ? contracts : [],
    query: {
      enabled: Boolean(address),
      refetchInterval: 3000, // 每3秒刷新一次
    }
  });

  // 添加日志来调试
  useEffect(() => {
    if (isSuccess && balanceData) {
      console.log('获取到新的余额数据:', balanceData);
    }
  }, [balanceData, isSuccess]);

  // 处理余额数据
  const tokenBalances = commonTokens.map((token, index) => {
    const balance = balanceData?.[index];
    const formattedBalance = balance?.status === 'success' ? 
      formatUnits(balance.result as bigint, token.decimals) : 
      '0.0';
    
    // 添加余额变化日志
    console.log(`${token.symbol} 余额:`, formattedBalance);
    
    return {
      ...token,
      balance: formattedBalance
    };
  });

  return tokenBalances;
} 
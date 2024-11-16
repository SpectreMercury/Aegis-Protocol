export const SWAP_ROUTER_ADDRESS = "0x797dE7CF79aC626CD943Ef921c5c99E50C5FD140";

export const SWAP_ROUTER_ABI = [
  "function createPool(address tokenA, address tokenB) external returns (address pool)",
  "function swap(address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256 amountOut)",
  "function pools(address token0, address token1) external view returns (address)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)"
]; 
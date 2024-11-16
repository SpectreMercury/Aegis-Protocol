// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SwapPool.sol";

contract SwapRouter is ReentrancyGuard {
    mapping(address => mapping(address => address)) public pools;
    
    event PoolCreated(address token0, address token1, address pool);
    
    function createPool(address tokenA, address tokenB, uint256 amount0, uint256 amount1) external returns (address pool) {
        require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(pools[token0][token1] == address(0), "POOL_EXISTS");
        
        pool = address(new SwapPool(token0, token1));
        pools[token0][token1] = pool;
        pools[token1][token0] = pool;
        
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        
        IERC20(token0).approve(pool, amount0);
        IERC20(token1).approve(pool, amount1);
        
        SwapPool(pool).addLiquidity(amount0, amount1);
        
        emit PoolCreated(token0, token1, pool);
    }
    
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        address pool = pools[tokenIn][tokenOut];
        require(pool != address(0), "POOL_NOT_FOUND");
        
        IERC20(tokenIn).transferFrom(msg.sender, pool, amountIn);
        amountOut = SwapPool(pool).swap(tokenIn, amountIn, msg.sender);
    }
} 
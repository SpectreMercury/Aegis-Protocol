// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapPool is ERC20, ReentrancyGuard {
    address public immutable token0;
    address public immutable token1;
    uint256 public reserve0;
    uint256 public reserve1;
    
    constructor(address _token0, address _token1) ERC20("LP Token", "LP") {
        token0 = _token0;
        token1 = _token1;
    }
    
    // 获取用户在池子中的份额
    function getUserPosition(address user) external view returns (uint256 amount0, uint256 amount1) {
        uint256 lpBalance = balanceOf(user);
        uint256 totalSupply = totalSupply();
        if (totalSupply > 0) {
            amount0 = (lpBalance * reserve0) / totalSupply;
            amount1 = (lpBalance * reserve1) / totalSupply;
        }
    }
    
    // 添加流动性
    function addLiquidity(uint256 amount0, uint256 amount1) external nonReentrant returns (uint256 liquidity) {
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1);
        } else {
            liquidity = Math.min(
                (amount0 * _totalSupply) / reserve0,
                (amount1 * _totalSupply) / reserve1
            );
        }
        
        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
        
        reserve0 += amount0;
        reserve1 += amount1;
        _mint(msg.sender, liquidity);
    }
    
    // 移除流动性
    function removeLiquidity(uint256 liquidity) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_BURNED");
        
        uint256 _totalSupply = totalSupply();
        amount0 = (liquidity * reserve0) / _totalSupply;
        amount1 = (liquidity * reserve1) / _totalSupply;
        
        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY");
        
        _burn(msg.sender, liquidity);
        reserve0 -= amount0;
        reserve1 -= amount1;
        
        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
    }
    
    // 原有的swap函数保持不变
    function swap(
        address tokenIn,
        uint256 amountIn,
        address to
    ) external nonReentrant returns (uint256 amountOut) {
        require(tokenIn == token0 || tokenIn == token1, "INVALID_TOKEN");
        
        bool isToken0 = tokenIn == token0;
        (uint256 reserveIn, uint256 reserveOut) = isToken0 
            ? (reserve0, reserve1) 
            : (reserve1, reserve0);
            
        amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        
        if (isToken0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
            IERC20(token1).transfer(to, amountOut);
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
            IERC20(token0).transfer(to, amountOut);
        }
    }
}

// 辅助库
library Math {
    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
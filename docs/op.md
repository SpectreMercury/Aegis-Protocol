# 前置
1.安装 docker

安装  just
brew install just
just 类似 maker 的命令行工具

安装 eth2-testnet-genesis
生成以太坊 L1 信标链（Beacon Chain）的创世状态
go install github.com/protolambda/eth2-testnet-genesis@latest
eth2-testnet-genesis --help

强制重新安装semgrep 指定版本
pipx install --force semgrep==1.90.0

创建 env 文件
touch .envrc
vim .envrc

# 配置文件
.envrc
packages/contracts-bedrock/deploy-config/*.json

# 启动测试网
### 1. 首先确保子模块已更新
make submodules

###  2  直接构建所有
make build


### 3. 启动开发网络
make devnet-up

### 如果需要查看日志
make devnet-logs

### 如果需要停止网络
make devnet-down

### 如果需要清理环境
make devnet-clean

# 具体改动文件
packages/contracts-bedrock/src/L1/OptimismPortal2.sol
packages/contracts-bedrock/src/L1/interfaces/IOptimismPortal2.sol
packages/contracts-bedrock/src/L1/interfaces/IOptimismPortalInterop.sol
optimism/packages/contracts-bedrock/src/L1/L2OutputOracle.sol
暂停之后，暂停 rollup stateRoot 

# 调用 pause unpause
### 权限控制
需要superchainConfigGuardian权限，
在deploy-config 中设置
### 合约地址
在 packages/contracts-bedrock/deployments/  对应链文件中 OptimismPortalProxy

// 创建合约实例
  const portalAddress = "YOUR_OPTIMISM_PORTAL2_ADDRESS";
  const portalContract = new ethers.Contract(portalAddress, abi, signer);

  try {
    // 1. 查询 guardian 地址
    const guardianAddress = await portalContract.guardian();
    console.log("Guardian address:", guardianAddress);

    // 2. 暂停系统
    const pauseTx = await portalContract.pause();
    await pauseTx.wait(); // 等待交易确认
    console.log("System paused");

    // 3. 恢复系统
    const unpauseTx = await portalContract.unpause();
    await unpauseTx.wait(); // 等待交易确认
    console.log("System unpaused");

  } catch (error) {
    console.error("Error:", error);
  }



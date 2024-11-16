import { ethers } from "hardhat";

async function main() {
  console.log("开始部署合约...");

  try {
    // 部署 SwapRouter
    console.log("正在部署 SwapRouter...");
    const SwapRouter = await ethers.getContractFactory("SwapRouter");
    const swapRouter = await SwapRouter.deploy();
    await swapRouter.waitForDeployment();
    const routerAddress = await swapRouter.getAddress();
    console.log("SwapRouter 已部署到:", routerAddress);

    console.log("\n部署完成！");
    console.log("----------------------------------------");
    console.log("合约地址汇总：");
    console.log("SwapRouter:", routerAddress);

  } catch (error) {
    console.error("部署过程中发生错误：");
    console.error(error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 
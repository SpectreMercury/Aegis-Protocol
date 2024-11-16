import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hashkeyTestnet: {
      url: "https://hashkeychain-testnet.alt.technology",
      accounts: ['0x4e1dfbc32ad3d7929902645b081728500d5b57c73db788227a7d9e8690d93cf1'],
      chainId: 133,
      gasPrice: "auto",
    }
  }
};

export default config;

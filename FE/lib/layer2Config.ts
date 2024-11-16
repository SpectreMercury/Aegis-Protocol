export interface Layer2Config {
  chainId: number;
  name: string;
  icon: string;
  stateValidation: string;
  challengePeriod: string;
  dataAvailability: string;
  exitWindow: string;
  sequencer: string;
  proposer: string;
  tokenPrice: number;
  rpc: string;
  explorer: string;
  bridge: string;
}

export const layer2Configs: Layer2Config[] = [
  {
    chainId: 42161,
    name: "Arbitrum One",
    icon: "./img/arbitrum.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "6d 8h",
    dataAvailability: "Onchain",
    exitWindow: "7d",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tokenPrice: 0.00026,
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    bridge: "https://bridge.arbitrum.io"
  },
  {
    chainId: 8453,
    name: "Base",
    icon: "./img/base.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "3d 12h",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tokenPrice: 0.00018,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    bridge: "https://bridge.base.org"
  },
  {
    chainId: 10,
    name: "OP Mainnet",
    icon: "./img/optimism.webp",
    stateValidation: "Fraud proofs (INT)",
    challengePeriod: "3d 12h",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Self propose",
    tokenPrice: 0.00035,
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    bridge: "https://app.optimism.io/bridge"
  },
  {
    chainId: 81457,
    name: "Blast",
    icon: "./img/blast.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00022,
    rpc: "https://rpc.blast.io",
    explorer: "https://blastscan.io",
    bridge: "https://blast.io/bridge"
  },
  {
    chainId: 534352,
    name: "Scroll",
    icon: "./img/scroll.webp",
    stateValidation: "ZK proofs (SN)",
    challengePeriod: "",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00019,
    rpc: "https://rpc.scroll.io",
    explorer: "https://scrollscan.com",
    bridge: "https://scroll.io/bridge"
  },
  {
    chainId: 59144,
    name: "Linea",
    icon: "./img/linea.webp",
    stateValidation: "ZK proofs (SN)",
    challengePeriod: "",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00015,
    rpc: "https://rpc.linea.build",
    explorer: "https://lineascan.build",
    bridge: "https://bridge.linea.build"
  },
  {
    chainId: 324,
    name: "ZKsync Era",
    icon: "./img/zksync-era.webp",
    stateValidation: "ZK proofs (ST, SN)",
    challengePeriod: "",
    dataAvailability: "Onchain (SD)",
    exitWindow: "None",
    sequencer: "Enqueue via L1",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00028,
    rpc: "https://mainnet.era.zksync.io",
    explorer: "https://explorer.zksync.io",
    bridge: "https://portal.zksync.io/bridge"
  },
  {
    chainId: 7777777,
    name: "Starknet",
    icon: "./img/starknet.webp",
    stateValidation: "ZK proofs (ST)",
    challengePeriod: "",
    dataAvailability: "Onchain (SD)",
    exitWindow: "None",
    sequencer: "No mechanism",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00032,
    rpc: "https://mainnet-rpc.starknet.io",
    explorer: "https://starkscan.co",
    bridge: "https://starkgate.starknet.io"
  },
  {
    chainId: 34443,
    name: "Mode",
    icon: "./img/mode.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00012,
    rpc: "https://mainnet.mode.network",
    explorer: "https://explorer.mode.network",
    bridge: "https://bridge.mode.network"
  },
  {
    chainId: 42170,
    name: "Fuel Ignition",
    icon: "./img/fuel.webp",
    stateValidation: "None",
    challengePeriod: "7d",
    dataAvailability: "Onchain",
    exitWindow: "None",
    sequencer: "Self sequence",
    proposer: "Cannot withdraw",
    tokenPrice: 0.00014,
    rpc: "https://mainnet.fuel.network",
    explorer: "https://fuelscan.com",
    bridge: "https://bridge.fuel.network"
  }
]; 
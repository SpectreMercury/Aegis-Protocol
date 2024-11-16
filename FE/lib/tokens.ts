export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance?: string;
}

export const commonTokens: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    balance: "0.0"
  },
  {
    symbol: "TLT",
    name: "TimeLock Token",
    address: "0x200cFF1920bA6EAD4a2B36FE745613EA392D5964",
    decimals: 18,
    balance: "0.0"
  },
  {
    symbol: "MT",
    name: "Mintable Token",
    address: "0x1427e37E62F91eFe9D7a78d1136e0dA476C0db18",
    decimals: 18,
    balance: "0.0"
  },
  {
    symbol: "WBTC",
    name: "WBTC",
    address: "0x3335B36864DD5cC5Ddd5aAebF4750cf6d462d8D9",
    decimals: 8,
    balance: "0.0"
  },
  {
    symbol: "BLT",
    name: "Blacklist Token",
    address: "0x4B553847c64d405572a2BeB92E47Ce1dA15681EA",
    decimals: 18,
    balance: "0.0"
  },
  {
    symbol: "FT",
    name: "Fee Token",
    address: "0x5628b5f0DdAA4392217d0B8B27CF843774595CcB",
    decimals: 18,
    balance: "0.0"
  }
];

export const SWAP_ROUTER_ADDRESS = "0x797dE7CF79aC626CD943Ef921c5c99E50C5FD140"; 
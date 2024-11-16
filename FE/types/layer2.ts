export interface Layer2Data {
  id: number;
  name: string;
  icon: string;
  stateValidation: string;
  challengePeriod: string;
  dataAvailability: string;
  exitWindow: string;
  sequencer: string;
  proposer: string;
  tvl: number;
  tokenPrice: number;
  metrics?: {
    tvlChange24h?: number;
    transactions7d?: number;
    transactionsChange7d?: number;
    fees7d?: number;
  };
  details?: {
    description: string;
    technology: string;
    website: string;
    explorer: string;
    bridge: string;
  };
} 
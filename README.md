![Aegis Logo](docs/logo.jpg)

# Aegis

### Overview

Aegis protocol introduces a new security paradigm for Layer 2 networks, featuring an Escape Smart Contract system that ensures asset safety and network resilience. By implementing automated operation suspension, Layer 1 asset recovery mechanisms, and an insurance pool, it establishes a comprehensive security framework that sets a new standard for Layer 2 protection.

### Bountry

#### Sign Protocol

In Aegis, after AVS obtains users' asset information on L2 through Thegraph, it converts the data into a Merkle tree and records it. When L2 encounters issues, users can use this proof to prioritize withdrawals from guarantors. We utilize Sign Protocol to provide Attestations for the Merkle roots uploaded by AVS.

We created a Schema on Sepolia and implemented Attestation creation in the UpdateMerkleRoot function. We also employed SchemaHook to validate information such as BlockNumber validity, with plans to add Signature verification and other checks in the future.

Key components:
- Schema created on Sepolia for Merkle root attestations
- Attestation integration in UpdateMerkleRoot function
- SchemaHook implementation for validation
- Future enhancements for signature verification

Schema Structure:

```json
[
  {
    "name": "merkleRoot",
    "type": "bytes32"
  },
  {
    "name": "issuer",
    "type": "address"
  },
  {
    "name": "blockNumber",
    "type": "uint256"
  },
  {
    "name": "keyId",
    "type": "uint256"
  }
]
```

Schema: https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x2fc
Create Attestation
https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x2fd
Schema Hook: 
https://sepolia.etherscan.io/tx/0xe1eab7a4ee0280db155dfd512d02ea6800c73208204226e3c51a8a542f9a69ad#eventlog
Code: https://github.com/SpectreMercury/Aegis-Protocol/blob/main/contract/contracts/Aegis.sol#L255

Challenges we faced:
- We didn't find a suitable way to test the Attestation creation locally, which is a challenge for us to debugging it.


#### Scroll 

We deployed our smart contract on Scroll Devnet. 
However, due to a bug in the explorer's verify functionality, we haven't been able to verify the contract yet.


#### Arbitum
```
{
  "chain": {
    "info-json": "[{\"chain-id\":36139093664,\"parent-chain-id\":421614,\"parent-chain-is-arbitrum\":true,\"chain-name\":\"My Arbitrum L3 Chain\",\"chain-config\":{\"homesteadBlock\":0,\"daoForkBlock\":null,\"daoForkSupport\":true,\"eip150Block\":0,\"eip150Hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"eip155Block\":0,\"eip158Block\":0,\"byzantiumBlock\":0,\"constantinopleBlock\":0,\"petersburgBlock\":0,\"istanbulBlock\":0,\"muirGlacierBlock\":0,\"berlinBlock\":0,\"londonBlock\":0,\"clique\":{\"period\":0,\"epoch\":0},\"arbitrum\":{\"EnableArbOS\":true,\"AllowDebugPrecompiles\":false,\"DataAvailabilityCommittee\":false,\"InitialArbOSVersion\":32,\"GenesisBlockNum\":0,\"MaxCodeSize\":24576,\"MaxInitCodeSize\":49152,\"InitialChainOwner\":\"0x19973AA0E2Db09d3FdAb5B01beF12EF15b673877\"},\"chainId\":36139093664},\"rollup\":{\"bridge\":\"0xbE0f0FB9Ae675AC619847421C09f113153dd3045\",\"inbox\":\"0x32A0CC128d4e4563Be9C4F3d351a8833E8430Bf9\",\"sequencer-inbox\":\"0xA0dBE35EcF5375EAC80Ae60f1C9dc5E50c1f4458\",\"rollup\":\"0xA5bFa2F11b506eBE0F62EA25F509f3dc32d291C0\",\"validator-utils\":\"0x7C100c97a54e2D309a194752Df2f66922A802be3\",\"validator-wallet-creator\":\"0xFAd2C6Cb969Ab7B18d78BD63e512b650bb70B570\",\"deployed-at\":97931893}}]",
    "name": "My Arbitrum L3 Chain"
  },
  "parent-chain": {
    "connection": {
      "url": "https://sepolia-rollup.arbitrum.io/rpc"
    }
  },
  "http": {
    "addr": "0.0.0.0",
    "port": 8449,
    "vhosts": [
      "*"
    ],
    "corsdomain": [
      "*"
    ],
    "api": [
      "eth",
      "net",
      "web3",
      "arb",
      "debug"
    ]
  },
  "node": {
    "sequencer": true,
    "delayed-sequencer": {
      "enable": true,
      "use-merge-finality": false,
      "finalize-distance": 1
    },
    "batch-poster": {
      "max-size": 90000,
      "enable": true,
      "parent-chain-wallet": {
        "private-key": "5904005f10d022135454be2efa985f78a37d2643661aaaf3437f605c1b203243"
      }
    },
    "staker": {
      "enable": true,
      "strategy": "MakeNodes",
      "parent-chain-wallet": {
        "private-key": "4e6796241e40e04bbfd02a34b1addb19c0ea3b16be47197972b5136d118a82fd"
      }
    },
    "dangerous": {
      "no-sequencer-coordinator": true,
      "disable-blob-reader": false
    }
  },
  "execution": {
    "forwarding-target": "",
    "sequencer": {
      "enable": true,
      "max-tx-data-size": 85000,
      "max-block-speed": "250ms"
    },
    "caching": {
      "archive": true
    }
  }
}
```

```
{
  "networkFeeReceiver": "0x19973AA0E2Db09d3FdAb5B01beF12EF15b673877",
  "infrastructureFeeCollector": "0x19973AA0E2Db09d3FdAb5B01beF12EF15b673877",
  "staker": "0xc7496D8938D8e4DA3c384db4f43a603085672C1B",
  "batchPoster": "0x76799dc4c74f8D17DcF1a33a15DD56d9a2A4e0BE",
  "chainOwner": "0x19973AA0E2Db09d3FdAb5B01beF12EF15b673877",
  "chainId": 36139093664,
  "chainName": "My Arbitrum L3 Chain",
  "minL2BaseFee": 100000000,
  "parentChainId": 421614,
  "parent-chain-node-url": "https://sepolia-rollup.arbitrum.io/rpc",
  "utils": "0x7C100c97a54e2D309a194752Df2f66922A802be3",
  "rollup": "0xA5bFa2F11b506eBE0F62EA25F509f3dc32d291C0",
  "inbox": "0x32A0CC128d4e4563Be9C4F3d351a8833E8430Bf9",
  "nativeToken": "0x0000000000000000000000000000000000000000",
  "outbox": "0x11661A24dAAe673641B00618C41f7d18a6c7551A",
  "rollupEventInbox": "0xe0843790f71d02af2d34Fb35323cE691D8384b63",
  "challengeManager": "0x1Fb76e7867c999D52FF0AeA51ca4962f9727C493",
  "adminProxy": "0x3FF7a21e3c761c6CaD27D3AfC25bAbd78Be7f252",
  "sequencerInbox": "0xA0dBE35EcF5375EAC80Ae60f1C9dc5E50c1f4458",
  "bridge": "0xbE0f0FB9Ae675AC619847421C09f113153dd3045",
  "upgradeExecutor": "0x3aC9ccECD0988C40bA8482d3b2ec5F0300712073",
  "validatorUtils": "0x7C100c97a54e2D309a194752Df2f66922A802be3",
  "validatorWalletCreator": "0xFAd2C6Cb969Ab7B18d78BD63e512b650bb70B570",
  "deployedAtBlockNumber": 97931893
}
```

Rollup address:
0xA5bFa2F11b506eBE0F62EA25F509f3dc32d291C0
Inbox address:
0x32A0CC128d4e4563Be9C4F3d351a8833E8430Bf9
Outbox address:
0x11661A24dAAe673641B00618C41f7d18a6c7551A
Admin Proxy address:
0x3FF7a21e3c761c6CaD27D3AfC25bAbd78Be7f252
Sequencer Inbox address:
0xA0dBE35EcF5375EAC80Ae60f1C9dc5E50c1f4458
Bridge address:
0xbE0f0FB9Ae675AC619847421C09f113153dd3045
Validator Utils address:
0x7C100c97a54e2D309a194752Df2f66922A802be3
Validator Wallet Creator address:
0xFAd2C6Cb969Ab7B18d78BD63e512b650bb70B570
Upgrade Executor address:
0x3aC9ccECD0988C40bA8482d3b2ec5F0300712073
Deployed at block number:
97931893

##### Validators

0xc7496D8938D8e4DA3c384db4f43a603085672C1B

#####Batch Posters

0x76799dc4c74f8D17DcF1a33a15DD56d9a2A4e0BE

In Aegis, L1SLOAD helps us to communicate with L1 smart contract directly, which we use to read the L1 ownership of the asset.
Code: https://github.com/SpectreMercury/Aegis-Protocol/blob/main/contract/contracts/Aegis.sol#L147

Challenges we faced:
- We faced some issues with the Scroll Devnet, such as the verify function not working.
- We also faced some issues with finding the right slot for L1 smart contract. scripts scanning to slots doesn't work. you can see https://github.com/SpectreMercury/Aegis-Protocol/blob/main/contract/scripts/scroll.ts#L11 for more details.



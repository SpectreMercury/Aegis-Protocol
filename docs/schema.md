https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x2fc

use https://app.sign.global/create-schema

Structure of the schema for the attestations

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

Create Attestation
https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x2fd

Schema Hook: 
https://sepolia.etherscan.io/tx/0xe1eab7a4ee0280db155dfd512d02ea6800c73208204226e3c51a8a542f9a69ad#eventlog

Successfully updated merkle root for key 0
Transaction hash: 0xab2057117b96aebf0e666564c7334fd857c5bdc4d0ff7cbee7fb91508cfe52f7
Stored merkle root: f14a39e7ad83feb927a2dc43e566d9dc51edb5849ecbef41cf95205eb61c3021
Proof verification result: True
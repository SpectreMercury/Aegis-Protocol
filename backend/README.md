.env file

```shell
PROVIDER_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

API 

http://:5000/update_merkle/

Json body

{"0x742d35Cc6634C0532925a3b844Bc454e4438f44e":500000000000000000} # must be number, not string

response

HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 264
Server: Werkzeug/2.0.3 Python/3.10.10
Date: Sat, 16 Nov 2024 15:58:02 GMT

{"attestations":"https://testnet-scan.sign.global/attestation/onchain_evm_11155111_0x3f9","block":7089751,"merkleRoot":"bf302ca9d841375d2aa3a50ca590b080b72639c6a672603d5fe78d2876fa9f1b","txnId":"0xdf405263399ac3666af2627b0ef0f5757c8105c3243dfd47e2fd63a6cf714dda"}

List API:
http://13.212.32.248:5000/get_history/
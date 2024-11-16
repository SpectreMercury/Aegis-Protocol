from flask import Flask, jsonify, request
from loop import update_merkle, generate_merkle_proof
import json
import os
from web3 import Web3
from flask_cors import CORS
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)
load_dotenv()
with open("Aegis.json") as f:
    contract_json = json.load(f)
contract_abi = contract_json["abi"]
contract_address = os.getenv('CONTRACT_ADDRESS')

w3 = Web3(Web3.HTTPProvider(os.getenv('PROVIDER_URL')))
# Create contract instance
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

@app.route('/update_merkle/', methods=['POST'])
def update_merkle_endpoint():
    balances = request.json
    try:
        # Update merkle root and get receipt
        receipt = update_merkle(contract, 0, balances)
        if receipt:
            response = {
                'block': receipt.blockNumber,
                'txnId': receipt.transactionHash.hex(),
                'merkleRoot': contract.functions.getMerkleRoot(0).call().hex(),
                'attestations': 'https://testnet-scan.sign.global/attestation/onchain_evm_11155111_0x3f9'
            }
            return jsonify(response), 200
        else:
            return jsonify({'error': 'Failed to update merkle root'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":    
    app.run(host='0.0.0.0', port=5000)
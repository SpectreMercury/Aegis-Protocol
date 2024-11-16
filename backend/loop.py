from web3 import Web3
from eth_account import Account
import json
import os
from dotenv import load_dotenv
from typing import Dict, List
from eth_utils import keccak

def generate_merkle_root(balances: Dict[str, int]) -> bytes:
    """
    Generate merkle root from address:balance mapping
    
    Args:
        balances: Dictionary mapping addresses to their balance in wei
    Returns:
        bytes32 merkle root
    """
    # Sort addresses to ensure consistent ordering
    sorted_addresses = sorted(balances.keys())

    # Create leaf nodes by hashing address + balance
    leaves = []
    for addr in sorted_addresses:
        # Hash address and balance together
        leaf = keccak(b''.join([
            bytes.fromhex(addr[2:].zfill(40)),
            balances[addr].to_bytes(32, 'big')
        ]))
        leaves.append(leaf)
    
    # Build merkle tree
    tree = leaves
    while len(tree) > 1:
        # Handle odd number of nodes by duplicating last one
        if len(tree) % 2 == 1:
            tree.append(tree[-1])
            
        next_level = []
        for i in range(0, len(tree), 2):
            # Hash pairs of nodes together
            combined = keccak(b''.join(sorted([tree[i], tree[i+1]])))
            next_level.append(combined)
        tree = next_level
        
    return tree[0]

def generate_merkle_proof(balances: Dict[str, int], address: str) -> List[bytes]:
    """
    Generate merkle proof for a specific address
    
    Args:
        balances: Dictionary mapping addresses to their balance in wei
        address: Address to generate proof for
    Returns:
        List of proof elements
    """
    sorted_addresses = sorted(balances.keys())
    leaves = []
    for addr in sorted_addresses:
        leaf = keccak(b''.join([
            bytes.fromhex(addr[2:].zfill(40)),
            balances[addr].to_bytes(32, 'big')
        ]))
        leaves.append(leaf)
    
    # Find index of target address
    target_idx = sorted_addresses.index(address)
    proof = []
    idx = target_idx
    
    tree = leaves
    while len(tree) > 1:
        if len(tree) % 2 == 1:
            tree.append(tree[-1])
            
        proof_element = tree[idx ^ 1]  # Get sibling node
        proof.append(proof_element)
        
        next_level = []
        for i in range(0, len(tree), 2):
            combined = keccak(b''.join(sorted([tree[i], tree[i+1]])))
            next_level.append(combined)
            
        tree = next_level
        idx = idx // 2
        
    return proof

def verify_merkle(contract, key_id: int, address: str, amount: int, proof: List[bytes]) -> bool:
    """
    Verify merkle proof for a claim
    
    Args:
        contract: Web3 contract instance
        key_id: ID of the key
        address: Address to verify
        amount: Amount claimed in wei
        proof: Merkle proof
    Returns:
        bool: Whether proof is valid
    """
    return contract.functions.verifyMerkle(key_id, address, amount, proof).call()

def update_merkle(contract, key_id: int, balances: Dict[str, int]):
    """
    Update merkle root for a specific key ID in the Aegis contract

    Args:
        contract: Web3 contract instance
        key_id: ID of the key to update
        balances: Dictionary mapping addresses to their balance in wei
    """
    try:
        # Generate merkle root from balances
        merkle_root = generate_merkle_root(balances)
        # Build transaction
        tx = contract.functions.updateMerkleRoot(
            key_id,
            merkle_root
        ).build_transaction({
            'from': Account.from_key(os.getenv('PRIVATE_KEY')).address,
            'nonce': w3.eth.get_transaction_count(Account.from_key(os.getenv('PRIVATE_KEY')).address),
            'gas': 900000, # Increased gas limit
            'gasPrice': w3.eth.gas_price
        })
        # Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(tx, os.getenv('PRIVATE_KEY'))
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        # Wait for transaction receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully updated merkle root for key {key_id}")
        print(f"Transaction hash: {receipt.transactionHash.hex()}")

        # Read back and verify the merkle root
        stored_root = contract.functions.getMerkleRoot(key_id).call()
        print(f"Stored merkle root: {stored_root.hex()}")
        return receipt
        
    except Exception as e:
        print(f"Error updating merkle root: {str(e)}")
        return None

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    # Connect to Ethereum network
    w3 = Web3(Web3.HTTPProvider(os.getenv('PROVIDER_URL')))
    # Load contract ABI and address
    with open("Aegis.json") as f:
        contract_json = json.load(f)
    contract_abi = contract_json["abi"]
    contract_address = os.getenv('CONTRACT_ADDRESS')
    
    # Create contract instance
    contract = w3.eth.contract(address=contract_address, abi=contract_abi)
    
    # Example balance claims in wei (1 ETH = 10^18 wei)
    balances = {
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": 500000000000000000,  # 0.5 ETH in wei
        "0x123F681646d4A755815f9CB19e1aCc8565A0c2AC": 1200000000000000000,  # 1.2 ETH in wei
        "0x6B175474E89094C44Da98b954EedeAC495271d0F": 800000000000000000    # 0.8 ETH in wei
    }
    # Update merkle root for key 0 with example balances
    update_merkle(contract, 0, balances)
    # Example of generating and verifying proof
    address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    amount = 500000000000000000
    proof = generate_merkle_proof(balances, address)
    is_valid = verify_merkle(contract, 0, address, amount, proof)
    print(f"Proof verification result: {is_valid}")

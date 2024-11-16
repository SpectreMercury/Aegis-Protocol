// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ERC1155.sol";
error Unauthorized();

contract Aegis is ERC1155 {
    event Create(uint256 indexed keyId, address indexed sender, string name);
    event Liquidate(uint256 indexed keyId, address indexed sender, bool status);
    event Trade(
        TradeType indexed tradeType,
        uint256 indexed keyId,
        address indexed sender,
        uint256 tokenAmount,
        uint256 ethAmount
    );
    event MerkleRootUpdated(uint256 indexed keyId, bytes32 merkleRoot);
    event Claimed(uint256 indexed keyId, address indexed claimer, uint256 amount);

    struct Key {
        uint256 id;
        string name; // L2 insurance key name
        address creator;
        bool isLiquidated;
        bytes32 merkleRoot;
    }

    address public owner;
    uint256 public keyIndex;
    mapping(uint256 => Key) public keys;
    mapping(address => uint256[]) public userKeys;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public pool;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    uint256 public constant CREATOR_PREMINT = 1 ether; // 1e18
    uint256 public constant CLAIM_PERCENT = 999; // 99.9%
    uint256 public constant CLAIM_DENOMINATOR = 1000;

    enum TradeType {
        Mint,
        Buy,
        Sell
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Only owner can create new insurance keys
    function create(string calldata name) public onlyOwner {
        uint256 newKeyId = keyIndex;
        keys[newKeyId] = Key(newKeyId, name, msg.sender, false, bytes32(0));
        userKeys[msg.sender].push(newKeyId);
        totalSupply[newKeyId] += CREATOR_PREMINT;
        keyIndex = newKeyId + 1;
        _mint(msg.sender, newKeyId, CREATOR_PREMINT, "");
        emit Create(newKeyId, msg.sender, name);
        emit Trade(TradeType.Mint, newKeyId, msg.sender, CREATOR_PREMINT, 0);
    }

    // Anyone can mark/unmark a key pool as liquidated (for demo purposes)
    function toggleLiquidation(uint256 keyId) public {
        require(keyId < keyIndex, "Key does not exist");
        Key storage key = keys[keyId];
        key.isLiquidated = !key.isLiquidated;
        emit Liquidate(keyId, msg.sender, key.isLiquidated);
    }

    function getKeysByAddress(address addr) public view returns (uint256[] memory) {
        return userKeys[addr];
    }

    // Simplified curve function - linear pricing
    function _curve(uint256 x) private pure returns (uint256) {
        return x <= CREATOR_PREMINT ? 0 : (x - CREATOR_PREMINT) * 0.001 ether;
    }

    function getPrice(uint256 supply, uint256 amount) public pure returns (uint256) {
        return (_curve(supply + amount) - _curve(supply));
    }

    function getBuyPrice(uint256 keyId, uint256 amount) public view returns (uint256) {
        return getPrice(totalSupply[keyId], amount);
    }

    function getSellPrice(uint256 keyId, uint256 amount) public view returns (uint256) {
        return getPrice(totalSupply[keyId] - amount, amount);
    }

    function buy(uint256 keyId, uint256 amount) public payable {
        require(keyId < keyIndex, "Key does not exist");
        require(!keys[keyId].isLiquidated, "Key pool is liquidated");
        uint256 price = getBuyPrice(keyId, amount);
        require(msg.value >= price, "Insufficient payment");
        totalSupply[keyId] += amount;
        pool[keyId] += price;
        _mint(msg.sender, keyId, amount, "");
        emit Trade(TradeType.Buy, keyId, msg.sender, amount, price);
    }

    function sell(uint256 keyId, uint256 amount) public {
        require(keyId < keyIndex, "Key does not exist");
        require(!keys[keyId].isLiquidated, "Key pool is liquidated");
        require(balanceOf[msg.sender][keyId] >= amount, "Insufficient balance");
        uint256 supply = totalSupply[keyId];
        require(supply - amount >= CREATOR_PREMINT, "Supply not allowed below premint amount");
        uint256 price = getSellPrice(keyId, amount);
        _burn(msg.sender, keyId, amount);
        totalSupply[keyId] = supply - amount;
        pool[keyId] -= price;
        emit Trade(TradeType.Sell, keyId, msg.sender, amount, price);
        (bool sent, ) = payable(msg.sender).call{value: price}("");
        require(sent, "Failed to send Ether");
    }

    function updateMerkleRoot(uint256 keyId, bytes32 merkleRoot) public {
        require(keyId < keyIndex, "Key does not exist");
        keys[keyId].merkleRoot = merkleRoot;
        emit MerkleRootUpdated(keyId, merkleRoot);
    }

    function getMerkleRoot(uint256 keyId) public view returns (bytes32) {
        require(keyId < keyIndex, "Key does not exist");
        return keys[keyId].merkleRoot;
    }

    function verifyMerkle(
        uint256 keyId,
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public view returns (bool) {
        bytes32 node = keccak256(abi.encodePacked(account, amount));
        bytes32 computedHash = node;

        for (uint256 i = 0; i < merkleProof.length; i++) {
            bytes32 proofElement = merkleProof[i];

            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == keys[keyId].merkleRoot;
    }

    function claim(
        uint256 keyId,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public {
        require(keyId < keyIndex, "Key does not exist");
        require(keys[keyId].isLiquidated, "Key pool is not liquidated");
        require(!hasClaimed[keyId][msg.sender], "Already claimed");
        require(
            verifyMerkle(keyId, msg.sender, amount, merkleProof),
            "Invalid merkle proof"
        );

        uint256 claimAmount = (amount * CLAIM_PERCENT) / CLAIM_DENOMINATOR;
        hasClaimed[keyId][msg.sender] = true;

        (bool sent, ) = payable(msg.sender).call{value: claimAmount}("");
        require(sent, "Failed to send Ether");

        emit Claimed(keyId, msg.sender, claimAmount);
    }

    function uri(uint256 id) public view override returns (string memory) {
        return keys[id].name;
    }
}
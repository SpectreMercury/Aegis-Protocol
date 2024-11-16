// scripts/interactWithAegis.ts

import { ethers,parseEther,formatEther,toUtf8Bytes,keccak256} from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {

  const providerUrl = "https://eth-sepolia.g.alchemy.com/v2/Lrkfb9WXJZRk9AH0NwwBaQ1RmSaSe3tj"; 
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const block = await provider.getBlock('latest');
  const stateRoot=block!.stateRoot||'';
  console.log(`stateRoot: ${block!.stateRoot}`);

  // Address 0x7CAE182a0d4e31A5a984a0EfA007aB4bfc960000
  const privateKey = "02a02ab7489d42fbf77de165f1cf640401a6c99f310795f549de0a05a236e55e";
  const wallet = new ethers.Wallet(privateKey, provider);

  

  // 已部署的Aegis合约地址 -- 需要换成新版本的合约地址
  const aegisAddress = "0xC52e4027129AFBBEb672512107EA2E2B251F7EDd";

  // 读取Aegis合约的ABI
  const abiPath = path.join(__dirname, "../artifacts/contracts/Aegis.sol/Aegis.json");
  const aegisArtifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  const aegisABI = aegisArtifact.abi;

  // 创建合约实例
  const aegis = new ethers.Contract(aegisAddress,aegisABI,wallet)

  console.log("Interacting with Aegis at:",await aegis.getAddress());

  // setSPInstance
  const spInstanceAddress = "0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5";
  const setSPInstanceTx= await aegis.setSPInstance(spInstanceAddress);
  await setSPInstanceTx.wait();
  console.log(`Set SP Instance, tx: ${setSPInstanceTx.hash}`);


  // setSchemaID
  const schemaId = 0x300;
  const setSchemaIDTx= await aegis.setSchemaID(schemaId);
  await setSchemaIDTx.wait();
  console.log(`Set Schema ID,Tx ${setSchemaIDTx.hash}` );

  // // setSignProtocolStatus
  const setSignProtocolStatusTX= await aegis.setSignProtocolStatus(true);
  await setSignProtocolStatusTX.wait();
  console.log(`Set Sign Protocol Status to true,tx ${setSignProtocolStatusTX}`);

  // create  Todo： 这里需要Owner 私钥
  await aegis.create("RugChain1");
  console.log("RugChain1");

  // toggleLiquidation
  await aegis.toggleLiquidation(0);
  console.log("Toggled liquidation for key 0");

  // // getKeysByAddress
  const keys = await aegis.getKeysByAddress(wallet.address);
  console.log("Keys for address:", keys);

  // getBuyPrice
  const buyPrice = await aegis.getBuyPrice(0, parseEther("0.01"));
  console.log(buyPrice);
  console.log("Buy price:", formatEther(buyPrice));

  // getSellPrice
  const sellPrice = await aegis.getSellPrice(0, parseEther("0.01"));
  console.log("Sell price:", formatEther(sellPrice));

  // buy
  await aegis.buy(0, parseEther("0.01"), { value: buyPrice });
  console.log("Bought tokens");

  // sell
  await aegis.sell(0, parseEther("0.005"));
  console.log("Sold tokens");

  // updateMerkleRoot
  const merkleRoot = keccak256(toUtf8Bytes(stateRoot));
  await aegis.updateMerkleRoot(0, merkleRoot);
  console.log("Updated Merkle root");

  // getMerkleRoot
  const retrievedMerkleRoot = await aegis.getMerkleRoot(0);
  console.log("Retrieved Merkle root:", retrievedMerkleRoot);

  // verifyMerkle
  const isValid = await aegis.verifyMerkle(0, wallet.address, parseEther("0.01"), []);
  console.log("Merkle proof verification:", isValid);
  // uri
  const uri = await aegis.uri(0);
  console.log("URI for key 0:", uri);

  // readSingleSlot 
  const l1ContractAddress = "0xC52e4027129AFBBEb672512107EA2E2B251F7EDd";
  const slotNumber = 0;
  const slotData = await aegis.readSingleSlot(l1ContractAddress, slotNumber);
  console.log("Data from L1 contract slot:", slotData);

  // owner 
  const ownerAddress = await aegis.owner();
  console.log("Contract owner:", ownerAddress);

  // keyIndex 
  const currentKeyIndex = await aegis.keyIndex();
  console.log("Current key index:", currentKeyIndex);

  // totalSupply 
  const totalSupplyForKey0 = await aegis.totalSupply(0);
  console.log("Total supply for key 0:", totalSupplyForKey0);

  // pool 
  const poolAmountForKey0 = await aegis.pool(0);
  console.log("Pool amount for key 0:", formatEther(poolAmountForKey0));

  // hasClaimed 
  const hasClaimedForKey0 = await aegis.hasClaimed(0, wallet.address);
  console.log("Has claimed for key 0:", hasClaimedForKey0);

  // spInstance 
  const spInstanceAddressOnChain = await aegis.spInstance();
  console.log("SP Instance address:", spInstanceAddressOnChain);

  // schemaId 
  const currentSchemaId = await aegis.schemaId();
  console.log("Current schema ID:", currentSchemaId);

  // signProtocolEnabled 
  const isSignProtocolEnabled = await aegis.signProtocolEnabled();
  console.log("Is Sign Protocol enabled:", isSignProtocolEnabled);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
import { ethers } from "hardhat";

async function main() {
  // Connect to deployed Aegis contract
  const aegisAddress = "0x25B6F252eCed1a26A9192EC35C6a83d1fa355843";
  const Aegis = await ethers.getContractFactory("Aegis");
  const aegis = Aegis.attach(aegisAddress);
  // Get key with ID 0
  const owner = await aegis.readL1ContractOwner("0xC52e4027129AFBBEb672512107EA2E2B251F7EDd");
  console.log("Owner:", owner);
  for (let i = 0; i <= 256; i++) {
    const key = await aegis.readSingleSlot("0xC52e4027129AFBBEb672512107EA2E2B251F7EDd", i);
    console.log(`Slot ${i}:`, key);
    // Slot 3: 0x0000000000000000000000005b61d576ec2509fb6cd0e626fa509ef44bcb2100
    // address public owner;

  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

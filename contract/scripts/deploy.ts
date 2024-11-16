import { ethers } from "hardhat";

async function main() {
  // Deploy the Aegis contract
  const Aegis = await ethers.getContractFactory("Aegis");
  const aegis = await Aegis.deploy();
  await aegis.waitForDeployment(); 
  console.log("Aegis deployed to:", await aegis.getAddress());

  // Create a new key named "RugChain"
  const createTx = await aegis.create("RugChain");
  await createTx.wait();
  console.log("Created RugChain key with ID: 0");
  // set the sp instance
  await aegis.setSPInstance("0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5");
  await aegis.setSchemaID(0x2fb);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
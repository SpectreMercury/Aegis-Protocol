import { ethers } from "hardhat";

async function main() {
  // Deploy the Aegis contract
  const Aegis = await ethers.getContractFactory("Aegis");
  const aegis = await Aegis.deploy();
  await aegis.waitForDeployment(); 
  // Create a new key named "RugChain"
  const createTx = await aegis.create("RugChain");
  await createTx.wait();
  // console.log("Created RugChain key with ID: 0");
  console.log("Aegis deployed to:", await aegis.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
const hre = require("hardhat");

async function main() {
  // Deploy the Aegis contract
  const Aegis = await hre.ethers.getContractFactory("Aegis");
  const aegis = await Aegis.deploy();
  await aegis.deployed();

  console.log("Aegis deployed to:", aegis.address);

  // Create a new key named "RugChain"
  const createTx = await aegis.create("RugChain");
  await createTx.wait();

  console.log("Created RugChain key with ID: 0");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
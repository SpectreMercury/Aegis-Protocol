import { ethers } from "hardhat";

async function main() {
  // Get the deployed Aegis contract
  const aegis = await ethers.getContractAt("Aegis", "0xD03Dc9381653A1647f38B93047B5291046Cb2286");
  // Update SP instance and schema
  await aegis.setSPInstance("0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5");
  await aegis.setSchemaID(0x300);
  const createTx = await aegis.create("RugChain1");
  await createTx.wait();
  console.log("Created RugChain1 key with ID: 1");
  console.log("Updated SP instance and schema ID");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

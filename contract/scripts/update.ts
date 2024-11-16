import { ethers } from "hardhat";

async function main() {
  // Get the deployed Aegis contract
  const aegis = await ethers.getContractAt("Aegis", "0x6C566F193656f69a54A7dabCc832CF0001E880dB");

  // Update SP instance and schema
  await aegis.setSPInstance("0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5");
  await aegis.setSchemaID(0x2fb);
  console.log("Updated SP instance and schema ID");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Core = await hre.ethers.getContractFactory("OpenChainHubToken");
  const core = await Core.deploy(
    "OpenChain Token",
    "OCH",
    deployer.address,
    hre.ethers.parseUnits("100", 18),
    60
  );
  await core.waitForDeployment();

  console.log("Deployer:", deployer.address);
  console.log("Core (Hub+Token+Faucet):", await core.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

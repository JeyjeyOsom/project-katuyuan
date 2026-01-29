import { network } from "hardhat";

async function main() {
  // 1. In Hardhat 3, we must connect to the network to get the viem object
  const { viem, networkName } = await network.connect();

  console.log(`🚀 Deploying Counter to ${networkName}...`);

  // 2. Now 'viem' is available on the connection object
  const counter = await viem.deployContract("Counter");

  console.log(`✅ Counter deployed to: ${counter.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
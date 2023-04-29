import { ethers } from "hardhat";

async function main() {
  const ZKVoting = await ethers.getContractFactory("ZKVoting");
  const pollId = randomNullifier();
  const proposal = "Should dragons be allowed to roam freely in the kingdom?\r\nYes, because it would add to the magic and wonder of the land, and create a unique tourist attraction.\r\nNo, because it poses a significant danger to the citizens and their livestock, and the cost of maintaining and protecting the kingdom would be too high.";
  const contract = await ZKVoting.deploy(pollId,proposal);
  await contract.deployed();
  
  console.info(`ZKVoting contract has been deployed to: ${contract.address} `)
  console.info(`ZKVoting poll id: `, pollId)
  console.info(`ZKVoting proposal: `, proposal)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function randomNullifier() {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}

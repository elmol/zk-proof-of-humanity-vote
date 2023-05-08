import { ethers } from "hardhat";


const proposal1 = "Should the kingdom allow dragons to roam freely within its borders?<br/>" +
"Yes: Dragons are majestic creatures that could add to the magic and wonder of the kingdom. Allowing them to roam freely would make the kingdom more attractive to tourists and could bring in significant revenue. It would also create a unique and thrilling experience for those who seek adventure.<br/>" +
"No: Allowing dragons to roam freely poses a significant danger to the citizens and their livestock. Dragons are powerful creatures that can cause significant damage to the kingdom's infrastructure and property. The cost of maintaining and protecting the kingdom from dragon attacks would be too high, and the risk to the citizens would be too great."

const proposal2 = "Proposal: Should magic be regulated in the kingdom?<br/>"+
"Yes: Magic can be a powerful force that can cause great harm if used irresponsibly. Therefore, the kingdom should regulate the use of magic to ensure that it is used safely and ethically. This could be done by requiring magic users to obtain licenses or certifications and setting up laws to prevent the misuse of magic.<br/>"+
"No: Magic is a natural part of the kingdom's environment, and regulating it would be impossible without infringing on the freedom of magic users. Moreover, attempting to regulate magic could lead to increased corruption and discrimination against certain groups of people. The kingdom should trust in the inherent goodness of its citizens to use magic responsible"


async function main() {
  const ZKVoting = await ethers.getContractFactory("ZKVoting");
  const contract = await ZKVoting.deploy();
  await contract.deployed();
  
  const pollId1 = randomNullifier();
  await contract.addPoll(pollId1,proposal1)

  const pollId2 = randomNullifier();
  await contract.addPoll(pollId2,proposal2)

  console.info(`ZKVoting contract has been deployed to: ${contract.address} `)
  console.info(`ZKVoting poll 1 id: `, pollId1)
  console.info(`ZKVoting proposal: `, proposal1)
  console.info(`ZKVoting poll 2 id: `, pollId1)
  console.info(`ZKVoting proposal: `, proposal1)

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

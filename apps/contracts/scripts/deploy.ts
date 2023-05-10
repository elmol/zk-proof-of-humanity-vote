import { ethers } from "hardhat";

const PROPOSAL1 =
  "Should the kingdom allow dragons to roam freely within its borders?<br/>" +
  "Yes: Dragons are majestic creatures that could add to the magic and wonder of the kingdom. Allowing them to roam freely would make the kingdom more attractive to tourists and could bring in significant revenue. It would also create a unique and thrilling experience for those who seek adventure.<br/>" +
  "No: Allowing dragons to roam freely poses a significant danger to the citizens and their livestock. Dragons are powerful creatures that can cause significant damage to the kingdom's infrastructure and property. The cost of maintaining and protecting the kingdom from dragon attacks would be too high, and the risk to the citizens would be too great.";

const PROPOSAL2 =
  "Proposal: Should magic be regulated in the kingdom?<br/>" +
  "Yes: Magic can be a powerful force that can cause great harm if used irresponsibly. Therefore, the kingdom should regulate the use of magic to ensure that it is used safely and ethically. This could be done by requiring magic users to obtain licenses or certifications and setting up laws to prevent the misuse of magic.<br/>" +
  "No: Magic is a natural part of the kingdom's environment, and regulating it would be impossible without infringing on the freedom of magic users. Moreover, attempting to regulate magic could lead to increased corruption and discrimination against certain groups of people. The kingdom should trust in the inherent goodness of its citizens to use magic responsible";

const GOERLI_POH_PROXY_ADDRESS = "0x90AAf5a8b9961558dB76b64c1308E0517866CA93";
const GOERLI_POH_ADDRESS = "0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52";
const POH_ABI = [
  {
    name: "isRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        internalType: "address",
        name: "_submissionID",
        type: "address",
      },
    ],
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
  },
];

const POH_PROXY_ABI = [
  ,
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_submissionIDs",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "_evidences",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "_names",
        type: "string[]",
      },
    ],
    name: "addHumans",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const ZKVoting = await ethers.getContractFactory("ZKVoting");
  const contract = await ZKVoting.deploy();
  await contract.deployed();

  const pollId1 = randomNullifier();
  await contract.addPoll(pollId1, PROPOSAL1);

  const pollId2 = randomNullifier();
  await contract.addPoll(pollId2, PROPOSAL2);

  console.info(`ZKVoting contract has been deployed to: ${contract.address} `);
  console.info(`ZKVoting poll 1 id: `, pollId1);
  console.info(`ZKVoting proposal: `, PROPOSAL2);
  console.info(`ZKVoting poll 2 id: `, pollId2);
  console.info(`ZKVoting proposal: `, PROPOSAL2);

  // register to proof of humanity if the human account is not registered
  const [human] = await ethers.getSigners();
  const poh = await ethers.getContractAt(POH_ABI, GOERLI_POH_ADDRESS);
  const isRegistered = await poh.isRegistered(human.address);
  console.info(`Human Account ${human.address} is Registered in POH: ${isRegistered}`);
  if (!isRegistered) {
    const submissionIDs = [human.address];
    const evidence = ["/ipfs/QmTuH5uZQokwb8fR2YwMGFB6BVsKzusmRNkDyqh8eZgbd3/registration.json"];
    const names = ["human"];
    const proxy = await ethers.getContractAt(POH_PROXY_ABI, GOERLI_POH_PROXY_ADDRESS);
    await proxy.addHumans(submissionIDs, evidence, names);
    console.info(`Human Account ${human.address} registered to POH ${poh.address}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function randomNullifier() {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
}

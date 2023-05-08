import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZKVoting", function () {
  const pollId1 = randomNullifier();
  const proposal1 = "Should dragons be allowed to roam freely in the kingdom?";
  
  const pollId2 = randomNullifier();
  const proposal2 = "Should magic be regulated in the kingdom?";

  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("ZKVoting");
    const contract = await ContractFactory.deploy();
    return { contract, owner, otherAccount };
  }

  describe("# Add Polls", () => {
    it("Should allow adding a poll", async () => {
      const { contract } = await loadFixture(deploy);
      await contract.addPoll(pollId1, proposal1);
      const amount = await contract.getPollIds();
      expect(1).equal(amount.length);
      const pollId = await contract.pollIds(0);
      expect(pollId1).equal(pollId);
      expect(proposal1).equal(await contract.polls(pollId));
    });

    it("Should allow adding two polls", async () => {
      const { contract } = await loadFixture(deploy);
      await contract.addPoll(pollId1, proposal1);
      await contract.addPoll(pollId2, proposal2);
      const amount = await contract.getPollIds();
      expect(2).equal(amount.length);
    });

    it("Should allow searching by pollId", async () => {
      const { contract } = await loadFixture(deploy);
      await contract.addPoll(pollId2, proposal2);
      const proposal = await contract.polls(pollId2);
      expect(proposal2).equal(proposal);
    });
  });
});

function randomNullifier() {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
}

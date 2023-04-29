import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZKVoting", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ZKVoting = await ethers.getContractFactory("ZKVoting");
    const pollId = randomNullifier();
    const proposal = "Should dragons be allowed to roam freely in the kingdom?";
    const contract = await ZKVoting.deploy(pollId, proposal);

    return { contract, proposal, pollId, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be deployed with a proposal", async function () {
      const { contract, proposal } = await loadFixture(deploy);
      expect(proposal).equal(await contract.proposal());
    });

    it("Should be constructed with a poll ID (externalNullifier)", async function () {
      const { contract, pollId } = await loadFixture(deploy);
      expect(pollId).equal(await contract.pollId());
    });
  });
});

function randomNullifier() {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
}

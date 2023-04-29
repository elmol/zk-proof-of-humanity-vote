// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ZKVoting {
    string public proposal;
    uint256 public pollId;

    constructor(uint256 _pollId, string memory _proposal) {
        pollId = _pollId;
        proposal = _proposal;
    }
}

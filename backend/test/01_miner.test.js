const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Miner Contract", function () {
  beforeEach(async function () {
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners();
  });

  describe("ERC1155DropDeployment", function () {
      it("Should deploy the ERC1155Drop contract", async function () {
        PickaxeNFT = await hre.ethers.getContractFactory("ERC1155Drop");
        pickaxeNFT = await PickaxeNFT.deploy(
          this.owner.address,          // _defaultAdmin
          "Pickaxe Collection",        // _name
          "PICKAXE",                   // _symbol
          this.owner.address,          // _royaltyRecipient
          500,                         // _royaltyBps (5%)
          this.owner.address  
        )
      });
    });

  describe("ERC20BaseDeployment", function () {
    it("Should deploy the ERC20Base contract", async function () {
      RewardsToken = await hre.ethers.getContractFactory("ERC20Base");
      rewardsToken = await RewardsToken.deploy(
        this.owner.address,          // _defaultAdmin
        "Rewards Token",             // _name
        "RTK",                       //_symbol
      )
    });
  });

  describe("MinerContractDeployment", function () {
    it("Should deploy the Miner contract", async function () {
      Miner = await hre.ethers.getContractFactory("Miner");
      miner = await Miner.deploy(pickaxeNFT.runner.address, rewardsToken.runner.address);
    });
  });

  describe("Stake", function () {
    it("Should revert if the player does not own the pickaxe they are trying to stake", async function () {
      await pickaxeNFT.lazyMint(1, "ipfs://baseURI/", "0x");
      await expect(miner.connect(this.addr2).stake(0)).to.be.revertedWith("You must have at least 1 of the pickaxe you are trying to stake");
    });
  });
});
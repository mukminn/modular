const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenChain Hub MVP", function () {
  it("admin can mint, user can burn, faucet has cooldown", async function () {
    const [admin, user] = await ethers.getSigners();

    const Core = await ethers.getContractFactory("OpenChainHubToken");
    const core = await Core.deploy(
      "OpenChain Token",
      "OCH",
      admin.address,
      ethers.parseUnits("10", 18),
      60
    );
    await core.waitForDeployment();

    await (await core.mint(user.address, ethers.parseUnits("5", 18))).wait();
    expect(await core.balanceOf(user.address)).to.equal(ethers.parseUnits("5", 18));

    await (await core.connect(user).burn(ethers.parseUnits("1", 18))).wait();
    expect(await core.balanceOf(user.address)).to.equal(ethers.parseUnits("4", 18));

    await (await core.connect(user).drip()).wait();
    await expect(core.connect(user).drip()).to.be.reverted;
  });
});

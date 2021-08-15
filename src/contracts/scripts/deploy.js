const hre = require("hardhat");

import nfts from './nfts'

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const NFTContractFactory = await hre.ethers.getContractFactory("CoopartNFT");
  const NFTContract = await NFTContractFactory.deploy();

  await NFTContract.deployed();

  console.log("Contract deployed to:", NFTContract.address);
  console.log("Minting NFTs to the contract with the deployer address : ", deployer.address);

  const bal = await NFTContract.balanceOf(deployer.address);
  console.log('Balance: ', bal.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
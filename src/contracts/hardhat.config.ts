import { config as dotEnvConfig } from "dotenv";
import { task } from "hardhat/config";
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/types";

dotEnvConfig();

import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

// TODO: reenable solidity-coverage when it works
// import "solidity-coverage";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "matic",
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    tests: "./test",
    sources: "./contracts",
    cache: "./cache",
    artifacts: "../frontend/src/artifacts"
  },
  typechain: {
    outDir: '../frontend/src/typechain',
  },
  networks: {
    hardhat: {
      chainId: 1337 // TO WORK WITH METAMASK
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      gasPrice: 8000000000
    },
    localhost: {},
  },
};

export default config;

task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    await ethers.provider.getBlockNumber().then((blockNumber) => {
      console.log("Current block number: " + blockNumber);
    });
  }
);

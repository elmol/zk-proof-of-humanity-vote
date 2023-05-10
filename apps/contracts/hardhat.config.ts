import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"

dotenvConfig({ path: resolve(__dirname, ".env") })

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: 'https://eth-goerli.g.alchemy.com/v2/'+process.env.ETHEREUM_URL_KEY,
        blockNumber: 8924675
      },
      accounts: [{privateKey: process.env.HUMAN_ACCOUNT_PRIVATE_KEY || '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', balance:'10000000000000000000000'},
                 {privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',balance:'10000000000000000000000'}]
    }
  }
};

export default config;

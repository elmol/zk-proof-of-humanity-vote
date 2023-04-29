import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"

dotenvConfig({ path: resolve(__dirname, ".env") })

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-goerli.g.alchemy.com/v2/'+process.env.ETHEREUM_URL_KEY,
      }
    }
  }
};

export default config;

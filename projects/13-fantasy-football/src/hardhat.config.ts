import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-celo";



// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const alchemyApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const infuraApiKey = process.env.INFURA_API_KEY;
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: { tests: "tests" },


  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        //url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
				// enabled: process.env.MAINNET_FORKING_ENABLED === "true",

				//url: `https://optimism.llamarpc.com`,
				//blockNumber: 111883000,

				// Sepolia
				//url: "https://sepolia.infura.io/v3/ee642ee8e91d452a9c2dd229ed4f7a33",
				//blockNumber: 4718211,

				// Base Goerli
				url: "https://goerli.base.org",
				blockNumber: 12564022,
			},
    },

    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [deployerPrivateKey],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [deployerPrivateKey],
    },

    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [deployerPrivateKey],
    },
    mantleTestnet: {
      url: "https://rpc.testnet.mantle.xyz",
      accounts: [deployerPrivateKey],
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [deployerPrivateKey],
      chainId: 44787,
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    linea: {
      url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [deployerPrivateKey],
    },
    xdc: {
      url: `https://rpc.apothem.network/`,
      accounts: [deployerPrivateKey],
    },
    moonbaseAlpha: {
      url: `https://rpc.api.moonbase.moonbeam.network`,
      accounts: [deployerPrivateKey],
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      arbitrumGoerli: process.env.ARBITRUM_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      baseGoerli: process.env.ETHERSCAN_API_KEY,
      chiado: process.env.GNOSISSCAN_API_KEY,
      linea: process.env.LINEASCAN_API_KEY,
      scrollSepolia: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGON_API_KEY,
      mantleTestnet: process.env.MANTLE_API_KEY,
      alfajores: process.env.CELO_API_KEY,
      moonbaseAlpha: process.env.MOONSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'mantleTestnet',
        chainId: 5001,
        urls: {
          apiURL: 'https://explorer.testnet.mantle.xyz/api',
          browserURL: 'https://explorer.testnet.mantle.xyz',
        },
      },
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "	https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "xdc",
        chainId: 51,
        urls: {
          apiURL: "https://rpc.apothem.network/",
          browserURL: "https://explorer.apothem.network",
        },
      },
      {
        network: "linea",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "	https://goerli.lineascan.build/address",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
    ],
  },

};

export default config;

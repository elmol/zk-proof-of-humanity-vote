# Step-by-Step Guide: Building a Secure, Anonymous Voting App with ZK Proof of Humanity

## Introduction

ZK Proof of Humanity is a protocol that allows humans registered in Proof of Humanity to prove their humanity without revealing their identity. If you're looking to integrate this protocol into your project, you might be interested in the zkpoh-widget React library. This library simplifies the process of integrating zkPoH with your React application, enabling you to create secure, anonymous voting systems and other applications that require proof of humanity. In this post, we'll be walking through a step-by-step example of how to use the zkpoh-widget library to create a distributed voting application. This example allows anyone registered in Proof of Humanity to vote privately using zkPoH, without revealing their identity. Let's dive in!

## Initial Configuration
To get started with building your distributed voting application, you'll first need a basic web3 application template. This template should include a smart contract module using Hardhat, which will allow you to store and retrieve votes securely on the blockchain. Additionally, the template should include a basic Next.js web app, which will provide a user interface for your voting application.


##  Starting with a Pre-configured Web3 Application Template

To get started with building your distributed voting application, you'll need a basic web3 application template that includes a smart contract module using Hardhat and a basic Next.js web app. A great starting point is our pre-configured template available on Github. This template provides you with the necessary tools to store and retrieve votes securely on the blockchain, as well as a basic web app to build out your application's front-end.

To clone the template, use the following command: `git clone --depth 1 --branch initial-base https://github.com/elmol/zk-proof-of-humanity-vote.git` Alternatively, you can also check it out directly or download it from https://github.com/elmol/zk-proof-of-humanity-vote/releases/tag/initial-base


### Template Content Details

#### Contract Module

The cloned template includes a basic `ZKVoting` smart contract that can store poll IDs and proposals. Here's the code for the contract:

```solidity
pragma solidity ^0.8.9;

contract ZKVoting {
    string public proposal;
    uint256 public pollId;

    constructor(uint256 _pollId, string memory _proposal) {
        pollId = _pollId;
        proposal = _proposal;
    }
}
```

The template also includes a deployment script `apps/contracts/scripts/deploy.ts` that can be used to deploy a proposal example. Additionally, a basic `goerli` fork configuration is provided since the zk proof of humanity test contract is deployed on the goerli test network.

#### Web-App Module

This template includes a basic Next.js web application with a simple design using the [Chakra-UI](https://chakra-ui.com/) library. It also includes an initial configuration for integrating with the ZKVoting contract on the blockchain using [Wagmi](https://wagmi.sh/).

Here is the `_app.tsx` configuration:

```
export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
  });

  return (
    <ChakraProvider>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}

```
and you can find the whole app in `apps/web-app/src/pages/index.tsx`

### Initial Setup and Development Run

To get started, first install all dependencies for the initial app using:

```
yarn install
```

Next, copy the `.env.example` file and rename it to `.env`. You will need an Alchemy key for the `Gorli` network for forking. Add the key in `.env`as follows:

```
ETHEREUM_URL_KEY=<alchemy key>
```

In the root directory of the cloned template, there are two yarn scripts available: one for running a local node with the Gorli fork and another for deploying the contract and running the web app in development mode.

To run the local node with Gorli fork, use:

```
yarn local
```

Note that this command should be run in a standalone terminal window and left running in the background while you deploy the contract and run the web app.

To deploy the contract and run the web app in development mode, use:

```
yarn dev
```

Here's a possible improvement:

### Configuration Caveat

To ensure everything works properly, you need to make the following configurations:

- In `apps/contracts/hardhat.config.ts`, set the `blockNumber` to `8924675` and make sure the `url` property in the `forking` section points to your Alchemy key:
```
hardhat: {
  chainId: 1337,
  forking: {
    url: 'https://eth-goerli.g.alchemy.com/v2/'+process.env.ETHEREUM_URL_KEY,
    blockNumber: 8924675
  }
}
```

- In `apps/web-app/wagmi.config.ts`, set the address of the ZKVoting contract to `0x5bCC3154698bBC205ABF09351A52DD2d1A39F608`:
```
deployments: {
  ZKVoting: {
    31337: '0x5bCC3154698bBC205ABF09351A52DD2d1A39F608',
    1337: '0x5bCC3154698bBC205ABF09351A52DD2d1A39F608',
  }
}
```

- Run `yarn wagmi generate` on `apps/web-app/` to generate access to the contract.

## Installing the ZK-POH Widget Library

With the initial configuration and template up and running, it's time to install and configure the ZK-POH Widget Library to enable private voting using the ZK Proof of Humanity protocol. Follow the steps below to install the necessary dependencies and the latest version of the library:

### Dependency Installation

Install the following dependencies by running the following command in your terminal:

```
apps/web-app$ yarn add @semaphore-protocol/data@3.7.0 @semaphore-protocol/group@3.7.0 @semaphore-protocol/identity@3.7.0 @semaphore-protocol/proof@3.7.0 react-no-ssr@1.1.0
```

### ZK-POH Widget Installation

To install the latest version of the ZK-POH Widget Library, run the following command in your terminal:

```
apps/web-app$ yarn add zkpoh-widget
```

### Supporting the `fs` Module

To support the `fs` module, you need to add or replace the following configuration in the `apps/web-app/next.config.js` file:

```
/** @type {import('next').NextConfig} */
const fs = require("fs")

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            fs: false
        }
    }

    return config
  }
}

module.exports = nextConfig
```

### Installation Verification

To verify that we have successfully installed the zk-poh-widget, we will read and log the address of the zk proof of humanity contract. 

To do this, we need to edit `apps/web-app/src/pages/index.tsx` and add the following `useEffect` hook that logs the contract address.

Note that in this case, the `contractAddress` is hardcoded to the current address of the zk proof of humanity contract on the Goerli testnet because we are working with a fork. In other cases, it's not necessary to hardcode it as it will take the address of the selected network.

```
import { useZkProofOfHumanity } from 'zkpoh-widget';

const contractAddress = '0x3575E04983C401f26fA02FC09f6EE97e44dF296B';
const zkPoHContract = useZkProofOfHumanity({ contractAddress });

useEffect(() => {
  console.log("zkpoh address:", zkPoHContract?.address);
}, [zkPoHContract?.address]);
```
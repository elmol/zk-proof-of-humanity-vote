# Step-by-Step Guide: Building a Secure, Anonymous Voting App with ZK Proof of Humanity

## Introduction

ZK Proof of Humanity is a protocol that allows humans registered in Proof of Humanity to prove their humanity without revealing their identity. If you're looking to integrate this protocol into your project, you might be interested in the zkpoh-widget React library. This library simplifies the process of integrating zkPoH with your React application, enabling you to create secure, anonymous voting systems and other applications that require proof of humanity. In this post, we'll be walking through a step-by-step example of how to use the zkpoh-widget library to create a distributed voting application. This example allows anyone registered in Proof of Humanity to vote privately using zkPoH, without revealing their identity. Let's dive in!

## Initial Configuration
To get started with building your distributed voting application, you'll first need a basic web3 application template. This template should include a smart contract module using Hardhat, which will allow you to store and retrieve votes securely on the blockchain. Additionally, the template should include a basic Next.js web app, which will provide a user interface for your voting application.


##  Starting with a Pre-configured Web3 Application Template

To get started with building your distributed voting application, you'll need a basic web3 application template that includes a smart contract module using Hardhat and a basic Next.js web app. A great starting point is our pre-configured template available on Github. This template provides you with the necessary tools to store and retrieve votes securely on the blockchain, as well as a basic web app to build out your application's front-end.

To clone the template, use the following command: `git clone --depth 1 --branch initial-base https://github.com/elmol/zk-proof-of-humanity-vote.git` Alternatively, you can also check it out directly or download it from https://github.com/elmol/zk-proof-of-humanity-vote/releases/tag/initial-base


## Template Content Details

### Contract Module

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

### Web-App Module

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

## Initial Web3 App Configuration

....



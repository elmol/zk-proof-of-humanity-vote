# ZK Proof of Humanity Vote

**zkPoH Vote** is a web3 application that demonstrates how to create an anonymous voting system using [ZK Proof of Humanity](https://github.com/elmol/zk-proof-of-humanity). The application allows registered Proof of Humanity users to vote securely without revealing their identity. This complete example serves as an educational resource and uses the zkpoh-widget React library to simplify the integration of zkPoH with your React application.

Following you find a step-by-step guide link, which, it shows how to get started with zkPoH and use the zkpoh-widget React library to build anonymous voting systems that require proof of humanity.
[**Link to the step by step guide**](https://github.com/elmol/zk-proof-of-humanity-vote/blob/main/step-by-step-guide.md)

You can try out a functional version of the zkPoH Vote application that supports Goerli and Sepolia networks at https://zk-proof-of-humanity-vote.vercel.app/.

https://github.com/elmol/zk-proof-of-humanity-vote/assets/5402004/95155629-cefb-4550-a9f7-8eb9f5f0ac09

# Local setup for zkPoH Vote

## Installation

`yarn install`

## Configuration

In `apps/contracts` copy the `.env.example` file and rename it to `.env`. You will need an Alchemy key for the `Goerli` network for forking. Add the key in `.env`as follows:

```shell
ETHEREUM_URL_KEY=<alchemy key>
```

As optional configuration, you can configure a human account that acts as a registered human account in proof of humanity. By default the first hardhat account `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` is taken.

```shell
HUMAN_ACCOUNT_PRIVATE_KEY=<account registered in goerli proof of humanity>>
```

## Run local node

To run the local node with Goerli fork, use:
`yarn local`

Note that this command should be run in a standalone terminal window and left running in background while you deploy the contract and run the web app.

## Run dev mode

To deploy the contract and run the web app in development mode, use:

```shell
yarn dev
```

## Access

1. Access `http://localhost:3000` in a browser.
2. Select the `localhost` network in Metamask.
3. Connect to the Dapp with the human account.

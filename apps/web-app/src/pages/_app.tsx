import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { publicProvider } from "@wagmi/core/providers/public";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import theme from "../styles/index"

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
  });

  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}

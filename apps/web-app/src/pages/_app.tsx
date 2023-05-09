import Card from "@/components/Card";
import LogsContext from "@/context/LogsContext";
import "@/styles/globals.css";
import { ChakraProvider, HStack, Spinner, Text } from "@chakra-ui/react";
import { publicProvider } from "@wagmi/core/providers/public";
import type { AppProps } from "next/app";
import { useState } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import theme from "../styles/index";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
  });

  const [_logs, setLogs] = useState<string>("");

  return (
    <>
      <Head>
        <title>ZK Proof of Humanity Vote</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#ebedff" />
      </Head>

      <ChakraProvider theme={theme}>
        <WagmiConfig client={client}>
          <LogsContext.Provider value={{ _logs, setLogs }}>
            <Component {...pageProps} />
          </LogsContext.Provider>
          <HStack position="absolute" right="0" bottom="0" align="initial" justify="center" spacing="2" p="1" maxWidth="25%">
            {_logs.endsWith("...") && <Spinner color="primary.900" />}
            <Card bg={"secondaryGray.900"} flexDirection="column" w="100%" p="15px" px="20px" mt="15px" mx="auto">
              <Text fontSize="sm" color="navy.50" fontWeight="500">
                {_logs || `⭐ ⭐ ⭐ `}
              </Text>
            </Card>
          </HStack>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
}

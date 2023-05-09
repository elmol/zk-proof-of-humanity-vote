import "@/styles/globals.css";
import { ChakraProvider, HStack, Spinner, Text } from "@chakra-ui/react";
import { publicProvider } from "@wagmi/core/providers/public";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import theme from "../styles/index";
import LogsContext from "@/context/LogsContext";
import { useState } from "react";
import Card from "@/components/Card";

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
  });

  const [_logs, setLogs] = useState<string>("");

  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <LogsContext.Provider value={{_logs, setLogs}}>
          <Component {...pageProps} />
        </LogsContext.Provider>
        <HStack
                    position="absolute"
                    right="0"
                    bottom = "0"
                    align="initial"
                    justify="center"
                    spacing="2"
                    p="1"
                    maxWidth='25%'
                >
                    {_logs.endsWith("...") && <Spinner color="primary.900" />}
                    <Card   bg={"secondaryGray.900"}
                    flexDirection='column'
                    w='100%'
                    p='15px'
                    px='20px'
                    mt='15px'
                    mx='auto'>
                    <Text fontSize='sm' color='navy.50' fontWeight='500' >{_logs || `⭐ ⭐ ⭐ `}</Text>
                     </Card>
                </HStack>
      </WagmiConfig>
    </ChakraProvider>
  );
}

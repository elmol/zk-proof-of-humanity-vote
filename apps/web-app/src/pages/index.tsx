import { EtherScanLink } from "@/components/EtherScanLink";
import LogsContext from "@/context/LogsContext";
import { useZkVotingPollIds, useZkVotingRead } from "@/generated/zk-voting";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils.js";
import Head from "next/head";
import { useCallback, useContext, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import NoSSR from "react-no-ssr";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { ButtonActionState, ZKPoHConnect, useIsRegisteredInPoH, useZkProofOfHumanity, useZkProofOfHumanitySignals } from "zkpoh-widget";
import Card from "../components/Card";

export default function Main() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { data: pollId } = useZkVotingPollIds({
    args: [BigNumber.from("0")],
  });
  const { data: proposal } = useZkVotingRead({
    functionName: "polls",
    args: [pollId ? pollId : BigNumber.from("0")],
  });

  const contractAddress = "0x3575E04983C401f26fA02FC09f6EE97e44dF296B";
  const zkPoHContract = useZkProofOfHumanity({ contractAddress });

  const { isHuman } = useIsRegisteredInPoH({ address });
  const [_identity, setIdentity] = useState<Identity>();
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();
  useEffect(() => {
    console.log("zkpoh address:", zkPoHContract?.address);
  }, [zkPoHContract?.address]);

  const { setLogs } = useContext(LogsContext);
  function handleLog(state: ButtonActionState) {
    setLogs(state.logs);
  }

  const [ballot, setBallot] = useState("YES");
  const ballots = useZkProofOfHumanitySignals({ contractAddress, externalNullifier: pollId });
  const count = useCallback(
    (ballotType: string) => {
      const ballot32Type = formatBytes32String(ballotType);
      return ballots?.reduce((n: number, ballot: any) => (BigNumber.from(ballot.signal).eq(BigNumber.from(ballot32Type)) ? n + 1 : n), 0);
    },
    [ballots]
  );

  function shortenAddress(address: string | undefined | any) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <>
      <Head>
        <title>Realm Referendum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NoSSR>
        <Card bg={"secondaryGray.900"} flexDirection="column" w="99%" p="5px" px="5px" mt="5px" mx="auto">
          <HStack align="center" justify="right" px={{ base: 4 }}>
            <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
              <Image w="40px" h="40px" src="./icon_zk_vote.png" alt="Zk Vote" marginRight="5px" />
              <Text marginTop="2" textAlign={useBreakpointValue({ base: "center", md: "left" })} fontFamily={"heading"} color="secondaryGray.100" fontSize="xl" fontWeight="700">
                <b>ZK POH Vote </b>
                <Link href="https://github.com/elmol/zk-proof-of-humanity-vote" isExternal>
                  <IconButton backgroundColor={"secondaryGray.900"} aria-label="Github repository" icon={<Icon boxSize={4} as={FaGithub} />} />
                </Link>
              </Text>
            </Flex>
            <Spacer></Spacer>
            {_identity && _addressIdentity && (
              <>
                <Text color="secondaryGray.100" fontSize="md" fontWeight="900">
                  | <b>🔒 Identity:</b>
                </Text>
                <Text color="secondaryGray.100" fontSize="md" fontWeight="800">
                  {" "}
                  - <b>Human Address:</b>{" "}
                </Text>{" "}
                <EtherScanLink address={_addressIdentity} network={chain?.network}>
                  <Text>{shortenAddress(_addressIdentity)} </Text>
                </EtherScanLink>
                <Text color="secondaryGray.100" fontSize="md" fontWeight="800">
                  {" "}
                  - <b>Identity Commitment:</b>{" "}
                </Text>
                <Text fontSize="md" color="primary.400">
                  {" "}
                  {shortenAddress(_identity?.commitment.toString())}{" "}
                </Text>
              </>
            )}
            {isConnected && zkPoHContract && (
              <Text color="secondaryGray.100" fontWeight="800">
                {" "}
                | <b>Contract:</b>{" "}
                <EtherScanLink address={zkPoHContract.address} network={chain?.network}>
                  {shortenAddress(zkPoHContract.address)}
                </EtherScanLink>
              </Text>
            )}
            {chain && (
              <Text color="secondaryGray.100" fontWeight="800">
                {" "}
                | <b>Network:</b> {chain.unsupported ? "Wrong Network" : chain.name}
              </Text>
            )}
            {isConnected && address && (
              <>
                <Text color="secondaryGray.100" fontWeight="800">
                  {" "}
                  | <b>Connected to </b>{" "}
                  <EtherScanLink address={address} network={chain?.network}>
                    {shortenAddress(address)}
                  </EtherScanLink>{" "}
                  {isHuman ? "🧑" : "🤖"} |{" "}
                </Text>{" "}
                <Button colorScheme="primary" size="xs" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            )}
          </HStack>
        </Card>
      </NoSSR>

      <Container maxW={"3xl"}>
        <Stack as={Box} textAlign={"center"} spacing={{ base: 4, md: 8 }} py={{ base: 20, md: 36 }}>
          <Heading fontWeight={600} fontSize={{ base: "xl", sm: "2xl", md: "4xl" }} lineHeight={"110%"}>
            Realm Referendum
          </Heading>
          <Text color={"gray.500"}>
            {pollId && (
              <Badge variant="subtle" colorScheme="yellow">
                {pollId.toString()}
              </Badge>
            )}
            <br />
            {proposal && proposal}
          </Text>
          <Stack direction={"column"} spacing={3} align={"center"} alignSelf={"center"} position={"relative"}>
            <RadioGroup onChange={setBallot} value={ballot} defaultValue="YES">
              <Stack spacing={5} direction="row">
                <Radio colorScheme="green" value="YES">
                  Yes 👍
                </Radio>
                <Radio colorScheme="red" value="NO">
                  No 👎
                </Radio>
              </Stack>
            </RadioGroup>
            <ZKPoHConnect externalNullifier={pollId} signal={ballot} contractAddress={contractAddress} onLog={handleLog}>
              Vote
            </ZKPoHConnect>
            <StatGroup w="100%" borderWidth="1px" borderRadius="lg" p={2}>
              <Stat>
                <StatNumber>{count("YES")}</StatNumber>
                <StatLabel>👍</StatLabel>
              </Stat>
              <Stat>
                <StatLabel>👎</StatLabel>
                <StatNumber>{count("NO")}</StatNumber>
              </Stat>
            </StatGroup>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

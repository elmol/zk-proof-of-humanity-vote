import { EtherScanLink } from "@/components/EtherScanLink";
import LogsContext from "@/context/LogsContext";
import { useZkVotingRead } from "@/generated/zk-voting";
import { Box, Button, Container, Flex, HStack, Icon, IconButton, Image, Link, Radio, RadioGroup, SimpleGrid, Spacer, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils.js";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import NoSSR from "react-no-ssr";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { ButtonActionState, ConnectionState, ConnectionStateType, ZKPoHConnect, useIsRegisteredInPoH, useZkProofOfHumanity, useZkProofOfHumanitySignals } from "zkpoh-widget";
import Card from "../components/Card";
import ListItem from "../components/ListItem";
import theme from "../styles/index";

export default function Main() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const zkPoHConfig = {
    confirmationMessage: "The vote was cast successfully 🗳️",
    helpText: "Your identity is registered in ZK Proof of Humanity and generated, so now you can now vote on the proposal.",
  };

  const [pollId, setPollId] = useState<BigNumber | undefined>();
  const router = useRouter();
  useEffect(() => {
    const pollId = router.query.pollId;
    if (!pollId) {
      console.error("*** Invalid pollId");
      return;
    }
    const pollIdBig = BigNumber.from(pollId);
    console.log("*** Specific PollId: ", pollId);
    setPollId(pollIdBig);
  }, [router.query.pollId]);

  const { data: pollIds } = useZkVotingRead({
    functionName: "getPollIds",
  });

  useEffect(() => {
    setPollId(pollIds ? pollIds[0] : undefined);
  }, [pollIds]);

  const { data: proposal } = useZkVotingRead({
    functionName: "polls",
    args: [pollId ? pollId : BigNumber.from("0")],
  });

  const contractAddress = "0x3575E04983C401f26fA02FC09f6EE97e44dF296B";
  const zkPoHContract = useZkProofOfHumanity({ contractAddress });

  const { isHuman } = useIsRegisteredInPoH({ address, contractAddress });
  const [_identity, setIdentity] = useState<Identity>();
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();
  useEffect(() => {
    console.log("zkpoh address:", zkPoHContract?.address);
  }, [zkPoHContract?.address]);

  const { setLogs } = useContext(LogsContext);
  function handleLog(state: ButtonActionState) {
    setLogs(state.logs);
  }
  const [connectionStateType, setConnectionStateType] = useState<ConnectionStateType>();
  const [helpText, setHelpText] = useState<string>();
  function handleChangeState(state: ConnectionState) {
    setConnectionStateType(state.stateType);
    setHelpText(state.helpText);
    if (state.stateType == "IDENTITY_GENERATED") {
      setIdentity(state.identity);
      setAddressIdentity(state.address);
    }
  }

  const [selectedVote, setSelectedVote] = useState("YES");

  const votes = useZkProofOfHumanitySignals({ contractAddress, externalNullifier: pollId });
  const count = useCallback(
    (voteType: string) => {
      const ballot32Type = formatBytes32String(voteType);
      return votes?.reduce((n: number, ballot: any) => (BigNumber.from(ballot.signal).eq(BigNumber.from(ballot32Type)) ? n + 1 : n), 0);
    },
    [votes]
  );

  const percentage = useCallback(
    (voteType: string) => {
      if (!votes) return 0;
      const totalVotes = votes.length;
      const _percentage = (count(voteType) * 100) / totalVotes;
      return isNaN(_percentage) ? 0 : _percentage;
    },
    [count, votes]
  );

  function shortenAddress(address: string | undefined | any) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function viewAllPanels() {
    if (isConnected && chain && !chain.unsupported) return true;
    return false;
  }

  return (
    <>
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

      <NoSSR>
        <Container flex="1" display="flex" maxW={viewAllPanels() ? "100%" : "30%"}>
          <SimpleGrid columns={{ base: 1, md: 1, lg: viewAllPanels() ? 4 : 1, "2xl": viewAllPanels() ? 4 : 1 }} gap="20px" mb="20px" mt="20px">
            {viewAllPanels() && (
              <Card justifyContent="initial" alignItems="left" flexDirection="column" w="100%" mt="0px" h="100%">
                <Text me="auto" color={"secondaryGray.900"} fontSize="xl" fontWeight="700" lineHeight="100%" mb="5">
                  Proposals
                </Text>
                {pollIds && pollIds.map((number) => <ListItem key={number.toString()} value={number.toString()} />)}
              </Card>
            )}

            {viewAllPanels() && (
              <Card alignItems="left" flexDirection="column" w="100%" mb="0px">
                <NoSSR>
                  <Stack display="flex" width="100%">
                    <Text me="auto" color={"secondaryGray.900"} fontSize="xl" fontWeight="700" lineHeight="100%" mb="5">
                      Proposal
                    </Text>
                    <Text color={"secondaryGray.800"} fontWeight="600">
                      Id: {shortenAddress(pollId?.toString())}
                    </Text>
                    <Text color={"secondaryGray.900"} fontWeight="600">
                      Details:
                    </Text>
                    <Text color={"secondaryGray.800"} fontWeight="600">
                      {proposal ? parse(proposal) : ""}
                    </Text>
                  </Stack>
                </NoSSR>
              </Card>
            )}

            <Card justifyContent="center" alignItems="left" flexDirection="column" mb="0px" h={viewAllPanels() ? "100%" : "300px"}>
              <Stack direction="column" h="100%">
                <Text me="auto" color={"secondaryGray.900"} fontSize="xl" fontWeight="700" mt="0px" lineHeight="100%">
                  Vote
                </Text>
                <Stack display="flex" width="100%">
                  <Stack display="flex" width="95%" height="100%" mt="4">
                    <Text color={"secondaryGray.800"} fontWeight="600">
                      {helpText}
                    </Text>
                  </Stack>
                  {connectionStateType == "CAST_SIGNAL" && (
                    <RadioGroup onChange={setSelectedVote} value={selectedVote} defaultValue="YES" pt="10">
                      <Stack direction="row">
                        <Card bg={"secondaryGray.600"} height="200px" px="5px" mx="auto">
                          <Flex direction="column" py="5px" me="10px" w="100%" alignItems="center" justifyContent="flex-end" h="100%">
                            <Image borderRadius="full" boxSize="150px" src="./yes.png" alt="YES" p="3" />
                            <Radio color={"primary.800"} value="YES" colorScheme="green">
                              Yes
                            </Radio>
                          </Flex>
                        </Card>
                        <Card bg={"secondaryGray.600"} height="200px" px="5px" mx="auto">
                          <Flex direction="column" py="5px" me="10px" w="100%" alignItems="center" justifyContent="flex-end" h="100%">
                            <Image borderRadius="full" boxSize="150px" src="./no.png" alt="NO" p="3" />
                            <Radio color={"primary.800"} colorScheme="red" value="NO">
                              No
                            </Radio>
                          </Flex>
                        </Card>
                      </Stack>
                    </RadioGroup>
                  )}
                </Stack>
                <Stack alignItems="flex-end" justifyContent="flex-end" h="100%">
                  <ZKPoHConnect theme={theme} onChangeState={handleChangeState} onLog={handleLog} signal={selectedVote} externalNullifier={pollId} {...zkPoHConfig} contractAddress={contractAddress}>
                    Vote
                  </ZKPoHConnect>
                </Stack>
              </Stack>
            </Card>

            {viewAllPanels() && (
              <Card justifyContent="center" alignItems="center" flexDirection="column" w="100%" mb="0px">
                <Text me="auto" color={"secondaryGray.900"} fontSize="xl" fontWeight="700" lineHeight="100%">
                  Result of the vote
                </Text>
                <Stack alignItems="center" justifyContent="center" h="100%" w="90%">
                  <Card bg={"secondaryGray.900"} flexDirection="column" w="100%" p="15px" px="20px" mt="15px" mx="auto">
                    <Flex direction="row" alignItems="center">
                      <Flex direction="column" py="5px" w="50%" alignItems="center">
                        <Flex align="center">
                          <Box h="8px" w="8px" bg="green.500" borderRadius="50%" me="4px" />
                          <Text fontSize="xs" color="secondaryGray.100" fontWeight="700" mb="5px">
                            Yes
                          </Text>
                        </Flex>
                        <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                          ({percentage("YES")}%)
                        </Text>
                      </Flex>
                      <Flex direction="column" py="5px" me="10px" w="50%" alignItems="center">
                        <Flex align="center">
                          <Box h="8px" w="8px" bg="red.600" borderRadius="50%" me="4px" />
                          <Text fontSize="xs" color="secondaryGray.100" fontWeight="700" mb="5px">
                            No
                          </Text>
                        </Flex>
                        <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                          ({percentage("NO")}%)
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex direction="column" alignItems="center" pt="5">
                      <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                        <b>Total votes:</b> {!votes ? 0 : votes.length}
                      </Text>
                    </Flex>
                  </Card>
                </Stack>
              </Card>
            )}
          </SimpleGrid>
        </Container>
      </NoSSR>
    </>
  );
}

import { useZkVotingPollId, useZkVotingProposal } from "@/generated/zk-voting";
import { Badge, Box, Container, Heading, Radio, RadioGroup, Stack, Stat, StatGroup, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { formatBytes32String } from "ethers/lib/utils.js";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { ZKPoHConnect, useZkProofOfHumanity, useZkProofOfHumanitySignals } from "zkpoh-widget";

export default function Main() {
  const { data: pollId } = useZkVotingPollId();
  const { data: proposal } = useZkVotingProposal();

  const contractAddress = '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f'
  const zkPoHContract = useZkProofOfHumanity({contractAddress});

  useEffect(() => {
   console.log("zkpoh address:",zkPoHContract?.address)
  }, [zkPoHContract?.address])
 
  const [ballot, setBallot] = useState('YES')
  const ballots = useZkProofOfHumanitySignals({contractAddress, externalNullifier:pollId})
  const count = useCallback(
    (ballotType: string) => {
      const ballot32Type = formatBytes32String(ballotType);
      return ballots?.reduce((n: number, ballot: any) => (ballot.signal == ballot32Type ? n + 1 : n), 0);
    },
    [ballots]
  );

  return (
    <>
      <Head>
        <title>Realm Referendum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            <ZKPoHConnect externalNullifier={pollId} signal={ballot} contractAddress={contractAddress}>Vote</ZKPoHConnect>
            <StatGroup w="100%" borderWidth="1px" borderRadius="lg" p={2}>
              <Stat>
                <StatNumber>{count('YES')}</StatNumber>
                <StatLabel>👍</StatLabel>
              </Stat>
              <Stat>
                <StatLabel>👎</StatLabel>
                <StatNumber>{count('NO')}</StatNumber>
              </Stat>
            </StatGroup>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

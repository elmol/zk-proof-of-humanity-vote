import { useZkVotingPollId, useZkVotingProposal } from "@/generated/zk-voting";
import { Badge, Box, Container, Heading, Radio, RadioGroup, Stack, Stat, StatGroup, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils.js";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { ZKPoHConnect, useZkProofOfHumanity, useZkProofOfHumanitySignals } from "zkpoh-widget";

export default function Main() {
  const { data: pollId } = useZkVotingPollId();
  const { data: proposal } = useZkVotingProposal();

  const contractAddress = '0x3575E04983C401f26fA02FC09f6EE97e44dF296B'
  const zkPoHContract = useZkProofOfHumanity({contractAddress});

  useEffect(() => {
   console.log("zkpoh address:",zkPoHContract?.address)
  }, [zkPoHContract?.address])
 
  const [ballot, setBallot] = useState('YES')
  const ballots = useZkProofOfHumanitySignals({contractAddress, externalNullifier:pollId})
  const count = useCallback(
    (ballotType: string) => {
      const ballot32Type = formatBytes32String(ballotType);
      return ballots?.reduce((n: number, ballot: any) => (BigNumber.from(ballot.signal).eq(BigNumber.from(ballot32Type)) ? n + 1 : n), 0);
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

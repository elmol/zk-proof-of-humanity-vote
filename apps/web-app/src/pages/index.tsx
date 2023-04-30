import { useZkVotingPollId, useZkVotingProposal } from "@/generated/zk-voting";
import { Badge, Box, Button, Container, Heading, Radio, RadioGroup, Stack, Stat, StatGroup, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useZkProofOfHumanity } from "zkpoh-widget";

export default function Main() {
  const { data: pollId } = useZkVotingPollId();
  const { data: proposal } = useZkVotingProposal();

  const zkPoHcontract = useZkProofOfHumanity({contractAddress:'0x611F0278dE9D2Bd4E38F15001B6410B4A915275f'});

  useEffect(() => {
   console.log("zkpoh address:",zkPoHcontract?.address)
  }, [zkPoHcontract?.address])
  
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
            <RadioGroup defaultValue="2">
              <Stack spacing={5} direction="row">
                <Radio colorScheme="green" value="1">
                  Yes 👍
                </Radio>
                <Radio colorScheme="red" value="2">
                  No 👎
                </Radio>
              </Stack>
            </RadioGroup>
            <Button colorScheme="blue" width="100%">
              Vote
            </Button>

            <StatGroup w="100%" borderWidth="1px" borderRadius="lg" p={2}>
              <Stat>
                <StatNumber>345</StatNumber>
                <StatLabel>👍</StatLabel>
              </Stat>
              <Stat>
                <StatLabel>👎</StatLabel>
                <StatNumber>45</StatNumber>
              </Stat>
            </StatGroup>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

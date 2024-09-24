import { FaCheck, FaDollarSign, FaExclamation } from 'react-icons/fa';
import useSWR from 'swr';
import { Card, Flex, Text, Title } from '@mantine/core';
import { BASE_URL } from '@/utils/constants';

interface TransactionMetaData {
  totalAmountInUSD: number;
  successfulCount: number;
  declinedCount: number;
}

export function TransactionMeta() {
  const { data: meta } = useSWR<TransactionMetaData>(
    `${BASE_URL}/transaction/aggregate-data`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (!meta) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card padding="lg" mt="xl" h={380} w="70%" style={{ borderRadius: '22px' }}>
      <Flex direction="column" justify="space-between" h="100%">
        <Flex
          p="lg"
          style={{ backgroundColor: '#fef1cf', borderRadius: '104px', position: 'relative' }}
        >
          <Flex
            justify="center"
            align="center"
            mr={20}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaDollarSign size={'2.5rem'} color="#fcb90d" />
          </Flex>
          <Flex direction={'column'} justify={'space-between'}>
            <Title order={2} c="#fcb90d">
              $ {meta.totalAmountInUSD.toFixed(2)}
            </Title>
            <Text c="dimmed">Total Volume (USD)</Text>
          </Flex>
        </Flex>
        <Flex
          p="lg"
          style={{ backgroundColor: '#dffcee', borderRadius: '104px', position: 'relative' }}
        >
          <Flex
            justify="center"
            align="center"
            mr={20}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaCheck size={'2.5rem'} color="#1baf21" />
          </Flex>
          <Flex direction={'column'} justify={'space-between'}>
            <Title order={2} c="#1baf21">
              $ {meta.successfulCount}
            </Title>
            <Text c="dimmed">Successful Transactions</Text>
          </Flex>
        </Flex>
        <Flex
          p="lg"
          style={{ backgroundColor: '#fce5de', borderRadius: '104px', position: 'relative' }}
        >
          <Flex
            justify="center"
            align="center"
            mr={20}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaExclamation size={'2.5rem'} color="#ed4216" />
          </Flex>
          <Flex direction={'column'} justify={'space-between'}>
            <Title order={2} c="#ed4216">
              $ {meta.declinedCount}
            </Title>
            <Text c="dimmed">Declined Transactions</Text>
          </Flex>
        </Flex>

        {/* <Flex
          direction="column"
          p="lg"
          style={{ backgroundColor: '#dffcee', borderRadius: '104px' }}
        >
          <Title order={2} c="#1baf21">
            {meta.successfulCount}
          </Title>
          <Text c="dimmed">Successful Transactions</Text>
        </Flex>
        <Flex
          direction="column"
          p="lg"
          style={{ backgroundColor: '#fce5de', borderRadius: '104px' }}
        >
          <Title order={2} c="#ed4216">
            {meta.declinedCount}
          </Title>
          <Text c="dimmed">Declined Transactions</Text>
        </Flex> */}
      </Flex>
    </Card>
  );
}

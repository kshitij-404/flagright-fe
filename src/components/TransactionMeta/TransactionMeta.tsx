import { FaCheck, FaDollarSign, FaExclamation } from 'react-icons/fa';
import useSWR from 'swr';
import { Flex, Paper, Text, Title } from '@mantine/core';
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
    <Paper p={10} w="100%" radius={22}>
      <Flex direction="column" h="100%" gap={10}>
        <Flex p={20} style={{ backgroundColor: '#fef1cf', borderRadius: 12, position: 'relative' }}>
          <Flex
            justify="center"
            align="center"
            mr={16}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaDollarSign size="1.5rem" color="#fcb90d" />
          </Flex>
          <Flex direction="column" gap={2} my="auto">
            <Title order={2} size={24} c="#fcb90d">
              $ {meta.totalAmountInUSD.toFixed(2)}
            </Title>
            <Text c="dimmed" opacity={0.8} size="sm">
              Total Volume (USD)
            </Text>
          </Flex>
        </Flex>
        <Flex p={20} style={{ backgroundColor: '#dffcee', borderRadius: 12, position: 'relative' }}>
          <Flex
            justify="center"
            align="center"
            mr={16}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaCheck size="1.5rem" color="#1baf21" />
          </Flex>
          <Flex direction="column" gap={2} my="auto">
            <Title order={2} size={24} c="#1baf21">
              {meta.successfulCount}
            </Title>
            <Text c="dimmed" opacity={0.8} size="sm">
              Successful Transactions
            </Text>
          </Flex>
        </Flex>
        <Flex p={20} style={{ backgroundColor: '#fce5de', borderRadius: 12, position: 'relative' }}>
          <Flex
            justify="center"
            align="center"
            mr={16}
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '4rem',
              height: '4rem',
            }}
          >
            <FaExclamation size="1.5rem" color="#ed4216" />
          </Flex>
          <Flex direction="column" gap={2} my="auto">
            <Title order={2} size={24} c="#ed4216">
              {meta.declinedCount}
            </Title>
            <Text c="dimmed" opacity={0.8} size="sm">
              Declined Transactions
            </Text>
          </Flex>
        </Flex>

        {/* <Flex
          direction="column"
          p={16}
          style={{ backgroundColor: '#dffcee', borderRadius: 22 }}
        >
          <Title order={2} size={24} c="#1baf21">
            {meta.successfulCount}
          </Title>
          <Text c="dimmed" opacity={0.8} size="sm">Successful Transactions</Text>
        </Flex>
        <Flex
          direction="column"
          p={16}
          style={{ backgroundColor: '#fce5de', borderRadius: 22 }}
        >
          <Title order={2} size={24} c="#ed4216">
            {meta.declinedCount}
          </Title>
          <Text c="dimmed" opacity={0.8} size="sm">Declined Transactions</Text>
        </Flex> */}
      </Flex>
    </Paper>
  );
}

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AreaChart } from '@mantine/charts';
import { Flex, Paper, Text, Title } from '@mantine/core';
import { BASE_URL } from '@/utils/constants';

interface TransactionData {
  date: string;
  amount: number;
}

interface GraphDataResponse {
  graphData: { timestamp: number; amount: number }[];
  minAmount: number;
  maxAmount: number;
}

export function TransactionGraph() {
  const [data, setData] = useState<TransactionData[]>([]);
  const { data: graphDataResponse } = useSWR<GraphDataResponse>(
    `${BASE_URL}/transaction/graph-data`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (graphDataResponse) {
      const formattedData = graphDataResponse.graphData.map((transaction) => ({
        date: dayjs(transaction.timestamp).format('MM/DD/YYYY HH:mm'),
        amount: transaction.amount,
      }));
      setData(formattedData);
    }
  }, [graphDataResponse]);

  return (
    <Paper p={0} pt={30} pb={20} radius={22}>
      <Flex gap={0} direction="column" justify="space-between" h="100%">
        <Flex direction="column" ml={30}>
          <Title order={3} c="dark" fz={20}>
            Transacted Amount
          </Title>
          <Text c="dimmed" size="sm">
            Cumulative transaction amount over time
          </Text>
        </Flex>
        <AreaChart
          h={220}
          data={data}
          dataKey="date"
          withGradient
          withXAxis={false}
          withYAxis={false}
          withDots={false}
          // xAxisLabel="Date and Time"
          // yAxisLabel="Amount (USD)"
          yAxisProps={{
            domain: [
              Math.round(graphDataResponse?.minAmount as any),
              Math.round(graphDataResponse?.maxAmount as any),
            ],
          }}
          valueFormatter={(value) =>
            new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
          }
          tooltipAnimationDuration={200}
          series={[{ name: 'amount', color: 'blue.6', label: 'Transaction Amount' }]}
          gridAxis="x"
        />
      </Flex>
    </Paper>
  );
}

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AreaChart } from '@mantine/charts';
import { Card, Flex } from '@mantine/core';
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
    <Flex direction="column" style={{ width: '100%' }}>
      <Card padding="lg" style={{ width: '650px', borderRadius: '22px' }}>
        <AreaChart
          h={340}
          data={data}
          dataKey="date"
          withGradient
          xAxisLabel="Date and Time"
          yAxisLabel="Amount (USD)"
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
        />
      </Card>
    </Flex>
  );
}

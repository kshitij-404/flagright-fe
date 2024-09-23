import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AreaChart } from '@mantine/charts';
import { Card, Flex, Title } from '@mantine/core';
import { BASE_URL } from '@/utils/constants';

interface TransactionData {
  date: string;
  amount: number;
}

export function TransactionGraph() {
  const [data, setData] = useState<TransactionData[]>([]);
  const { data: transactions } = useSWR(`${BASE_URL}/transactions/last-5-days`, (url) =>
    fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (transactions) {
      const formattedData = transactions.map((transaction: any) => ({
        date: dayjs(transaction.date).format('MM/DD/YYYY HH:mm'),
        amount: transaction.amount,
      }));
      setData(formattedData);
    }
  }, [transactions]);

  return (
    <Flex direction='column' justify="center" align="center" style={{width: '100%'}}>
      <Card mt='xl' padding="lg" style={{ width: '1200px', borderRadius: '22px' }}>
        <Title order={4} mb="md">
          Transaction Graph
        </Title>
        <AreaChart
          h={300}
          data={data}
          dataKey="date"
          type="stacked"
          withGradient
          xAxisLabel="Date and Time"
          yAxisLabel="Amount"
          series={[{ name: 'Transaction Amount', color: 'blue.6' }]}
          tooltipProps={{
            content: ({ label, payload }) => (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                <strong>{label}</strong>
                {payload?.map((item: any) => (
                  <div key={item.name} style={{ color: item.color }}>
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            ),
          }}
        />
      </Card>
    </Flex>
  );
}

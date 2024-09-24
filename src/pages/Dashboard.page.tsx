import { useState } from 'react';
import { Flex, Grid } from '@mantine/core';
import { FilterMenu } from '@/components/FilterMenu/FilterMenu';
import { TransactionGraph } from '@/components/TransactionGraph/TransactionGraph';
import { TransactionInventory } from '@/components/TransactionInventory/TransactionInventory';
import { TransactionMeta } from '@/components/TransactionMeta/TransactionMeta';

export function Dashboard() {
  const [filters, setFilters] = useState<any>({});

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Grid>
      <Grid.Col span={2.5} style={{ position: 'sticky', top: 0, height: '100dvh' }}>
        <FilterMenu onApplyFilters={handleApplyFilters} />
      </Grid.Col>
      <Grid.Col span={9.5}>
        <Grid>
          <Grid.Col span={12}>
            <Flex align='center' justify='center' mb='lg'>
              <Flex w={1200} align="center" justify="space-between">
                <TransactionGraph />
                <TransactionMeta />
              </Flex>
            </Flex>
          </Grid.Col>
          <Grid.Col span={12}>
            <TransactionInventory filters={filters} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}

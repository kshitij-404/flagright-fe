import { useState } from 'react';
import { Grid } from '@mantine/core';
import { FilterMenu } from '@/components/FilterMenu/FilterMenu';
import { TransactionGraph } from '@/components/TransactionGraph/TransactionGraph';
import { TransactionInventory } from '@/components/TransactionInventory/TransactionInventory';

export function Dashboard() {
  const [filters, setFilters] = useState<any>({});

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Grid>
      <Grid.Col span={2.5} style={{ position: 'sticky', top: -10, height: '110vh', overflowY: 'hidden' }}>
        <FilterMenu onApplyFilters={handleApplyFilters} />
      </Grid.Col>
      <Grid.Col span={9.5}>
        <Grid>
          <Grid.Col span={12}>
            <TransactionGraph />
          </Grid.Col>
          <Grid.Col span={12}>
            <TransactionInventory filters={filters} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}

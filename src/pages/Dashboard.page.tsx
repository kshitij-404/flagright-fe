import { useState } from 'react';
import { Grid } from '@mantine/core';
import { TransactionInventory } from '@/components/TransactionInventory/TransactionInventory';
import { FilterMenu } from '@/components/FilterMenu/FilterMenu';

export function Dashboard() {
  const [filters, setFilters] = useState<any>({});

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Grid>
      <Grid.Col span={3}>
        <FilterMenu onApplyFilters={handleApplyFilters} />
      </Grid.Col>
      <Grid.Col span={9}>
        <TransactionInventory filters={filters} />
      </Grid.Col>
    </Grid>
  );
}

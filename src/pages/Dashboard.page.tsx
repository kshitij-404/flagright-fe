import { useState } from 'react';
import { Flex, Grid } from '@mantine/core';
import { FilterMenu } from '@/components/FilterMenu/FilterMenu';
import { ToolkitBar } from '@/components/ToolkitBar/ToolkitBar';
import { TransactionGraph } from '@/components/TransactionGraph/TransactionGraph';
import { TransactionInventory } from '@/components/TransactionInventory/TransactionInventory';
import { TransactionMeta } from '@/components/TransactionMeta/TransactionMeta';

export function Dashboard() {
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  return (
    <Grid gutter={0}>
      <Grid.Col span={2.5} h="100dvh" pos="sticky" top={0}>
        <FilterMenu onApplyFilters={handleApplyFilters} />
      </Grid.Col>
      <Grid.Col span={9.5}>
        <Grid p={20}>
          <Grid.Col span={12}>
            <Flex align="center" justify="center" mb="lg">
              <Flex w={1200} align="center" justify="space-between">
                <TransactionGraph />
                <TransactionMeta />
              </Flex>
            </Flex>
            <Flex align='center' justify='center' mt='xl' mb='sm'>
              <ToolkitBar onSearch={handleSearch} filters={filters}/>
            </Flex>
          </Grid.Col>
          <Grid.Col span={12}>
            <TransactionInventory filters={filters} searchTerm={searchTerm} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}

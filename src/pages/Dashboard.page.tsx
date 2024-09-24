import { useState } from 'react';
import { Box, Flex, Title } from '@mantine/core';
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
    <Box
      display="grid"
      style={{
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      <Box h="100dvh" pos="sticky" top={0}>
        <FilterMenu onApplyFilters={handleApplyFilters} />
      </Box>
      <Flex
        p={32}
        pt={40}
        mx="auto"
        w="100%"
        maw="min(calc(100vw - 18.5rem), 75rem)"
        direction="column"
        gap={24}
      >
        <Title order={2} ml={8}>
          Dashboard
        </Title>

        <Box
          display="grid"
          style={{
            gridTemplateColumns: '6fr 3fr',
            gap: 20,
          }}
          w="100%"
        >
          <TransactionGraph />
          <TransactionMeta />
        </Box>

        <Flex direction="column" gap={0}>
          <Flex align="center" justify="center">
            <ToolkitBar onSearch={handleSearch} filters={filters}/>
          </Flex>
          <Box>
            <TransactionInventory filters={filters} searchTerm={searchTerm} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

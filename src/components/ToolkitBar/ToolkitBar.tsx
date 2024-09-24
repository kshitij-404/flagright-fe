import { Button, Flex, TextInput } from '@mantine/core';
import { useState } from 'react';

interface ToolkitBarProps {
  onSearch: (searchQuery: string) => void;
}

export function ToolkitBar({ onSearch }: ToolkitBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Flex align="center" justify="space-between" style={{ width: '1200px' }}>
      <TextInput
        placeholder="Search..."
        radius="xl"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        style={{ width: '50%' }}
      />
      <Button color="blue" radius="xl" onClick={handleSearch}>
        Search
      </Button>
      <Button color="blue" radius="xl">
        Generate Report
      </Button>
      <Button color="blue" radius="xl">
        Download CSV
      </Button>
      <Button color="blue" radius="xl">
        Generate Transactions
      </Button>
    </Flex>
  );
}
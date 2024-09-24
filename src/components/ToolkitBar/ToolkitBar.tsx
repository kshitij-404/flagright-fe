import { useEffect, useState } from 'react';
import {
  IconFileTypeCsv,
  IconReport,
  IconSearch,
  IconTransactionDollar,
} from '@tabler/icons-react';
import { ActionIcon, Button, Flex, TextInput, useMantineTheme } from '@mantine/core';
import { BASE_URL } from '@/utils/constants';

interface ToolkitBarProps {
  onSearch: (searchQuery: string) => void;
  filters: any;
}

export function ToolkitBar({ onSearch, filters }: ToolkitBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratorRunning, setIsGeneratorRunning] = useState(false);

  useEffect(() => {
    const generatorStatus = localStorage.getItem('isGeneratorRunning');
    if (generatorStatus) {
      setIsGeneratorRunning(JSON.parse(generatorStatus));
    }
  }, []);
  const theme = useMantineTheme();
  const colors = theme.colors;

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

  const toggleTransactionGenerator = async () => {
    const action = isGeneratorRunning ? 'stop' : 'start';
    try {
      const response = await fetch(`${BASE_URL}/transaction/generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setIsGeneratorRunning(!isGeneratorRunning);
        localStorage.setItem('isGeneratorRunning', JSON.stringify(!isGeneratorRunning));
      } else {
        console.error('Failed to toggle transaction generator');
      }
    } catch (error) {
      console.error('Error toggling transaction generator', error);
    }
  };

  const downloadCSV = async () => {
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    );
    try {
      const queryParams = new URLSearchParams(filteredFilters as any).toString();
      const response = await fetch(`${BASE_URL}/transaction/download-csv?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/csv',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error downloading CSV', error);
    }
  };

  const downloadPDF = async () => {
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    );
    try {
      const queryParams = new URLSearchParams(filteredFilters as any).toString();
      const response = await fetch(`${BASE_URL}/transaction/report?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF', error);
    }
  };

  return (
    <Flex
      align="center"
      gap={20}
      w="100%"
      justify="space-between"
      bg="blue.5"
      p={8}
      pr={12}
      style={{
        borderRadius: 22,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <Flex
        gap={8}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        align="center"
      >
        <TextInput
          placeholder="Search..."
          radius={14}
          value={searchQuery}
          onChange={handleSearchChange}
          // onKeyPress={handleKeyPress}
          w={300}
          variant="filled"
          styles={{
            input: {
              backgroundColor: colors.blue[7],
              color: colors.blue[0],
            },
          }}
        />
        {/* <Button
          color="blue"
          radius="xl"
          type="submit"
          leftSection={<IconSearch size={16} stroke={2.5} />}
          variant="gradient"
        >
          Search
        </Button> */}
        <ActionIcon variant="white" radius={14} type="submit" size={34}>
          <IconSearch size={16} stroke={2} />
        </ActionIcon>
      </Flex>

      <Flex gap={16}>
        <Button size="compact-sm" color="blue.5" radius={14} leftSection={<IconReport size={16} />}>
          Generate Report
        </Button>
        <Button
          size="compact-sm"
          color="blue.5"
          radius={14}
          leftSection={<IconTransactionDollar size={16} />}
        >
          Generate Transactions
        </Button>
        <Button
          size="compact-sm"
          color="blue.5"
          radius={14}
          leftSection={<IconFileTypeCsv size={16} />}
        >
          Download CSV
        </Button>
      </Flex>
    </Flex>
  );
}

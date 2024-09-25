import { Button, Flex, TextInput } from '@mantine/core';
import { useState, useEffect } from 'react';
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
      <Button color="blue" radius="xl" onClick={downloadPDF}>
        Generate Report
      </Button>
      <Button color="blue" radius="xl" onClick={downloadCSV}>
        Download CSV
      </Button>
      <Button color="blue" radius="xl" onClick={toggleTransactionGenerator}>
        {isGeneratorRunning ? 'Stop' : 'Generate Transactions'}
      </Button>
    </Flex>
  );
}
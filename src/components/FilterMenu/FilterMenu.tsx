import { useState } from 'react';
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';

const transactionTypes = [
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'EXTERNAL_PAYMENT', label: 'External Payment' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'REFUND', label: 'Refund' },
  { value: 'OTHER', label: 'Other' },
];

const transactionStates = [
  { value: 'CREATED', label: 'Created' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SENT', label: 'Sent' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'SUCCESSFUL', label: 'Successful' },
  { value: 'REVERSED', label: 'Reversed' },
];

export function FilterMenu({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) {
  const [amountGte, setAmountGte] = useState<number | undefined>(undefined);
  const [amountLte, setAmountLte] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [tag, setTag] = useState<string>('');

  const handleApplyFilters = () => {
    const filters = {
      amountGte,
      amountLte,
      startDate,
      endDate,
      description,
      type,
      state,
      tag,
    };
    onApplyFilters(filters);
  };

  return (
    <Stack spacing="md" p="md" style={{ width: 300 }}>
      <NumberInput
        label="Amount (Greater than or equal)"
        value={amountGte}
        onChange={(value) => setAmountGte(value as number)}
        placeholder="Enter minimum amount"
      />
      <NumberInput
        label="Amount (Less than or equal)"
        value={amountLte}
        onChange={(value) => setAmountLte(value as number)}
        placeholder="Enter maximum amount"
      />
      <TextInput
        label="Start Date"
        value={startDate}
        onChange={(event) => setStartDate(event.currentTarget.value)}
        placeholder="YYYY-MM-DD"
      />
      <TextInput
        label="End Date"
        value={endDate}
        onChange={(event) => setEndDate(event.currentTarget.value)}
        placeholder="YYYY-MM-DD"
      />
      <TextInput
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        placeholder="Enter description"
      />
      <Select
        label="Type"
        value={type}
        onChange={setType}
        data={transactionTypes}
        placeholder="Select type"
      />
      <Select
        label="State"
        value={state}
        onChange={setState}
        data={transactionStates}
        placeholder="Select state"
      />
      <TextInput
        label="Tag"
        value={tag}
        onChange={(event) => setTag(event.currentTarget.value)}
        placeholder="Enter tag"
      />
      <Group position="right" mt="md">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </Group>
    </Stack>
  );
}
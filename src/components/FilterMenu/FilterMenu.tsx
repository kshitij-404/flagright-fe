import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  Button,
  Group,
  MultiSelect,
  Paper,
  RangeSlider,
  Stack,
  Text,
  TextInput,
  Title,
  ActionIcon,
  Popover,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { BASE_URL } from '@/utils/constants';

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
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [startDatePickerOpened, setStartDatePickerOpened] = useState(false);
  const [endDatePickerOpened, setEndDatePickerOpened] = useState(false);
  const { data: tagOptions } = useSWR(`${BASE_URL}/transaction/tags`, (url) => fetch(url).then((res) => res.json()));
  const { data: amountRangeData } = useSWR(`${BASE_URL}/transaction/amount-range`, (url) => fetch(url).then((res) => res.json()));

  useEffect(() => {
    if (amountRangeData) {
      setAmountRange([amountRangeData.minAmount, amountRangeData.maxAmount]);
    }
  }, [amountRangeData]);

  const handleApplyFilters = () => {
    const filters = {
      amountGte: amountRange[0],
      amountLte: amountRange[1],
      startDate,
      endDate,
      description,
      types,
      states,
      tags,
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setAmountRange([0, 1000]);
    setStartDate(null);
    setEndDate(null);
    setDescription('');
    setTypes([]);
    setStates([]);
    setTags([]);
    onApplyFilters({});
  };

  const sliderMarks = [
    { value: Math.round(amountRangeData?.minAmount || 0), label: `${Math.round(amountRangeData?.minAmount || 0)}` },
    { value: Math.round(amountRangeData?.maxAmount || 1000), label: `${Math.round(amountRangeData?.maxAmount || 1000)}` },
  ];

  return (
    <Paper p="md" style={{ backgroundColor: 'white', width: '100%', height: '100vh' }}>
      <Title order={3} mb="md" mt={50} ml="lg">
        FILTERS
      </Title>
      <Stack p="md" style={{ width: 300 }}>
        <RangeSlider
          value={amountRange}
          onChange={setAmountRange}
          min={Math.round(amountRangeData?.minAmount || 0)}
          max={Math.round(amountRangeData?.maxAmount || 1000)}
          marks={sliderMarks}
        />
        <Group>
          <Text>Start Date: {startDate ? startDate.toLocaleDateString() : 'Not selected'}</Text>
          <Popover
            opened={startDatePickerOpened}
            onChange={setStartDatePickerOpened}
            position="bottom"
            withArrow
          >
            <Popover.Target>
              <ActionIcon onClick={() => setStartDatePickerOpened((o) => !o)}>
                <IconCalendar size={16} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker value={startDate} onChange={setStartDate} />
            </Popover.Dropdown>
          </Popover>
        </Group>
        <Group>
          <Text>End Date: {endDate ? endDate.toLocaleDateString() : 'Not selected'}</Text>
          <Popover
            opened={endDatePickerOpened}
            onChange={setEndDatePickerOpened}
            position="bottom"
            withArrow
          >
            <Popover.Target>
              <ActionIcon onClick={() => setEndDatePickerOpened((o) => !o)}>
                <IconCalendar size={16} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker value={endDate} onChange={setEndDate} />
            </Popover.Dropdown>
          </Popover>
        </Group>
        <TextInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          placeholder="Enter description"
        />
        <MultiSelect
          label="Type"
          value={types}
          onChange={setTypes}
          data={transactionTypes}
          placeholder="Select types"
        />
        <MultiSelect
          label="State"
          value={states}
          onChange={setStates}
          data={transactionStates}
          placeholder="Select states"
        />
        <MultiSelect
          label="Tag"
          value={tags}
          onChange={setTags}
          data={tagOptions?.map((tag: string) => ({ value: tag, label: tag })) || []}
          placeholder="Select tags"
        />
        <Group mt="md">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
        </Group>
      </Stack>
    </Paper>
  );
}
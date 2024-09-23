import { useEffect, useState } from 'react';
import { IconCalendar } from '@tabler/icons-react';
import useSWR from 'swr';
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  MultiSelect,
  Paper,
  Popover,
  RangeSlider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
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
  const { data: tagOptions } = useSWR(`${BASE_URL}/transaction/tags`, (url) =>
    fetch(url).then((res) => res.json())
  );
  const { data: amountRangeData } = useSWR(`${BASE_URL}/transaction/amount-range`, (url) =>
    fetch(url).then((res) => res.json())
  );

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
    {
      value: Math.round(amountRangeData?.minAmount || 0),
      label: `${Math.round(amountRangeData?.minAmount || 0)}`,
    },
    {
      value: Math.round(amountRangeData?.maxAmount || 1000),
      label: `${Math.round(amountRangeData?.maxAmount || 1000)}`,
    },
  ];

  return (
    <Paper p="md" radius="xs" style={{ backgroundColor: 'white', width: '100%', height: '100vh' }}>
      <Flex direction="column" align="center">
        <Flex align='flex-start' style={{width: '100%'}}>
          <Title order={3} mb="md" mt={50} ml="40">
            FILTERS
          </Title>
        </Flex>
        <Stack p="md" style={{ width: 300 }}>
          <Text mt="md" style={{ fontWeight: '600' }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Enter description"
          />
          <Text mt="md" style={{ fontWeight: '600' }}>
            Type
          </Text>
          <MultiSelect
            value={types}
            onChange={setTypes}
            data={transactionTypes}
            placeholder="Select types"
          />
          <Text mt="md" style={{ fontWeight: '600' }}>
            State
          </Text>
          <MultiSelect
            value={states}
            onChange={setStates}
            data={transactionStates}
            placeholder="Select states"
          />
          <Text mt="md" style={{ fontWeight: '600' }}>
            Tags
          </Text>
          <MultiSelect
            value={tags}
            onChange={setTags}
            data={tagOptions?.map((tag: string) => ({ value: tag, label: tag })) || []}
            placeholder="Select tags"
          />
          <Text mt="30" mb="lg" style={{ fontWeight: '600' }}>
            Date
          </Text>
          <Group>
            <Flex justify="space-between" style={{ width: '100%' }}>
              <Text c="dimmed">Start</Text>
              <Group>
                <Text>{startDate ? startDate.toLocaleDateString() : 'Not selected'}</Text>
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
            </Flex>
          </Group>
          <Divider size="xs"></Divider>
          <Group>
            <Flex justify="space-between" style={{ width: '100%' }}>
              <Text c="dimmed">End</Text>
              <Group>
                <Text>{endDate ? endDate.toLocaleDateString() : 'Not selected'}</Text>
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
            </Flex>
          </Group>
          <Text mt="30" mb="lg" style={{ fontWeight: '600' }}>
            Price Range
          </Text>
          <RangeSlider
            value={amountRange}
            onChange={setAmountRange}
            min={Math.round(amountRangeData?.minAmount || 0)}
            max={Math.round(amountRangeData?.maxAmount || 1000)}
            marks={sliderMarks}
          />
          <Flex justify='space-between'  mt="60">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Flex >
        </Stack>
      </Flex>
    </Paper>
  );
}

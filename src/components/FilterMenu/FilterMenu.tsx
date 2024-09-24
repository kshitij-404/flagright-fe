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
      type: types.join(','),
      state: states.join(','),
      tags: tags.join(','),
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
    <Paper
      radius={0}
      h="100vh"
      bg="white"
      // style={{ backgroundColor: 'white', width: '100%', height: '100vh' }}
      // p={28}
      // pt={40}
    >
      <Flex direction="column" align="center" p={28} pt={40} gap={28} h="100%">
        <Flex align="flex-start" style={{ width: '100%' }}>
          <Title order={3}>Filters</Title>
        </Flex>

        <Flex direction="column" gap={20} w={240}>
          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              Description
            </Text>
            <TextInput
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
              placeholder="Enter description"
              variant="filled"
            />
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              Type
            </Text>
            <MultiSelect
              value={types}
              onChange={setTypes}
              data={transactionTypes}
              placeholder="Select types"
              variant="filled"
            />
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              State
            </Text>
            <MultiSelect
              value={states}
              onChange={setStates}
              data={transactionStates}
              placeholder="Select states"
              variant="filled"
            />
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              Tags
            </Text>
            <MultiSelect
              value={tags}
              onChange={setTags}
              data={tagOptions?.map((tag: string) => ({ value: tag, label: tag })) || []}
              placeholder="Select tags"
              variant="filled"
            />
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              Date
            </Text>

            <Paper bg="gray.1" radius={12}>
              <Flex direction="column" gap={10} py={10}>
                <Flex px={12} justify="space-between" align="center" w="100%">
                  <Text size="sm" c="dark.2">
                    Start
                  </Text>
                  <Group>
                    <Text c="dark.4" fw={500} size="sm">
                      {startDate ? startDate.toLocaleDateString() : 'Not selected'}
                    </Text>
                    <Popover
                      opened={startDatePickerOpened}
                      onChange={setStartDatePickerOpened}
                      position="bottom"
                      withArrow
                    >
                      <Popover.Target>
                        <ActionIcon
                          variant="filled"
                          onClick={() => setStartDatePickerOpened((o) => !o)}
                        >
                          <IconCalendar size={16} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker value={startDate} onChange={setStartDate} />
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </Flex>

                <Divider size="xs" />

                <Flex px={12} justify="space-between" align="center" w="100%">
                  <Text size="sm" c="dark.2">
                    End
                  </Text>
                  <Group>
                    <Text c="dark.4" fw={500} size="sm">
                      {endDate ? endDate.toLocaleDateString() : 'Not selected'}
                    </Text>
                    <Popover
                      opened={endDatePickerOpened}
                      onChange={setEndDatePickerOpened}
                      position="bottom"
                      withArrow
                    >
                      <Popover.Target>
                        <ActionIcon
                          variant="filled"
                          onClick={() => setEndDatePickerOpened((o) => !o)}
                        >
                          <IconCalendar size={16} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker value={endDate} onChange={setEndDate} />
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </Flex>
              </Flex>
            </Paper>
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw={500} size="sm" c="dark.4">
              Price Range
            </Text>

            <RangeSlider
              value={amountRange}
              onChange={setAmountRange}
              min={Math.round(amountRangeData?.minAmount || 0)}
              max={Math.round(amountRangeData?.maxAmount || 1000)}
              marks={sliderMarks}
              labelTransitionProps={{
                transition: 'pop',
                duration: 80,
                timingFunction: 'linear',
              }}
            />
          </Flex>
        </Flex>

        <Flex justify="space-between" mt="auto" gap={10} w="100%">
          <Button w="100%" onClick={handleApplyFilters}>
            Apply
          </Button>
          <Button w="100%" variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </Flex>
      </Flex>
    </Paper>
  );
}

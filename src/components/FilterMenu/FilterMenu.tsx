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
  ScrollArea,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { currencyOptions, transactionStates, transactionTypes } from '@/utils/constants';
import { swrFetcher } from '@/utils/swr';

export function FilterMenu({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) {
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [originUserIds, setOriginUserIds] = useState<string[]>([]);
  const [destinationUserIds, setDestinationUserIds] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [startDatePickerOpened, setStartDatePickerOpened] = useState(false);
  const [endDatePickerOpened, setEndDatePickerOpened] = useState(false);
  const { data: tagOptions } = useSWR([`transaction/tags`, 'get'], swrFetcher);
  const { data: amountRangeData } = useSWR([`transaction/amount-range`, 'get'], swrFetcher);
  const { data: userList } = useSWR([`transaction/user-id-list`, 'get'], swrFetcher);

  useEffect(() => {
    if (amountRangeData?.data) {
      setAmountRange([amountRangeData?.data.minAmount, amountRangeData?.data.maxAmount]);
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
      originUserId: originUserIds.join(','),
      destinationUserId: destinationUserIds.join(','),
      currency: currencies.join(','),
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setAmountRange([amountRangeData?.data.minAmount, amountRangeData?.data.maxAmount]);
    setStartDate(null);
    setEndDate(null);
    setDescription('');
    setTypes([]);
    setStates([]);
    setTags([]);
    setOriginUserIds([]);
    setDestinationUserIds([]);
    setCurrencies([]);
    onApplyFilters({});
  };

  const sliderMarks = [
    {
      value: Math.round(amountRangeData?.data?.minAmount || 0),
      label: `${Math.round(amountRangeData?.data?.minAmount || 0)}`,
    },
    {
      value: Math.round(amountRangeData?.data?.maxAmount || 1000),
      label: `${Math.round(amountRangeData?.data?.maxAmount || 1000)}`,
    },
  ];

  return (
    <Paper
      radius={0}
      // h="100vh"
      bg="white"
      // style={{ backgroundColor: 'white', width: '100%', height: '100vh' }}
      // p={28}
      // pt={40}
    >
      <ScrollArea h="100vh" type="hover" scrollbarSize={6} scrollHideDelay={100}>
        <Flex direction="column" align="center" p={28} pt={40} gap={20} h="100%">
          <Flex align="flex-start" style={{ width: '100%' }}>
            <Title order={3}>Filters</Title>
          </Flex>

          <Flex direction="column" gap={20} w={240}>
            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              Description
            </Text> */}
              <TextInput
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
                placeholder="Enter description"
                variant="filled"
                label="Description"
              />
            </Flex>
            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              Type
            </Text> */}
              <MultiSelect
                value={types}
                onChange={setTypes}
                data={transactionTypes}
                placeholder="Select types"
                variant="filled"
                label="Type"
              />
            </Flex>

            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              State
            </Text> */}
              <MultiSelect
                value={states}
                onChange={setStates}
                data={transactionStates}
                placeholder="Select states"
                variant="filled"
                label="State"
              />
            </Flex>

            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              Tags
            </Text> */}
              <MultiSelect
                value={tags}
                onChange={setTags}
                data={tagOptions?.data?.map((tag: string) => ({ value: tag, label: tag })) || []}
                placeholder="Select tags"
                variant="filled"
                label="Tags"
              />
            </Flex>

            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              Sender
            </Text> */}
              <MultiSelect
                value={originUserIds}
                onChange={setOriginUserIds}
                data={userList?.data?.map((user: string) => ({ value: user, label: user })) || []}
                placeholder="Select user"
                variant="filled"
                label="Sender"
              />
            </Flex>

            <Flex direction="column" gap={10}>
              {/* <Text fw={500} size="sm" c="dark.4">
              Receiver
            </Text> */}
              <MultiSelect
                value={destinationUserIds}
                onChange={setDestinationUserIds}
                data={userList?.data?.map((user: string) => ({ value: user, label: user })) || []}
                placeholder="Select user"
                variant="filled"
                label="Receiver"
              />
            </Flex>

            <Flex direction="column" gap={2}>
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
              {/* <Text fw={500} size="sm" c="dark.4">
              Currency
            </Text> */}
              <MultiSelect
                value={currencies}
                onChange={setCurrencies}
                data={currencyOptions}
                placeholder="Select Currency"
                variant="filled"
                label="Currency"
              />
            </Flex>

            <Flex direction="column" gap={10}>
              <Text fw={500} size="sm" c="dark.4">
                Price Range
              </Text>

              <RangeSlider
                value={amountRange}
                onChange={setAmountRange}
                min={Math.round(amountRangeData?.data?.minAmount || 0)}
                max={Math.round(amountRangeData?.data?.maxAmount || 1000)}
                marks={sliderMarks}
                labelTransitionProps={{
                  transition: 'pop',
                  duration: 80,
                  timingFunction: 'linear',
                }}
              />
            </Flex>
          </Flex>

          <Flex justify="space-between" mt={32} gap={10} w="100%">
            <Button w="100%" onClick={handleApplyFilters}>
              Apply
            </Button>
            <Button w="100%" variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </Flex>
        </Flex>
      </ScrollArea>
    </Paper>
  );
}

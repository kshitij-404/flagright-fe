import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import useSWR from 'swr';
import {
  ActionIcon,
  Badge,
  CopyButton,
  Flex,
  NumberFormatter,
  Pagination,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { BASE_URL } from '@/utils/constants';
import { TransactionDetailsDrawer } from '../TransactionDetails/TransactionDetails';

interface TransactionInventoryProps {
  filters: any;
}

export function TransactionInventory({ filters }: TransactionInventoryProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );

  const { data, error } = useSWR(
    `${BASE_URL}/transaction?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&${new URLSearchParams(filteredFilters as any).toString()}`,
    (url) => fetch(url).then((res) => res.json())
  );

  if (error) return <Text>Error loading data</Text>;
  if (!data) return <Skeleton mah={636} mt={27} height={200} radius="xl" maw={1024} />;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const rows = data.transactions.map((transaction: any) => (
    <Table.Tr
      key={transaction._id}
      onClick={() => setSelectedTransactionId(transaction.transactionId)}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td style={{ textAlign: 'center' }}>
        <Badge variant="light" color="blue" size="lg">
          {transaction.type}
        </Badge>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        <CopyButton value={transaction.transactionId} timeout={1000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
              <Badge
                color={copied ? 'teal' : 'transparent'}
                variant="filled"
                onClick={copy}
                style={{
                  cursor: 'pointer',
                  border: copied ? 'none' : '1px solid gray',
                  color: copied ? 'white' : 'black',
                }}
              >
                {transaction.transactionId}
              </Badge>
            </Tooltip>
          )}
        </CopyButton>
      </Table.Td>
      <Table.Td>
        <div style={{ textAlign: 'center' }}>
          <Text size="sm">{dayjs(transaction.timestamp).format('MMM D, YYYY')}</Text>
          <Text c="dimmed" style={{ fontSize: '12px' }}>
            {`at ${dayjs(transaction.timestamp).format('h:mm A')}`}
          </Text>
        </div>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{transaction.originUserId}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>{transaction.destinationUserId}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        <Badge variant="light" color="blue" size="lg">
          {transaction.transactionState}
        </Badge>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        <NumberFormatter
          value={transaction.originAmountDetails.transactionAmount}
          thousandSeparator
          decimalScale={2}
          prefix={`${transaction.originAmountDetails.transactionCurrency} `}
        />
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        {transaction.tags.map((tag: any) => (
          <Badge variant="light" key={tag._id} color="green" size="sm" mr="xs">
            {`${tag.key}`}
          </Badge>
        ))}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Flex
        justify="center"
        align="center"
        style={{
          marginBottom: '60px',
        }}
        direction="column"
      >
        <Table
          className="transaction-inventory"
          horizontalSpacing="md"
          verticalSpacing="md"
          highlightOnHover
          mah={636}
          bgcolor="#ffffff"
          mb={26}
          mt={27}
          style={{
            borderRadius: 22,
            fontSize: 14,
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>
                Type
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('type')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'type' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Txn ID
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('transactionId')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'transactionId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Time
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('timestamp')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'timestamp' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Sender ID
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('originUserId')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'originUserId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Receiver ID
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('destinationUserId')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'destinationUserId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                State
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('transactionState')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'transactionState' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Amount
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('originAmountDetails.transactionAmount')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'originAmountDetails.transactionAmount' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Tags
                <ActionIcon
                  variant="subtle"
                  color="black"
                  onClick={() => handleSort('tags')}
                  ml={4}
                  mr={4}
                  style={{ transform: 'translate(0px, 2px)' }}
                >
                  {sortBy === 'tags' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
      <Flex justify="center" align="center" mt="md">
        <Pagination
          total={data.metadata.totalPages}
          value={page}
          onChange={setPage}
          size="lg"
          radius="xl"
        />
      </Flex>
      <TransactionDetailsDrawer
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  );
}

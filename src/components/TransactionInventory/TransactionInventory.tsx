import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IconArrowsMoveVertical, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import useSWR from 'swr';
import {
  ActionIcon,
  Badge,
  Button,
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
  searchTerm: string;
}

export function TransactionInventory({ filters, searchTerm }: TransactionInventoryProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  const filteredFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );

  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/transaction?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchTerm=${searchTerm}&${new URLSearchParams(filteredFilters as any).toString()}`,
    (url) => fetch(url).then((res) => res.json())
  );

  if (error) {
    return <Text>Error loading data</Text>;
  }
  // if (!data) {
  //   return <Skeleton mah={636} mt={27} height={200} radius="xl" maw={1024} />;
  // }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const rows =
    data && data.transactions && data.transactions.length > 0 ? (
      data.transactions?.map((transaction: any) => (
        <Table.Tr
          key={transaction._id}
          onClick={() => setSelectedTransactionId(transaction.transactionId)}
          style={{ cursor: 'pointer' }}
        >
          <Table.Td style={{ textAlign: 'center' }}>
            <Badge variant="light" color="blue" size="md">
              {transaction.type}
            </Badge>
          </Table.Td>
          <Table.Td style={{ textAlign: 'center' }}>
            <CopyButton value={transaction.transactionId} timeout={1000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Copied' : 'Copy'}
                  withArrow
                  position="right"
                  transitionProps={{ transition: 'scale-x' }}
                >
                  <Badge
                    className="font-mono"
                    color={copied ? 'teal' : 'dark'}
                    variant={copied ? 'light' : 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation();
                      copy();
                    }}
                    fw={400}
                    style={{
                      cursor: 'pointer',
                      // border: copied ? 'none' : '1px solid gray',
                      // color: copied ? 'white' : 'black',
                    }}
                  >
                    {transaction.transactionId}
                  </Badge>
                </Tooltip>
              )}
            </CopyButton>
          </Table.Td>
          <Table.Td>
            <Flex direction="column" gap={2} align="center">
              <Text size="sm" fw={600} c="dark.4">
                {dayjs(transaction.timestamp).format('MMM D, YYYY')}
              </Text>
              <Text c="dimmed" size="xs">
                {`${dayjs(transaction.timestamp).format('h:mm A')}`}
              </Text>
            </Flex>
          </Table.Td>
          {/* <Table.Td style={{ textAlign: 'center' }}>{transaction.originUserId}</Table.Td> */}
          <Table.Td style={{ textAlign: 'center' }}>
            <CopyButton value={transaction.originUserId} timeout={1000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Copied' : 'Copy'}
                  withArrow
                  position="right"
                  transitionProps={{ transition: 'scale-x' }}
                >
                  <Badge
                    className="font-mono"
                    color={copied ? 'teal' : 'dark'}
                    variant={copied ? 'light' : 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation();
                      copy();
                    }}
                    fw={400}
                    style={{
                      cursor: 'pointer',
                      // border: copied ? 'none' : '1px solid gray',
                      // color: copied ? 'white' : 'black',
                    }}
                  >
                    {transaction.originUserId}
                  </Badge>
                </Tooltip>
              )}
            </CopyButton>
          </Table.Td>
          <Table.Td style={{ textAlign: 'center' }}>
            {' '}
            <CopyButton value={transaction.destinationUserId} timeout={1000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Copied' : 'Copy'}
                  withArrow
                  position="right"
                  transitionProps={{ transition: 'scale-x' }}
                >
                  <Badge
                    className="font-mono"
                    color={copied ? 'teal' : 'dark'}
                    variant={copied ? 'light' : 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation();
                      copy();
                    }}
                    fw={400}
                    style={{
                      cursor: 'pointer',
                      // border: copied ? 'none' : '1px solid gray',
                      // color: copied ? 'white' : 'black',
                    }}
                  >
                    {transaction.destinationUserId}
                  </Badge>
                </Tooltip>
              )}
            </CopyButton>
          </Table.Td>
          <Table.Td style={{ textAlign: 'center' }}>
            <Badge variant="light" color="blue" size="md">
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
              <Badge variant="light" key={tag._id} color="green" size="md">
                {`${tag.key}`}
              </Badge>
            ))}
          </Table.Td>
        </Table.Tr>
      ))
    ) : isLoading ? (
      new Array(5).fill(0).map((_, index) => (
        <Table.Tr key={index} p={0}>
          <Table.Td colSpan={8}>
            <Skeleton height={40} />
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={8} style={{ textAlign: 'center' }} c="dimmed">
          No transactions found
        </Table.Td>
      </Table.Tr>
    );

  return (
    <Flex direction="column" gap={30}>
      <Flex
        justify="center"
        align="center"
        style={{
          // marginBottom: '60px',
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
        }}
        bg="blue.5"
        direction="column"
        p={4}
        pt={0}
      >
        <Table
          className="transaction-inventory"
          horizontalSpacing="md"
          verticalSpacing="md"
          highlightOnHover
          // mah={636}
          bgcolor="#ffffff"
          style={{
            borderRadius: 18,
            overflow: 'hidden',
            // borderTopLeftRadius: 0,
            // borderTopRightRadius: 0,
            fontSize: 14,
            // maxWidth: '1200px',
            // margin: '0 auto',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>
                {/* Type
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
                </ActionIcon> */}
                <Button
                  size="compact-sm"
                  variant="subtle"
                  c="dark"
                  rightSection={
                    sortBy === 'type' ? (
                      sortOrder === 'asc' ? (
                        <IconSortAscending size={16} stroke={1.5} />
                      ) : (
                        <IconSortDescending size={16} stroke={1.5} />
                      )
                    ) : (
                      <IconArrowsMoveVertical size={16} stroke={1.5} />
                    )
                  }
                  onClick={() => handleSort('type')}
                >
                  Type
                </Button>
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
      <Flex justify="center" align="center">
        <Pagination
          total={data?.metadata?.totalPages || 0}
          value={page}
          onChange={setPage}
          size="md"
          radius="xl"
        />
      </Flex>
      <TransactionDetailsDrawer
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </Flex>
  );
}

import dayjs from 'dayjs';
import { useState } from 'react';
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

export function TransactionInventory() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('asc');

  const { data, error } = useSWR(
    `${BASE_URL}/transaction?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
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
    <Table.Tr key={transaction._id}>
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
          <Text size="sm">
            {dayjs(transaction.timestamp).format('MMM D, YYYY')}
          </Text>
          <Text c="dimmed" style={{fontSize: "12px"}}>
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
            {`${tag.key}: ${tag.value}`}
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
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: 'center' }}>
                Type
                <ActionIcon onClick={() => handleSort('type')}>
                  {sortBy === 'type' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Transaction ID
                <ActionIcon onClick={() => handleSort('transactionId')}>
                  {sortBy === 'transactionId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Timestamp
                <ActionIcon onClick={() => handleSort('timestamp')}>
                  {sortBy === 'timestamp' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Origin User ID
                <ActionIcon onClick={() => handleSort('originUserId')}>
                  {sortBy === 'originUserId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Destination User ID
                <ActionIcon onClick={() => handleSort('destinationUserId')}>
                  {sortBy === 'destinationUserId' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Transaction State
                <ActionIcon onClick={() => handleSort('transactionState')}>
                  {sortBy === 'transactionState' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Amount
                <ActionIcon onClick={() => handleSort('originAmountDetails.transactionAmount')}>
                  {sortBy === 'originAmountDetails.transactionAmount' && sortOrder === 'asc' ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>
                Tags
                <ActionIcon onClick={() => handleSort('tags')}>
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
    </div>
  );
}

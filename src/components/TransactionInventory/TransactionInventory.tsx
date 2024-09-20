import { useState } from 'react';
import useSWR from 'swr';
import { Flex, Pagination, Table } from '@mantine/core';
import { BASE_URL } from '@/utils/constants';

import './TransactionInventory.module.css';

export function TransactionInventory() {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(`${BASE_URL}/transaction?page=${page}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  console.log(data);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const rows = data.transactions.map((transaction: any) => (
    <Table.Tr key={transaction._id}>
      <Table.Td>{transaction.type}</Table.Td>
      <Table.Td>{transaction.transactionId}</Table.Td>
      <Table.Td>{new Date(transaction.timestamp).toLocaleString()}</Table.Td>
      <Table.Td>{transaction.originUserId}</Table.Td>
      <Table.Td>{transaction.destinationUserId}</Table.Td>
      <Table.Td>{transaction.transactionState}</Table.Td>
      <Table.Td>{transaction.originAmountDetails.transactionAmount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Flex justify="center" align="center">
        <Table
          className="transaction-inventory"
          horizontalSpacing="md"
          verticalSpacing="md"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Type</Table.Th>
              <Table.Th>Transaction ID</Table.Th>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Origin User ID</Table.Th>
              <Table.Th>Destination User ID</Table.Th>
              <Table.Th>Transaction State</Table.Th>
              <Table.Th>Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
      <Flex justify="center" align="center">
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

import { useEffect, useState } from 'react';
import { IconCopy } from '@tabler/icons-react';
import {
  Badge,
  CopyButton,
  Divider,
  Drawer,
  Flex,
  Group,
  NumberFormatter,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BASE_URL } from '@/utils/constants';

import './transactionDetails.modules.css';

interface TransactionDetailsDrawerProps {
  transactionId: string | null;
  onClose: () => void;
}

export function TransactionDetailsDrawer({
  transactionId,
  onClose,
}: TransactionDetailsDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (transactionId) {
      open();
      fetch(`${BASE_URL}/transaction/${transactionId}`)
        .then((res) => res.json())
        .then((data) => setTransaction(data))
        .catch((error) => console.error('Failed to fetch transaction details', error));
    } else {
      close();
    }
  }, [transactionId]);

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
        onClose();
      }}
      title="Transaction Details"
      position="right"
      size="lg"
      offset={10}
    >
      {transaction ? (
        <div>
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
                    fontSize: '13px',
                    padding: '5px 14px',
                  }}
                >
                  {transaction.transactionId}
                </Badge>
              </Tooltip>
            )}
          </CopyButton>
          <Flex
            justify={'space-between'}
            mt={14}
            mb={12}
            style={{ border: '1px solid #eaeaea', padding: '14px', borderRadius: '20px' }}
          >
            <Text size="lg">
              From <strong>{transaction.originUserId}</strong> to{' '}
              <strong>{transaction.destinationUserId}</strong>
            </Text>
            <Text size="lg">
              <strong>
                <NumberFormatter
                  value={transaction.originAmountDetails.transactionAmount}
                  thousandSeparator
                  decimalScale={2}
                  prefix={`${transaction.originAmountDetails.transactionCurrency} `}
                />
              </strong>
            </Text>
          </Flex>
          <Group mt="md">
            Type:
            <Badge color="blue" size="lg">
              {transaction.type}
            </Badge>
            State:
            <Badge color="green" size="lg">
              {transaction.transactionState}
            </Badge>
          </Group>
          <Divider my="sm" />
          <SimpleGrid cols={2} spacing="sm">
            <Text c="dimmed">Description:</Text>
            <Text>{transaction.description}</Text>
            <Text c="dimmed">Date:</Text>
            <Text>{new Date(transaction.timestamp).toLocaleString()}</Text>
            <Text c="dimmed">Promotion Code Used:</Text>
            <Text>{transaction.promotionCodeUsed ? 'Yes' : 'No'}</Text>
            <Text c="dimmed">Reference:</Text>
            <Text>{transaction.reference}</Text>
            <Text c="dimmed">Origin Country:</Text>
            <Text>{transaction.originAmountDetails.country}</Text>
            <Text c="dimmed">Destination Country:</Text>
            <Text>{transaction.destinationAmountDetails.country}</Text>
          </SimpleGrid>
          <Group mt="md">
            {transaction.tags.map((tag: any) => (
              <Badge key={tag._id} color="green">
                {`${tag.key}: ${tag.value}`}
              </Badge>
            ))}
          </Group>
        </div>
      ) : (
        <Text>Loading...</Text>
      )}
    </Drawer>
  );
}

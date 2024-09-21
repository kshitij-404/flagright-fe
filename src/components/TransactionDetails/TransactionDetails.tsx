import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Badge,
  CopyButton,
  Divider,
  Drawer,
  Flex,
  Group,
  NumberFormatter,
  SimpleGrid,
  Tabs,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BASE_URL } from '@/utils/constants';

import './TransactionDetails.modules.css';

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

  const renderDeviceDetails = (deviceData: any) => (
    <SimpleGrid cols={2} spacing="sm">
      {deviceData.batteryLevel !== undefined && (
        <>
          <Text c="dimmed">Battery Level:</Text>
          <Text>{deviceData.batteryLevel}%</Text>
        </>
      )}
      {deviceData.deviceLatitude !== undefined && (
        <>
          <Text c="dimmed">Latitude:</Text>
          <Text>{deviceData.deviceLatitude}</Text>
        </>
      )}
      {deviceData.deviceLongitude !== undefined && (
        <>
          <Text c="dimmed">Longitude:</Text>
          <Text>{deviceData.deviceLongitude}</Text>
        </>
      )}
      {deviceData.ipAddress && (
        <>
          <Text c="dimmed">IP Address:</Text>
          <Text>{deviceData.ipAddress}</Text>
        </>
      )}
      {deviceData.deviceIdentifier && (
        <>
          <Text c="dimmed">Device Identifier:</Text>
          <Text>{deviceData.deviceIdentifier}</Text>
        </>
      )}
      {deviceData.vpnUsed !== undefined && (
        <>
          <Text c="dimmed">VPN Used:</Text>
          <Text>{deviceData.vpnUsed ? 'Yes' : 'No'}</Text>
        </>
      )}
      {deviceData.operatingSystem && (
        <>
          <Text c="dimmed">Operating System:</Text>
          <Text>{deviceData.operatingSystem}</Text>
        </>
      )}
      {deviceData.deviceMaker && (
        <>
          <Text c="dimmed">Device Maker:</Text>
          <Text>{deviceData.deviceMaker}</Text>
        </>
      )}
      {deviceData.deviceModel && (
        <>
          <Text c="dimmed">Device Model:</Text>
          <Text>{deviceData.deviceModel}</Text>
        </>
      )}
      {deviceData.deviceYear && (
        <>
          <Text c="dimmed">Device Year:</Text>
          <Text>{deviceData.deviceYear}</Text>
        </>
      )}
      {deviceData.appVersion && (
        <>
          <Text c="dimmed">App Version:</Text>
          <Text>{deviceData.appVersion}</Text>
        </>
      )}
      {/* {deviceData.deviceLatitude !== undefined && deviceData.deviceLongitude !== undefined && (
        <MapContainer
          center={[deviceData.deviceLatitude, deviceData.deviceLongitude]}
          zoom={13}
          style={{ height: '200px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[deviceData.deviceLatitude, deviceData.deviceLongitude]}>
            <Popup>
              {deviceData.deviceLatitude}, {deviceData.deviceLongitude}
            </Popup>
          </Marker>
        </MapContainer>
      )} */}
    </SimpleGrid>
  );

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
          <Tabs variant="outline" defaultValue="details">
            <Tabs.List>
              <Tabs.Tab value="details">Details</Tabs.Tab>
              <Tabs.Tab value="originDevice">Origin Device</Tabs.Tab>
              <Tabs.Tab value="destinationDevice">Destination Device</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="details" pt="xs">
              <Text>Description:</Text>
              <Text
                c="dimmed"
                mt={12}
                mb={12}
                style={{ border: '1px solid #eaeaea', padding: '14px', borderRadius: '20px' }}
              >
                {transaction.description}
              </Text>
              <Group mt="md" mb="md">
                {transaction.tags.map((tag: any) => (
                  <Badge key={tag._id} color="green">
                    {`${tag.key}: ${tag.value}`}
                  </Badge>
                ))}
              </Group>
              <SimpleGrid cols={2} spacing="sm">
                <Text c="dimmed">Time:</Text>
                <Text
                  style={{ textAlign: 'right' }}
                >{`${dayjs(transaction.timestamp).format('MMM D, YYYY')} at ${dayjs(transaction.timestamp).format('h:mm A')}`}</Text>
                <Text c="dimmed">Promotion Code Used:</Text>
                <Text style={{ textAlign: 'right' }}>
                  {transaction.promotionCodeUsed ? 'Yes' : 'No'}
                </Text>
                <Text c="dimmed">Reference:</Text>
                <Text style={{ textAlign: 'right' }}>{transaction.reference}</Text>
                <Text c="dimmed">Origin Amount:</Text>
                <Text style={{ textAlign: 'right' }}>
                  <NumberFormatter
                    value={transaction.originAmountDetails.transactionAmount}
                    thousandSeparator
                    decimalScale={2}
                    prefix={`${transaction.originAmountDetails.transactionCurrency} `}
                  />
                </Text>
                <Text c="dimmed">Destination Amount:</Text>
                <Text style={{ textAlign: 'right' }}>
                  <NumberFormatter
                    value={transaction.destinationAmountDetails.transactionAmount}
                    thousandSeparator
                    decimalScale={2}
                    prefix={`${transaction.destinationAmountDetails.transactionCurrency} `}
                  />
                </Text>
              </SimpleGrid>
            </Tabs.Panel>
            <Tabs.Panel value="originDevice" pt="xs">
              {renderDeviceDetails(transaction.originDeviceData)}
            </Tabs.Panel>
            <Tabs.Panel value="destinationDevice" pt="xs">
              {renderDeviceDetails(transaction.destinationDeviceData)}
            </Tabs.Panel>
          </Tabs>
        </div>
      ) : (
        <Text>Loading...</Text>
      )}
    </Drawer>
  );
}

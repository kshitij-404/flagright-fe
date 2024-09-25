import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  CopyButton,
  Drawer,
  Flex,
  NumberFormatter,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BASE_URL } from '@/utils/constants';

import './TransactionDetails.modules.css';

import { IconArrowRight } from '@tabler/icons-react';

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
  const [activeTab, setActiveTab] = useState('originDevice');

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
          <Text c="dimmed" size="sm">
            Battery Level:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.batteryLevel}%
          </Text>
        </>
      )}
      {deviceData.deviceLatitude !== undefined && (
        <>
          <Text c="dimmed" size="sm">
            Latitude:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceLatitude}
          </Text>
        </>
      )}
      {deviceData.deviceLongitude !== undefined && (
        <>
          <Text c="dimmed" size="sm">
            Longitude:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceLongitude}
          </Text>
        </>
      )}
      {deviceData.ipAddress && (
        <>
          <Text c="dimmed" size="sm">
            IP Address:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.ipAddress}
          </Text>
        </>
      )}
      {deviceData.deviceIdentifier && (
        <>
          <Text c="dimmed" size="sm">
            Device Identifier:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceIdentifier}
          </Text>
        </>
      )}
      {deviceData.vpnUsed !== undefined && (
        <>
          <Text c="dimmed" size="sm">
            VPN Used:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.vpnUsed ? 'Yes' : 'No'}
          </Text>
        </>
      )}
      {deviceData.operatingSystem && (
        <>
          <Text c="dimmed" size="sm">
            Operating System:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.operatingSystem}
          </Text>
        </>
      )}
      {deviceData.deviceMaker && (
        <>
          <Text c="dimmed" size="sm">
            Device Maker:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceMaker}
          </Text>
        </>
      )}
      {deviceData.deviceModel && (
        <>
          <Text c="dimmed" size="sm">
            Device Model:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceModel}
          </Text>
        </>
      )}
      {deviceData.deviceYear && (
        <>
          <Text c="dimmed" size="sm">
            Device Year:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.deviceYear}
          </Text>
        </>
      )}
      {deviceData.appVersion && (
        <>
          <Text c="dimmed" size="sm">
            App Version:
          </Text>
          <Text size="sm" ta="right">
            {deviceData.appVersion}
          </Text>
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
      title={
        <Flex gap={12} align="center">
          <Title order={3} fz={20}>
            Transaction Details
          </Title>
          <CopyButton value={transaction?.transactionId} timeout={1000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <Badge
                  color={copied ? 'teal' : 'yellow'}
                  variant="dot"
                  onClick={copy}
                  style={{
                    cursor: 'pointer',
                  }}
                  // size="lg"
                >
                  {transaction?.transactionId}
                </Badge>
              </Tooltip>
            )}
          </CopyButton>
        </Flex>
      }
      position="right"
      size={500}
      offset={10}
    >
      {transaction ? (
        <Flex gap={20} direction="column" pb={32}>
          <Paper p={14} radius={20} bg="gray.0">
            <Flex
              justify="space-between"
              align="center"
              // style={{ border: '1px solid #eaeaea', padding: '14px', borderRadius: '20px' }}
            >
              {/* <Text size="md" className="font-mono"> */}
              <Flex className="font-mono" align="center" gap={10}>
                {/* From{' '} */}
                <Badge className="font-mono" variant="light" size="lg" color="red">
                  {transaction.originUserId}
                </Badge>
                <IconArrowRight size={20} stroke={1.5} />
                {/* {' => '} */}
                {/* <br /> */}
                {/* to{' '} */}
                <Badge className="font-mono" variant="light" size="lg" color="teal">
                  {transaction.destinationUserId}
                </Badge>
              </Flex>
              {/* </Text> */}
              <Text size="lg">
                <strong>
                  <NumberFormatter
                    value={transaction.originAmountDetails.transactionAmount}
                    thousandSeparator
                    decimalScale={2}
                    suffix={` ${transaction.originAmountDetails.transactionCurrency}`}
                  />
                </strong>
              </Text>
            </Flex>
          </Paper>

          <Flex direction="column" gap={12}>
            <Flex direction="column" gap={6}>
              <Title order={5} fw={600}>
                Overview:
              </Title>
              {/* <Paper>
                <Text
                  c="dimmed"
                  size="sm"
                  // style={{ border: '1px solid #eaeaea', padding: '14px', borderRadius: '20px' }}
                >
                  {transaction.description}
                </Text>
              </Paper> */}
            </Flex>
            <Box
              display="grid"
              style={{
                gridTemplateColumns: 'auto 1fr',
                gap: 10,
              }}
            >
              <Text c="dimmed" size="sm">
                Type:
              </Text>
              <Badge
                variant="light"
                // p={0}
                color="blue"
                size="md"
                ml="auto"
              >
                {transaction.type}
              </Badge>
              <Text c="dimmed" size="sm">
                State:
              </Text>
              <Badge
                variant="light"
                // p={0}
                color="indigo"
                size="md"
                ml="auto"
              >
                {transaction.transactionState}
              </Badge>
              <Text c="dimmed" size="sm">
                Description:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                {transaction.description}
              </Text>
              <Text c="dimmed" size="sm">
                Tags:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                {transaction.tags.map((tag: any) => tag.key).join(', ')}
              </Text>
              <Text c="dimmed" size="sm">
                Time:
              </Text>
              <Text
                ta="right"
                size="sm"
                fw={500}
              >{`${dayjs(transaction.timestamp).format('MMM D, YYYY')} at ${dayjs(transaction.timestamp).format('h:mm A')}`}</Text>
              <Text c="dimmed" size="sm">
                Promotion Code Used:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                {transaction.promotionCodeUsed ? 'Yes' : 'No'}
              </Text>
              <Text c="dimmed" size="sm">
                Reference:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                {transaction.reference}
              </Text>
              <Text c="dimmed" size="sm">
                Origin Amount:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                <NumberFormatter
                  value={transaction.originAmountDetails.transactionAmount}
                  thousandSeparator
                  decimalScale={2}
                  prefix={`${transaction.originAmountDetails.transactionCurrency} `}
                />
              </Text>
              <Text c="dimmed" size="sm">
                Destination Amount:
              </Text>
              <Text ta="right" size="sm" fw={500}>
                <NumberFormatter
                  value={transaction.destinationAmountDetails.transactionAmount}
                  thousandSeparator
                  decimalScale={2}
                  prefix={`${transaction.destinationAmountDetails.transactionCurrency} `}
                />
              </Text>
            </Box>
          </Flex>

          {/* <Divider my="sm" /> */}
          {/* <Tabs variant="outline" defaultValue="originDevice"> */}
          {/* <Tabs.List>
              <Tabs.Tab value="originDevice">Origin Device</Tabs.Tab>
              <Tabs.Tab value="destinationDevice">Destination Device</Tabs.Tab>
            </Tabs.List> */}
          <Flex direction="column" gap={20} mt={20}>
            <Flex>
              <SegmentedControl
                data={[
                  { value: 'originDevice', label: 'Origin Device' },
                  { value: 'destinationDevice', label: 'Destination Device' },
                ]}
                radius={100}
                value={activeTab}
                onChange={setActiveTab}
                color="blue"
              />
            </Flex>

            {/* <Tabs.Panel value="originDevice" pt="xs"> */}

            <Paper bg="gray.1" p={20} radius={20} w="80%">
              {activeTab === 'originDevice'
                ? renderDeviceDetails(transaction.originDeviceData)
                : renderDeviceDetails(transaction.destinationDeviceData)}
            </Paper>
            {/* </Tabs.Panel> */}
            {/* <Tabs.Panel value="destinationDevice" pt="xs"> */}
            {/* </Tabs.Panel> */}
            {/* </Tabs> */}
          </Flex>
        </Flex>
      ) : (
        <Text size="sm" ta="right">
          Loading...
        </Text>
      )}
    </Drawer>
  );
}

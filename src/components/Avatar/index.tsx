'use client';

import { IconLogout } from '@tabler/icons-react';
import useSWR from 'swr';
import { Flex, Avatar as MantineAvatar, Menu, rem, Skeleton, Text } from '@mantine/core';
import { swrFetcher } from '@/utils/swr';

function Avatar() {
  const { data, isLoading } = useSWR(['user', 'get'], swrFetcher);
  const user = data?.data;

  if (isLoading || !user) {
    return <Skeleton variant="circle" width={32} height={32} />;
  }

  return (
    <Menu
      shadow="md"
      width={200}
      position="top-end"
      transitionProps={{ transition: 'pop-top-right' }}
    >
      <Menu.Target>
        <MantineAvatar
          src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?._id}`}
          alt={user?.fullName || 'User'}
          size={36}
          style={{ cursor: 'pointer' }}
        />
      </Menu.Target>

      <Menu.Dropdown style={{ borderRadius: 12 }}>
        <Menu.Label>Account Details</Menu.Label>
        <Menu.Divider />

        <Flex px="sm" py={8} direction="column" gap={2}>
          <Text fz="sm" fw={600}>
            {user?.displayName}
          </Text>
          <Text fz="xs" c="dimmed">
            {user?.email}
          </Text>
        </Flex>

        <Menu.Divider />
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          color="red"
          // onClick={() => signOut({ redirectUrl: pathname })}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default Avatar;

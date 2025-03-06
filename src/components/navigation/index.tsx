'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Toolbar,
} from '@mui/material';

const configs = [
  {
    key: '',
    label: '首页',
  },
  {
    key: 'settings',
    label: '设置',
  },
];

const testConfigKeyAndPathname = (key: string, pathname: string) => {
  return new RegExp(`^${key}$`).test(pathname.split('/')[1]);
};

export default function Navigation({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  if (!configs.some(({ key }) => testConfigKeyAndPathname(key, pathname))) {
    router.replace(configs[0].key);
  }

  const value = configs.findIndex(({ key }) =>
    testConfigKeyAndPathname(key, pathname),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ top: 0 }}>
        <Toolbar>{configs[value]?.label}</Toolbar>
      </AppBar>
      {children}
      <Paper sx={{ position: 'sticky', right: 0, bottom: 0, left: 0 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_event, value) => router.push(`/${configs[value].key}`)}
        >
          {configs.map(({ key, label }) => (
            <BottomNavigationAction key={key} label={label} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

'use client';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import { bscTestnet, avalancheFuji } from 'wagmi/chains';
import { VITE_WALLET_CONNECT_PROJECT_ID } from './config';

export function useWagmiConfig() {
  const projectId = VITE_WALLET_CONNECT_PROJECT_ID ?? '';
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'solarps',
        projectId,
      },
    );

    const wagmiConfig = createConfig({
      chains: [bscTestnet, avalancheFuji],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [bscTestnet.id]: http(),
        [avalancheFuji.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}

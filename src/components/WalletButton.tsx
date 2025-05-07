import React, { useEffect } from 'react';
import ArweaveWalletBtn from '@ar-dacity/ardacity-wallet-btn';
import styles from './WalletButton.module.css';

declare global {
  interface Window {
    arweaveWallet?: {
      connect: (permissions: string[], appInfo?: { name: string; logo: string }, gateway?: { host: string; port: number; protocol: string }) => Promise<void>;
      disconnect: () => Promise<void>;
      getActiveAddress: () => Promise<string>;
    };
  }
}

export interface WalletButtonProps {
  variant?: 'default' | 'outline' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showAddress?: boolean;
  addressDisplayLength?: number;
  luaCode?: string;
  aoProcessId?: string;
  className?: string;
  style?: React.CSSProperties;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  variant = 'default',
  size = 'md',
  showAddress = false,
  addressDisplayLength = 6,
  luaCode,
  aoProcessId,
  className = '',
  style = {},
}) => {
  useEffect(() => {
    const initializeWallet = async () => {
      if (window.arweaveWallet) {
        try {
          // Request the required permissions
          await window.arweaveWallet.connect(['ACCESS_ADDRESS'], {
            name: 'Wallet Builder',
            logo: 'https://your-app-logo-url.com/logo.png'
          });
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      }
    };

    initializeWallet();
  }, []);

  const handleConnect = async (address: string) => {
    if (aoProcessId && luaCode) {
      try {
        // Ensure we have the required permissions
        if (window.arweaveWallet) {
          await window.arweaveWallet.connect(['ACCESS_ADDRESS']);
        }
        
        // Execute the onConnect handler if it exists in the Lua code
        if (luaCode.includes('function onConnect')) {
          console.log('Wallet connected:', address);
          // You can add custom logic here for handling the connection
        }
      } catch (error) {
        console.error('Error handling wallet connection:', error);
      }
    }
  };

  const handleDisconnect = async () => {
    if (aoProcessId && luaCode) {
      try {
        // Execute the onDisconnect handler if it exists in the Lua code
        if (luaCode.includes('function onDisconnect')) {
          console.log('Wallet disconnected');
          // You can add custom logic here for handling the disconnection
        }
      } catch (error) {
        console.error('Error handling wallet disconnection:', error);
      }
    }
  };

  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <ArweaveWalletBtn
        variant={variant}
        size={size}
        showAddress={showAddress}
        addressDisplayLength={addressDisplayLength}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        className={styles.button}
      />
    </div>
  );
};

export default WalletButton; 
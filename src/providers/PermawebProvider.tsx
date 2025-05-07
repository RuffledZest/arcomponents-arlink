/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import Arweave from 'arweave';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import Permaweb from '@permaweb/libs';

interface PermawebContextState {
  libs: any | null;
  isConnected: boolean;
  error: string | null;
  reconnect: () => Promise<boolean>;
}

const PermawebContext = React.createContext<PermawebContextState>({
  libs: null,
  isConnected: false,
  error: null,
  reconnect: async () => false
});

export function usePermawebProvider(): PermawebContextState {
  return React.useContext(PermawebContext);
}

export function PermawebProvider(props: { children: React.ReactNode }) {
  const [libs, setLibs] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToWallet = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Attempting to connect to Arweave wallet...');
      if (typeof window === 'undefined' || !window.arweaveWallet) {
        console.log('No Arweave wallet found in window');
        setError('Arweave wallet not found. Please install the Arweave wallet extension.');
        return false;
      }

      // Check if we're already connected
      let walletAddress;
      try {
        walletAddress = await window.arweaveWallet.getActiveAddress();
        console.log('Already connected to wallet address:', walletAddress);
        // We're already connected, no need to call connect()
      } catch (err) {
        // Not connected yet, need to connect
        console.log('Not connected to wallet yet, calling connect()...');
        try {
          // Try to connect to the wallet
          await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
          walletAddress = await window.arweaveWallet.getActiveAddress();
          console.log('Connected to Arweave wallet, address:', walletAddress);
        } catch (connectError) {
          console.error('Failed to connect to Arweave wallet:', connectError);
          setError('Failed to connect to Arweave wallet. Please make sure you have approved the connection request.');
          return false;
        }
      }
      
      // Initialize Arweave
      const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      });
      
      console.log('Initializing Arweave dependencies...');
      const dependencies = {
        ao: connect({
          MODE: "mainnet"
        }),
        arweave,
        signer: createDataItemSigner(window.arweaveWallet)
      };

      console.log('Creating Permaweb instance...');
      const permawebInstance = Permaweb.init(dependencies);
      console.log('Permaweb initialized successfully');
      
      setLibs(permawebInstance);
      setIsConnected(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to connect to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Arweave wallet');
      return false;
    }
  }, []);

  useEffect(() => {
    const initializePermaweb = async () => {
      try {
        console.log('Initializing Permaweb...');
        await connectToWallet();
      } catch (err) {
        console.error('Failed to initialize Permaweb:', err);
        setError('Failed to initialize Permaweb. Please check the console for details.');
      }
    };

    initializePermaweb();
  }, [connectToWallet]);

  return (
    <PermawebContext.Provider value={{ 
      libs, 
      isConnected, 
      error, 
      reconnect: connectToWallet 
    }}>
      {props.children}
    </PermawebContext.Provider>
  );
} 
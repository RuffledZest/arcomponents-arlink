/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */






import React, { useState, useEffect } from 'react';
import { spawn, createDataItemSigner } from '@permaweb/aoconnect';

interface ProcessSpawnerProps {
  onProcessSpawned?: (processId: string) => void;
}

interface Tag {
  name: string;
  value: string;
}

// declare global {
//   interface Window {
//     arweaveWallet: {
//       connect: (permissions: string[], appInfo?: {
//           name: string;
//           logo: string;
//       }, gateway?: {
//           host: string;
//           port: number;
//           protocol: string;
//       }) => Promise<void>;
//       disconnect: () => Promise<void>;
//       getActiveAddress: () => Promise<string>;
//       getArweaveConfig?: () => Promise<{
//           host: string;
//       }>;
//     } | undefined;
//   }
// }
// List of fallback gateways
const ARWEAVE_GATEWAYS = [
  'https://arweave.net',
  'https://arweave.live',
  'https://ar-io.dev'
];

const ProcessSpawner: React.FC<ProcessSpawnerProps> = ({ onProcessSpawned }) => {
  const [moduleTxId, setModuleTxId] = useState('');
  const [customScheduler, setCustomScheduler] = useState('');
  const [customAuthority, setCustomAuthority] = useState('');
  const [tags, setTags] = useState<Tag[]>([{ name: '', value: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [processId, setProcessId] = useState('');
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentGateway, setCurrentGateway] = useState(ARWEAVE_GATEWAYS[0]);

  // Default scheduler and authority addresses
  const defaultScheduler = '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA';
  const defaultAuthority = 'fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY';

  // Check for wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.arweaveWallet) {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        setWalletAddress(address);
      } catch (error) {
        setWalletAddress('');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.arweaveWallet) {
      setError('ArConnect extension not detected. Please install it first.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
      const address = await window.arweaveWallet.getActiveAddress();
      setWalletAddress(address);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.arweaveWallet.disconnect();
      setWalletAddress('');
    } catch (err) {
      console.error('Wallet disconnection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  };

  const handleTagChange = (index: number, field: keyof Tag, value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, { name: '', value: '' }]);
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const tryWithFallbackGateways = async (fn: () => Promise<any>, attempt = 0): Promise<any> => {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= ARWEAVE_GATEWAYS.length - 1) {
        throw err;
      }
      
      console.warn(`Attempt ${attempt + 1} failed, switching to fallback gateway`);
      setCurrentGateway(ARWEAVE_GATEWAYS[attempt + 1]);
      return tryWithFallbackGateways(fn, attempt + 1);
    }
  };

  const handleSpawn = async () => {
    if (!moduleTxId) {
      setError('Module TxID is required');
      return;
    }

    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Filter out empty tags
      const filteredTags = tags.filter(tag => tag.name && tag.value);
      
      // Add Authority tag if not already present
      if (!filteredTags.some(tag => tag.name === 'Authority')) {
        filteredTags.push({
          name: 'Authority',
          value: customAuthority || defaultAuthority
        });
      }

      // Add Data-Protocol tag (required for AO)
      filteredTags.push({
        name: 'Data-Protocol',
        value: 'ao'
      });

      const signer = createDataItemSigner(window.arweaveWallet);

      const spawnData = {
        module: moduleTxId,
        scheduler: customScheduler || defaultScheduler,
        signer: signer,
        tags: filteredTags
      };

      console.log('Spawning process with data:', spawnData);

      // Try with fallback gateways
      const result = await tryWithFallbackGateways(async () => {
        const startTime = Date.now();
        const result = await spawn(spawnData);
        console.log(`Spawn completed in ${Date.now() - startTime}ms`);
        return result;
      });

      if (!result) {
        throw new Error('Failed to spawn process: No process ID returned');
      }

      console.log('Process spawned successfully! Process ID:', result);
      setProcessId(result);
      if (onProcessSpawned) {
        onProcessSpawned(result);
      }
    } catch (err) {
      console.error('Detailed error spawning process:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? 
        `Failed to spawn process: ${err.message}. Trying different gateway...` : 
        'Failed to spawn process. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">AO Process Spawner</h2>
      
      <div className="mb-2 text-sm text-gray-500">
        Current Gateway: <span className="font-mono">{currentGateway}</span>
      </div>
      
      {/* Wallet Connection Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Wallet Connection</h3>
        {walletAddress ? (
          <div>
            <p className="text-sm mb-2">
              Connected wallet: <span className="font-mono text-blue-600 break-all">{walletAddress}</span>
            </p>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-2">You need to connect your Arweave wallet to spawn processes.</p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isConnecting ? 'Connecting...' : 'Connect ArConnect Wallet'}
            </button>
            {!window.arweaveWallet && (
              <p className="text-sm text-red-500 mt-2">
                ArConnect extension not detected. <a href="https://www.arconnect.io/" target="_blank" rel="noopener noreferrer" className="underline">Download it here</a>.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">
        Spawn a new AO process by providing the module TxID and optional configuration.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Module TxID*</label>
        <input
          type="text"
          value={moduleTxId}
          onChange={(e) => setModuleTxId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter the Arweave TxID of the ao Module"
          required
          disabled={!walletAddress}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Scheduler Address</label>
        <input
          type="text"
          value={customScheduler}
          onChange={(e) => setCustomScheduler(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Default: ${defaultScheduler}`}
          disabled={!walletAddress}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Authority Address (Messaging Unit)</label>
        <input
          type="text"
          value={customAuthority}
          onChange={(e) => setCustomAuthority(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Default: ${defaultAuthority}`}
          disabled={!walletAddress}
        />
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-medium mb-2">Additional Tags</h3>
        {tags.map((tag, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Tag name"
              value={tag.name}
              onChange={(e) => handleTagChange(index, 'name', e.target.value)}
              className="flex-1 p-2 border rounded"
              disabled={!walletAddress}
            />
            <input
              type="text"
              placeholder="Tag value"
              value={tag.value}
              onChange={(e) => handleTagChange(index, 'value', e.target.value)}
              className="flex-1 p-2 border rounded"
              disabled={!walletAddress}
            />
            <button 
              type="button"
              onClick={() => removeTag(index)}
              disabled={tags.length === 1 || !walletAddress}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              ×
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addTag}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!walletAddress}
        >
          + Add Tag
        </button>
      </div>

      <button 
        onClick={handleSpawn}
        disabled={isLoading || !moduleTxId || !walletAddress}
        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Spawning...' : 'Spawn Process'}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {processId && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <h3 className="text-lg font-medium text-green-700">Process Spawned Successfully!</h3>
          <p className="text-sm text-gray-600">Process ID:</p>
          <div className="mt-2 p-2 bg-white rounded font-mono break-all">
            {processId}
          </div>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
             
              console.log('Copied Process ID to clipboard:', processId);
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessSpawner;
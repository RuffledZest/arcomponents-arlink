/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { usePermawebProvider } from '../providers/PermawebProvider';
import { connectWallet, disconnectWallet, getWalletAddress, dryrunResult } from './arweaveUtils';
import MonacoEditor from '@monaco-editor/react';
import { dryrun } from '@permaweb/aoconnect';

interface PermawebAtomicAssetProps {
  onAssetCreated?: (assetId: string) => void;
  assetId?: string;
  assetIds?: string[];
  luaCode?: string;
  processId?: string;

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

const PermawebAtomicAsset: React.FC<PermawebAtomicAssetProps> = ({
  onAssetCreated,
  assetId,
  assetIds,
  luaCode,
  processId
}) => {
  const { libs } = usePermawebProvider();
  const [asset, setAsset] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topics: [''],
    creator: '',
    data: '',
    contentType: 'text/plain',
    assetType: '',
    metadata: {
      status: 'Initial Status'
    }
  });
  const [dryrunResult, setDryrunResult] = useState<any>(null);
  // Removed duplicate luaCode declaration

  useEffect(() => {
    const checkWallet = async () => {
      if (window.arweaveWallet) {
        try {
          const address = await getWalletAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error('Failed to get wallet address:', error);
        }
      }
    };
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      const address = await getWalletAddress();
      setWalletAddress(address);
      setError(null);
    } catch (err) {
      console.error('Error in handleConnectWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress('');
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  };

  useEffect(() => {
    if (libs && walletAddress && (assetId || (assetIds && assetIds.length > 0))) {
      if (assetId) {
        fetchAsset();
      } else if (assetIds && assetIds.length > 0) {
        fetchAssets();
      }
    }
  }, [libs, walletAddress, assetId, assetIds]);

  const fetchAsset = async () => {
    if (!assetId) return;
    try {
      setLoading(true);
      setError(null);
      const assetData = await libs.getAtomicAsset(assetId);
      setAsset(assetData);
    } catch (err) {
      setError('Failed to fetch asset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    if (!assetIds || assetIds.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const assetsData = await libs.getAtomicAssets(assetIds);
      setAssets(assetsData);
    } catch (err) {
      setError('Failed to fetch assets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libs || !walletAddress) {
      setError('Not connected to wallet. Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newAssetId = await libs.createAtomicAsset(formData);
      setAsset(await libs.getAtomicAsset(newAssetId));
      onAssetCreated?.(newAssetId);
    } catch (err) {
      setError('Failed to create asset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, '']
    });
  };

  const handleRemoveTopic = (index: number) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index)
    });
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({
      ...formData,
      topics: newTopics
    });
  };

  const handleDryrunTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting dryrun test...');
      console.log('Form data:', formData);
      
      // Prepare the input for the dryrun
      const input = {
        function: "create",
        name: formData.name,
        description: formData.description,
        topics: formData.topics,
        data: formData.data,
        contentType: formData.contentType,
        assetType: formData.assetType,
        metadata: formData.metadata
      };

      console.log('Sending dryrun request with input:', input);

      // Example dryrun test for atomic asset creation
      const result = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Create-Asset' },
        { name: 'Input', value: JSON.stringify(input) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('Dryrun response:', result);
      
      if (result.error) {
        console.error('Dryrun error:', result.error);
        setError(result.error);
      } else {
        console.log('Dryrun successful:', result);
      }
    } catch (err) {
      console.error('Error in dryrun test:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform dryrun test');
    } finally {
      setLoading(false);
    }
  };

  const handleLuaCodeChange = (value: string | undefined) => {
    if (value) {
      console.log('Lua code changed:', value);
      luaCode = value;
    }
  };

  const handleRunCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Running Lua handler code...');
      
      // Prepare test input
      const testInput = {
        function: "create",
        name: "Test Asset",
        description: "This is a test asset",
        topics: ["test", "demo"],
        data: "Test data",
        contentType: "text/plain",
        assetType: "test",
        metadata: {
          status: "test"
        }
      };

      console.log('Test input:', testInput);

      // Run the code with test input
      const result = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Run-Code' },
        { name: 'Input', value: JSON.stringify(testInput) },
        { name: 'Caller', value: walletAddress },
        { name: 'Code', value: luaCode }
      ]);

      console.log('Code execution result:', result);
      
      if (result.error) {
        console.error('Code execution error:', result.error);
        setError(result.error);
      } else {
        console.log('Code executed successfully:', result);
      }
    } catch (err) {
      console.error('Error running code:', err);
      setError(err instanceof Error ? err.message : 'Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  const handleDryrun = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!processId) {
      setError('Process ID is required for dryrun');
      return;
    }

    if (!luaCode) {
      setError('Please provide Lua code to execute');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await dryrun({
        process: processId,
        data: luaCode,
        tags: [
          { name: 'Action', value: 'Dryrun' }
        ]
      });

      console.log('Dryrun result:', result);
      setDryrunResult(result);
      if (onAssetCreated) {
        onAssetCreated(assetId || '');
      }
    } catch (err) {
      console.error('Error executing dryrun:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute dryrun');
    } finally {
      setLoading(false);
    }
  };

  const handleTestHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test create operation
      const createInput = {
        function: "create",
        name: "Test Asset",
        description: "This is a test asset",
        topics: ["test", "demo"],
        data: "Test data",
        contentType: "text/plain",
        assetType: "test",
        metadata: {
          status: "test"
        }
      };

      const createResult = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Create-Asset' },
        { name: 'Input', value: JSON.stringify(createInput) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('Create result:', createResult);

      if (createResult.error) {
        throw new Error(createResult.error);
      }

      const assetId = createResult.result.id;

      // Test get operation
      const getInput = {
        function: "get",
        assetId: assetId
      };

      const getResult = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Get-Asset' },
        { name: 'Input', value: JSON.stringify(getInput) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('Get result:', getResult);

      // Test update operation
      const updateInput = {
        function: "update",
        assetId: assetId,
        name: "Updated Test Asset",
        description: "This is an updated test asset",
        topics: ["test", "demo", "updated"],
        metadata: {
          status: "updated"
        }
      };

      const updateResult = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Update-Asset' },
        { name: 'Input', value: JSON.stringify(updateInput) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('Update result:', updateResult);

      // Test list operation
      const listInput = {
        function: "list"
      };

      const listResult = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'List-Assets' },
        { name: 'Input', value: JSON.stringify(listInput) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('List result:', listResult);

      // Test delete operation
      const deleteInput = {
        function: "delete",
        assetId: assetId
      };

      const deleteResult = await dryrunResult('YOUR_PROCESS_ID', [
        { name: 'Action', value: 'Delete-Asset' },
        { name: 'Input', value: JSON.stringify(deleteInput) },
        { name: 'Caller', value: walletAddress }
      ]);

      console.log('Delete result:', deleteResult);

      setDryrunResult({
        create: createResult,
        get: getResult,
        update: updateResult,
        list: listResult,
        delete: deleteResult
      });

    } catch (err) {
      console.error('Error testing handler:', err);
      setError(err instanceof Error ? err.message : 'Failed to test handler');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-end">
        {walletAddress ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </span>
            <button
              onClick={handleDisconnectWallet}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Create Atomic Asset</h2>
          <form onSubmit={handleCreateAsset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Topics
              </label>
              <div className="space-y-2">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Topic
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Creator Address
              </label>
              <input
                type="text"
                value={formData.creator}
                onChange={(e) =>
                  setFormData({ ...formData, creator: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <textarea
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <input
                type="text"
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asset Type
              </label>
              <input
                type="text"
                value={formData.assetType}
                onChange={(e) =>
                  setFormData({ ...formData, assetType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Asset
            </button>
          </form>
        </div>

        {/* Lua Handler Workspace */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Lua Handler</h2>
            <div className="space-x-2">
              <button
                onClick={handleRunCode}
                disabled={loading}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleDryrunTest}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Testing...' : 'Test Asset'}
              </button>
              <button
                onClick={handleTestHandler}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Testing...' : 'Test Handler'}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <MonacoEditor
              height="400px"
              defaultLanguage="lua"
              value={luaCode}
              onChange={handleLuaCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                wordWrap: "on",
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          </div>

          {error && (
            <div className="mt-4 text-red-500">
              Error: {error}
            </div>
          )}
        </div>
      </div>

      {/* Asset Display Section */}
      {asset ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{asset.name}</h2>
          <p className="text-gray-700 mb-4">{asset.description}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {asset.topics.map((topic: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Metadata</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(asset.metadata, null, 2)}
            </pre>
          </div>
        </div>
      ) : assetIds && assetIds.length > 0 ? (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{asset.name}</h2>
              <p className="text-gray-700 mb-4">{asset.description}</p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {asset.topics.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Dryrun Results Section */}
      {dryrunResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-medium mb-2">Dryrun Results</h3>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(dryrunResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PermawebAtomicAsset; 
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { usePermawebProvider } from '../providers/PermawebProvider';
import { dryrun } from '@permaweb/aoconnect';
import AOSpawnerTest from './AOSpawnerTest';
import { connectWallet, disconnectWallet, getWalletAddress } from './arweaveUtils';

interface AOSpawnerProps {
  luaCode?: string;
  onProcessCreated?: (processId: string) => void;
}

const defaultLuaCode = `-- Process spawning with essential components
local process_id = ao.spawn([==[
  Name = "MyProcess"
  Owner = ao.id  -- Required
  Inbox = {}
  Handlers = {}
  ao = {
    id = ao.id,
    send = ao.send,
    spawn = ao.spawn
  }
  
  -- Permissions are mandatory
  Permissions = {
    {Action = "*", Who = Owner}
  }

  -- Ping handler
  Handlers.add(
    "ping",
    {Action = "Ping"},
    function(msg)
      ao.send({
        Target = msg.From,
        Data = "Pong"
      })
    end
  )
]==])

assert(process_id ~= nil, "Failed to spawn process")

-- Return process ID for verification
return { process_id = process_id }`;

const AOSpawner: React.FC<AOSpawnerProps> = ({
  luaCode: initialLuaCode = defaultLuaCode,
  onProcessCreated
}) => {
  const { isConnected } = usePermawebProvider();
  const [luaCode, setLuaCode] = useState<string>(initialLuaCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [processId, setProcessId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

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

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setLuaCode(value);
    }
  };

  const handleSpawnProcess = async () => {
    try {
      // Check if wallet is connected
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      setLoading(true);
      setError(null);

      // Execute the Lua code using dryrun
      const dryrunResult = await dryrun({
        process: "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc", // AOS system process ID
        data: luaCode,
        tags: [
          { name: 'Action', value: 'Spawn-Process' },
          { name: 'Data-Protocol', value: 'ao' },
          { name: 'Variant', value: '1.0.0' }
        ]
      });

      console.log('Spawn result:', dryrunResult);
      setResult(dryrunResult);

      // Check for errors in the dryrun result
      if (dryrunResult.Error) {
        throw new Error(`Dryrun error: ${JSON.stringify(dryrunResult.Error)}`);
      }

      // Check for spawn messages
      if (dryrunResult.Messages && dryrunResult.Messages.length > 0) {
        const lastMessage = dryrunResult.Messages[dryrunResult.Messages.length - 1];
        if (lastMessage.Data) {
          try {
            const data = JSON.parse(lastMessage.Data);
            if (data.process_id) {
              const newProcessId = data.process_id;
              setProcessId(newProcessId);
              onProcessCreated?.(newProcessId);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing message data:', parseError);
          }
        }
      }

      // If no process ID found in messages, check spawns
      if (dryrunResult.Spawns && dryrunResult.Spawns.length > 0) {
        const newProcessId = dryrunResult.Spawns[0];
        setProcessId(newProcessId);
        onProcessCreated?.(newProcessId);
        return;
      }

      // If no process ID found, check Output
      if (dryrunResult.Output) {
        try {
          const output = typeof dryrunResult.Output === 'string' 
            ? JSON.parse(dryrunResult.Output) 
            : dryrunResult.Output;
          
          if (output.process_id) {
            const newProcessId = output.process_id;
            setProcessId(newProcessId);
            onProcessCreated?.(newProcessId);
            return;
          }
        } catch (parseError) {
          console.error('Error parsing output:', parseError);
        }
      }

      // If we get here, we couldn't find a process ID
      throw new Error(`Failed to get process ID from spawn result. Full result: ${JSON.stringify(dryrunResult)}`);

    } catch (err) {
      console.error('Detailed error spawning process:', err);
      setError(err instanceof Error ? err.message : 'Failed to spawn process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AO Process Spawner</h2>
          <div className="flex space-x-2">
            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className={`bg-green-500 text-white font-bold py-2 px-4 rounded ${
                  isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connected'}
                </span>
                <button
                  onClick={handleDisconnectWallet}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
        
        {!isConnected && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            Please connect your wallet to spawn a process
          </div>
        )}

        <div className="mb-4">
          <MonacoEditor
            height="400px"
            defaultLanguage="lua"
            value={luaCode}
            onChange={handleCodeChange}
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
              folding: true
            }}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSpawnProcess}
            disabled={loading || !isConnected}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              !isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Spawning...' : 'Spawn Process'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium mb-2">Result</h3>
            <pre className="bg-white p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {processId && (
          <AOSpawnerTest processId={processId} />
        )}
      </div>
    </div>
  );
};

export default AOSpawner; 
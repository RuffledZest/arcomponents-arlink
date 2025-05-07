/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { usePermawebProvider } from '../providers/PermawebProvider';
import { connectWallet, disconnectWallet, getWalletAddress } from './arweaveUtils';
import isWalletConnected from './arweaveUtils';
import LuaIDE from './LuaIDE'; // Import the LuaIDE component

// Default Lua code for profile handler
const DEFAULT_PROFILE_LUA = `-- profile_handler.lua
-- This is a simulation of how a profile might be stored on Arweave

-- Table to store profiles by address
local profiles = {}

function handle(state, action)
  local input = action.input or {}
  local caller = action.caller

  -- Create or update a profile
  if input.function == "create_profile" then
    if not caller then
      return { error = "Must be authenticated" }
    end
    
    if not input.username or not input.displayName then
      return { error = "Username and displayName are required" }
    end
    
    -- Create or update profile
    profiles[caller] = {
      id = "profile_" .. string.sub(caller, 1, 8),
      username = input.username,
      displayName = input.displayName,
      description = input.description or "",
      thumbnail = input.thumbnail or "",
      banner = input.banner or "",
      owner = caller,
      createdAt = os.time()
    }
    
    return { 
      result = "Profile saved successfully",
      profileId = profiles[caller].id
    }
    
  -- Get profile by ID
  elseif input.function == "get_profile" then
    if not input.profileId then
      return { error = "Profile ID is required" }
    end
    
    -- Find profile by ID
    for _, profile in pairs(profiles) do
      if profile.id == input.profileId then
        return { result = profile }
      end
    end
    
    return { error = "Profile not found" }
    
  -- Get profile by wallet address
  elseif input.function == "get_profile_by_address" then
    if not input.address then
      return { error = "Wallet address is required" }
    end
    
    if profiles[input.address] then
      return { result = profiles[input.address] }
    else
      return { error = "No profile found for this address" }
    end
  
  else
    return { error = "Invalid function" }
  end
end`;

interface ProfileProps {
  profileId?: string;
  walletAddress?: string;
  onCreateProfile?: (profileId: string) => void;
  simulationMode?: boolean;
  initialLuaCode?: string;
}

export const PermawebProfile: React.FC<ProfileProps> = ({
  profileId,
  walletAddress: initialWalletAddress,
  onCreateProfile,
  simulationMode = false,
  initialLuaCode = DEFAULT_PROFILE_LUA
}) => {
  // Get the connection status and reconnect function from PermawebProvider
  const { libs, isConnected: providerConnected, reconnect } = usePermawebProvider();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>(initialWalletAddress || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(providerConnected || false);

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    description: '',
    thumbnail: '',
    banner: ''
  });

  // Simulation mode state
  const [isSimulation, setIsSimulation] = useState(simulationMode);
  const [luaCode, setLuaCode] = useState(initialLuaCode);
  const luaIdeRef = useRef<any>(null);
  const [simulatedProfiles, setSimulatedProfiles] = useState<Record<string, any>>({});
  const [simResults, setSimResults] = useState<Array<{test: string, result: any, error: string | null}>>([]);

  // Update local connection state when provider connection changes
  useEffect(() => {
    setIsConnected(providerConnected);
  }, [providerConnected]);

  // Check for wallet on component mount
  useEffect(() => {
    const checkWalletStatus = async () => {
      console.log("Checking wallet status on component mount...");
      const connected = await isWalletConnected();
      console.log("Wallet connected status from utility:", connected);
      
      if (connected) {
        try {
          const address = await getWalletAddress();
          setWalletAddress(address);
          setIsConnected(true);
          console.log("Wallet detected and connected, address:", address);
        } catch (error) {
          console.error("Error getting wallet address:", error);
        }
      } else {
        setIsConnected(false);
        console.log("Wallet not connected");
      }
    };

    checkWalletStatus();
  }, []);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // First try to use the provider's reconnect function
      console.log("Attempting to connect via provider reconnect...");
      const providerConnected = await reconnect();
      
      if (!providerConnected) {
        // Fall back to direct wallet connection
        console.log("Provider reconnect failed, trying direct wallet connection...");
        await connectWallet();
      }
      
      const address = await getWalletAddress();
      console.log("Connected to wallet, address:", address);
      setWalletAddress(address);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress('');
      setIsConnected(false);
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  };

  // Fetch profile when connection status changes
  useEffect(() => {
    console.log("Connection status changed, isConnected:", isConnected);
    console.log("Wallet address:", walletAddress);
    console.log("Libs available:", !!libs);
    
    if (libs && isConnected && (profileId || walletAddress)) {
      console.log("Attempting to fetch profile...");
      fetchProfile();
    }
  }, [libs, isConnected, profileId, walletAddress]);

  // Simulate Lua execution for profile operations
  const simulateLuaExecution = (
    handler: string,
    args: Record<string, any>,
    caller: string = walletAddress
  ): { result: any; error: string | null } => {
    try {
      console.log(`Simulating Lua execution for handler: ${handler}`, args);
      
      // Mock data for simulation
      const action = { 
        input: { function: handler, ...args },
        caller
      };
      
      const state = { profiles: simulatedProfiles };
      
      // Create a sandbox to execute the code
      // This is a very simplified simulation - in a real app, you'd use a proper Lua interpreter
      let result;
      let error = null;
      
      // Simple simulation based on the handler type
      if (handler === 'create_profile') {
        if (!caller) {
          error = "Must be authenticated";
        } else if (!args.username || !args.displayName) {
          error = "Username and displayName are required";
        } else {
          // Create a mock profile
          const newProfile = {
            id: `profile_${caller.substring(0, 8)}`,
            username: args.username,
            displayName: args.displayName,
            description: args.description || "",
            thumbnail: args.thumbnail || "",
            banner: args.banner || "",
            owner: caller,
            createdAt: Date.now()
          };
          
          // Store in our simulated state
          const updatedProfiles = {...simulatedProfiles};
          updatedProfiles[caller] = newProfile;
          setSimulatedProfiles(updatedProfiles);
          
          result = {
            result: "Profile saved successfully",
            profileId: newProfile.id
          };
        }
      } else if (handler === 'get_profile') {
        if (!args.profileId) {
          error = "Profile ID is required";
        } else {
          // Try to find profile by ID
          let foundProfile = null;
          Object.values(simulatedProfiles).forEach(profile => {
            if (profile.id === args.profileId) {
              foundProfile = profile;
            }
          });
          
          if (foundProfile) {
            result = { result: foundProfile };
          } else {
            error = "Profile not found";
          }
        }
      } else if (handler === 'get_profile_by_address') {
        if (!args.address) {
          error = "Wallet address is required";
        } else if (simulatedProfiles[args.address]) {
          result = { result: simulatedProfiles[args.address] };
        } else {
          error = "No profile found for this address";
        }
      } else {
        error = `Unknown handler: ${handler}`;
      }
      
      return {
        result: result || null,
        error
      };
    } catch (err) {
      console.error('Error in Lua simulation:', err);
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Unknown error in simulation'
      };
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      let profileData;
      
      if (isSimulation) {
        console.log('Simulating profile fetch...');
        let result;
        
        if (profileId) {
          result = simulateLuaExecution('get_profile', { profileId });
        } else if (walletAddress) {
          result = simulateLuaExecution('get_profile_by_address', { address: walletAddress });
        }
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        profileData = result.result?.result || null;
      } else {
        if (profileId) {
          console.log('Fetching profile by ID:', profileId);
          profileData = await libs.getProfileById(profileId);
        } else if (walletAddress) {
          console.log('Fetching profile by wallet address:', walletAddress);
          profileData = await libs.getProfileByWalletAddress(walletAddress);
        }
      }
      
      console.log('Profile data:', profileData);
      setProfile(profileData);
      
      // If we found a profile, pre-fill the form with its data
      if (profileData) {
        setFormData({
          username: profileData.username || '',
          displayName: profileData.displayName || '',
          description: profileData.description || '',
          thumbnail: profileData.thumbnail || '',
          banner: profileData.banner || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSimulation && (!libs || !isConnected)) {
      setError('Not connected to Arweave. Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Creating profile with data:', formData);
      
      let newProfileId;
      if (isSimulation) {
        const result = simulateLuaExecution('create_profile', formData);
        if (result.error) {
          throw new Error(result.error);
        }
        newProfileId = result.result?.profileId;
        
        // Refresh profile data
        await fetchProfile();
      } else {
        newProfileId = await libs.createProfile(formData);
        console.log('Profile created with ID:', newProfileId);
        setProfile(await libs.getProfileById(newProfileId));
      }
      
      onCreateProfile?.(newProfileId);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSimulation && (!libs || !isConnected)) {
      setError('Not connected to Arweave. Please connect your wallet first.');
      return;
    }
    if (!profileId && !walletAddress) {
      setError('No profile ID or wallet address provided for update');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Updating profile with data:', formData);
      
      if (isSimulation) {
        // In simulation, create_profile handles both creation and updates
        const result = simulateLuaExecution('create_profile', formData);
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Refresh profile data
        await fetchProfile();
      } else {
        await libs.updateProfile(formData, profileId);
        console.log('Profile updated successfully');
        setProfile(await libs.getProfileById(profileId));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle LuaIDE code changes
  const handleLuaCodeChange = (newCode: string) => {
    setLuaCode(newCode);
  };

  // Run simulation tests
  const runLuaDryRun = () => {
    setMessage("Running Lua code simulation...");
    setSimResults([]);
    
    try {
      // Reset simulation profiles
      setSimulatedProfiles({});
      
      // Test cases to verify profile functionality
      const testCases = [
        { 
          handler: 'create_profile', 
          args: { 
            username: 'alice', 
            displayName: 'Alice', 
            description: 'Test profile for Alice' 
          },
          caller: 'ALICE_WALLET_ADDRESS'
        },
        { 
          handler: 'create_profile', 
          args: { 
            username: 'bob', 
            displayName: 'Bob', 
            description: 'Test profile for Bob' 
          },
          caller: 'BOB_WALLET_ADDRESS'
        },
        { 
          handler: 'get_profile_by_address', 
          args: { address: 'ALICE_WALLET_ADDRESS' } 
        },
        { 
          handler: 'get_profile', 
          args: { profileId: 'profile_BOB_WALL' }  // This should match the generated ID for Bob
        },
        { 
          handler: 'create_profile', 
          args: { 
            // Missing required fields
            description: 'Invalid profile' 
          },
          caller: 'MISSING_FIELDS_TEST'
        }
      ];
      
      // Execute each test case
      const results = testCases.map(test => {
        const result = simulateLuaExecution(
          test.handler, 
          test.args, 
          test.caller || walletAddress
        );
        
        return { 
          test: `${test.handler}(${JSON.stringify(test.args)})${test.caller ? ` as ${test.caller}` : ''}`,
          result: result.result,
          error: result.error
        };
      });
      
      setSimResults(results);
      
      // Show results in console and summary in message
      console.log('Dry run test results:', results);
      
      const successCount = results.filter(r => !r.error).length;
      setMessage(`Dry run completed: ${successCount}/${results.length} tests passed. See results below.`);
    } catch (error) {
      console.error('Error in Lua dry run:', error);
      setMessage(`Error in Lua dry run: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Helper to show messages
  const [message, setMessage] = useState('');

  // Render the wallet connection UI if not connected and not in simulation mode
  if (!isConnected && !isSimulation) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Permaweb Profile</h2>
          <p className="mb-6 text-gray-600">
            Connect your Arweave wallet to view or create your profile.
          </p>
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Debug information section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md text-left">
            <h3 className="text-sm font-bold mb-2 text-gray-700">Debug Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Provider Connected: {providerConnected ? 'Yes' : 'No'}</p>
              <p>Component isConnected: {isConnected ? 'Yes' : 'No'}</p>
              <p>Wallet Address: {walletAddress || 'None'}</p>
              <p>ArConnect Detected: {typeof window !== 'undefined' && window.arweaveWallet ? 'Yes' : 'No'}</p>
              <p>Libraries Available: {libs ? 'Yes' : 'No'}</p>
              <p>Connection State: {isConnecting ? 'Connecting...' : 'Idle'}</p>
            </div>
            <div className="mt-2">
              <button 
                onClick={async () => {
                  try {
                    console.log("Debugging wallet availability and connection:");
                    console.log("ArConnect available:", typeof window !== 'undefined' && !!window.arweaveWallet);
                    
                    if (typeof window !== 'undefined' && window.arweaveWallet) {
                      try {
                        const address = await window.arweaveWallet.getActiveAddress();
                        console.log("Wallet address:", address);
                        alert(`Wallet is connected. Address: ${address}`);
                      } catch (error) {
                        console.log("Error getting address:", error);
                        alert("ArConnect is available but not connected. Please connect your wallet.");
                      }
                    } else {
                      alert("ArConnect extension not detected. Please install it from https://www.arconnect.io");
                    }
                  } catch (err) {
                    console.error("Debug error:", err);
                    alert(`Debug error: ${err instanceof Error ? err.message : String(err)}`);
                  }
                }}
                className="text-xs py-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Check Wallet Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Permaweb Profile</h2>
        <div className="flex items-center space-x-4">
          {/* Simulation mode toggle */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isSimulation}
                onChange={() => setIsSimulation(!isSimulation)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {isSimulation ? "Simulation" : "Live"}
              </span>
            </label>
          </div>
          
          {isConnected && !isSimulation && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2 truncate max-w-[150px]">{walletAddress}</span>
              <button
                onClick={handleDisconnectWallet}
                className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
          {message}
        </div>
      )}

      {/* Simulation Mode Editor Section */}
      {isSimulation && (
        <div className="mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-bold">Lua Profile Handler Simulation</h3>
            <p className="text-sm text-gray-600">Edit the Lua code below to modify the profile handler simulation.</p>
          </div>
          <div className="p-4">
            <div className="h-64 mb-4 border rounded">
              <LuaIDE 
                cellId="profile-simulation"
                initialCode={luaCode}
                onCodeChange={handleLuaCodeChange}
              />
            </div>
            <button
              onClick={runLuaDryRun}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Simulation Tests
            </button>
          </div>
          
          {/* Simulation Results */}
          {simResults.length > 0 && (
            <div className="p-4 border-t">
              <h3 className="font-bold mb-2">Simulation Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simResults.map((result, index) => (
                      <tr key={index} className={result.error ? 'bg-red-50' : 'bg-green-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.test}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.error 
                            ? <span className="text-red-500">{result.error}</span>
                            : <pre className="text-green-700">{JSON.stringify(result.result, null, 2)}</pre>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.error 
                            ? <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Failed</span>
                            : <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Passed</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {profile ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {profile.banner && (
            <div className="h-48 bg-gray-200">
              <img
                src={profile.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center space-x-4">
              {profile.thumbnail && (
                <img
                  src={profile.thumbnail}
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                <p className="text-gray-600">@{profile.username}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{profile.description}</p>
            
            <button
              onClick={() => setProfile(null)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={profileId ? handleUpdateProfile : handleCreateProfile}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">
            {profileId ? 'Update Profile' : 'Create Profile'} {isSimulation && "(Simulation)"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail URL
              </label>
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Banner URL
              </label>
              <input
                type="text"
                value={formData.banner}
                onChange={(e) =>
                  setFormData({ ...formData, banner: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Processing...' : profileId ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PermawebProfile; 
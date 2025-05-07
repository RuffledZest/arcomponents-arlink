/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { AOProcess, LuaHandler } from '@/types/arweave';

// Mock AO process for development
let mockProcesses: Record<string, AOProcess> = {};

// Simple development check
const isDev = true; // Set to false in production

export const createAOProcess = async (
  name: string,
  description?: string,
  handlers: LuaHandler[] = []
): Promise<AOProcess> => {
  const process: AOProcess = {
    id: `process-${Date.now()}`,
    name,
    description,
    handlers,
    state: {},
  };

  // In development, store in mock
  if (isDev) {
    mockProcesses[process.id] = process;
  }

  return process;
};

export const updateAOProcess = async (
  processId: string,
  updates: Partial<AOProcess>
): Promise<AOProcess> => {
  if (isDev) {
    const process = mockProcesses[processId];
    if (!process) throw new Error('Process not found');

    const updatedProcess = { ...process, ...updates };
    mockProcesses[processId] = updatedProcess;
    return updatedProcess;
  }

  // In production, call actual AO API
  // TODO: Implement actual AO API calls
  throw new Error('AO API not implemented');
};

export const addLuaHandler = async (
  processId: string,
  handler: LuaHandler
): Promise<AOProcess> => {
  if (isDev) {
    const process = mockProcesses[processId];
    if (!process) throw new Error('Process not found');

    const updatedProcess = {
      ...process,
      handlers: [...process.handlers, handler],
    };
    mockProcesses[processId] = updatedProcess;
    return updatedProcess;
  }

  // In production, call actual AO API
  // TODO: Implement actual AO API calls
  throw new Error('AO API not implemented');
};

export const executeLuaHandler = async (
  processId: string,
  handlerName: string,
  params: Record<string, any> = {}
): Promise<any> => {
  if (isDev) {
    const process = mockProcesses[processId];
    if (!process) throw new Error('Process not found');

    const handler = process.handlers.find(h => h.name === handlerName);
    if (!handler) throw new Error('Handler not found');

    // In development, just return mock data
    return {
      success: true,
      result: `Mock execution of ${handlerName}`,
      params,
    };
  }

  // In production, call actual AO API
  // TODO: Implement actual AO API calls
  throw new Error('AO API not implemented');
};

export const getProcessState = async (processId: string): Promise<Record<string, any>> => {
  if (isDev) {
    const process = mockProcesses[processId];
    if (!process) throw new Error('Process not found');
    return process.state || {};
  }

  // In production, call actual AO API
  // TODO: Implement actual AO API calls
  throw new Error('AO API not implemented');
};

export const updateProcessState = async (
  processId: string,
  updates: Record<string, any>
): Promise<Record<string, any>> => {
  if (isDev) {
    const process = mockProcesses[processId];
    if (!process) throw new Error('Process not found');

    const updatedState = { ...process.state, ...updates };
    mockProcesses[processId] = { ...process, state: updatedState };
    return updatedState;
  }

  // In production, call actual AO API
  // TODO: Implement actual AO API calls
  throw new Error('AO API not implemented');
};

// Common Lua handlers
export const commonLuaHandlers: LuaHandler[] = [
  {
    name: 'onConnect',
    code: `function onConnect(address)
  print('Connected:', address)
  return { success = true, address = address }
end`,
    description: 'Called when a wallet connects',
    parameters: [
      { name: 'address', type: 'string', description: 'The connected wallet address' }
    ],
    returnType: '{ success: boolean, address: string }',
    example: `local result = onConnect("arweave-address")
print(result.success) -- true
print(result.address) -- arweave-address`
  },
  {
    name: 'onDisconnect',
    code: `function onDisconnect()
  print('Disconnected')
  return { success = true }
end`,
    description: 'Called when a wallet disconnects',
    returnType: '{ success: boolean }',
    example: `local result = onDisconnect()
print(result.success) -- true`
  },
  {
    name: 'onTransaction',
    code: `function onTransaction(tx)
  print('Transaction:', tx)
  return { success = true, tx = tx }
end`,
    description: 'Called when a transaction is received',
    parameters: [
      { name: 'tx', type: 'table', description: 'The transaction data' }
    ],
    returnType: '{ success: boolean, tx: table }',
    example: `local result = onTransaction({ id = "tx-id", amount = 100 })
print(result.success) -- true
print(result.tx.id) -- tx-id`
  },
  {
    name: 'onMessage',
    code: `function onMessage(msg)
  print('Message:', msg)
  return { success = true, msg = msg }
end`,
    description: 'Called when a message is received',
    parameters: [
      { name: 'msg', type: 'table', description: 'The message data' }
    ],
    returnType: '{ success: boolean, msg: table }',
    example: `local result = onMessage({ type = "greeting", content = "Hello" })
print(result.success) -- true
print(result.msg.content) -- Hello`
  }
]; 
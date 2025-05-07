/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  message,
  createDataItemSigner,
  dryrun
} from "@permaweb/aoconnect";

// declare global {
//   interface Window {
//     arweaveWallet?: {
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

// Arweave frontend handlers Documentation
const AOModule = "Do_Uc2Sju_ffp6Ev0AnLVdPtot15rvMjP-a9VVaA5fM"; // aos 2.0.1
const AOScheduler = "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";
const CommonTags = [
  { name: "Name", value: "Anon" },
  { name: "Version", value: "0.2.1" },
];

/**
 * Check if arweave wallet is available and connected
 */
export default async function isWalletConnected(): Promise<boolean> {
  try {
    if (!window.arweaveWallet) {
      console.log('ArConnect not installed');
      return false;
    }

    // Try to get the active address to check if already connected
    try {
      const address = await window.arweaveWallet.getActiveAddress();
      return !!address;
    } catch (error) {
      // If this fails, the wallet is not connected
      console.log('Wallet exists but not connected:', error);
      return false;
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
}

// connect wallet
export async function connectWallet(): Promise<void> {
  try {
    if (!window.arweaveWallet) {
      throw new Error('No Arconnect detected. Please install the ArConnect browser extension.');
    }

    // Check if already connected
    try {
      const address = await window.arweaveWallet.getActiveAddress();
      if (address) {
        console.log('Already connected to wallet:', address);
        return;
      }
    } catch (error) {
      // Not connected, continue with connection
      console.log('Not connected, attempting to connect now...');
    }

    console.log('Connecting to ArConnect wallet...');
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_TOKENS'],
      {
        name: 'Anon',
        logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
      },
      {
        host: 'g8way.io',
        port: 443,
        protocol: 'https',
      }
    );
    console.log('Successfully connected to ArConnect');

    // Verify connection
    const address = await window.arweaveWallet.getActiveAddress();
    console.log('Connected to wallet address:', address);
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
}

// disconnect wallet
export async function disconnectWallet(): Promise<void> {
  if (!window.arweaveWallet) {
    throw new Error('No Arconnect detected');
  }
  try {
    await window.arweaveWallet.disconnect();
    console.log('Disconnected from wallet');
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
}

// get wallet details
export async function getWalletAddress(): Promise<string> {
  if (!window.arweaveWallet) {
    throw new Error('No Arconnect detected');
  }
  try {
    const walletAddress = await window.arweaveWallet.getActiveAddress();
    console.log('Retrieved wallet address:', walletAddress);
    return walletAddress;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw error;
  }
}

// send message to process 
export const messageAR = async ({ 
  tags = [], 
  data, 
  anchor = '',
  pId 
}: { 
  tags?: { name: string; value: string }[]; 
  data: any; 
  anchor?: string;
  pId: string;
}): Promise<string> => {
  try {
    if (!pId) throw new Error("Process ID is required.");
    if (!data) throw new Error("Data is required.");

    console.log(pId);
    const allTags = [...CommonTags, ...tags];
    const messageId = await message({
      data: JSON.stringify(data),
      anchor,
      process: pId,
      tags: allTags,
      signer: createDataItemSigner(window.arweaveWallet)
    });
    return messageId;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// fetch data from the processId
export async function dryrunResult(
  processId: string, 
  tags: { name: string; value: string }[]
): Promise<any> {
  try {
    const res = await dryrun({
      process: processId,
      tags,
    });

    if (!res || !res.Messages || !res.Messages.length) {
      console.warn('No messages in dryrun response:', res);
      return { error: 'No response from dryrun' };
    }

    try {
      const data = JSON.parse(res.Messages[0].Data);
      return data;
    } catch (parseError) {
      console.error('Error parsing dryrun response:', parseError);
      return { error: 'Failed to parse dryrun response', raw: res.Messages[0].Data };
    }
  } catch (error) {
    console.error('Error in dryrun:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error in dryrun' };
  }
} 
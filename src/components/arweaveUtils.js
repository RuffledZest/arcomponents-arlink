// arweaveUtils.js
// const AOModule = "Do_Uc2Sju_ffp6Ev0AnLVdPtot15rvMjP-a9VVaA5fM"; // aos 2.0.1
// const AOScheduler = "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";
// const CommonTags = [
//   { name: "Name", value: "Anon" },
//   { name: "Version", value: "0.2.1" },
// ];

import {
  dryrun
} from "@permaweb/aoconnect"

// connect wallet
export async function connectWallet() {
  try {
    if (!window.arweaveWallet) {
      alert('No Arconnect detected');
      return;
    }
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_TOKENS'],
      {
        name: 'ArDacity',
        logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
      },
      {
        host: 'g8way.io',
        port: 443,
        protocol: 'https',
      }
    );
  } catch (error) {
    console.error(error);
  } finally {
    console.log('connection finished execution');
  }
};

// disconnect wallet
export async function disconnectWallet() {
  return await window.arweaveWallet.disconnect();
};

// get wallet details
export async function getWalletAddress() {
  const walletAddress = await window.arweaveWallet.getActiveAddress();
  console.log(walletAddress)
  return walletAddress;
};

// fetch data from the processId
export async function dryrunResult(processId, tags) {
  const res = await dryrun({
    process: processId,
    tags,
  }).then((res) => JSON.parse(res.Messages[0].Data))
  return res
}
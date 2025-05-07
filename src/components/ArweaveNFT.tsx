"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react"
import { useState } from "react"
import LuaIDE from "./LuaIDE"

export interface ArweaveNFTProps {
  title?: string
  description?: string
  imageUrl?: string
  tokenId?: string
  owner?: string
  initialLuaCode?: string
  onTransfer?: (data: {
    to: string
    tokenId: string
    luaCode: string
  }) => void
  className?: string
  style?: React.CSSProperties
}

const ArweaveNFT: React.FC<ArweaveNFTProps> = ({
  title = "Arweave NFT",
  description = "View and interact with your Arweave NFT",
  imageUrl = "https://arweave.net/your-nft-image",
  tokenId = "your-token-id",
  owner = "your-wallet-address",
  initialLuaCode = `-- NFT transfer handler
function transferNFT(to, tokenId)
  -- Get the current owner
  local currentOwner = ao.getActiveAddress()
  
  -- Check if the sender is the owner
  if currentOwner ~= owner then
    return {
      success = false,
      error = "Only the owner can transfer this NFT"
    }
  end
  
  -- Transfer the NFT
  local result = ao.transferNFT(to, tokenId)
  
  -- Return the result
  return {
    success = true,
    transactionId = result.id
  }
end

-- Example usage:
-- local result = transferNFT("recipient-address", "token-id")
-- print("Transfer result:", result)`,
  onTransfer,
  className = "",
  style = {},
}) => {
  const [luaCode, setLuaCode] = useState(initialLuaCode)
  const [recipient, setRecipient] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isTransferring || !recipient.trim()) return

    setIsTransferring(true)
    setError(null)
    setSuccess(null)

    try {
      // Here you would typically execute the Lua code to transfer the NFT
      // For now, we'll simulate it
      const result = {
        to: recipient,
        tokenId,
        luaCode,
      }

      if (onTransfer) {
        await onTransfer(result)
      }
      setSuccess("NFT transferred successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to transfer NFT")
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <div
      className={`bg-gradient-to-br from-black to-zinc-900 rounded-xl shadow-xl p-8 border border-zinc-800 ${className}`}
      style={style}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-zinc-400 text-lg">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NFT Display */}
        <div className="bg-transparent rounded-lg p-6 shadow-md border border-zinc-800 transition-all hover:border-zinc-700">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg ring-2 ring-zinc-800">
            <img src={'/ArweaveNFT.png'} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">Token ID</h3>
            <p className="font-mono text-sm text-zinc-400 break-all mt-1 bg-zinc-950 p-2 rounded-md">{tokenId}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-white">Owner</h3>
            <p className="font-mono text-sm text-zinc-400 break-all mt-1 bg-zinc-950 p-2 rounded-md">{owner}</p>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-transparent rounded-lg p-6 shadow-md border border-zinc-800">
          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's Arweave address"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all"
                required
              />
            </div>

            {/* Lua Code Editor */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Transfer Handler</label>
              <div className="border border-zinc-800 rounded-lg overflow-hidden shadow-inner">
                <LuaIDE
                  cellId="nft-transfer-lua"
                  initialCode={luaCode}
                  onProcessId={(pid) => console.log("Process ID:", pid)}
                  onNewMessage={(msgs) => console.log("New messages:", msgs)}
                  onInbox={(inbox) => console.log("Inbox:", inbox)}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-400 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Transfer Button */}
            <button
              type="submit"
              disabled={isTransferring || !recipient.trim()}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-[1.02] ${
                isTransferring || !recipient.trim()
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 shadow-md hover:shadow-lg border border-zinc-600"
              }`}
            >
              {isTransferring ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Transferring...
                </div>
              ) : (
                "Transfer NFT"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ArweaveNFT

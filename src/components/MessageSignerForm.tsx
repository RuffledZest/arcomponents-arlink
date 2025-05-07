/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import LuaIDE from './LuaIDE';

export interface MessageSignerFormProps {
  title?: string;
  description?: string;
  initialLuaCode?: string;
  onSign?: (data: {
    message: string;
    signature: string;
    luaCode: string;
  }) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MessageSignerForm: React.FC<MessageSignerFormProps> = ({
  title = 'Message Signer',
  description = 'Sign messages using Lua handlers',
  initialLuaCode = `-- Message signing handler
function signMessage(message)
  -- Get the wallet address
  local address = ao.getActiveAddress()
  
  -- Create a signature
  local signature = ao.signMessage(message)
  
  -- Return the signature
  return {
    address = address,
    signature = signature
  }
end

-- Example usage:
-- local result = signMessage("Hello, Arweave!")
-- print("Address:", result.address)
-- print("Signature:", result.signature)`,
  onSign,
  className = '',
  style = {}
}) => {
  const [message, setMessage] = useState('');
  const [luaCode, setLuaCode] = useState(initialLuaCode);
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigning || !message.trim()) return;

    setIsSigning(true);
    setError(null);
    setSignature(null);

    try {
      // Here you would typically execute the Lua code to sign the message
      // For now, we'll simulate it
      const result = {
        message,
        signature: 'simulated_signature_' + Date.now(),
        luaCode
      };

      if (onSign) {
        await onSign(result);
      }
      setSignature(result.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 border border-gray-100 ${className}`} 
      style={style}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      <form onSubmit={handleSign} className="space-y-8">
        {/* Message Input */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message to Sign
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            required
          />
        </div>

        {/* Lua Code Editor */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lua Signing Handler
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-inner">
            <LuaIDE
              cellId="message-signer-lua"
              initialCode={luaCode}
              onProcessId={(pid) => console.log('Process ID:', pid)}
              onNewMessage={(msgs) => console.log('New messages:', msgs)}
              onInbox={(inbox) => console.log('Inbox:', inbox)}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Signature Display */}
        {signature && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-600 font-medium">Signature Generated</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <p className="font-mono text-sm break-all text-gray-800">{signature}</p>
            </div>
          </div>
        )}

        {/* Sign Button */}
        <button
          type="submit"
          disabled={isSigning || !message.trim()}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-[1.02] ${
            isSigning || !message.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
          }`}
        >
          {isSigning ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing...
            </div>
          ) : (
            'Sign Message'
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageSignerForm; 
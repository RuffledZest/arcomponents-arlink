/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LuaIDE from './LuaIDE';

export interface ArweaveFormProps {
  title?: string;
  description?: string;
  initialLuaCode?: string;
  onSubmit?: (data: {
    luaCode: string;
    tags: Array<{ name: string; value: string }>;
    data: string;
  }) => void;
  className?: string;
  style?: React.CSSProperties;
}

const ArweaveForm: React.FC<ArweaveFormProps> = ({
  title = 'Arweave Transaction Form',
  description = 'Create and submit Arweave transactions with Lua handlers',
  initialLuaCode = `-- Add your Lua handlers here
function onConnect(address)
  print('Connected:', address)
end

function onDisconnect()
  print('Disconnected')
end

function onTransaction(tx)
  print('Transaction:', tx)
end`,
  onSubmit,
  className = '',
  style = {}
}) => {
  const [luaCode, setLuaCode] = useState(initialLuaCode);
  const [tags, setTags] = useState<Array<{ name: string; value: string }>>([
    { name: 'Content-Type', value: 'application/json' }
  ]);
  const [data, setData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    setTags([...tags, { name: '', value: '' }]);
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, field: 'name' | 'value', value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          luaCode,
          tags,
          data
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} style={style}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lua Code Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lua Handlers
          </label>
          <div className="border rounded-lg overflow-hidden">
            <LuaIDE
              cellId="arweave-form-lua"
              initialCode={luaCode}
              onProcessId={(pid) => console.log('Process ID:', pid)}
              onNewMessage={(msgs) => console.log('New messages:', msgs)}
              onInbox={(inbox) => console.log('Inbox:', inbox)}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Tags
          </label>
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tag.name}
                  onChange={(e) => handleTagChange(index, 'name', e.target.value)}
                  placeholder="Tag Name"
                  className="flex-1 p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={tag.value}
                  onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                  placeholder="Tag Value"
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTag}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* Data Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Data
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter transaction data (JSON, text, etc.)"
            className="w-full h-32 p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Transaction'}
        </button>
      </form>
    </div>
  );
};

export default ArweaveForm; 
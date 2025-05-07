/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { dryrun } from '@permaweb/aoconnect';

interface AOSpawnerTestProps {
  processId: string;
}

const AOSpawnerTest: React.FC<AOSpawnerTestProps> = ({ processId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const testProcess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test ping handler
      const pingResult = await dryrun({
        process: processId,
        data: JSON.stringify({
          Action: "Ping"
        }),
        tags: [
          { name: 'Action', value: 'Ping' }
        ]
      });

      console.log('Ping result:', pingResult);
      setResult(pingResult);

    } catch (err) {
      console.error('Error testing process:', err);
      setError(err instanceof Error ? err.message : 'Failed to test process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded">
      <h3 className="text-lg font-medium mb-2">Process Test</h3>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Process ID: {processId}</span>
        <button
          onClick={testProcess}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Testing...' : 'Test Process'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Test Result</h4>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AOSpawnerTest; 
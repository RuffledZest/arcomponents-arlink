/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import './Leaderboard.css';
import LuaIDE from './LuaIDE'; // Import the LuaIDE component

export interface LeaderboardProps {
  processId?: string;
  title?: string;
  limit?: number;
  className?: string;
  style?: React.CSSProperties;
  simulationMode?: boolean;
  initialLuaCode?: string;
}

// Default Lua code for the leaderboard handler
const DEFAULT_LEADERBOARD_LUA = `-- leaderboard.lua

-- Table to store scores: { player_name = score }
local scores = {}

function handle(state, action)
  local input = action.input or {}

  -- Submit a score
  if input.function == "submit_score" then
    local player = input.player
    local score = tonumber(input.score)

    if not player or not score then
      return { error = "Missing player or score" }
    end

    -- Update only if the score is higher
    if not scores[player] or scores[player] < score then
      scores[player] = score
    end

    return { result = "Score submitted" }

  -- Get the leaderboard
  elseif input.function == "get_leaderboard" then
    local leaderboard = {}
    for player, score in pairs(scores) do
      table.insert(leaderboard, { player = player, score = score })
    end

    table.sort(leaderboard, function(a, b) return a.score > b.score end)

    -- Limit to top N
    local top_n = input.limit or 10
    local result = {}
    for i = 1, math.min(top_n, #leaderboard) do
      table.insert(result, leaderboard[i])
    end

    return { result = result }

  else
    return { error = "Invalid function" }
end`;

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  processId = "N_boXL20JQirhENJyfml_Geaa5cofYG8BieNA0uKZ6U", 
  title = "AO Leaderboard",
  limit = 10,
  className = '',
  style = {},
  simulationMode = false,
  initialLuaCode = DEFAULT_LEADERBOARD_LUA
}) => {
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');
  const [leaderboard, setLeaderboard] = useState<Array<{player: string, score: number}>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [displayLimit, setDisplayLimit] = useState(limit);
  const [isSimulation, setIsSimulation] = useState(simulationMode);
  const [luaCode, setLuaCode] = useState(initialLuaCode);
  
  // For simulation: store simulated scores
  const [simulatedScores, setSimulatedScores] = useState<Record<string, number>>({});
  const [simResults, setSimResults] = useState<Array<{test: string, result: any, error: string | null}>>([]);
  const luaIdeRef = useRef<any>(null);

  // Use the proxy API endpoint instead of direct AO endpoint
  const PROXY_ENDPOINT = '/api/ao-proxy';

  // Mock function to simulate Lua execution locally
  const simulateLuaExecution = (
    handler: string,
    args: Record<string, any>
  ): { result: any; error: string | null } => {
    try {
      console.log(`Simulating Lua execution for handler: ${handler}`, args);
      
      if (handler === 'submit_score') {
        const { player, score } = args;
        
        if (!player || score === undefined) {
          return { result: null, error: 'Missing player or score' };
        }
        
        // Mock submit score logic
        const mockScores = {...simulatedScores};
        const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
        
        // Update only if the score is higher (matching Lua logic)
        if (!mockScores[player] || mockScores[player] < numScore) {
          mockScores[player] = numScore;
          setSimulatedScores(mockScores);
        }
        
        return {
          result: "Score submitted",
          error: null
        };
      }
      
      if (handler === 'get_leaderboard') {
        const { limit = 10 } = args;
        
        // Convert scores object to array (matching Lua logic)
        const leaderboardArray = Object.entries(simulatedScores).map(([player, score]) => ({
          player,
          score
        }));
        
        // Sort by score (descending)
        const sortedLeaderboard = leaderboardArray.sort((a, b) => b.score - a.score);
        
        // Return limited number of scores
        return {
          result: sortedLeaderboard.slice(0, limit),
          error: null
        };
      }
      
      return {
        result: null,
        error: `Unknown handler: ${handler}`
      };
    } catch (err) {
      console.error('Error in Lua simulation:', err);
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Unknown error in simulation'
      };
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      if (isSimulation) {
        // Use local simulation
        console.log('Simulating leaderboard fetch with params:', { limit: displayLimit });
        const result = simulateLuaExecution('get_leaderboard', { limit: displayLimit });
        console.log('Simulated leaderboard result:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Ensure we're setting an array with the correct type
        if (result.result && Array.isArray(result.result)) {
          setLeaderboard(result.result);
        } else {
          setLeaderboard([]);
        }
      } else {
        // Use actual AO process
        console.log('Fetching leaderboard with params:', { processId, limit: displayLimit });
        
        const requestBody = {
          processId,
          function: "get_leaderboard",
          limit: displayLimit
        };
        console.log('Request body:', requestBody);
        
        const response = await fetch(PROXY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Leaderboard response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        setLeaderboard(data.result || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setMessage(`Failed to load leaderboard: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async () => {
    if (!playerName || !playerScore) {
      setMessage("Please enter both player name and score");
      return;
    }

    const scoreNum = Number(playerScore);
    if (isNaN(scoreNum)) {
      setMessage("Score must be a number");
      return;
    }

    setLoading(true);
    try {
      if (isSimulation) {
        // Use local simulation
        console.log('Simulating score submission:', { player: playerName, score: scoreNum });
        const result = simulateLuaExecution('submit_score', { player: playerName, score: scoreNum });
        console.log('Simulated submission result:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Set the message as a string
        setMessage(typeof result.result === 'string' ? result.result : "Score submitted successfully");
        
        // Clear the form fields after successful submission
        setPlayerName('');
        setPlayerScore('');
        fetchLeaderboard(); // Refresh the leaderboard
      } else {
        // Use actual AO process
        console.log('Submitting score with params:', { processId, player: playerName, score: scoreNum });
        
        const requestBody = {
          processId,
          function: "submit_score",
          player: playerName,
          score: scoreNum
        };
        console.log('Request body:', requestBody);
        
        const response = await fetch(PROXY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Submit score response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Submit score response:', result);
        setMessage(result.result || "Score submitted successfully");
        // Clear the form fields after successful submission
        setPlayerName('');
        setPlayerScore('');
        fetchLeaderboard(); // Refresh the leaderboard
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      setMessage(`Failed to submit score: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to execute Lua code from the editor and display results
  const runLuaDryRun = () => {
    setMessage("Running Lua code simulation...");
    setSimResults([]);
    
    try {
      // Reset simulation scores
      setSimulatedScores({});
      
      // Test cases to verify leaderboard functionality
      const testCases = [
        { handler: 'submit_score', args: { player: 'Alice', score: 100 } },
        { handler: 'submit_score', args: { player: 'Bob', score: 85 } },
        { handler: 'submit_score', args: { player: 'Charlie', score: 150 } },
        { handler: 'submit_score', args: { player: 'Alice', score: 120 } }, // Higher score should update
        { handler: 'submit_score', args: { player: 'Bob', score: 75 } },    // Lower score should not update
        { handler: 'get_leaderboard', args: { limit: displayLimit } }
      ];
      
      // Execute each test case
      const results = testCases.map(test => {
        const result = simulateLuaExecution(test.handler, test.args);
        return { 
          test: `${test.handler}(${JSON.stringify(test.args)})`,
          result: result.result,
          error: result.error
        };
      });
      
      setSimResults(results);
      
      // Display final leaderboard
      fetchLeaderboard();
      
      // Show results in console and summary in message
      console.log('Dry run test results:', results);
      
      const successCount = results.filter(r => !r.error).length;
      setMessage(`Dry run completed: ${successCount}/${results.length} tests passed. See results below.`);
    } catch (error) {
      console.error('Error in Lua dry run:', error);
      setMessage(`Error in Lua dry run: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Handle LuaIDE code changes
  const handleLuaCodeChange = (newCode: string) => {
    setLuaCode(newCode);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [displayLimit, processId, isSimulation]);

  return (
    <div className={`leaderboard-container ${className}`} style={style}>
      <h1>{title}</h1>
      
      <div className="leaderboard-mode-toggle">
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={isSimulation}
            onChange={() => setIsSimulation(!isSimulation)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">{isSimulation ? "Simulation Mode" : "Live Mode"}</span>
        </label>
      </div>
      
      {isSimulation && (
        <div className="simulation-editor">
          <h2>Leaderboard Lua Handler</h2>
          <div className="lua-editor-container">
            <LuaIDE 
              ref={luaIdeRef}
              cellId="leaderboard-simulation"
              initialCode={luaCode}
              onCodeChange={handleLuaCodeChange}
              onProcessId={(pid) => console.log('Process ID:', pid)}
              onNewMessage={(msgs) => console.log('New messages:', msgs)}
              onInbox={(inbox) => console.log('Inbox:', inbox)}
            />
          </div>
          <button 
            onClick={runLuaDryRun}
            className="run-simulation-btn"
          >
            Run Dry Test
          </button>
          
          {simResults.length > 0 && (
            <div className="simulation-results">
              <h3>Simulation Results</h3>
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Result</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simResults.map((result, index) => (
                      <tr key={index} className={result.error ? 'test-failed' : 'test-passed'}>
                        <td>{result.test}</td>
                        <td>{result.error || JSON.stringify(result.result)}</td>
                        <td>{result.error ? '❌ Failed' : '✅ Passed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <p className="simulation-note">
            Note: This is a simplified simulation. The actual execution might vary slightly from the real AO environment.
          </p>
        </div>
      )}
      
      <div className="submit-form">
        <h2>Submit Score</h2>
        <div>
          <label>
            Player Name:
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)} 
            />
          </label>
        </div>
        <div>
          <label>
            Score:
            <input 
              type="number" 
              value={playerScore} 
              onChange={(e) => setPlayerScore(e.target.value)} 
            />
          </label>
        </div>
        <button onClick={submitScore} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Score'}
        </button>
      </div>

      <div className="leaderboard-display">
        <h2>Top Scores {isSimulation && "(Simulation)"}</h2>
        <div>
          <label>
            Show top: 
            <select value={displayLimit} onChange={(e) => setDisplayLimit(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.player}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No scores yet. Be the first to submit!</p>
        )}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Leaderboard; 
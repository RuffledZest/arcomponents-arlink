"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type React from "react"
import { useState, forwardRef } from "react"

interface LuaIDEProps {
  cellId: string
  initialCode: string
  onProcessId?: (pid: string) => void
  onNewMessage?: (msgs: any[]) => void
  onInbox?: (inbox: any[]) => void
  onCodeChange?: (code: string) => void
}

const LuaIDE = forwardRef<HTMLTextAreaElement, LuaIDEProps>(
  ({ cellId, initialCode, onProcessId, onNewMessage, onInbox, onCodeChange }, ref) => {
    const [code, setCode] = useState(initialCode)
    const [error, setError] = useState<string | null>(null)

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value)
      if (onCodeChange) {
        onCodeChange(e.target.value)
      }
    }

    const handleRun = () => {
      try {
        // Here you would typically send the code to your Lua execution service
        console.log("Running Lua code:", code)

        // Simulate process ID generation
        if (onProcessId) {
          onProcessId(`process-${Date.now()}`)
        }

        // Simulate message handling
        if (onNewMessage) {
          onNewMessage([{ type: "info", message: "Code executed successfully" }])
        }

        // Simulate inbox updates
        if (onInbox) {
          onInbox([{ type: "system", message: "Process started" }])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    }

    if (error) {
      return <div className="p-4 bg-transparent text-red-400 rounded-lg border border-red-800">{error}</div>
    }

    return (
      <div className="flex flex-col h-[300px] border border-zinc-700 rounded-lg overflow-hidden bg-black">
        <div className="flex-1 p-4 bg-black">
          <textarea
            ref={ref}
            value={code}
            onChange={handleCodeChange}
            className="w-full h-full p-2 font-mono text-sm bg-transparent border border-zinc-700 rounded text-white"
            placeholder="Enter your Lua code here..."
            style={{ color: "white" }}
          />
        </div>
        <div className="p-2 bg-transparent border-t border-zinc-700">
          <button
            onClick={handleRun}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded hover:bg-zinc-700"
          >
            Run Code
          </button>
        </div>
      </div>
    )
  },
)

export default LuaIDE

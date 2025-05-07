import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the process ID from the URL or body
    const body = await request.json();
    console.log('AO Proxy Request Body:', body);
    
    const { processId, ...restBody } = body;
    
    if (!processId) {
      console.log('AO Proxy Error: Missing processId');
      return NextResponse.json(
        { error: 'Process ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the AO endpoint
    const aoEndpoint = `https://ao.arweave.net/${processId}`;
    
    // Format the request for AO by wrapping it in an input object
    // This is critical for AO processes that expect action.input.function format
    const aoRequestBody = {
      input: restBody
    };
    
    console.log('Sending request to AO endpoint:', aoEndpoint);
    console.log('With body:', aoRequestBody);
    
    const response = await fetch(aoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aoRequestBody),
    });

    console.log('AO Response Status:', response.status);
    
    // Forward the response back to the client
    const data = await response.json();
    console.log('AO Response Data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('AO Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to AO', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 
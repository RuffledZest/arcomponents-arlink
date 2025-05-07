import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test endpoint received:', body);
    
    // Simply return what was sent with a confirmation
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working correctly',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test endpoint error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
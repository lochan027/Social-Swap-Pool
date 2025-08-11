import { NextRequest, NextResponse } from 'next/server';
import { okxAPI } from '@/lib/okx-api';

export async function GET(request: NextRequest) {
  try {
    console.log('Getting available tokens for swap...');
    
    const tokens = await okxAPI.getAvailableTokens();
    
    console.log(`Retrieved ${tokens.length} tokens:`, tokens.map(t => t.symbol));
    
    return NextResponse.json({
      success: true,
      tokens: tokens,
      count: tokens.length,
      chainId: '196', // XLayer
      network: 'XLayer'
    });
  } catch (error) {
    console.error('Error getting tokens for swap:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tokens: []
    }, { status: 500 });
  }
}
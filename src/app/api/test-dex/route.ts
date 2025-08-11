import { NextRequest, NextResponse } from 'next/server';
import { okxAPI } from '@/lib/okx-api';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing DEX integration (DEMO MODE)...');
    
    // Test 1: Get available DEMO tokens
    console.log('Test 1: Getting available DEMO tokens...');
    const tokens = await okxAPI.getAvailableTokens();
    console.log(`Retrieved ${tokens.length} tokens:`, tokens.map(t => t.symbol));
    
    // Test 2: Get a DEMO price quote
    console.log('Test 2: Getting DEMO price quote...');
    const quote = await okxAPI.getPriceQuote('ETH', 'USDT', '1');
    console.log('DEMO Quote received:', quote);
    
    return NextResponse.json({
      success: true,
      demoMode: true,
      tokens: tokens.length,
      tokenSymbols: tokens.map(t => t.symbol),
      quote: {
        fromToken: quote.fromToken,
        toToken: quote.toToken,
        fromAmount: quote.fromAmount,
        toAmount: quote.toAmount,
        price: quote.price,
        dexName: quote.dexName,
        estimatedGas: quote.estimatedGas,
        priceImpact: quote.priceImpact,
        slippage: quote.slippage,
        minReceived: quote.minReceived
      },
      usingRealData: quote.dexName !== 'Mock DEX',
      isMock: quote.dexName === 'Mock DEX',
      demoNotice: {
        title: "Demo Application",
        message: "This is a demonstration version with simulated data for testing purposes only.",
        warnings: [
          "All prices and market data are simulated",
          "No real blockchain transactions are executed",
          "Do not use this application with real funds",
          "Data is generated for demonstration purposes only"
        ]
      }
    });
  } catch (error) {
    console.error('DEX DEMO test failed:', error);
    return NextResponse.json({
      success: false,
      demoMode: true,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      demoNotice: {
        title: "Demo Application Error",
        message: "This is a demonstration version. Even errors are part of the demo simulation.",
        warnings: [
          "This error is part of the demo simulation",
          "No real funds or transactions are affected",
          "The application is for demonstration purposes only"
        ]
      }
    }, { status: 500 });
  }
}
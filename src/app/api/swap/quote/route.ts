import { NextRequest, NextResponse } from 'next/server';
import { okxAPI } from '@/lib/okx-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromToken, toToken, amount, slippage = '0.5' } = body;

    console.log('Getting swap quote:', { fromToken, toToken, amount, slippage });

    // Validate required parameters
    if (!fromToken || !toToken || !amount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: fromToken, toToken, amount'
      }, { status: 400 });
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Get the price quote
    const quote = await okxAPI.getPriceQuote(fromToken, toToken, amount, slippage);

    console.log('Swap quote received:', quote);

    return NextResponse.json({
      success: true,
      quote: {
        fromToken: quote.fromToken,
        toToken: quote.toToken,
        fromAmount: quote.fromAmount,
        toAmount: quote.toAmount,
        price: quote.price,
        estimatedGas: quote.estimatedGas,
        dexName: quote.dexName,
        priceImpact: quote.priceImpact,
        slippage: quote.slippage,
        minReceived: quote.minReceived,
        txData: quote.txData,
        gasPrice: quote.gasPrice
      },
      usingRealData: quote.dexName !== 'Mock DEX',
      isMock: quote.dexName === 'Mock DEX',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting swap quote:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
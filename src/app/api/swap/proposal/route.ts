import { NextRequest, NextResponse } from 'next/server';
import { okxAPI } from '@/lib/okx-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromToken, toToken, amount, slippage = '0.5', includeTokens = true } = body;

    console.log('Creating swap proposal:', { fromToken, toToken, amount, slippage, includeTokens });

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

    const response: any = {
      success: true,
      proposal: {
        fromToken,
        toToken,
        amount,
        slippage,
        timestamp: new Date().toISOString(),
        network: 'XLayer',
        chainId: '196'
      }
    };

    // Get available tokens if requested
    if (includeTokens) {
      try {
        const tokens = await okxAPI.getAvailableTokens();
        response.tokens = tokens;
        response.tokenCount = tokens.length;
      } catch (tokenError) {
        console.error('Error getting tokens for proposal:', tokenError);
        response.tokens = [];
        response.tokenError = tokenError instanceof Error ? tokenError.message : 'Failed to get tokens';
      }
    }

    // Get the price quote
    try {
      const quote = await okxAPI.getPriceQuote(fromToken, toToken, amount, slippage);
      
      response.proposal.quote = {
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
      };

      response.usingRealData = quote.dexName !== 'Mock DEX';
      response.isMock = quote.dexName === 'Mock DEX';

      // Add proposal metadata
      response.proposal.status = 'quote_received';
      response.proposal.validUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
      response.proposal.id = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    } catch (quoteError) {
      console.error('Error getting quote for proposal:', quoteError);
      response.proposal.quote = null;
      response.quoteError = quoteError instanceof Error ? quoteError.message : 'Failed to get quote';
      response.proposal.status = 'quote_failed';
    }

    console.log('Swap proposal created:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating swap proposal:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET method to get proposal template with available tokens
export async function GET(request: NextRequest) {
  try {
    console.log('Getting swap proposal template...');

    // Get available tokens
    const tokens = await okxAPI.getAvailableTokens();

    // Find common default tokens
    const ethToken = tokens.find(t => t.symbol === 'ETH');
    const usdtToken = tokens.find(t => t.symbol === 'USDT');
    const usdcToken = tokens.find(t => t.symbol === 'USDC');

    const template = {
      success: true,
      template: {
        network: 'XLayer',
        chainId: '196',
        defaultFromToken: ethToken?.symbol || 'ETH',
        defaultToToken: usdtToken?.symbol || 'USDT',
        defaultSlippage: '0.5',
        minAmount: '0.000001',
        maxSlippage: '10',
        supportedTokens: tokens.map(t => ({
          symbol: t.symbol,
          name: t.name,
          decimals: t.decimals,
          address: t.address
        })),
        popularPairs: [
          { from: 'ETH', to: 'USDT' },
          { from: 'ETH', to: 'USDC' },
          { from: 'USDT', to: 'USDC' },
          { from: 'ETH', to: 'OKB' }
        ]
      },
      tokens: tokens,
      tokenCount: tokens.length
    };

    console.log('Swap proposal template created');

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error getting swap proposal template:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
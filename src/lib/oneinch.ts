import axios from 'axios';

interface OneInchToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
}

interface OneInchQuote {
  fromToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  fromTokenAmount: string;
  toTokenAmount: string;
  estimatedGas: number;
  gasPrice: string;
  protocols: Array<{
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }>;
  tx: {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

interface OneInchSwapResponse {
  fromToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  fromTokenAmount: string;
  toTokenAmount: string;
  estimatedGas: number;
  tx: {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

export class OneInchService {
  private baseUrl: string;
  private apiKey: string;
  private chainId: number;

  constructor() {
    this.baseUrl = 'https://api.1inch.dev/swap/v6.0';
    this.apiKey = process.env.ONEINCH_API_KEY || '';
    this.chainId = 196; // XLayer chain ID
    
    console.log('1Inch Service (DEMO MODE) initialized with:', {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      chainId: this.chainId,
      demoMode: true
    });
  }

  async getTokens(): Promise<OneInchToken[]> {
    try {
      console.log('Fetching DEMO tokens from 1inch API...');
      
      // For XLayer DEMO, we'll use a predefined list of common tokens
      // since 1inch might not have full XLayer support in demo mode
      const xlayerTokens: OneInchToken[] = [
        {
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          name: 'Ethereum (DEMO)',
          symbol: 'ETH',
          decimals: 18,
          chainId: this.chainId
        },
        {
          address: '0x4200000000000000000000000000000000000006',
          name: 'Wrapped Ethereum (DEMO)',
          symbol: 'WETH',
          decimals: 18,
          chainId: this.chainId
        },
        {
          address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
          name: 'Tether USD (DEMO)',
          symbol: 'USDT',
          decimals: 6,
          chainId: this.chainId
        },
        {
          address: '0x948d2a81086a075b3130b43763d280ae6cd99a09',
          name: 'USD Coin (DEMO)',
          symbol: 'USDC',
          decimals: 6,
          chainId: this.chainId
        },
        {
          address: '0xda3b25e1f5d34c843c5ef6a7f5e2d6c9415684a0',
          name: 'OKB (DEMO)',
          symbol: 'OKB',
          decimals: 18,
          chainId: this.chainId
        }
      ];

      console.log(`Returning ${xlayerTokens.length} DEMO XLayer tokens`);
      return xlayerTokens;
    } catch (error) {
      console.error('Error fetching DEMO tokens from 1inch:', error);
      throw new Error(`Failed to fetch DEMO tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getQuote(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): Promise<OneInchQuote> {
    try {
      console.log('Getting DEMO quote from 1inch API:', { fromTokenAddress, toTokenAddress, amount });
      
      // For DEMO purposes, we'll simulate a realistic quote
      // In production, you would make actual API calls to 1inch
      const fromAmount = parseFloat(amount);
      const toAmount = fromAmount * 0.95; // Simulate 5% slippage
      
      const mockQuote: OneInchQuote = {
        fromToken: {
          address: fromTokenAddress,
          name: this.getTokenName(fromTokenAddress),
          symbol: this.getTokenSymbol(fromTokenAddress),
          decimals: this.getTokenDecimals(fromTokenAddress)
        },
        toToken: {
          address: toTokenAddress,
          name: this.getTokenName(toTokenAddress),
          symbol: this.getTokenSymbol(toTokenAddress),
          decimals: this.getTokenDecimals(toTokenAddress)
        },
        fromTokenAmount: amount,
        toTokenAmount: toAmount.toString(),
        estimatedGas: 210000,
        gasPrice: '20000000000',
        protocols: [
          {
            name: '1inch DEX (DEMO)',
            part: 100,
            fromTokenAddress,
            toTokenAddress
          }
        ],
        tx: {
          to: '0x111111125421cA6dc452d289314280a0f8842A65', // 1inch router
          data: '0x', // Mock transaction data
          value: fromTokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? amount : '0',
          gas: '210000',
          gasPrice: '20000000000'
        }
      };

      console.log('1inch DEMO quote response:', mockQuote);
      return mockQuote;
    } catch (error) {
      console.error('Error getting DEMO quote from 1inch:', error);
      throw new Error(`Failed to get DEMO quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSwapData(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ): Promise<OneInchSwapResponse> {
    try {
      console.log('Getting DEMO swap data from 1inch API:', { fromTokenAddress, toTokenAddress, amount, fromAddress, slippage });
      
      // For DEMO purposes, we'll simulate realistic swap data
      const fromAmount = parseFloat(amount);
      const toAmount = fromAmount * 0.95; // Simulate 5% slippage
      
      const mockSwap: OneInchSwapResponse = {
        fromToken: {
          address: fromTokenAddress,
          name: this.getTokenName(fromTokenAddress),
          symbol: this.getTokenSymbol(fromTokenAddress),
          decimals: this.getTokenDecimals(fromTokenAddress)
        },
        toToken: {
          address: toTokenAddress,
          name: this.getTokenName(toTokenAddress),
          symbol: this.getTokenSymbol(toTokenAddress),
          decimals: this.getTokenDecimals(toTokenAddress)
        },
        fromTokenAmount: amount,
        toTokenAmount: toAmount.toString(),
        estimatedGas: 210000,
        tx: {
          to: '0x111111125421cA6dc452d289314280a0f8842A65', // 1inch router
          data: '0x', // Mock transaction data
          value: fromTokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? amount : '0',
          gas: '210000',
          gasPrice: '20000000000'
        }
      };

      console.log('1inch DEMO swap data response:', mockSwap);
      return mockSwap;
    } catch (error) {
      console.error('Error getting DEMO swap data from 1inch:', error);
      throw new Error(`Failed to get DEMO swap data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getTokenName(address: string): string {
    const tokenMap: Record<string, string> = {
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 'Ethereum',
      '0x4200000000000000000000000000000000000006': 'Wrapped Ethereum',
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 'Tether USD',
      '0x948d2a81086a075b3130b43763d280ae6cd99a09': 'USD Coin',
      '0xda3b25e1f5d34c843c5ef6a7f5e2d6c9415684a0': 'OKB'
    };
    return tokenMap[address] || 'Unknown Token';
  }

  private getTokenSymbol(address: string): string {
    const tokenMap: Record<string, string> = {
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 'ETH',
      '0x4200000000000000000000000000000000000006': 'WETH',
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 'USDT',
      '0x948d2a81086a075b3130b43763d280ae6cd99a09': 'USDC',
      '0xda3b25e1f5d34c843c5ef6a7f5e2d6c9415684a0': 'OKB'
    };
    return tokenMap[address] || 'UNKNOWN';
  }

  private getTokenDecimals(address: string): number {
    const tokenMap: Record<string, number> = {
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 18,
      '0x4200000000000000000000000000000000000006': 18,
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 6,
      '0x948d2a81086a075b3130b43763d280ae6cd99a09': 6,
      '0xda3b25e1f5d34c843c5ef6a7f5e2d6c9415684a0': 18
    };
    return tokenMap[address] || 18;
  }
}

// Singleton instance
export const oneInchService = new OneInchService();
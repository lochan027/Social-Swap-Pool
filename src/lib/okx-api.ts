import { okxService } from './okx';

interface TokenInfo {
  symbol: string;
  name: string;
  address?: string;
  decimals: number;
  chainId: string;
}

interface TokenPair {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  baseToken: string;
  quoteToken: string;
}

interface PriceQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  price: string;
  estimatedGas: string;
  dexName: string;
  priceImpact: string;
  slippage: string;
  minReceived: string;
  txData?: string;
  gasPrice?: string;
}

interface TokenListResponse {
  tokens: TokenInfo[];
  pairs: TokenPair[];
}

interface OKXTokenResponse {
  data: {
    chainId: string;
    tokenContractAddress: string;
    tokenSymbol: string;
    tokenName: string;
    decimals: number;
    logoUrl: string;
  }[];
}

interface OKXQuoteResponse {
  data: {
    chainId: string;
    fromTokenAddress: string;
    toTokenAddress: string;
    fromTokenAmount: string;
    toTokenAmount: string;
    estimatedGas: string;
    gasPrice: string;
    dexContractAddress: string;
    dexName: string;
    priceImpact: string;
    slippage: string;
    minimumReceived: string;
    txData: string;
  }[];
}

class OKXAPI {
  private chainId = '196'; // XLayer chain index

  async getAvailableTokens(): Promise<TokenInfo[]> {
    try {
      console.log('Fetching available tokens from OKX...');
      const response = await okxService.getTokens(this.chainId);

      console.log('OKX token response:', response);

      const tokens: TokenInfo[] = response.map((token: any) => ({
        symbol: token.tokenSymbol,
        name: token.tokenName,
        address: token.tokenContractAddress,
        decimals: token.decimals,
        chainId: token.chainId
      }));

      console.log('Processed tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error('Error fetching tokens from OKX:', error);
      throw new Error(`Failed to fetch tokens from OKX DEX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailablePairs(): Promise<TokenPair[]> {
    try {
      const tokens = await this.getAvailableTokens();
      const pairs: TokenPair[] = [];

      // Create trading pairs with common base tokens
      const baseTokens = tokens.filter(t => ['ETH', 'USDT', 'USDC'].includes(t.symbol));
      const quoteTokens = tokens.filter(t => !['ETH', 'USDT', 'USDC'].includes(t.symbol));

      // Create pairs with base tokens as quote
      for (const base of baseTokens) {
        for (const quote of quoteTokens) {
          if (base.symbol !== quote.symbol) {
            pairs.push({
              fromToken: quote,
              toToken: base,
              baseToken: base.symbol,
              quoteToken: quote.symbol
            });
          }
        }
      }

      // Create pairs with base tokens as base
      for (const base of baseTokens) {
        for (const quote of quoteTokens) {
          if (base.symbol !== quote.symbol) {
            pairs.push({
              fromToken: base,
              toToken: quote,
              baseToken: base.symbol,
              quoteToken: quote.symbol
            });
          }
        }
      }

      return pairs;
    } catch (error) {
      console.error('Error fetching pairs:', error);
      throw new Error('Failed to fetch available pairs');
    }
  }

  async getPriceQuote(
    fromToken: string,
    toToken: string,
    amount: string,
    slippage: string = '0.5'
  ): Promise<PriceQuote> {
    try {
      console.log('Getting price quote:', { fromToken, toToken, amount, slippage });
      
      // Get token addresses first
      const tokens = await this.getAvailableTokens();
      console.log('Available tokens:', tokens);
      
      const fromTokenInfo = tokens.find(t => t.symbol === fromToken);
      const toTokenInfo = tokens.find(t => t.symbol === toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error(`Token not found: ${!fromTokenInfo ? fromToken : toToken}`);
      }

      console.log('Token info:', { fromTokenInfo, toTokenInfo });

      // Handle native ETH address properly
      const fromTokenAddress = fromTokenInfo.symbol === 'ETH' 
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' 
        : fromTokenInfo.address;
      
      const toTokenAddress = toTokenInfo.symbol === 'ETH'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : toTokenInfo.address;

      console.log('Token addresses:', { fromTokenAddress, toTokenAddress });

      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('Token address not found');
      }

      // Use a placeholder wallet address for the quote
      const walletAddress = '0x0000000000000000000000000000000000000000';
      
      const response = await okxService.getSimpleQuote(
        fromTokenAddress,
        toTokenAddress,
        amount,
        walletAddress,
        slippage,
        this.chainId
      );

      console.log('OKX API response:', response);

      if (!response) {
        throw new Error('No quote data received from OKX API');
      }

      console.log('Quote data:', response);

      // Check if we're using real data or mock data
      const isUsingRealData = response.routes && response.routes.length > 0 && 
                             response.routes[0].name !== 'Mock DEX' && 
                             response.routes[0].name !== 'OKX DEX';

      const dexName = isUsingRealData ? (response.routes[0].name || '1inch DEX') : 'Mock DEX';

      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: response.toTokenAmount || '0',
        price: this.calculatePrice(amount, response.toTokenAmount || '0'),
        estimatedGas: response.estimatedGas || '0',
        dexName: dexName,
        priceImpact: response.priceImpact || '0',
        slippage: slippage,
        minReceived: this.calculateMinReceived(amount, response.toTokenAmount || '0', slippage),
        txData: response.txData,
        gasPrice: response.gasPrice
      };
    } catch (error) {
      console.error('Error getting price quote from OKX:', error);
      throw new Error(`Failed to get price quote from OKX DEX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateMinReceived(fromAmount: string, toAmount: string, slippage: string): string {
    const to = parseFloat(toAmount);
    const slippageDecimal = parseFloat(slippage) / 100;
    return (to * (1 - slippageDecimal)).toString();
  }

  private calculatePrice(fromAmount: string, toAmount: string): string {
    const from = parseFloat(fromAmount);
    const to = parseFloat(toAmount);
    return (to / from).toString();
  }
}

export const okxAPI = new OKXAPI();
export type { TokenInfo, TokenPair, PriceQuote };
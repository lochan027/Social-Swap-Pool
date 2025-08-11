'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightLeft, RefreshCw, AlertCircle, CheckCircle, TrendingUp, DollarSign, Zap, Percent } from 'lucide-react';
import { okxAPI, TokenInfo, PriceQuote } from '@/lib/okx-api';

interface OKXQuoteInterfaceProps {
  className?: string;
}

export function OKXQuoteInterface({ className }: OKXQuoteInterfaceProps) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tokensLoading, setTokensLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setTokensLoading(true);
      const tokenList = await okxAPI.getAvailableTokens();
      setTokens(tokenList);
      
      // Set default tokens
      const ethToken = tokenList.find(t => t.symbol === 'ETH');
      const usdtToken = tokenList.find(t => t.symbol === 'USDT');
      
      if (ethToken) setFromToken(ethToken.symbol);
      if (usdtToken) setToToken(usdtToken.symbol);
    } catch (err) {
      console.error('Failed to load tokens:', err);
      setError('Failed to load available tokens');
    } finally {
      setTokensLoading(false);
    }
  };

  const getQuote = async () => {
    if (!fromToken || !toToken || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setQuote(null);

      const quoteData = await okxAPI.getPriceQuote(fromToken, toToken, amount, slippage);
      setQuote(quoteData);
    } catch (err) {
      console.error('Failed to get quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setQuote(null);
  };

  const formatAmount = (amount: string, decimals: number = 18): string => {
    try {
      const num = parseFloat(amount);
      if (isNaN(num)) return '0';
      return num.toFixed(decimals);
    } catch {
      return '0';
    }
  };

  const formatPrice = (price: string): string => {
    try {
      const num = parseFloat(price);
      if (isNaN(num)) return '0';
      return num.toFixed(6);
    } catch {
      return '0';
    }
  };

  const getTokenInfo = (symbol: string): TokenInfo | undefined => {
    return tokens.find(t => t.symbol === symbol);
  };

  if (tokensLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            OKX DEX Quote Interface
          </CardTitle>
          <CardDescription>
            Get the best quotes for token swaps on OKX DEX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          OKX DEX Quote Interface
        </CardTitle>
        <CardDescription>
          Get the best quotes for token swaps on OKX DEX Aggregator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fromToken">From Token</Label>
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select from token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-muted-foreground">({token.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toToken">To Token</Label>
            <div className="flex gap-2">
              <Select value={toToken} onValueChange={setToToken} className="flex-1">
                <SelectTrigger>
                  <SelectValue placeholder="Select to token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-muted-foreground">({token.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={swapTokens}>
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Amount and Slippage */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
            <Input
              id="slippage"
              type="number"
              placeholder="0.5"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              step="0.1"
              min="0.1"
              max="10"
            />
          </div>
        </div>

        {/* Get Quote Button */}
        <Button 
          onClick={getQuote} 
          disabled={loading || !fromToken || !toToken || !amount}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Getting Quote...
            </>
          ) : (
            'Get Quote'
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quote Results */}
        {quote && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-700">Quote Retrieved Successfully</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Quote Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span className="font-medium">
                      {formatAmount(quote.fromAmount)} {quote.fromToken}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">To</span>
                    <span className="font-medium">
                      {formatAmount(quote.toAmount)} {quote.toToken}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">
                      1 {quote.fromToken} = {formatPrice(quote.price)} {quote.toToken}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">DEX</span>
                    <Badge variant="secondary">{quote.dexName}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quote Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Est. Gas</span>
                    </div>
                    <span className="font-medium">{quote.estimatedGas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Price Impact</span>
                    </div>
                    <span className="font-medium">{quote.priceImpact}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Slippage</span>
                    </div>
                    <span className="font-medium">{quote.slippage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Min Received</span>
                    </div>
                    <span className="font-medium">
                      {formatAmount(quote.minReceived)} {quote.toToken}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> This quote is provided by OKX DEX Aggregator and may change based on market conditions. 
                Always verify the final rate before executing the swap.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
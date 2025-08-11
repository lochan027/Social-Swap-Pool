'use client';

import { useState, useEffect, useCallback } from 'react';
import { okxAPI, TokenInfo, TokenPair, PriceQuote } from '@/lib/okx-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { 
  Search, 
  ArrowRightLeft, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  Check,
  X,
  RefreshCw
} from 'lucide-react';

interface TokenPairSelectorProps {
  onPairSelected: (fromToken: string, toToken: string, amount: string, minReceived: string, quoteData?: any) => void;
  disabled?: boolean;
}

export function TokenPairSelector({ onPairSelected, disabled = false }: TokenPairSelectorProps) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [pairs, setPairs] = useState<TokenPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [amount, setAmount] = useState('');
  const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);
  const [showTokenSelector, setShowTokenSelector] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tokens.filter(token =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokens);
    }
  }, [searchQuery, tokens]);

  const loadData = async () => {
    console.log('TokenPairSelector: loadData called');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('TokenPairSelector: Calling okxAPI.getAvailableTokens and okxAPI.getAvailablePairs...');
      const [tokenList, pairList] = await Promise.all([
        okxAPI.getAvailableTokens(),
        okxAPI.getAvailablePairs()
      ]);
      
      console.log('TokenPairSelector: Data loaded:', { tokenList: tokenList.length, pairList: pairList.length });
      setTokens(tokenList);
      setPairs(pairList);
      setFilteredTokens(tokenList);
    } catch (err: any) {
      console.error('TokenPairSelector: Error loading data:', err);
      setError(err.message || 'Failed to load token data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceQuote = useCallback(async (fromToken: string, toToken: string, amount: string) => {
    console.log('getPriceQuote called:', { fromToken, toToken, amount });
    
    if (!amount || parseFloat(amount) <= 0) {
      console.log('Invalid amount, clearing price quote');
      setPriceQuote(null);
      return;
    }

    setIsQuoting(true);
    setError(null);

    try {
      console.log('Calling okxAPI.getPriceQuote...');
      const quote = await okxAPI.getPriceQuote(fromToken, toToken, amount);
      console.log('Price quote received:', quote);
      setPriceQuote(quote);
    } catch (err: any) {
      console.error('Error getting price quote:', err);
      setError(err.message || 'Failed to get price quote');
      setPriceQuote(null);
    } finally {
      setIsQuoting(false);
    }
  }, []);

  const handleTokenSelect = (token: TokenInfo, type: 'from' | 'to') => {
    if (type === 'from') {
      const newPair = selectedPair 
        ? { ...selectedPair, fromToken: token }
        : { fromToken: token, toToken: tokens.find(t => t.symbol === 'USDT') || tokens[1], baseToken: token.symbol, quoteToken: 'USDT' };
      setSelectedPair(newPair);
      if (newPair.toToken && amount) {
        getPriceQuote(token.symbol, newPair.toToken.symbol, amount);
      }
    } else {
      const newPair = selectedPair 
        ? { ...selectedPair, toToken: token }
        : { fromToken: tokens.find(t => t.symbol === 'ETH') || tokens[0], toToken: token, baseToken: 'ETH', quoteToken: token.symbol };
      setSelectedPair(newPair);
      if (newPair.fromToken && amount) {
        getPriceQuote(newPair.fromToken.symbol, token.symbol, amount);
      }
    }
    setShowTokenSelector(null);
    setSearchQuery('');
  };

  const handleAmountChange = (value: string) => {
    console.log('handleAmountChange called:', { value, selectedPair: !!selectedPair });
    setAmount(value);
    if (selectedPair && selectedPair.fromToken && selectedPair.toToken && value) {
      console.log('Calling getPriceQuote from handleAmountChange...');
      getPriceQuote(selectedPair.fromToken.symbol, selectedPair.toToken.symbol, value);
    }
  };

  const handleSwapTokens = () => {
    if (selectedPair) {
      const newPair = {
        ...selectedPair,
        fromToken: selectedPair.toToken,
        toToken: selectedPair.fromToken,
        baseToken: selectedPair.quoteToken,
        quoteToken: selectedPair.baseToken
      };
      setSelectedPair(newPair);
      setAmount('');
      setPriceQuote(null);
    }
  };

  const handleSubmit = () => {
    if (selectedPair && amount && priceQuote) {
      onPairSelected(
        selectedPair.fromToken.symbol,
        selectedPair.toToken.symbol,
        amount,
        priceQuote.minReceived,
        priceQuote
      );
    }
  };

  const canSubmit = selectedPair && amount && parseFloat(amount) > 0 && priceQuote && !isQuoting && !disabled;

  // Debug logging
  console.log('TokenPairSelector state:', {
    selectedPair: !!selectedPair,
    amount,
    amountValid: amount && parseFloat(amount) > 0,
    priceQuote: !!priceQuote,
    isQuoting,
    disabled,
    canSubmit
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (error && !selectedPair) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" onClick={loadData} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Select Token Pair
          </CardTitle>
          <CardDescription>
            Choose the tokens you want to swap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <Label>From</Label>
            <div 
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setShowTokenSelector('from')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {selectedPair?.fromToken?.symbol.slice(0, 2) || '??'}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {selectedPair?.fromToken?.symbol || 'Select token'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPair?.fromToken?.name || 'Click to select'}
                  </div>
                </div>
              </div>
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              disabled={!selectedPair}
              className="rounded-full"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label>To</Label>
            <div 
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setShowTokenSelector('to')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {selectedPair?.toToken?.symbol.slice(0, 2) || '??'}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {selectedPair?.toToken?.symbol || 'Select token'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPair?.toToken?.name || 'Click to select'}
                  </div>
                </div>
              </div>
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount Input */}
      {selectedPair && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to swap</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0"
                disabled={isQuoting}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Quote */}
      {priceQuote && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Price Quote
            </CardTitle>
            <CardDescription>
              Current market price and estimated output
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Amount Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">You Send</div>
                <div className="text-xl font-bold text-blue-800">{priceQuote.fromAmount} {priceQuote.fromToken}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">You Receive</div>
                <div className="text-xl font-bold text-green-800">{priceQuote.toAmount} {priceQuote.toToken}</div>
                <div className="text-xs text-green-600 mt-1">
                  Minimum: {priceQuote.minReceived} {priceQuote.toToken}
                </div>
              </div>
            </div>
            
            {/* Exchange Rate */}
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Exchange Rate</div>
              <div className="text-lg font-semibold">
                1 {priceQuote.fromToken} = {priceQuote.price} {priceQuote.toToken}
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price Impact</span>
                  <Badge variant={parseFloat(priceQuote.priceImpact) > 1 ? "destructive" : "secondary"}>
                    {priceQuote.priceImpact}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Slippage</span>
                  <span className="text-sm font-medium">{priceQuote.slippage}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Gas</span>
                  <span className="text-sm font-medium">{priceQuote.estimatedGas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DEX</span>
                  <Badge variant="outline">{priceQuote.dexName}</Badge>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit Button - Always show when tokens are selected */}
      {selectedPair && (
        <Card className="border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Button 
                onClick={handleSubmit} 
                disabled={!canSubmit}
                className="w-full"
                size="lg"
              >
                {isQuoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Quote...
                  </>
                ) : !amount || parseFloat(amount) <= 0 ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Enter Amount
                  </>
                ) : !priceQuote ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Waiting for Quote
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create Swap Proposal
                  </>
                )}
              </Button>
              
              {!canSubmit && selectedPair && amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Waiting for price quote...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Select Token</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleTokenSelect(token, showTokenSelector)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.decimals} decimals
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowTokenSelector(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
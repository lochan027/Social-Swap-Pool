'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSwapAPI } from '@/hooks/use-swap-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Percent,
  Clock,
  Copy,
  Share2,
  Loader2
} from 'lucide-react';

interface SwapProposalProps {
  onProposalCreated?: (proposal: any) => void;
  className?: string;
}

export function SwapProposal({ onProposalCreated, className }: SwapProposalProps) {
  const {
    tokens,
    tokensLoading,
    tokensError,
    loadTokens,
    quote,
    quoteLoading,
    quoteError,
    getQuote,
    proposal,
    proposalLoading,
    proposalError,
    createProposal,
    clearQuote,
    clearProposal
  } = useSwapAPI();

  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [includeTokens, setIncludeTokens] = useState<boolean>(true);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  useEffect(() => {
    // Set default tokens when tokens are loaded
    if (tokens.length > 0 && !fromToken) {
      const ethToken = tokens.find(t => t.symbol === 'ETH');
      const usdtToken = tokens.find(t => t.symbol === 'USDT');
      if (ethToken) setFromToken(ethToken.symbol);
      if (usdtToken) setToToken(usdtToken.symbol);
    }
  }, [tokens, fromToken, toToken]);

  const handleGetQuote = useCallback(async () => {
    if (fromToken && toToken && amount) {
      await getQuote(fromToken, toToken, amount, slippage);
    }
  }, [fromToken, toToken, amount, slippage, getQuote]);

  const handleCreateProposal = useCallback(async () => {
    if (fromToken && toToken && amount) {
      await createProposal(fromToken, toToken, amount, slippage, includeTokens);
      if (onProposalCreated) {
        onProposalCreated({ fromToken, toToken, amount, slippage });
      }
    }
  }, [fromToken, toToken, amount, slippage, includeTokens, createProposal, onProposalCreated]);

  const swapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    clearQuote();
    clearProposal();
  }, [fromToken, toToken, clearQuote, clearProposal]);

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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const canGetQuote = fromToken && toToken && amount && parseFloat(amount) > 0;
  const canCreateProposal = canGetQuote && quote && !quoteLoading;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Swap Proposal
          </CardTitle>
          <CardDescription>
            Create a swap proposal with real-time pricing from OKX DEX Aggregator
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tokensLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : tokensError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tokensError}</AlertDescription>
              <Button variant="outline" size="sm" onClick={loadTokens} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </Alert>
          ) : (
            <>
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
                    min="0"
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTokens"
                  checked={includeTokens}
                  onChange={(e) => setIncludeTokens(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="includeTokens" className="text-sm">
                  Include token list in proposal
                </Label>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Get Quote Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleGetQuote} 
            disabled={!canGetQuote || quoteLoading}
            className="w-full"
            size="lg"
          >
            {quoteLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Quote...
              </>
            ) : (
              'Get Price Quote'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quote Results */}
      {quote && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Price Quote Received
            </CardTitle>
            <CardDescription>
              Current market price and estimated output from OKX DEX Aggregator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Quote Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">You Send</div>
                <div className="text-xl font-bold text-blue-800">{formatAmount(quote.fromAmount)} {quote.fromToken}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">You Receive</div>
                <div className="text-xl font-bold text-green-800">{formatAmount(quote.toAmount)} {quote.toToken}</div>
                <div className="text-xs text-green-600 mt-1">
                  Minimum: {formatAmount(quote.minReceived)} {quote.toToken}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quote Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">
                    1 {quote.fromToken} = {formatPrice(quote.price)} {quote.toToken}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Price Impact</span>
                  </div>
                  <Badge variant={parseFloat(quote.priceImpact) > 1 ? "destructive" : "secondary"}>
                    {quote.priceImpact}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Slippage</span>
                  </div>
                  <span className="font-medium">{quote.slippage}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Est. Gas</span>
                  </div>
                  <span className="font-medium">{quote.estimatedGas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">DEX</span>
                  <Badge variant="outline">{quote.dexName}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Quote Time</span>
                  </div>
                  <span className="font-medium text-xs">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {quoteError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{quoteError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Proposal Button */}
      {quote && (
        <Card className="border-2 border-blue-200">
          <CardContent className="pt-6">
            <Button 
              onClick={handleCreateProposal} 
              disabled={!canCreateProposal || proposalLoading}
              className="w-full"
              size="lg"
            >
              {proposalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Proposal...
                </>
              ) : (
                'Create Swap Proposal'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Proposal Results */}
      {proposal && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <CheckCircle className="h-5 w-5" />
              Swap Proposal Created
            </CardTitle>
            <CardDescription>
              Your swap proposal has been created with the following details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Proposal ID</div>
                <div className="font-mono text-sm bg-muted p-2 rounded">
                  {proposal.id}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(proposal.id || '')}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Valid Until</div>
                <div className="font-medium">
                  {proposal.validUntil ? new Date(proposal.validUntil).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={proposal.status === 'quote_received' ? 'default' : 'secondary'}>
                  {proposal.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Network</div>
                <Badge variant="outline">{proposal.network} (Chain ID: {proposal.chainId})</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Proposal
              </Button>
              <Button variant="outline" size="sm" onClick={clearProposal}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            {proposalError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{proposalError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {tokensError && !tokensLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{tokensError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
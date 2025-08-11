'use client';

import { useState, useCallback } from 'react';

interface TokenInfo {
  symbol: string;
  name: string;
  address?: string;
  decimals: number;
  chainId: string;
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

interface SwapProposal {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: string;
  timestamp: string;
  network: string;
  chainId: string;
  quote?: PriceQuote;
  status: string;
  validUntil?: string;
  id?: string;
}

interface UseSwapAPIReturn {
  // Tokens
  tokens: TokenInfo[];
  tokensLoading: boolean;
  tokensError: string | null;
  loadTokens: () => Promise<void>;
  
  // Quotes
  quote: PriceQuote | null;
  quoteLoading: boolean;
  quoteError: string | null;
  getQuote: (fromToken: string, toToken: string, amount: string, slippage?: string) => Promise<void>;
  
  // Proposals
  proposal: SwapProposal | null;
  proposalLoading: boolean;
  proposalError: string | null;
  createProposal: (fromToken: string, toToken: string, amount: string, slippage?: string, includeTokens?: boolean) => Promise<void>;
  getProposalTemplate: () => Promise<any>;
  
  // Utility
  clearQuote: () => void;
  clearProposal: () => void;
}

export function useSwapAPI(): UseSwapAPIReturn {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [tokensError, setTokensError] = useState<string | null>(null);
  
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  
  const [proposal, setProposal] = useState<SwapProposal | null>(null);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  // Load available tokens
  const loadTokens = useCallback(async () => {
    try {
      setTokensLoading(true);
      setTokensError(null);
      
      const response = await fetch('/api/swap/tokens');
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load tokens');
      }
      
      setTokens(data.tokens);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTokensError(errorMessage);
      console.error('Error loading tokens:', error);
    } finally {
      setTokensLoading(false);
    }
  }, []);

  // Get price quote
  const getQuote = useCallback(async (fromToken: string, toToken: string, amount: string, slippage: string = '0.5') => {
    try {
      setQuoteLoading(true);
      setQuoteError(null);
      
      const response = await fetch('/api/swap/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount,
          slippage
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get quote');
      }
      
      setQuote(data.quote);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setQuoteError(errorMessage);
      console.error('Error getting quote:', error);
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  // Create swap proposal
  const createProposal = useCallback(async (
    fromToken: string, 
    toToken: string, 
    amount: string, 
    slippage: string = '0.5',
    includeTokens: boolean = true
  ) => {
    try {
      setProposalLoading(true);
      setProposalError(null);
      
      const response = await fetch('/api/swap/proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount,
          slippage,
          includeTokens
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create proposal');
      }
      
      setProposal(data.proposal);
      
      // Also update tokens if included in response
      if (data.tokens) {
        setTokens(data.tokens);
      }
      
      // Also update quote if included
      if (data.proposal?.quote) {
        setQuote(data.proposal.quote);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setProposalError(errorMessage);
      console.error('Error creating proposal:', error);
    } finally {
      setProposalLoading(false);
    }
  }, []);

  // Get proposal template
  const getProposalTemplate = useCallback(async () => {
    try {
      const response = await fetch('/api/swap/proposal');
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get proposal template');
      }
      
      // Update tokens from template
      if (data.tokens) {
        setTokens(data.tokens);
      }
      
      return data.template;
    } catch (error) {
      console.error('Error getting proposal template:', error);
      throw error;
    }
  }, []);

  // Clear quote
  const clearQuote = useCallback(() => {
    setQuote(null);
    setQuoteError(null);
  }, []);

  // Clear proposal
  const clearProposal = useCallback(() => {
    setProposal(null);
    setProposalError(null);
  }, []);

  return {
    // Tokens
    tokens,
    tokensLoading,
    tokensError,
    loadTokens,
    
    // Quotes
    quote,
    quoteLoading,
    quoteError,
    getQuote,
    
    // Proposals
    proposal,
    proposalLoading,
    proposalError,
    createProposal,
    getProposalTemplate,
    
    // Utility
    clearQuote,
    clearProposal
  };
}
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { xlayerService, XLAYER_CONFIG } from '@/lib/xlayer';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string;
  chainId: number | null;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask or other wallet is available
  const checkWalletAvailability = (): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect wallet
  const connect = async () => {
    if (!checkWalletAvailability()) {
      setError('Please install MetaMask or another Web3 wallet. For the best experience, we recommend using OKX Wallet.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const selectedAddress = accounts[0];
      setAddress(selectedAddress);

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setChainId(Number(network.chainId));

      // Check if connected to correct network
      if (Number(network.chainId) !== XLAYER_CONFIG.chainId) {
        try {
          // Try to switch to XLayer network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.toBeHex(XLAYER_CONFIG.chainId) }],
          });
          
          // Successfully switched, update chainId
          setChainId(XLAYER_CONFIG.chainId);
        } catch (switchError: any) {
          // If the network is not added, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: ethers.toBeHex(XLAYER_CONFIG.chainId),
                    chainName: XLAYER_CONFIG.chainName,
                    rpcUrls: XLAYER_CONFIG.rpcUrls,
                    nativeCurrency: XLAYER_CONFIG.nativeCurrency,
                    blockExplorerUrls: XLAYER_CONFIG.blockExplorerUrls,
                  },
                ],
              });
              
              // Successfully added and switched
              setChainId(XLAYER_CONFIG.chainId);
            } catch (addError) {
              throw new Error('Failed to add XLayer network. Please add it manually.');
            }
          } else {
            throw new Error('Failed to switch to XLayer network. Please switch manually.');
          }
        }
      }

      // Get balance
      const balance = await provider.getBalance(selectedAddress);
      setBalance(ethers.formatEther(balance));

      setIsConnected(true);

      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
    setChainId(null);
    setError(null);

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      // Update balance
      updateBalance(accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId: string) => {
    const newChainId = Number(chainId);
    setChainId(newChainId);
    
    // Check if the new chain is XLayer
    if (newChainId !== XLAYER_CONFIG.chainId) {
      setError(`Please switch to XLayer network (Chain ID: ${XLAYER_CONFIG.chainId})`);
    } else {
      setError(null);
    }
    
    // Update balance
    if (address) {
      updateBalance(address);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
  };

  // Update balance
  const updateBalance = async (walletAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const value: WalletContextType = {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    balance,
    chainId,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
'use client';

import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function WalletConnect() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    balance, 
    chainId, 
    error 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    return `${parseFloat(bal).toFixed(4)} ETH`;
  };

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-blue-600 dark:text-blue-400">Troubleshooting tips:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Make sure OKX Wallet or MetaMask is installed</li>
              <li>• Ensure you're on the correct network (XLayer)</li>
              <li>• Check your wallet connection</li>
              <li>• Refresh the page and try again</li>
            </ul>
          </div>
          <Button onClick={connect} variant="outline" className="w-full mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            <div className="space-y-2">
              <p>Connect your wallet to start using Social Swap Pool</p>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <span className="font-medium">Recommended:</span>
                <span>OKX Wallet for best XLayer experience</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Wallet Connected
        </CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p>Your wallet is connected to XLayer network</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Address:</span>
          <Badge variant="secondary">{formatAddress(address!)}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Balance:</span>
          <Badge variant="outline">{formatBalance(balance)}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network:</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">XLayer (Chain ID: {chainId})</Badge>
          </div>
        </div>
        
        <Button 
          onClick={disconnect} 
          variant="outline" 
          className="w-full"
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
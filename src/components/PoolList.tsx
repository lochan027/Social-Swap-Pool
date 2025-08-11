'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Clock, DollarSign, Search, AlertCircle, Plus } from 'lucide-react';

interface Pool {
  id: string;
  name: string;
  description?: string;
  multisigAddress: string;
  creatorId: string;
  createdAt: string;
  memberCount: number;
  totalValue?: string;
  pendingSwaps?: number;
}

interface PoolListProps {
  onSelectPool: (poolId: string) => void;
  onSwitchToDashboard: () => void;
}

export function PoolList({ onSelectPool, onSwitchToDashboard }: PoolListProps) {
  const { address } = useWallet();
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPools();
  }, [address]);

  const fetchPools = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pools?userAddress=${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }
      
      const data = await response.json();
      setPools(data.pools || []);
    } catch (err: any) {
      console.error('Error fetching pools:', err);
      setError(err.message || 'Failed to fetch pools');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPools = pools.filter(pool =>
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Pools</h2>
          <p className="text-muted-foreground">
            Pools you're a member of
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPools.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pools found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No pools match your search.' : 'You haven\'t joined any pools yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPools.map((pool) => (
            <Card 
              key={pool.id} 
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{pool.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {pool.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{pool.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{formatDate(pool.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{pool.totalValue || '$0.00'}</span>
                  </div>
                  {pool.pendingSwaps && pool.pendingSwaps > 0 && (
                    <Badge variant="secondary" className="flex-shrink-0">
                      {pool.pendingSwaps} pending
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Multisig: {formatAddress(pool.multisigAddress)}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPool(pool.id);
                    onSwitchToDashboard();
                  }}
                >
                  View Pool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
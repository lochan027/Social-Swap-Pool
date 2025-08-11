'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddMember } from '@/components/AddMember';
import { JoinPool } from '@/components/JoinPool';
import { StatsCard } from '@/components/StatsCard';
import { TokenPairSelector } from '@/components/TokenPairSelector';

import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Plus, 
  Vote, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface Pool {
  id: string;
  name: string;
  description?: string;
  multisigAddress: string;
  creatorId: string;
  visibility: string;
  joinCode?: string;
  createdAt: string;
  memberCount: number;
  totalValue?: string;
  pendingSwaps?: number;
}

interface Member {
  id: string;
  walletAddress: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
}

interface Token {
  id: string;
  symbol: string;
  address?: string;
  decimals: number;
  balance: string;
  updatedAt: string;
}

interface SwapProposal {
  id: string;
  fromToken: string;
  toToken: string;
  amount: string;
  minReceived: string;
  status: string;
  createdAt: string;
  proposer: {
    walletAddress: string;
  };
  votes: Vote[];
  transaction?: {
    status: string;
    txHash?: string;
    errorMessage?: string;
  };
}

interface Vote {
  id: string;
  vote: string;
  createdAt: string;
  user: {
    walletAddress: string;
  };
}

interface PoolDashboardProps {
  poolId: string;
  onBack: () => void;
}

export function PoolDashboard({ poolId, onBack }: PoolDashboardProps) {
  const { address } = useWallet();
  const [pool, setPool] = useState<Pool | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [proposals, setProposals] = useState<SwapProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    fetchPoolData();
  }, [poolId, address]);

  const fetchPoolData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [poolRes, membersRes, tokensRes, proposalsRes] = await Promise.all([
        fetch(`/api/pools/${poolId}`),
        fetch(`/api/pools/${poolId}/members`),
        fetch(`/api/pools/${poolId}/tokens`),
        fetch(`/api/pools/${poolId}/proposals`)
      ]);

      if (!poolRes.ok) throw new Error('Failed to fetch pool');
      if (!membersRes.ok) throw new Error('Failed to fetch members');
      if (!tokensRes.ok) throw new Error('Failed to fetch tokens');
      if (!proposalsRes.ok) throw new Error('Failed to fetch proposals');

      const [poolData, membersData, tokensData, proposalsData] = await Promise.all([
        poolRes.json(),
        membersRes.json(),
        tokensRes.json(),
        proposalsRes.json()
      ]);

      setPool(poolData);
      setMembers(membersData.members || []);
      setTokens(tokensData.tokens || []);
      setProposals(proposalsData.proposals || []);
    } catch (err: any) {
      console.error('Error fetching pool data:', err);
      setError(err.message || 'Failed to fetch pool data');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXECUTED': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      case 'EXECUTED': return <CheckCircle className="h-4 w-4" />;
      case 'FAILED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deletePool = async () => {
    if (!address) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/pools/${poolId}?userAddress=${address}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete pool');
      }

      const result = await response.json();
      setShowDeleteConfirm(false);
      onBack(); // Go back to pool list
    } catch (err: any) {
      console.error('Error deleting pool:', err);
      setActionError(err.message || 'Failed to delete pool');
    } finally {
      setIsDeleting(false);
    }
  };

  const leavePool = async () => {
    if (!address) return;

    setIsLeaving(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/pools/${poolId}/members?userAddress=${address}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave pool');
      }

      const result = await response.json();
      setShowLeaveConfirm(false);
      onBack(); // Go back to pool list
    } catch (err: any) {
      console.error('Error leaving pool:', err);
      setActionError(err.message || 'Failed to leave pool');
    } finally {
      setIsLeaving(false);
    }
  };

  const isCreator = pool && pool.creatorId === address;
  const isOnlyMember = members.length === 1;
  const canDeletePool = isCreator && isOnlyMember;
  const canLeavePool = !isCreator || (isCreator && isOnlyMember);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Pool not found'}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pools
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Error Alert */}
      {actionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{pool.name}</h1>
              <Badge variant={pool.visibility === 'PRIVATE' ? 'secondary' : 'default'}>
                {pool.visibility === 'PRIVATE' ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {pool.description || 'No description provided'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pool.visibility === 'PRIVATE' && pool.joinCode && (
            <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              Code: {pool.joinCode}
            </div>
          )}
          
          {/* Action Buttons */}
          {canDeletePool && (
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Pool
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Pool</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{pool.name}"? This action cannot be undone.
                    The pool will be permanently deleted along with all its data.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={deletePool}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Pool'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {canLeavePool && !canDeletePool && (
            <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Pool
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave Pool</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to leave "{pool.name}"? 
                    {isCreator && members.length > 1 && (
                      <span className="text-red-600 block mt-2">
                        Warning: As the creator, you cannot leave while other members are present. 
                        You must delete the pool instead.
                      </span>
                    )}
                    {!isCreator && (
                      <span className="block mt-2">
                        You will no longer be able to participate in this pool's decisions.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowLeaveConfirm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={leavePool}
                    disabled={isLeaving}
                  >
                    {isLeaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Leaving...
                      </>
                    ) : (
                      'Leave Pool'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <AddMember 
            poolId={poolId} 
            isCreator={pool.creatorId === address} 
            onMemberAdded={fetchPoolData}
          />
          <JoinPool 
            poolId={poolId} 
            visibility={pool.visibility}
            onPoolJoined={fetchPoolData}
          />
          <Dialog open={showNewProposal} onOpenChange={setShowNewProposal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Swap Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Swap Proposal</DialogTitle>
                <DialogDescription>
                  Propose a token swap for the pool
                </DialogDescription>
              </DialogHeader>
              <NewProposalForm 
                poolId={poolId}
                onSuccess={() => {
                  setShowNewProposal(false);
                  fetchPoolData();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Value"
          value={pool.totalValue || '$0.00'}
          description="Pool value"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="+0%"
        />
        <StatsCard
          title="Members"
          value={pool.memberCount}
          description="Participants"
          icon={Users}
          color="blue"
          trend={members.length > 1 ? "up" : "neutral"}
          trendValue={members.length > 1 ? "Growing" : "Stable"}
        />
        <StatsCard
          title="Pending Swaps"
          value={pool.pendingSwaps || 0}
          description="Proposals"
          icon={Clock}
          color="purple"
          trend={pool.pendingSwaps && pool.pendingSwaps > 0 ? "up" : "neutral"}
          trendValue={pool.pendingSwaps && pool.pendingSwaps > 0 ? "Active" : "None"}
        />
        <StatsCard
          title="Multisig"
          value={formatAddress(pool.multisigAddress)}
          description="Wallet address"
          icon={Copy}
          color="orange"
          trend="neutral"
          trendValue="Active"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tokens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pool Tokens
              </CardTitle>
              <CardDescription>
                Tokens in the pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tokens.length === 0 ? (
                <p className="text-muted-foreground">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.address ? formatAddress(token.address) : 'Native'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.balance}</div>
                        <div className="text-sm text-muted-foreground">
                          Updated {formatDate(token.updatedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pool Members
              </CardTitle>
              <CardDescription>
                Members of the pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-muted-foreground">No members found</p>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{formatAddress(member.walletAddress)}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {formatDate(member.joinedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === 'CREATOR' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                        {member.isActive ? (
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Swap Proposals
              </CardTitle>
              <CardDescription>
                Token swap proposals in the pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <p className="text-muted-foreground">No proposals found</p>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(proposal.status)}
                          <span className="font-medium">
                            Swap {proposal.amount} {proposal.fromToken} → {proposal.toToken}
                          </span>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        <div>Proposed by {formatAddress(proposal.proposer.walletAddress)}</div>
                        <div>Created {formatDate(proposal.createdAt)}</div>
                        <div>Minimum received: {proposal.minReceived} {proposal.toToken}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Vote className="h-4 w-4" />
                          <span className="text-sm">
                            {proposal.votes.length} votes ({proposal.votes.filter(v => v.vote === 'FOR').length} for, {proposal.votes.filter(v => v.vote === 'AGAINST').length} against)
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NewProposalFormProps {
  poolId: string;
  onSuccess: () => void;
}

function NewProposalForm({ poolId, onSuccess }: NewProposalFormProps) {
  const { address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePairSelected = async (fromToken: string, toToken: string, amount: string, minReceived: string, quoteData?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pools/${poolId}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount,
          minReceived,
          proposerAddress: address,
          quoteData: quoteData // Include the full quote data for execution
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create proposal');
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setError(err.message || 'Failed to create proposal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TokenPairSelector 
        onPairSelected={handlePairSelected}
        disabled={isLoading}
      />
    </div>
  );
}
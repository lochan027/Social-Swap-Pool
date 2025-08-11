'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { LogIn, AlertCircle, Shield } from 'lucide-react';

interface JoinPoolProps {
  poolId: string;
  visibility: string;
  onPoolJoined: () => void;
}

export function JoinPool({ poolId, visibility, onPoolJoined }: JoinPoolProps) {
  const { address } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/pools/${poolId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          joinCode: visibility === 'PRIVATE' ? joinCode : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join pool');
      }

      setSuccess('Successfully joined the pool!');
      setJoinCode('');
      
      setTimeout(() => {
        setIsOpen(false);
        onPoolJoined();
      }, 1500);

    } catch (err: any) {
      console.error('Error joining pool:', err);
      setError(err.message || 'Failed to join pool');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Join Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Join Pool
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <div>
                {visibility === 'PRIVATE' 
                  ? 'This is a private pool. Please enter the join code to join.'
                  : 'This is a public pool. You can join without a join code.'
                }
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {visibility === 'PRIVATE' && (
            <div className="space-y-2">
              <Label htmlFor="joinCode">Join Code</Label>
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter join code..."
                required
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || (visibility === 'PRIVATE' && !joinCode)}
              className="flex-1"
            >
              {isLoading ? 'Joining...' : 'Join Pool'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
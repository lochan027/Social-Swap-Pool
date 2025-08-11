'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { UserPlus, AlertCircle, Shield } from 'lucide-react';

interface AddMemberProps {
  poolId: string;
  isCreator: boolean;
  onMemberAdded: () => void;
}

export function AddMember({ poolId, isCreator, onMemberAdded }: AddMemberProps) {
  const { address } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [memberAddress, setMemberAddress] = useState('');
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
          userAddress: memberAddress,
          joinCode: joinCode || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add member');
      }

      setSuccess('Member added successfully!');
      setMemberAddress('');
      setJoinCode('');
      
      setTimeout(() => {
        setIsOpen(false);
        onMemberAdded();
      }, 1500);

    } catch (err: any) {
      console.error('Error adding member:', err);
      setError(err.message || 'Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCreator) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add Member
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <div>
                Add a new member to the pool. For private pools, you may need to provide a join code.
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

          <div className="space-y-2">
            <Label htmlFor="memberAddress">Member Address</Label>
            <Input
              id="memberAddress"
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinCode">Join Code (if private pool)</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter join code..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !memberAddress}
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Member'}
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
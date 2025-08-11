'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { xlayerService } from '@/lib/xlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { Loader2, Users, Plus, AlertCircle, Shield } from 'lucide-react';

interface CreatePoolProps {
  onSuccess?: (poolId: string) => void;
}

export function CreatePool({ onSuccess }: CreatePoolProps) {
  const { address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredSignatures: 2,
    initialMembers: [address || ''],
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    joinCode: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.initialMembers];
    newMembers[index] = value;
    setFormData(prev => ({
      ...prev,
      initialMembers: newMembers
    }));
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      initialMembers: [...prev.initialMembers, '']
    }));
  };

  const removeMember = (index: number) => {
    const newMembers = formData.initialMembers.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      initialMembers: newMembers
    }));
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.name.trim()) {
      return { isValid: false, error: 'Pool name is required' };
    }

    if (formData.name.length < 3) {
      return { isValid: false, error: 'Pool name must be at least 3 characters' };
    }

    if (formData.requiredSignatures < 1) {
      return { isValid: false, error: 'At least 1 signature is required' };
    }

    if (formData.requiredSignatures > formData.initialMembers.length) {
      return { isValid: false, error: 'Required signatures cannot exceed number of members' };
    }

    const validMembers = formData.initialMembers.filter(member => 
      member && /^0x[a-fA-F0-9]{40}$/.test(member)
    );

    if (validMembers.length < formData.requiredSignatures) {
      return { isValid: false, error: 'Not enough valid members for required signatures' };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty member addresses
      const validMembers = formData.initialMembers.filter(member => 
        member && /^0x[a-fA-F0-9]{40}$/.test(member)
      );

      // Generate join code for private pools if not provided
      let joinCode = formData.joinCode;
      if (formData.visibility === 'PRIVATE' && !joinCode) {
        joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      // Create multisig wallet address
      const multisigAddress = await xlayerService.createMultisigWallet(
        validMembers,
        formData.requiredSignatures
      );

      // Create pool via API
      const response = await fetch('/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          multisigAddress,
          creatorAddress: address,
          members: validMembers,
          requiredSignatures: formData.requiredSignatures,
          visibility: formData.visibility,
          joinCode: joinCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create pool');
      }

      const pool = await response.json();
      let successMessage = `Pool "${formData.name}" created successfully!`;
      if (formData.visibility === 'PRIVATE' && joinCode) {
        successMessage += `\nJoin Code: ${joinCode}`;
      }
      setSuccess(successMessage);
      
      // Call onSuccess after a short delay if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(pool.id);
        }, 1500);
      }

    } catch (err: any) {
      console.error('Error creating pool:', err);
      setError(err.message || 'Failed to create pool');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Pool
          </CardTitle>
          <CardDescription>
            <p>Create a multisig wallet pool for collective token swapping</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="name">Pool Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="My Trading Pool"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the purpose of this pool..."
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredSignatures">Required Signatures</Label>
              <Input
                id="requiredSignatures"
                type="number"
                min="1"
                value={formData.requiredSignatures}
                onChange={(e) => handleInputChange('requiredSignatures', parseInt(e.target.value) || 1)}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Number of members required to approve a transaction
              </p>
            </div>

            <div className="space-y-2">
              <Label>Pool Visibility</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={formData.visibility === 'PUBLIC'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    disabled={isLoading}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Public</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={formData.visibility === 'PRIVATE'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    disabled={isLoading}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Private</span>
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.visibility === 'PUBLIC' 
                  ? 'Anyone can join this pool' 
                  : 'Only invited members can join this pool'
                }
              </p>
            </div>

            {formData.visibility === 'PRIVATE' && (
              <div className="space-y-2">
                <Label htmlFor="joinCode">Join Code (Optional)</Label>
                <Input
                  id="joinCode"
                  value={formData.joinCode}
                  onChange={(e) => handleInputChange('joinCode', e.target.value)}
                  placeholder="Enter a join code for private pool"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Members will need this code to join the private pool. Leave empty to generate automatically.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Initial Members</Label>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formData.initialMembers.filter(m => m).length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {formData.initialMembers.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      placeholder="0x..."
                      disabled={isLoading}
                    />
                    {formData.initialMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMember(index)}
                        disabled={isLoading}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMember}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Pool...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Pool
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pool = await db.pool.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          where: { isActive: true },
          include: {
            user: true,
          },
        },
        _count: {
          select: { 
            members: true,
            swapProposals: {
              where: { status: 'PENDING' },
            },
          },
        },
        tokens: true,
      },
    });

    if (!pool) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 });
    }

    const totalValue = calculateTotalValue(pool.tokens);

    return NextResponse.json({
      id: pool.id,
      name: pool.name,
      description: pool.description,
      multisigAddress: pool.multisigAddress,
      creatorId: pool.creatorId,
      visibility: pool.visibility,
      joinCode: pool.joinCode,
      createdAt: pool.createdAt,
      memberCount: pool._count.members,
      totalValue,
      pendingSwaps: pool._count.swapProposals,
    });

  } catch (error) {
    console.error('Error fetching pool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 });
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { walletAddress: userAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the pool with member count
    const pool = await db.pool.findUnique({
      where: { id },
      include: {
        members: {
          where: { isActive: true },
        },
      },
    });

    if (!pool) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 });
    }

    // Check if user is the creator
    if (pool.creatorId !== user.id) {
      return NextResponse.json({ error: 'Only pool creator can delete the pool' }, { status: 403 });
    }

    // Check if user is the only member
    if (pool.members.length !== 1) {
      return NextResponse.json({ 
        error: 'Pool can only be deleted when you are the only member' 
      }, { status: 400 });
    }

    // Delete pool members first (due to foreign key constraint)
    await db.poolMember.deleteMany({
      where: { poolId: id },
    });

    // Delete pool tokens
    await db.poolToken.deleteMany({
      where: { poolId: id },
    });

    // Delete swap proposals
    await db.swapProposal.deleteMany({
      where: { poolId: id },
    });

    // Delete transactions
    await db.transaction.deleteMany({
      where: { poolId: id },
    });

    // Delete the pool
    await db.pool.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Pool deleted successfully',
      poolId: id 
    });

  } catch (error) {
    console.error('Error deleting pool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateTotalValue(tokens: any[]): string {
  // This is a simplified calculation
  // In a real implementation, you would fetch current prices from an oracle
  return '$0.00';
}
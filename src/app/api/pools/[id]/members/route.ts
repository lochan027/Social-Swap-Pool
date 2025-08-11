import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const members = await db.poolMember.findMany({
      where: { 
        poolId: id,
        isActive: true 
      },
      include: {
        user: true,
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    const formattedMembers = members.map(member => ({
      id: member.id,
      walletAddress: member.user.walletAddress,
      role: member.role,
      joinedAt: member.joinedAt,
      isActive: member.isActive,
    }));

    return NextResponse.json({ members: formattedMembers });

  } catch (error) {
    console.error('Error fetching pool members:', error);
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

    // Find the pool with members
    const pool = await db.pool.findUnique({
      where: { id },
      include: {
        members: {
          where: { isActive: true },
          include: {
            user: true,
          },
        },
      },
    });

    if (!pool) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 });
    }

    // Check if user is a member of the pool
    const userMembership = pool.members.find(member => member.userId === user.id);
    if (!userMembership) {
      return NextResponse.json({ error: 'User is not a member of this pool' }, { status: 400 });
    }

    // Check if user is the creator and there are other members
    if (pool.creatorId === user.id && pool.members.length > 1) {
      return NextResponse.json({ 
        error: 'Pool creator cannot leave while other members are present. Delete the pool instead.' 
      }, { status: 400 });
    }

    // Remove the user from the pool
    await db.poolMember.update({
      where: { 
        id: userMembership.id 
      },
      data: { 
        isActive: false 
      },
    });

    // Create a transaction record for the member removal
    await db.transaction.create({
      data: {
        poolId: id,
        type: 'WITHDRAWAL',
        status: 'SUCCESS',
      },
    });

    // If this was the last member, delete the pool
    if (pool.members.length === 1) {
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
        message: 'You left the pool and it was deleted as you were the last member',
        poolId: id,
        poolDeleted: true 
      });
    }

    return NextResponse.json({ 
      message: 'You left the pool successfully',
      poolId: id,
      poolDeleted: false 
    });

  } catch (error) {
    console.error('Error removing member from pool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
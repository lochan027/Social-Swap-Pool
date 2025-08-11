import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 });
    }

    // Find user by wallet address
    const user = await db.user.findUnique({
      where: { walletAddress: userAddress },
    });

    if (!user) {
      return NextResponse.json({ pools: [] });
    }

    // Get pools where user is a member
    const memberships = await db.poolMember.findMany({
      where: { userId: user.id, isActive: true },
      include: {
        pool: {
          include: {
            _count: {
              select: { members: true },
            },
            tokens: true,
            swapProposals: {
              where: { status: 'PENDING' },
            },
          },
        },
      },
    });

    const pools = memberships.map(membership => ({
      id: membership.pool.id,
      name: membership.pool.name,
      description: membership.pool.description,
      multisigAddress: membership.pool.multisigAddress,
      creatorId: membership.pool.creatorId,
      createdAt: membership.pool.createdAt,
      memberCount: membership.pool._count.members,
      totalValue: calculateTotalValue(membership.pool.tokens),
      pendingSwaps: membership.pool.swapProposals.length,
    }));

    return NextResponse.json({ 
      pools,
      demoMode: true,
      demoNotice: {
        title: "Demo Application",
        message: "This is a demonstration version with simulated pool data.",
        warnings: [
          "All pool data is simulated for demonstration purposes",
          "No real funds are managed in these pools",
          "Pool values and transactions are not real",
          "This is a test environment only"
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching pools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      multisigAddress,
      creatorAddress,
      members,
      requiredSignatures,
      visibility,
      joinCode,
    } = body;

    // Validate input
    if (!name || !multisigAddress || !creatorAddress || !members || !requiredSignatures) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create creator user
    let creator = await db.user.findUnique({
      where: { walletAddress: creatorAddress },
    });

    if (!creator) {
      creator = await db.user.create({
        data: {
          walletAddress: creatorAddress,
        },
      });
    }

    // Create pool
    const pool = await db.pool.create({
      data: {
        name,
        description,
        multisigAddress,
        creatorId: creator.id,
        visibility: visibility || 'PUBLIC',
        joinCode,
      },
    });

    // Create pool members
    const memberPromises = members.map(async (memberAddress: string) => {
      let user = await db.user.findUnique({
        where: { walletAddress: memberAddress },
      });

      if (!user) {
        user = await db.user.create({
          data: {
            walletAddress: memberAddress,
          },
        });
      }

      const role = memberAddress === creatorAddress ? 'CREATOR' : 'MEMBER';

      return db.poolMember.create({
        data: {
          poolId: pool.id,
          userId: user.id,
          role,
        },
      });
    });

    await Promise.all(memberPromises);

    // Create pool creation transaction
    await db.transaction.create({
      data: {
        poolId: pool.id,
        type: 'POOL_CREATION',
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({
      id: pool.id,
      name: pool.name,
      description: pool.description,
      multisigAddress: pool.multisigAddress,
      visibility: pool.visibility,
      joinCode: pool.joinCode,
      createdAt: pool.createdAt,
      demoMode: true,
      demoNotice: {
        title: "Demo Pool Created",
        message: "This is a demonstration pool created in test mode.",
        warnings: [
          "This pool exists only for demonstration purposes",
          "No real funds or transactions are involved",
          "Pool management features are simulated",
          "This is not a real financial instrument"
        ]
      }
    });
  } catch (error) {
    console.error('Error creating pool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateTotalValue(tokens: any[]): string {
  // This is a simplified calculation
  // In a real implementation, you would fetch current prices from an oracle
  return '$0.00';
}
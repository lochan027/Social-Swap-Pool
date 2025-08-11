import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposals = await db.swapProposal.findMany({
      where: { poolId: id },
      include: {
        proposer: true,
        votes: {
          include: {
            user: true,
          },
        },
        transaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error fetching pool proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      fromToken,
      toToken,
      amount,
      minReceived,
      proposerAddress,
    } = body;

    if (!fromToken || !toToken || !amount || !minReceived || !proposerAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find proposer user
    let proposer = await db.user.findUnique({
      where: { walletAddress: proposerAddress },
    });

    if (!proposer) {
      proposer = await db.user.create({
        data: {
          walletAddress: proposerAddress,
        },
      });
    }

    // Create swap proposal
    const proposal = await db.swapProposal.create({
      data: {
        poolId: id,
        proposerId: proposer.id,
        fromToken,
        toToken,
        amount,
        minReceived,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error creating swap proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tokens = await db.poolToken.findMany({
      where: { poolId: id },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching pool tokens:', error);
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
    const { symbol, address, decimals, balance } = body;

    if (!symbol || !decimals || !balance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if token already exists
    const existingToken = await db.poolToken.findUnique({
      where: {
        poolId_symbol: {
          poolId: id,
          symbol,
        },
      },
    });

    if (existingToken) {
      // Update existing token
      const updatedToken = await db.poolToken.update({
        where: { id: existingToken.id },
        data: {
          address,
          decimals,
          balance,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ token: updatedToken });
    }

    // Create new token
    const token = await db.poolToken.create({
      data: {
        poolId: id,
        symbol,
        address,
        decimals,
        balance,
      },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error adding pool token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
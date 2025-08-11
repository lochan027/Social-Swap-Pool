import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { okxService } from '@/lib/okx';
import { xlayerService } from '@/lib/xlayer';

export async function POST(
  request: NextRequest,
  { params }: { params: { proposalId: string } }
) {
  try {
    const proposalId = params.proposalId;
    const body = await request.json();
    const { executorAddress } = body;

    if (!executorAddress) {
      return NextResponse.json({ error: 'Executor address is required' }, { status: 400 });
    }

    // Get proposal details
    const proposal = await db.swapProposal.findUnique({
      where: { id: proposalId },
      include: {
        pool: true,
        proposer: true,
        votes: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Proposal must be approved before execution' }, { status: 400 });
    }

    if (proposal.transaction) {
      return NextResponse.json({ error: 'Proposal already executed' }, { status: 400 });
    }

    // Prepare swap transaction
    try {
      const swapTx = await okxService.prepareSwapTransaction(
        proposal.fromToken === 'ETH' ? '0x0000000000000000000000000000000000000000' : proposal.fromToken,
        proposal.toToken === 'ETH' ? '0x0000000000000000000000000000000000000000' : proposal.toToken,
        proposal.amount,
        proposal.pool.multisigAddress,
        '1', // 1% slippage
        '195' // XLayer chain ID
      );

      // Create transaction record
      const transaction = await db.transaction.create({
        data: {
          poolId: proposal.poolId,
          proposalId: proposal.id,
          type: 'SWAP',
          status: 'PENDING',
          fromToken: proposal.fromToken,
          toToken: proposal.toToken,
          amount: proposal.amount,
        },
      });

      // Update proposal status
      await db.swapProposal.update({
        where: { id: proposalId },
        data: {
          status: 'EXECUTED',
          executedAt: new Date(),
          transactionId: transaction.id,
        },
      });

      // In a real implementation, you would execute the transaction here
      // For now, we'll simulate a successful execution
      await simulateTransactionExecution(transaction.id);

      return NextResponse.json({ 
        transaction,
        message: 'Swap executed successfully' 
      });
    } catch (swapError) {
      console.error('Swap execution error:', swapError);
      
      // Create failed transaction record
      const transaction = await db.transaction.create({
        data: {
          poolId: proposal.poolId,
          proposalId: proposal.id,
          type: 'SWAP',
          status: 'FAILED',
          fromToken: proposal.fromToken,
          toToken: proposal.toToken,
          amount: proposal.amount,
          errorMessage: swapError instanceof Error ? swapError.message : 'Unknown error',
        },
      });

      // Update proposal status
      await db.swapProposal.update({
        where: { id: proposalId },
        data: {
          status: 'FAILED',
          executedAt: new Date(),
          transactionId: transaction.id,
          errorMessage: swapError instanceof Error ? swapError.message : 'Unknown error',
        },
      });

      return NextResponse.json({ 
        error: 'Swap execution failed',
        transaction 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error executing swap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function simulateTransactionExecution(transactionId: string) {
  // Simulate transaction execution delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Update transaction status to success
  await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'SUCCESS',
      executedAt: new Date(),
      txHash: '0x' + Math.random().toString(16).substr(2, 64), // Simulated tx hash
      gasUsed: '21000',
      gasPrice: '20',
    },
  });
}
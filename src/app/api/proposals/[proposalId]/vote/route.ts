import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { proposalId: string } }
) {
  try {
    const proposalId = params.proposalId;
    const body = await request.json();
    const { userAddress, vote } = body;

    if (!userAddress || !vote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['FOR', 'AGAINST', 'ABSTAIN'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Find user
    let user = await db.user.findUnique({
      where: { walletAddress: userAddress },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          walletAddress: userAddress,
        },
      });
    }

    // Check if user has already voted
    const existingVote = await db.vote.findUnique({
      where: {
        proposalId_userId: {
          proposalId,
          userId: user.id,
        },
      },
    });

    if (existingVote) {
      // Update existing vote
      const updatedVote = await db.vote.update({
        where: { id: existingVote.id },
        data: { vote },
      });
      return NextResponse.json({ vote: updatedVote });
    }

    // Create new vote
    const newVote = await db.vote.create({
      data: {
        proposalId,
        userId: user.id,
        vote,
      },
    });

    // Check if proposal should be approved or rejected based on votes
    await updateProposalStatus(proposalId);

    return NextResponse.json({ vote: newVote });
  } catch (error) {
    console.error('Error casting vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateProposalStatus(proposalId: string) {
  try {
    const proposal = await db.swapProposal.findUnique({
      where: { id: proposalId },
      include: {
        pool: {
          include: {
            members: {
              where: { isActive: true },
            },
          },
        },
        votes: true,
      },
    });

    if (!proposal) return;

    const totalMembers = proposal.pool.members.length;
    const votes = proposal.votes;
    const forVotes = votes.filter(v => v.vote === 'FOR').length;
    const againstVotes = votes.filter(v => v.vote === 'AGAINST').length;
    const totalVotes = votes.length;

    // Simple majority voting (can be customized based on requirements)
    const requiredVotes = Math.ceil(totalMembers / 2);

    if (totalVotes >= requiredVotes) {
      if (forVotes > againstVotes) {
        // Approve proposal
        await db.swapProposal.update({
          where: { id: proposalId },
          data: { status: 'APPROVED' },
        });
      } else if (againstVotes > forVotes) {
        // Reject proposal
        await db.swapProposal.update({
          where: { id: proposalId },
          data: { status: 'REJECTED' },
        });
      }
    }
  } catch (error) {
    console.error('Error updating proposal status:', error);
  }
}
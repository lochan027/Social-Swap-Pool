'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  ArrowRightLeft, 
  Vote, 
  Wallet, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Key,
  DollarSign,
  LogOut,
  Trash2
} from 'lucide-react';

interface GuideStep {
  step: number;
  title: string;
  description: string;
  icon: any;
  tips?: string[];
  warnings?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  steps: GuideStep[];
}

const guides: Guide[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of Social Swap Pool',
    difficulty: 'beginner',
    timeEstimate: '5 min',
    steps: [
      {
        step: 1,
        title: 'Connect Your Wallet',
        description: 'Install OKX Wallet or MetaMask and connect to XLayer network',
        icon: Wallet,
        tips: [
          'OKX Wallet is recommended for best XLayer experience',
          'Make sure you have some ETH in your wallet for gas fees'
        ],
        warnings: [
          'Never share your private keys or seed phrase',
          'Always verify you\'re on the correct network (XLayer)'
        ]
      },
      {
        step: 2,
        title: 'Create Your First Pool',
        description: 'Set up a multisig wallet pool with trusted members',
        icon: Plus,
        tips: [
          'Start with yourself as the only member for testing',
          'Choose a clear pool name and description',
          'Set appropriate signature requirements (2-3 for most cases)'
        ]
      },
      {
        step: 3,
        title: 'Add Members',
        description: 'Invite trusted people to join your pool',
        icon: Users,
        tips: [
          'Only add people you trust with your funds',
          'Consider starting with a small test amount',
          'Communicate pool rules and expectations clearly'
        ]
      }
    ]
  },
  {
    id: 'pool-management',
    title: 'Pool Management',
    description: 'Advanced pool management and administration',
    difficulty: 'intermediate',
    timeEstimate: '10 min',
    steps: [
      {
        step: 1,
        title: 'Pool Settings',
        description: 'Configure pool visibility and access controls',
        icon: Settings,
        tips: [
          'Use private pools for trusted groups',
          'Share join codes securely with invited members',
          'Consider pool purpose when choosing visibility'
        ]
      },
      {
        step: 2,
        title: 'Member Management',
        description: 'Add or remove members from your pool',
        icon: Users,
        tips: [
          'Regular members cannot be removed by creators',
          'Members can leave voluntarily at any time',
          'Pool is deleted when last member leaves'
        ],
        warnings: [
          'Creators cannot leave if other members are present',
          'Deleting a pool is permanent and cannot be undone'
        ]
      },
      {
        step: 3,
        title: 'Pool Deletion',
        description: 'Safely delete pools when no longer needed',
        icon: Trash2,
        tips: [
          'Only creators can delete pools',
          'Pool must have only one member (the creator)',
          'Ensure all funds are withdrawn before deletion'
        ]
      }
    ]
  },
  {
    id: 'token-swapping',
    title: 'Token Swapping',
    description: 'Create and vote on token swap proposals',
    difficulty: 'advanced',
    timeEstimate: '15 min',
    steps: [
      {
        step: 1,
        title: 'Create Swap Proposals',
        description: 'Propose token swaps for the pool to vote on',
        icon: ArrowRightLeft,
        tips: [
          'Research tokens before proposing swaps',
          'Set realistic minimum received amounts',
          'Consider market conditions and timing'
        ],
        warnings: [
          'Slippage protection is important for volatile tokens',
          'Large swaps may impact market prices'
        ]
      },
      {
        step: 2,
        title: 'Voting Process',
        description: 'Participate in democratic decision making',
        icon: Vote,
        tips: [
          'Vote promptly to keep the process moving',
          'Consider the risks and rewards of each proposal',
          'Communicate with other pool members'
        ]
      },
      {
        step: 3,
        title: 'Execution',
        description: 'Execute approved swaps and track results',
        icon: TrendingUp,
        tips: [
          'Monitor transaction status after execution',
          'Keep records of all pool activities',
          'Learn from both successful and failed swaps'
        ]
      }
    ]
  }
];

export function HowToSection() {
  const getDifficultyColor = (difficulty: Guide['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: Guide['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return <CheckCircle className="h-4 w-4" />;
      case 'intermediate':
        return <Clock className="h-4 w-4" />;
      case 'advanced':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          How to Use Social Swap Pool
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guides to help you master collective token swapping and pool management
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {guides.map((guide) => (
            <TabsTrigger key={guide.id} value={guide.id} className="flex items-center gap-2">
              {getDifficultyIcon(guide.difficulty)}
              <span className="hidden sm:inline">{guide.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {guides.map((guide) => (
          <TabsContent key={guide.id} value={guide.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {guide.title}
                      <Badge className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      ⏱️ {guide.timeEstimate}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {guide.steps.map((step, index) => (
                <Card key={step.step} className="relative">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <step.icon className="h-5 w-5" />
                          {step.title}
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {(step.tips || step.warnings) && (
                    <CardContent className="pt-0">
                      <div className="grid gap-4 md:grid-cols-2">
                        {step.tips && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-green-700 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Tips
                            </h4>
                            <ul className="space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {step.warnings && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-700 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Warnings
                            </h4>
                            <ul className="space-y-1">
                              {step.warnings.map((warning, warningIndex) => (
                                <li key={warningIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                  
                  {index < guide.steps.length - 1 && (
                    <div className="absolute bottom-0 left-12 w-0.5 h-6 bg-gradient-to-b from-blue-200 to-transparent" />
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
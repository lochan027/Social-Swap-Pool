'use client';

import { useState } from 'react';
import { WalletProvider } from '@/contexts/WalletContext';
import { WalletConnect } from '@/components/WalletConnect';
import { CreatePool } from '@/components/CreatePool';
import { PoolList } from '@/components/PoolList';
import { PoolDashboard } from '@/components/PoolDashboard';
import { StatsCard } from '@/components/StatsCard';
import { SwapProposal } from '@/components/SwapProposal';
import { ActivityFeed } from '@/components/ActivityFeed';
import { HowToSection } from '@/components/HowToSection';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Plus, 
  List, 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle,
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowRightLeft,
  Vote,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Target,
  BarChart3,
  Activity,
  Lightbulb
} from 'lucide-react';

function AppContent() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative w-32 h-32">
                <img
                  src="/logo.png"
                  alt="Social Swap Pool Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Social Swap Pool
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Pool funds and swap tokens collectively on XLayer
            </p>
            <div className="text-lg text-amber-600 font-medium mb-8">
              🚀 Demo Only - This is a demonstration application
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Multisig Security</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Collective Trading</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Reduced Fees</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Why Choose Social Swap Pool?
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Enhanced Security:</strong> Multisig wallets protect your funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Collective Power:</strong> Pool funds for better trading rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Vote className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Democratic Control:</strong> Vote on all trading decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Reduced Slippage:</strong> Better prices with larger volumes</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Getting Started
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Install OKX Wallet</h4>
                    <p className="text-sm text-muted-foreground">
                      Download OKX Wallet for the best XLayer experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect and switch to XLayer network
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Start Pooling</h4>
                    <p className="text-sm text-muted-foreground">
                      Create or join pools and start trading collectively
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Recommended Wallet
              </p>
              <div className="flex justify-center items-center gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 px-6 py-3 rounded-lg border border-blue-200 dark:border-blue-700 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">OKX</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">OKX Wallet</div>
                      <div className="text-sm text-muted-foreground">Best for XLayer</div>
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground">or</div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MM</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">MetaMask</div>
                      <div className="text-sm text-muted-foreground">Also supported</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <img
                  src="/logo.png"
                  alt="Social Swap Pool Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Social Swap Pool
                </h1>
                <p className="text-muted-foreground">
                  Collective token swapping on XLayer network
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-md">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="pools" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">My Pools</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <ArrowRightLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Swap</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="howto" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">How-to</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {selectedPool ? (
              <PoolDashboard 
                poolId={selectedPool} 
                onBack={() => setSelectedPool(null)}
              />
            ) : (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
                      <p className="text-blue-100">
                        Manage your pools, track performance, and stay updated with the latest activities
                      </p>
                    </div>
                    <Star className="h-12 w-12 text-yellow-300 opacity-80" />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Active Pools"
                    value="0"
                    description="Pools you're participating in"
                    icon={Users}
                    color="blue"
                    trend="neutral"
                    trendValue="No change"
                  />
                  <StatsCard
                    title="Total Value"
                    value="$0.00"
                    description="Combined value of all pools"
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="+0%"
                  />
                  <StatsCard
                    title="Pending Votes"
                    value="0"
                    description="Proposals awaiting your vote"
                    icon={Vote}
                    color="purple"
                    trend="neutral"
                    trendValue="0 active"
                  />
                  <StatsCard
                    title="Recent Activity"
                    value="0"
                    description="Actions in the last 24h"
                    icon={Activity}
                    color="orange"
                    trend="up"
                    trendValue="New today"
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Create New Pool
                      </CardTitle>
                      <CardDescription>
                        Start a new pool with multisig security
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CreatePool />
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <List className="h-5 w-5" />
                        My Pools
                      </CardTitle>
                      <CardDescription>
                        View and manage your existing pools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PoolList 
                        onSelectPool={setSelectedPool} 
                        onSwitchToDashboard={() => setActiveTab('dashboard')} 
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest updates from your pools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <PoolList 
                onSelectPool={setSelectedPool} 
                onSwitchToDashboard={() => setActiveTab('dashboard')} 
              />
          </TabsContent>

          <TabsContent value="swap" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <SwapProposal onProposalCreated={(proposal) => {
                console.log('Swap proposal created:', proposal);
              }} />
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Pool
                  </CardTitle>
                  <CardDescription>
                    Create a new pool with multisig security and collective trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreatePool />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="howto" className="space-y-6">
            <HowToSection />
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <FAQSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
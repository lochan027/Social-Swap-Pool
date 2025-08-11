'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  Trash2,
  HelpCircle,
  Lock,
  Globe,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  Database,
  Network,
  Coins,
  BarChart3,
  BookOpen,
  MessageCircle,
  Github
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'getting-started' | 'pools' | 'swapping' | 'security' | 'technical';
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  icon?: any;
  relatedQuestions?: string[];
}

const faqItems: FAQItem[] = [
  {
    question: "What is Social Swap Pool?",
    answer: "Social Swap Pool is a decentralized application that allows groups of users to pool funds into multisig smart account wallets on the XLayer network and collectively swap tokens using OKX DEX API. It enables democratic decision-making for token trades, reduced slippage through collective trading power, and enhanced security through multisig wallet protection.",
    category: "getting-started",
    difficulty: "basic",
    icon: HelpCircle
  },
  {
    question: "How do I get started with Social Swap Pool?",
    answer: "To get started: 1) Install OKX Wallet or MetaMask, 2) Connect your wallet and switch to XLayer network, 3) Create a new pool or join an existing one using a join code, 4) Add funds to the pool multisig wallet, 5) Create or vote on swap proposals. The process is designed to be intuitive with clear guidance at each step.",
    category: "getting-started",
    difficulty: "basic",
    icon: Plus
  },
  {
    question: "What wallets are supported?",
    answer: "We primarily recommend OKX Wallet for the best XLayer experience, but MetaMask is also supported. Both wallets need to be configured to connect to the XLayer network. Make sure your wallet has some ETH for gas fees before getting started.",
    category: "getting-started",
    difficulty: "basic",
    icon: Wallet
  },
  {
    question: "What's the difference between public and private pools?",
    answer: "Public pools can be joined by anyone without restrictions, while private pools require a join code to access. Public pools are great for community projects and experimentation, while private pools are ideal for trusted groups who want to control who can participate. Private pools offer additional security through access control.",
    category: "pools",
    difficulty: "basic",
    icon: Eye
  },
  {
    question: "How do I create a pool?",
    answer: "To create a pool: 1) Click 'Create Pool' in the dashboard, 2) Enter pool name and description, 3) Set the number of required signatures (usually 2-3), 4) Add initial members (starting with yourself), 5) Choose visibility (public/private), 6) For private pools, optionally set a custom join code. The system will generate a unique multisig wallet address for your pool.",
    category: "pools",
    difficulty: "intermediate",
    icon: Plus
  },
  {
    question: "Can I leave a pool after joining?",
    answer: "Yes, you can leave any pool at any time by clicking the 'Leave Pool' button in the pool dashboard. However, pool creators cannot leave if there are other members present - they must delete the pool instead. When you leave a pool, you'll no longer be able to participate in its decisions or access its funds.",
    category: "pools",
    difficulty: "basic",
    icon: LogOut
  },
  {
    question: "What happens when I delete a pool?",
    answer: "When you delete a pool, all associated data including members, tokens, swap proposals, and transactions are permanently removed from the database. The multisig wallet address becomes inactive. This action cannot be undone, so make sure to withdraw all funds before deleting a pool. Only pool creators can delete pools, and only when they are the sole member.",
    category: "pools",
    difficulty: "intermediate",
    icon: Trash2
  },
  {
    question: "How does the multisig wallet work?",
    answer: "The multisig wallet requires multiple signatures to execute transactions. When you create a pool, you specify how many signatures are needed (e.g., 2 out of 3 members). For any token swap to occur, the required number of members must approve the proposal. This provides enhanced security and prevents any single member from unilaterally moving funds.",
    category: "security",
    difficulty: "intermediate",
    icon: Shield
  },
  {
    question: "Are my funds safe in a pool?",
    answer: "Pools use multisig smart contracts for enhanced security. Funds can only be moved when the required number of members approve a transaction. However, like all DeFi protocols, there are risks including smart contract vulnerabilities, oracle manipulation, and market risks. Start with small amounts and only pool funds with trusted members.",
    category: "security",
    difficulty: "intermediate",
    icon: Lock
  },
  {
    question: "How are swap proposals created and executed?",
    answer: "Any pool member can create a swap proposal specifying the token pair, amount, and minimum received. The proposal then goes to a vote where members can approve or reject. If the required number of members approve, the swap is executed automatically through the OKX DEX API. The process ensures democratic decision-making and protects against malicious trades.",
    category: "swapping",
    difficulty: "advanced",
    icon: ArrowRightLeft
  },
  {
    question: "What is slippage and how is it handled?",
    answer: "Slippage is the difference between expected and actual execution prices. In Social Swap Pool, each proposal includes a 'minimum received' amount that acts as slippage protection. If the swap cannot execute at or better than this minimum, the transaction fails. This protects the pool from unfavorable price movements during execution.",
    category: "swapping",
    difficulty: "advanced",
    icon: BarChart3
  },
  {
    question: "What are the gas fees and transaction costs?",
    answer: "Gas fees are paid in ETH on the XLayer network and vary based on network congestion. Each action (creating pools, proposing swaps, executing transactions) requires gas. Pool members share these costs collectively. The system estimates gas costs before execution and displays them to users for transparency.",
    category: "technical",
    difficulty: "advanced",
    icon: Coins
  },
  {
    question: "How does the system integrate with OKX DEX?",
    answer: "Social Swap Pool integrates with OKX DEX API to execute token swaps at competitive rates. The system automatically finds the best trading routes and executes trades when proposals are approved. This integration provides access to deep liquidity and competitive pricing while maintaining the security of the multisig governance model.",
    category: "technical",
    difficulty: "advanced",
    icon: Network
  },
  {
    question: "Can I add or remove members from a pool?",
    answer: "Pool creators can add new members at any time through the 'Add Member' feature. Members can voluntarily leave pools using the 'Leave Pool' button. However, creators cannot remove existing members - members must choose to leave voluntarily. This design ensures democratic control and prevents abuse of power.",
    category: "pools",
    difficulty: "intermediate",
    icon: UserPlus
  },
  {
    question: "What happens to a pool when all members leave?",
    answer: "When the last member leaves a pool, the system automatically deletes the pool and all associated data. This cleanup process ensures the database remains efficient and prevents orphaned data. The multisig wallet address becomes permanently inactive, though any remaining funds would still be accessible through the blockchain if the private keys were recovered.",
    category: "pools",
    difficulty: "intermediate",
    icon: Database
  }
];

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: HelpCircle, color: 'blue' },
  { id: 'pools', name: 'Pools & Members', icon: Users, color: 'green' },
  { id: 'swapping', name: 'Token Swapping', icon: ArrowRightLeft, color: 'purple' },
  { id: 'security', name: 'Security', icon: Shield, color: 'red' },
  { id: 'technical', name: 'Technical', icon: Settings, color: 'orange' },
];

export function FAQSection() {
  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFAQsByCategory = (categoryId: string) => {
    return faqItems.filter(faq => faq.category === categoryId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about Social Swap Pool functionality, security, and best practices
        </p>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => {
          const categoryFAQs = getFAQsByCategory(category.id);
          return (
            <Card 
              key={category.id} 
              className={`hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${getCategoryColor(category.color)}`}
            >
              <CardHeader className="text-center">
                <category.icon className="h-8 w-8 mx-auto mb-2" />
                <CardTitle className="text-sm">{category.name}</CardTitle>
                <CardDescription className="text-xs">
                  {categoryFAQs.length} questions
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            All Questions & Answers
          </CardTitle>
          <CardDescription>
            Click on any question to expand the answer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => {
              const category = categories.find(cat => cat.id === faq.category);
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {faq.icon && <faq.icon className="h-4 w-4 flex-shrink-0" />}
                      <div className="flex-1">
                        <span className="font-medium">{faq.question}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {category && (
                            <Badge variant="outline" className="text-xs">
                              <category.icon className="h-3 w-3 mr-1" />
                              {category.name}
                            </Badge>
                          )}
                          {faq.difficulty && (
                            <Badge className={getDifficultyColor(faq.difficulty)}>
                              {faq.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Related Questions:</h5>
                          <ul className="space-y-1">
                            {faq.relatedQuestions.map((related, relatedIndex) => (
                              <li key={relatedIndex} className="text-sm text-muted-foreground">
                                • {related}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Quick Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Need More Help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Here are some additional resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border rounded-lg">
              <Github className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium mb-1">GitHub</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contribute to the project or report issues
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://github.com/lochan027/socialswappool', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                View GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
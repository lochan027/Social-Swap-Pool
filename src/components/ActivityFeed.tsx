'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { 
  Users, 
  Plus, 
  ArrowRightLeft, 
  Vote, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'member_joined' | 'pool_created' | 'swap_proposed' | 'swap_executed' | 'swap_failed';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status?: 'success' | 'pending' | 'failed';
  amount?: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ activities = [], className = '' }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'member_joined':
        return <Users className="h-4 w-4" />;
      case 'pool_created':
        return <Plus className="h-4 w-4" />;
      case 'swap_proposed':
        return <ArrowRightLeft className="h-4 w-4" />;
      case 'swap_executed':
        return <CheckCircle className="h-4 w-4" />;
      case 'swap_failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type'], status?: ActivityItem['status']) => {
    if (status === 'failed') return 'text-red-600';
    if (status === 'pending') return 'text-yellow-600';
    if (status === 'success') return 'text-green-600';
    
    switch (type) {
      case 'member_joined':
        return 'text-blue-600';
      case 'pool_created':
        return 'text-purple-600';
      case 'swap_proposed':
        return 'text-orange-600';
      case 'swap_executed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            <p>Activities in your pools</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No activity</h3>
            <p className="text-muted-foreground">
              Start by creating or joining a pool to see activity here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          <p>Activities in your pools</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-gradient-to-r from-transparent to-transparent hover:from-muted/50 hover:to-muted/30 transition-all duration-200"
            >
              <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type, activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activity.user && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {activity.user.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {formatAddress(activity.user)}
                        </span>
                      </div>
                    )}
                    
                    {activity.amount && (
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {activity.amount}
                      </Badge>
                    )}
                    
                    {activity.status && (
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : activity.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  
                  {activity.type === 'swap_proposed' && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <Vote className="h-3 w-3 mr-1" />
                      Vote
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length > 5 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" size="sm">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
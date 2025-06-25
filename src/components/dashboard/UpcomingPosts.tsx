
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { format, startOfDay, isAfter, isSameDay } from 'date-fns';
import { Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  contentType: string;
  completed: boolean;
}

interface UpcomingPostsProps {
  posts: Post[];
  onComplete: (id: string) => void;
  isLoading?: boolean;
}

export const UpcomingPosts: React.FC<UpcomingPostsProps> = memo(({ posts, onComplete, isLoading = false }) => {
  const navigate = useNavigate();
  const [pendingCompletions, setPendingCompletions] = useState<Set<string>>(new Set());
  
  // Memoized filtered posts with stable filtering
  const upcomingPosts = useMemo(() => {
    const today = startOfDay(new Date());
    
    const filtered = posts
      .filter(post => {
        const postDate = startOfDay(new Date(post.date));
        const isNotCompleted = !post.completed && !pendingCompletions.has(post.id);
        const isUpcoming = isSameDay(postDate, today) || isAfter(postDate, today);
        
        return isNotCompleted && isUpcoming;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
      
    return filtered;
  }, [posts, pendingCompletions]);
  
  const handleEditClick = useCallback((postId?: string) => {
    if (postId) {
      navigate(`/calendar?edit=${postId}`);
    } else {
      navigate('/calendar');
    }
  }, [navigate]);

  const handleComplete = useCallback((id: string) => {
    // Single optimistic update with smooth transition
    setPendingCompletions(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Delay the actual completion call to allow UI to update smoothly
    setTimeout(() => {
      onComplete(id);
    }, 150);
    
    // Clear pending state after completion
    setTimeout(() => {
      setPendingCompletions(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);
  }, [onComplete]);
  
  return (
    <Card className="border border-chichi-purple/20 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-chichi-purple" />
            Upcoming Posts
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => handleEditClick()}>
            View All
          </Button>
        </div>
        <CardDescription>
          Your next scheduled content posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={`loading-${index}`} 
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card animate-pulse"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded ml-3"></div>
              </div>
            ))}
          </div>
        ) : upcomingPosts.length > 0 ? (
          <div className="space-y-3">
            {upcomingPosts.map(post => {
              const isPending = pendingCompletions.has(post.id);
              return (
                <div 
                  key={post.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-300 gap-3 ${
                    isPending ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {post.platform}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(post.date), 'MMM d')}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm sm:text-base truncate">{post.title}</h4>
                    {post.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleComplete(post.id)}
                      disabled={isPending}
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 touch-manipulation transition-all duration-200"
                    >
                      {isPending ? 'Completing...' : 'Complete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(post.id)}
                      className="touch-manipulation transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="mb-2">No upcoming content scheduled.</p>
            <Button variant="link" className="text-chichi-purple p-0" onClick={() => handleEditClick()}>
              Schedule some posts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

UpcomingPosts.displayName = 'UpcomingPosts';

export default UpcomingPosts;

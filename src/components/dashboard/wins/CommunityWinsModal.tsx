
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Instagram, Music, Youtube, Globe } from 'lucide-react';
import { CommunityWin, useWins, WIN_TAGS } from '@/hooks/useWins';

interface CommunityWinsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformIcons = {
  Instagram: Instagram,
  TikTok: Music,
  YouTube: Youtube,
  Other: Globe,
};

const reactionEmojis = {
  big: '🔥',
  inspired: '💡', 
  goal: '🎯'
};

const reactionLabels = {
  big: "That's Big",
  inspired: "Inspired Me",
  goal: "Goal Energy"
};

export function CommunityWinsModal({ isOpen, onClose }: CommunityWinsModalProps) {
  const { communityWins, addReaction, fetchCommunityWins } = useWins();
  const [filteredWins, setFilteredWins] = useState<CommunityWin[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchCommunityWins();
    }
  }, [isOpen, fetchCommunityWins]);

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredWins(communityWins);
    } else {
      setFilteredWins(communityWins.filter(win => 
        win.tags.includes(selectedTag)
      ));
    }
  }, [communityWins, selectedTag]);

  const handleReaction = async (winId: string, reactionType: 'big' | 'inspired' | 'goal') => {
    await addReaction(winId, reactionType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Community Wins Wall</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by tag:</span>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wins</SelectItem>
                {WIN_TAGS.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredWins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No community wins to show yet. Be the first to share your win!
              </div>
            ) : (
              filteredWins.map(win => {
                const PlatformIcon = platformIcons[win.platform as keyof typeof platformIcons] || Globe;
                
                return (
                  <div key={win.id} className="border rounded-lg p-4 space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={win.avatar_url || undefined} />
                        <AvatarFallback className="bg-chichi-purple text-white text-xs">
                          {(win.user_name || win.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {win.user_name || win.username}
                        </p>
                        {win.username && win.user_name && (
                          <p className="text-xs text-gray-500">@{win.username}</p>
                        )}
                      </div>
                    </div>

                    {/* Win Content */}
                    <div>
                      <h4 className="font-semibold">{win.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(win.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <PlatformIcon className="h-3 w-3" />
                          {win.platform}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {win.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {win.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Screenshot */}
                    {win.screenshot_url && (
                      <img 
                        src={win.screenshot_url} 
                        alt="Win screenshot" 
                        className="w-full max-h-48 object-cover rounded-md"
                      />
                    )}

                    {/* Description */}
                    {win.description && (
                      <p className="text-sm text-gray-600">{win.description}</p>
                    )}

                    {/* Reactions */}
                    <div className="flex gap-2 pt-2 border-t">
                      {Object.entries(reactionEmojis).map(([type, emoji]) => {
                        const count = win[`${type}_reactions` as keyof CommunityWin] as number;
                        return (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            onClick={() => handleReaction(win.id, type as 'big' | 'inspired' | 'goal')}
                            className="text-xs"
                          >
                            <span className="mr-1">{emoji}</span>
                            {reactionLabels[type as keyof typeof reactionLabels]}
                            {count > 0 && <span className="ml-1">({count})</span>}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

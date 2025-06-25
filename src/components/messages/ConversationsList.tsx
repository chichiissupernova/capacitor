
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_username: string;
  other_user_avatar_url: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectConversation: (id: string) => void;
}

export function ConversationsList({
  conversations,
  selectedConversation,
  searchTerm,
  onSearchChange,
  onSelectConversation
}: ConversationsListProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 max-h-[400px] overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start messaging creators from the Connect page!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.other_user_id}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                  selectedConversation === conversation.other_user_id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectConversation(conversation.other_user_id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.other_user_avatar_url || undefined} />
                    <AvatarFallback>
                      {conversation.other_user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {conversation.other_user_name}
                      </p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.last_message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(conversation.last_message_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

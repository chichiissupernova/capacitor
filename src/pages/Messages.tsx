
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useOptimizedMessages } from '@/hooks/useOptimizedMessages';
import { ConversationsList } from '@/components/messages/ConversationsList';
import { MessageArea } from '@/components/messages/MessageArea';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    conversations,
    messages,
    isLoading,
    isSending,
    fetchConversations,
    fetchMessages,
    sendMessage
  } = useOptimizedMessages();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation) return;
    
    const success = await sendMessage(selectedConversation, message);
    if (success) {
      // Message sent successfully, fetchMessages is called in sendMessage
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.other_user_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-fade-in p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <ConversationsList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectConversation={setSelectedConversation}
        />

        <MessageArea
          selectedConversation={selectedConversation}
          messages={messages}
          isSending={isSending}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

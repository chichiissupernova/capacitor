import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

interface MessageAreaProps {
  selectedConversation: string | null;
  messages: Message[];
  isSending: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export function MessageArea({
  selectedConversation,
  messages,
  isSending,
  onSendMessage
}: MessageAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="lg:col-span-2">
      {selectedConversation ? (
        <>
          <CardContent className="p-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-chichi-purple text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === user?.id
                          ? 'text-purple-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                className="resize-none"
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="bg-chichi-purple hover:bg-chichi-purple-dark"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Choose a conversation to start messaging</p>
        </CardContent>
      )}
    </Card>
  );
}

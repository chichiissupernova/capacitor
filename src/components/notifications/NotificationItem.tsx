
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onConnectionAction?: (requestId: string, action: 'accepted' | 'ignored') => void;
}

export function NotificationItem({ notification, onMarkAsRead, onConnectionAction }: NotificationItemProps) {
  const isUnread = !notification.read_at;

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'connection_request':
        return '👥';
      case 'connection_accepted':
        return '🤝';
      case 'win_reaction':
        return notification.data.reaction || '🔥';
      case 'milestone_unlocked':
        return '👏';
      case 'system_update':
        return '📢';
      default:
        return '📔';
    }
  };

  return (
    <div 
      className={`p-3 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
        isUnread ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-2">
        <div className="text-sm">{getNotificationIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="text-xs font-medium text-gray-900 truncate">
              {notification.title}
            </h4>
            {isUnread && (
              <Badge variant="secondary" className="bg-blue-500 text-white text-xs h-4 px-1">
                New
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-gray-600 mb-1.5">{notification.message}</p>
          
          {notification.type === 'connection_request' && onConnectionAction && (
            <div className="flex space-x-1.5">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectionAction(notification.data.request_id, 'accepted');
                }}
                className="bg-chichi-purple hover:bg-chichi-purple/90 h-6 px-2 text-xs"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectionAction(notification.data.request_id, 'ignored');
                }}
                className="h-6 px-2 text-xs"
              >
                Ignore
              </Button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

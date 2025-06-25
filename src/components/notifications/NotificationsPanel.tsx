
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationsPanelProps {
  onClose: () => void;
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const {
    groupedNotifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    handleConnectionRequest
  } = useNotifications();

  const hasNotifications = groupedNotifications.today.length > 0 || 
                          groupedNotifications.yesterday.length > 0 || 
                          groupedNotifications.older.length > 0;

  if (loading) {
    return (
      <div className="w-64 bg-white rounded-lg shadow-lg border p-3">
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-1.5">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg border max-h-80 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-chichi-purple hover:text-chichi-purple/90 text-xs h-6 px-2"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {!hasNotifications ? (
          <div className="p-6 text-center">
            <div className="text-2xl mb-1">🔔</div>
            <p className="text-gray-500 text-xs">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-gray-50 border-b">
                  <h4 className="text-xs font-medium text-gray-900">Today</h4>
                </div>
                {groupedNotifications.today.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onConnectionAction={handleConnectionRequest}
                  />
                ))}
              </div>
            )}

            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-gray-50 border-b">
                  <h4 className="text-xs font-medium text-gray-900">Yesterday</h4>
                </div>
                {groupedNotifications.yesterday.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onConnectionAction={handleConnectionRequest}
                  />
                ))}
              </div>
            )}

            {/* Older */}
            {groupedNotifications.older.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-gray-50 border-b">
                  <h4 className="text-xs font-medium text-gray-900">Earlier</h4>
                </div>
                {groupedNotifications.older.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onConnectionAction={handleConnectionRequest}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

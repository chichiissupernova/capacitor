
import { useSyncStatus } from '@/services/sync';
import { CloudOff, RefreshCw, Cloud, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

interface SyncStatusIndicatorProps {
  className?: string;
}

export function SyncStatusIndicator({ className = '' }: SyncStatusIndicatorProps) {
  const { isOnline, isSyncing, pendingOperations } = useSyncStatus();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Determine status based on the available properties
  const status = isSyncing ? 'syncing' : isOnline ? 'online' : 'offline';
  const pendingCount = pendingOperations;
  
  // Control animation state based on sync status
  useEffect(() => {
    if (status === 'syncing' || (status === 'online' && pendingCount > 0)) {
      setIsAnimating(true);
    } else if (status === 'online' && pendingCount === 0) {
      // Keep animation running for a short time after sync completes
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(false);
    }
  }, [status, pendingCount]);
  
  const getIcon = () => {
    switch (status) {
      case 'offline':
        return <CloudOff className="h-4 w-4 text-amber-500" />;
      case 'syncing':
        return <RefreshCw className={`h-4 w-4 text-blue-500 ${isAnimating ? 'animate-spin' : ''}`} />;
      case 'online':
        if (pendingCount > 0) {
          return <RefreshCw className={`h-4 w-4 text-amber-500 ${isAnimating ? 'animate-spin' : ''}`} />;
        }
        return <Cloud className="h-4 w-4 text-green-500" />;
      default:
        return <Cloud className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'offline':
        return 'Offline - Changes will sync when you reconnect';
      case 'syncing':
        return `Syncing ${pendingCount} changes...`;
      case 'online':
        return pendingCount > 0 
          ? `Online - ${pendingCount} changes pending sync` 
          : 'All changes synced';
      default:
        return 'Online';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${className}`}>
            {getIcon()}
            {pendingCount > 0 && (
              <span className="text-xs font-medium">{pendingCount}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{getStatusText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


import { Clock, Check, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarTask } from '@/hooks/useCalendarTasks';

interface ModernTaskCardProps extends CalendarTask {
  onComplete: (id: string) => void;
  onEdit: () => void;
}

export function ModernTaskCard({
  id,
  title,
  description,
  platform,
  content_type,
  points,
  completed,
  onComplete,
  onEdit
}: ModernTaskCardProps) {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "bg-gradient-to-r from-pink-500 to-purple-500",
      tiktok: "bg-black",
      youtube: "bg-red-500",
      twitter: "bg-blue-400",
      linkedin: "bg-blue-600",
      facebook: "bg-blue-600",
      default: "bg-gray-500"
    };
    return colors[platform.toLowerCase()] || colors.default;
  };

  const getEstimatedTime = (contentType: string) => {
    const times: Record<string, string> = {
      post: "15 min",
      reel: "30 min",
      story: "10 min",
      video: "45 min",
      article: "60 min",
      tweet: "5 min",
      default: "20 min"
    };
    return times[contentType.toLowerCase()] || times.default;
  };

  return (
    <div className={cn(
      "bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm",
      "hover:shadow-md transition-all duration-200",
      completed && "bg-green-50 border-green-200"
    )}>
      {/* Header with platform badge */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <div className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium text-white mb-1",
            getPlatformColor(platform)
          )}>
            {platform}
          </div>
          
          <h3 className="font-semibold text-sm text-gray-900 mb-0.5 line-clamp-1">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-600 text-xs mb-1 line-clamp-1">
              {description}
            </p>
          )}
        </div>
        
        <button
          onClick={onEdit}
          className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex-shrink-0"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getEstimatedTime(content_type)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-chichi-orange rounded-full"></span>
            <span>{points} pts</span>
          </div>
        </div>
        
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {content_type}
        </span>
      </div>

      {/* Completion status */}
      <div className="flex items-center justify-between">
        {completed ? (
          <div className="flex items-center text-green-600 font-medium text-xs">
            <Check className="w-3 h-3 mr-1" />
            <span>Completed</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            Scheduled
          </div>
        )}
      </div>
    </div>
  );
}

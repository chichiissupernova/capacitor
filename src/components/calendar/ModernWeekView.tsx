
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface ModernWeekViewProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: any[];
}

export function ModernWeekView({ currentDate, selectedDate, onDateSelect, tasks }: ModernWeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTaskCount = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.date), date)).length;
  };

  return (
    <div className="flex justify-between items-center px-1.5 py-2 bg-white rounded-lg border border-gray-100 mb-2">
      {weekDays.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentDay = isToday(day);
        const taskCount = getTaskCount(day);
        
        return (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={cn(
              "flex flex-col items-center space-y-1 p-1 rounded-md transition-all duration-200",
              "hover:bg-gray-50 min-w-[30px]",
              isSelected && "bg-chichi-purple text-white hover:bg-chichi-purple"
            )}
          >
            <span className={cn(
              "text-xs font-medium uppercase tracking-wide",
              isSelected ? "text-white" : "text-gray-500"
            )}>
              {format(day, 'EEE').slice(0, 1)}
            </span>
            
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center font-semibold text-xs",
              "transition-all duration-200",
              isSelected && "bg-white text-chichi-purple",
              !isSelected && isCurrentDay && "bg-chichi-purple-soft text-chichi-purple",
              !isSelected && !isCurrentDay && "text-gray-900"
            )}>
              {format(day, 'd')}
            </div>
            
            {taskCount > 0 && (
              <div className={cn(
                "w-1 h-1 rounded-full",
                isSelected ? "bg-white" : "bg-chichi-orange"
              )} />
            )}
          </button>
        );
      })}
    </div>
  );
}

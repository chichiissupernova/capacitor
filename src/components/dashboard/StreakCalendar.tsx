
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface StreakCalendarProps {
  streakDays: Date[];
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ streakDays }) => {
  const { user } = useAuth();
  const today = new Date();
  
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
        <h3 className="text-sm font-medium flex items-center">
          <Flame className="mr-2 h-4 w-4 text-chichi-orange" />
          Streak Calendar
        </h3>
        <Button variant="ghost" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          View All
        </Button>
      </div>
      <div className="w-full flex justify-center px-0 pb-4 pt-0">
        <Calendar
          mode="single"
          selected={today}
          defaultMonth={today}
          onSelect={undefined}
          modifiers={{
            streak: streakDays,
            today: today
          }}
          modifiersStyles={{
            streak: {
              backgroundColor: '#ff6b35',
              color: 'white',
              borderRadius: '50%'
            },
            today: {
              backgroundColor: '#ff6b35',
              color: 'white',
              fontWeight: 'bold'
            }
          }}
          disabled={(date) => {
            // Don't disable any dates, just style them differently
            return false;
          }}
          className={cn("border-none shadow-none pointer-events-auto mx-auto")}
        />
      </div>
    </div>
  );
};

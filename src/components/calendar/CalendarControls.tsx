
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface CalendarControlsProps {
  currentDate: Date;
  isWeeklyView: boolean;
  onViewChange: (isWeekly: boolean) => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onGoToToday: () => void;
}

export function CalendarControls({
  currentDate,
  isWeeklyView,
  onViewChange,
  onNavigatePrevious,
  onNavigateNext,
  onGoToToday
}: CalendarControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h2 className="text-xl font-semibold">
        {isWeeklyView 
          ? `Week of ${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
          : format(currentDate, 'MMMM yyyy')
        }
      </h2>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="calendar-view"
            checked={isWeeklyView}
            onCheckedChange={onViewChange}
          />
          <Label htmlFor="calendar-view">Weekly view</Label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onGoToToday}>
            Today
          </Button>
          <div className="flex">
            <Button variant="outline" size="icon" onClick={onNavigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNavigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

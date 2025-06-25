
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { CalendarTask } from '@/hooks/useCalendarTasks';

interface ModernCalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAddTask: (task: Omit<CalendarTask, 'id'>) => Promise<void>;
}

export const ModernCalendarHeader = React.memo(({
  currentDate,
  onDateChange,
  onAddTask
}: ModernCalendarHeaderProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddTask = useCallback(async (taskData: Omit<CalendarTask, 'id'>) => {
    try {
      await onAddTask(taskData);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [onAddTask]);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-chichi-purple" />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Content Calendar</h1>
            <p className="text-xs text-gray-600">
              Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-chichi-purple hover:bg-chichi-purple/90 text-white shrink-0 text-sm py-1.5 px-3 h-8"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Content
        </Button>
      </div>

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddTask={handleAddTask}
        selectedDate={currentDate}
      />
    </>
  );
});

ModernCalendarHeader.displayName = 'ModernCalendarHeader';


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { useNavigate } from 'react-router-dom';
import { CalendarTask } from '@/hooks/useCalendarTasks';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarHeaderProps {
  onAddTask: (task: Omit<CalendarTask, 'id'>) => Promise<void>;
}

export function CalendarHeader({ onAddTask }: CalendarHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddTask = async (task: Omit<CalendarTask, 'id'>) => {
    await onAddTask(task);
    setShowAddDialog(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Content Calendar</h1>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Button
            onClick={() => navigate('/content-plan')}
            className="flex items-center justify-center gap-2 bg-chichi-purple hover:bg-chichi-purple-dark text-sm md:text-base py-2.5 md:py-3"
            size={isMobile ? "sm" : "default"}
          >
            <Lightbulb className="h-4 w-4" />
            Generate 7-Day Plan
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center justify-center gap-2 bg-chichi-purple hover:bg-chichi-purple-dark text-sm md:text-base py-2.5 md:py-3"
            size={isMobile ? "sm" : "default"}
          >
            Add Content
          </Button>
        </div>
      </div>

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddTask={handleAddTask}
      />
    </>
  );
}

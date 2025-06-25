import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { ModernCalendarHeader } from '@/components/calendar/ModernCalendarHeader';
import { ModernWeekView } from '@/components/calendar/ModernWeekView';
import { ModernTaskCard } from '@/components/calendar/ModernTaskCard';
import { TaskDetailsDialog } from '@/components/calendar/TaskDetailsDialog';
import { ContentGeneratorSection } from '@/components/calendar/ContentGeneratorSection';
import { PageErrorBoundary } from '@/components/errors/PageErrorBoundary';
import { toast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const { tasks, isLoading, addTask, updateTask, deleteTask, completeTask } = useCalendarTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  console.log('Calendar: Rendering, isLoading:', isLoading, 'tasks count:', tasks.length);
  
  // Handle edit parameter from URL
  useEffect(() => {
    const editTaskId = searchParams.get('edit');
    if (editTaskId && tasks.length > 0) {
      const taskToEdit = tasks.find(task => task.id === editTaskId);
      if (taskToEdit) {
        setSelectedTask(taskToEdit);
        setTaskDetailsOpen(true);
        setSelectedDate(new Date(taskToEdit.date));
        // Remove the edit parameter from URL
        setSearchParams(params => {
          params.delete('edit');
          return params;
        });
      }
    }
  }, [searchParams, tasks, setSearchParams]);
  
  // Handle task completion
  const handleCompleteTask = async (id: string) => {
    await completeTask(id);
    toast({
      title: "Task completed! 🎉",
      description: "Great work! You're making progress on your content goals.",
    });
  };
  
  // Get tasks for selected date
  const selectedDateTasks = tasks.filter(task => 
    isSameDay(new Date(task.date), selectedDate)
  );
  
  // Handle click on a task
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  // Show improved loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 md:p-4 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-2 md:p-4 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto">
          <ModernCalendarHeader
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onAddTask={addTask}
          />
          
          <ModernWeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            tasks={tasks}
          />
          
          <ContentGeneratorSection />
          
          {/* Selected day tasks */}
          <div className="mb-3">
            <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
              {selectedDateTasks.length > 0 
                ? `${selectedDateTasks.length} content ${selectedDateTasks.length === 1 ? 'piece' : 'pieces'} scheduled`
                : 'No content scheduled'
              }
            </h2>
            
            {selectedDateTasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {selectedDateTasks.map(task => (
                  <ModernTaskCard 
                    key={task.id} 
                    {...task}
                    onComplete={handleCompleteTask}
                    onEdit={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No content scheduled
                </h3>
                <p className="text-gray-500 text-xs max-w-sm mx-auto">
                  Add your first content piece to start planning your content for this day.
                </p>
              </div>
            )}
          </div>
          
          {/* Task details dialog */}
          {selectedTask && (
            <TaskDetailsDialog
              task={selectedTask}
              open={taskDetailsOpen}
              onOpenChange={setTaskDetailsOpen}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default CalendarPage;

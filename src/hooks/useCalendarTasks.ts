import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  content_type: string;
  points: number;
  completed: boolean;
}

export const useCalendarTasks = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  const fetchTasks = async () => {
    // Don't fetch if auth is still loading or no user
    if (authLoading) {
      console.log('useCalendarTasks: Auth still loading, waiting...');
      return;
    }

    if (!user?.id) {
      console.log('useCalendarTasks: No user available, clearing tasks');
      setTasks([]);
      setIsLoading(false);
      return;
    }

    console.log('useCalendarTasks: Fetching tasks for user:', user.id);

    try {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load calendar tasks",
          variant: "destructive",
        });
        setTasks([]);
      } else {
        const formattedTasks = (data || []).map(task => ({
          ...task,
          date: new Date(task.date),
          contentType: task.content_type
        }));

        console.log('useCalendarTasks: Successfully loaded tasks:', formattedTasks.length);
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Unexpected error fetching tasks:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<CalendarTask, 'id'>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          date: task.date.toISOString().split('T')[0],
          platform: task.platform,
          content_type: task.content_type,
          points: task.points,
          completed: task.completed
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        toast({
          title: "Error",
          description: "Failed to add task",
          variant: "destructive",
        });
        return;
      }

      const newTask = {
        ...data,
        date: new Date(data.date),
        contentType: data.content_type
      };

      setTasks(prev => [...prev, newTask]);
      
      // Enhanced event triggering for dashboard refresh
      console.log('Calendar: Task added, triggering dashboard refresh events');
      
      // Multiple event mechanisms to ensure dashboard refresh
      window.dispatchEvent(new CustomEvent('calendar_task_added', { 
        detail: { task: newTask, timestamp: Date.now() }
      }));
      
      // Storage event for cross-tab communication
      localStorage.setItem('calendar_task_added', JSON.stringify({
        timestamp: Date.now(),
        taskId: data.id,
        userId: user.id
      }));
      
      // Additional custom event
      window.dispatchEvent(new CustomEvent('upcoming-posts-refresh'));
      
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error('Unexpected error adding task:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (updatedTask: CalendarTask) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('calendar_tasks')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          date: updatedTask.date.toISOString().split('T')[0],
          platform: updatedTask.platform,
          content_type: updatedTask.content_type,
          points: updatedTask.points,
          completed: updatedTask.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedTask.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      // Trigger refresh events for task updates too
      window.dispatchEvent(new CustomEvent('upcoming-posts-refresh'));
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Unexpected error updating task:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('calendar_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Trigger refresh events for deletions too
      window.dispatchEvent(new CustomEvent('upcoming-posts-refresh'));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Unexpected error deleting task:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask({ ...task, completed: true });
    }
  };

  // Effect to handle auth state changes and data fetching
  useEffect(() => {
    console.log('useCalendarTasks: Auth state changed - authLoading:', authLoading, 'user:', !!user);
    
    // Only fetch when auth is stable (not loading)
    if (!authLoading) {
      fetchTasks();
    }
  }, [user?.id, authLoading]); // React to user ID changes and auth loading state

  return {
    tasks,
    isLoading: isLoading || authLoading, // Show loading if either auth or tasks are loading
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    refetch: fetchTasks
  };
};

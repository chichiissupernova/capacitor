
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const FeedbackPopup = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Show once after first task completion
  useEffect(() => {
    if (!user) return;
    
    const checkFirstTaskCompletion = async () => {
      try {
        // Check if user has completed a task
        const { data: taskCompletions } = await supabase
          .from('task_completions')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
          
        const hasCompletedTasks = taskCompletions && taskCompletions.length > 0;
        
        // Check if feedback has been shown before
        const feedbackShown = localStorage.getItem(`feedback_shown_${user.id}`);
        
        // If tasks completed and feedback not shown yet, show popup
        if (hasCompletedTasks && !feedbackShown) {
          setOpen(true);
          localStorage.setItem(`feedback_shown_${user.id}`, 'true');
        }
      } catch (error) {
        console.error('Error checking task completion:', error);
      }
    };
    
    checkFirstTaskCompletion();
  }, [user]);
  
  const handleSendFeedback = async () => {
    if (!feedback.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Use the Supabase client's insert method directly
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          content: feedback
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Feedback Received!",
        description: "Thank you for helping us improve CHICHI!",
      });
      
      setFeedback('');
      setOpen(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Mobile-optimized feedback button positioned well above bottom nav */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-[140px] md:bottom-6 right-3 md:right-6 z-50 rounded-full shadow-lg bg-chichi-orange hover:bg-chichi-orange/90 h-12 w-12 md:h-12 md:w-12 touch-manipulation"
        size="icon"
        title="Leave Feedback"
        aria-label="Leave Feedback"
      >
        <MessageSquare className="h-5 w-5 md:h-5 md:w-5" />
      </Button>

      {/* Smaller, more compact feedback dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm mx-4 max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Quick Feedback</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Help us improve CHICHI! What's working well or what could be better?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-3">
            <Textarea
              placeholder="Your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={isSubmitting}
              className="w-full sm:w-auto touch-manipulation min-h-[40px] text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendFeedback}
              className="bg-chichi-orange hover:bg-chichi-orange/90 w-full sm:w-auto touch-manipulation min-h-[40px] text-sm"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

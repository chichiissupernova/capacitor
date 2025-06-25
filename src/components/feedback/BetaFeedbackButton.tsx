import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export const BetaFeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Beta Feedback
          <MessageSquare className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>We'd love your feedback!</DialogTitle>
          <DialogDescription>
            As a founding member of CHICHI, your experience matters.
            Tell us what you loved, what confused you, or what you want to see next!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Your feedback helps shape the future of CHICHI..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-between">
          <Button variant="link" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendFeedback}
            className="bg-chichi-orange hover:bg-chichi-orange/90"
            disabled={isSubmitting || !feedback.trim()}
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarTask } from '@/hooks/useCalendarTasks';
import { format } from 'date-fns';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<CalendarTask, 'id'>) => Promise<void>;
  selectedDate?: Date;
}

export function AddTaskDialog({ open, onOpenChange, onAddTask, selectedDate }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('');
  const [date, setDate] = useState(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !platform || !contentType || !date) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title,
        description: description || undefined,
        date: new Date(date),
        platform,
        content_type: contentType,
        points: 10, // Default points
        completed: false
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPlatform('');
      setContentType('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="title" className="text-sm">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              required
              className="h-8 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Content description"
              rows={2}
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-sm">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Platform *</Label>
            <Select value={platform} onValueChange={setPlatform} required>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Content Type *</Label>
            <Select value={contentType} onValueChange={setContentType} required>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-8 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !platform || !contentType || !date || isSubmitting}
              className="flex-1 h-8 text-sm"
            >
              {isSubmitting ? 'Adding...' : 'Add Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

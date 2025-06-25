
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarTask } from '@/hooks/useCalendarTasks';
import { ContentTask } from '@/components/tasks/ContentTask';

interface TaskDetailsDialogProps {
  task: CalendarTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedTask: CalendarTask) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailsDialog({ 
  task, 
  open, 
  onOpenChange, 
  onUpdate, 
  onDelete 
}: TaskDetailsDialogProps) {
  const [editedTask, setEditedTask] = useState<CalendarTask>({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setEditedTask({ ...task });
    setIsEditing(false);
  }, [task]);
  
  const handleTaskComplete = () => {
    onUpdate({ ...editedTask, completed: true });
    onOpenChange(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
    toast({
      title: "Task deleted",
      description: "The task has been successfully removed.",
    });
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your task has been updated.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{editedTask.title}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {!isEditing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <input
                  id="title"
                  className="w-full border rounded p-2"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  className="w-full border rounded p-2"
                  rows={3}
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    className="w-full border rounded p-2"
                    value={editedTask.platform}
                    onChange={(e) => setEditedTask({...editedTask, platform: e.target.value})}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <select
                    id="contentType"
                    className="w-full border rounded p-2"
                    value={editedTask.content_type}
                    onChange={(e) => setEditedTask({...editedTask, content_type: e.target.value})}
                  >
                    <option value="Post">Post</option>
                    <option value="Reel">Reel</option>
                    <option value="Story">Story</option>
                    <option value="Video">Video</option>
                    <option value="Article">Article</option>
                    <option value="Tweet">Tweet</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <input
                  id="points"
                  type="number"
                  className="w-full border rounded p-2"
                  value={editedTask.points}
                  min={1}
                  onChange={(e) => setEditedTask({...editedTask, points: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <ContentTask
              {...editedTask}
              contentType={editedTask.content_type}
              onComplete={handleTaskComplete}
              className="shadow-none border-none"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

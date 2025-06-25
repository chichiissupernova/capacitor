
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface AddNoteDialogProps {
  collectionId?: string;
  onAddNote: (note: {
    title: string;
    content: string;
    color: string;
    collectionId?: string;
  }) => void;
}

export const AddNoteDialog = ({ collectionId, onAddNote }: AddNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your note",
        variant: "destructive",
      });
      return;
    }
    
    onAddNote({
      title,
      content,
      color,
      collectionId,
    });
    
    // Reset form and close dialog
    setTitle('');
    setContent('');
    setColor('yellow');
    setOpen(false);
    
    toast({
      title: "Note created!",
      description: "Your note has been saved.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-chichi-purple hover:bg-chichi-purple-dark">
          <Plus className="mr-1 h-4 w-4" /> New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your ideas here..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <ToggleGroup 
                type="single" 
                value={color} 
                onValueChange={(value) => value && setColor(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="yellow" className="h-6 w-6 p-0 bg-amber-100 border border-amber-200" />
                <ToggleGroupItem value="blue" className="h-6 w-6 p-0 bg-blue-100 border border-blue-200" />
                <ToggleGroupItem value="green" className="h-6 w-6 p-0 bg-green-100 border border-green-200" />
                <ToggleGroupItem value="pink" className="h-6 w-6 p-0 bg-pink-100 border border-pink-200" />
                <ToggleGroupItem value="purple" className="h-6 w-6 p-0 bg-purple-100 border border-purple-200" />
              </ToggleGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-chichi-purple hover:bg-chichi-purple-dark">
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

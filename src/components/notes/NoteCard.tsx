
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  color?: string;
  createdAt: Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NOTE_COLORS = {
  yellow: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  pink: 'bg-pink-50 border-pink-200',
  purple: 'bg-purple-50 border-purple-200',
};

export const NoteCard = ({ 
  id, 
  title, 
  content, 
  color = 'yellow',
  createdAt, 
  onEdit, 
  onDelete 
}: NoteCardProps) => {
  const colorClass = NOTE_COLORS[color as keyof typeof NOTE_COLORS] || NOTE_COLORS.yellow;
  
  return (
    <Card className={cn("w-full h-full flex flex-col shadow-sm border-2 hover:shadow-md transition-shadow", colorClass)}>
      <CardHeader className="p-3 pb-0">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
      </CardHeader>
      <CardContent className="p-3 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">{content}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(id)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

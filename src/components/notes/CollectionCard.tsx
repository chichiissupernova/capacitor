
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Folder, Trash2 } from "lucide-react";

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  notesCount: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CollectionCard = ({ 
  id, 
  name, 
  description, 
  notesCount, 
  onClick, 
  onEdit, 
  onDelete 
}: CollectionCardProps) => {
  return (
    <Card 
      className="w-full h-full flex flex-col hover:shadow-md transition-shadow border-2 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-chichi-purple" />
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{notesCount} notes</span>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
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

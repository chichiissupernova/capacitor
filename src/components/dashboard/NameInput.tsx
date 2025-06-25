import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

export const NameInput = () => {
  const { user, updateUserName } = useAuth();
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUserName(name.trim());
    }
  };
  
  // If user already has a name, don't show this component
  if (user?.name) return null;
  
  return (
    <Card className="mb-8 border-2 border-chichi-purple bg-[#F6F4FF]/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-chichi-purple">Want to personalize CHICHI?</CardTitle>
        <CardDescription>Add your name below!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow"
            autoComplete="name"
          />
          <Button type="submit" className="bg-chichi-purple hover:bg-chichi-purple-dark">
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

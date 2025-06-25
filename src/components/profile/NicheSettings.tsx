
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

const NICHE_OPTIONS = [
  'Beauty',
  'Fashion', 
  'Wellness',
  'Tech',
  'Education',
  'Lifestyle',
  'Finance',
  'Fitness',
  'Music',
  'Art & Design',
  'Food & Recipes',
  'Creator Education',
  'Motivation & Mindset',
  'Parenting',
  'Business Owner',
  'Other'
];

export function NicheSettings() {
  const { user } = useAuth();
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [customNiche, setCustomNiche] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNichePreferences();
  }, [user?.id]);

  const fetchNichePreferences = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('niche_preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setSelectedNiches(data?.niche_preferences || []);
    } catch (error) {
      console.error('Error fetching niche preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNiche = (niche: string) => {
    if (selectedNiches.length >= 2) {
      toast({
        title: "Maximum reached",
        description: "You can only select up to 2 niches",
        variant: "destructive",
      });
      return;
    }

    if (selectedNiches.includes(niche)) {
      toast({
        title: "Already selected",
        description: "This niche is already in your list",
        variant: "destructive",
      });
      return;
    }

    setSelectedNiches([...selectedNiches, niche]);
  };

  const handleAddCustomNiche = () => {
    if (!customNiche.trim()) return;
    
    handleAddNiche(customNiche.trim());
    setCustomNiche('');
  };

  const handleRemoveNiche = (nicheToRemove: string) => {
    setSelectedNiches(selectedNiches.filter(niche => niche !== nicheToRemove));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ niche_preferences: selectedNiches })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Preferences saved",
        description: "Your niche preferences have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving niche preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save niche preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Niche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Niche</CardTitle>
        <p className="text-sm text-gray-600">
          Select up to 2 content niches that best describe your content focus
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Niches */}
        {selectedNiches.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Niches ({selectedNiches.length}/2)</Label>
            <div className="flex flex-wrap gap-2">
              {selectedNiches.map((niche, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {niche}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveNiche(niche)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Niche Dropdown */}
        {selectedNiches.length < 2 && (
          <div className="space-y-2">
            <Label>Add a Niche</Label>
            <Select onValueChange={(value) => {
              if (value === 'Other') {
                // Focus will be handled by the custom input below
                return;
              }
              handleAddNiche(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a niche..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {NICHE_OPTIONS.filter(option => !selectedNiches.includes(option)).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom Niche Input */}
        {selectedNiches.length < 2 && (
          <div className="space-y-2">
            <Label>Or add a custom niche</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom niche..."
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomNiche();
                  }
                }}
              />
              <Button 
                type="button"
                onClick={handleAddCustomNiche}
                disabled={!customNiche.trim()}
                variant="outline"
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';
import { WinFormData, PLATFORMS, WIN_TAGS, useWins } from '@/hooks/useWins';

interface LogWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCommunity: () => void;
}

export function LogWinModal({ isOpen, onClose, onViewCommunity }: LogWinModalProps) {
  const { createWin } = useWins();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WinFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    platform: '',
    description: '',
    tags: [],
    screenshot: undefined,
    share_to_community: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.platform) return;
    
    setIsSubmitting(true);
    const success = await createWin(formData);
    
    if (success) {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        platform: '',
        description: '',
        tags: [],
        screenshot: undefined,
        share_to_community: false,
      });
      onClose();
    }
    setIsSubmitting(false);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, screenshot: file }));
    }
  };

  const removeScreenshot = () => {
    setFormData(prev => ({ ...prev, screenshot: undefined }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a New Win</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Win Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Hit 10K followers!"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date of Win</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={formData.platform} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, platform: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">What Happened?</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your win..."
              rows={3}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {WIN_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Upload Screenshot (Optional)</Label>
            <div className="mt-2">
              {formData.screenshot ? (
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <span className="text-sm text-gray-600 flex-1">
                    {formData.screenshot.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeScreenshot}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload screenshot
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="share-toggle">Share to Community Wins Wall</Label>
            <Switch
              id="share-toggle"
              checked={formData.share_to_community}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, share_to_community: checked }))
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Logging...' : 'Log Win'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <div className="text-center pt-2">
            <Button
              type="button"
              variant="link"
              onClick={onViewCommunity}
              className="text-sm"
            >
              View Community Wins Wall
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

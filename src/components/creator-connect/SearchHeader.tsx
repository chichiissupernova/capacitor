
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedNiche: string;
  onNicheChange: (niche: string) => void;
}

export function SearchHeader({ searchQuery, onSearchChange, selectedNiche, onNicheChange }: SearchHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">Creator Connect</h1>
        </div>
      </div>
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
        Connect with creators who show up. Stay inspired by the ones building momentum—just like you.
      </p>
      
      {/* Search and Filter - Mobile optimized */}
      <div className="space-y-3 md:space-y-0 md:flex md:gap-4 md:items-end">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 md:h-10 text-base md:text-sm touch-manipulation"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={selectedNiche} onValueChange={onNicheChange}>
            <SelectTrigger className="w-full h-12 md:h-10 text-base md:text-sm touch-manipulation">
              <SelectValue placeholder="Filter by niche..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
              <SelectItem value="all">All Niches</SelectItem>
              {NICHE_OPTIONS.map((niche) => (
                <SelectItem key={niche} value={niche} className="py-3 text-base md:text-sm">
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
